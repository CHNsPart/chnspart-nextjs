import { prisma } from '@/lib/prisma';

export interface AnalyticsSnapshot {
  totals: {
    views: number;
    uniques: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  daily: Array<{ date: string; views: number; uniques: number }>;
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ referrer: string; views: number }>;
  topCountries: Array<{ country: string; views: number }>;
  deviceBreakdown: Array<{ device: string; views: number }>;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function formatDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getAnalyticsSnapshot(days = 30): Promise<AnalyticsSnapshot> {
  const now = new Date();
  const todayStart = startOfDayUTC(now);
  const weekStart = new Date(todayStart.getTime() - 6 * DAY_MS);
  const monthStart = new Date(todayStart.getTime() - 29 * DAY_MS);
  const rangeStart = new Date(todayStart.getTime() - (days - 1) * DAY_MS);

  const [totalViews, uniqueRows, todayViews, weekViews, monthViews, windowRows] = await Promise.all([
    prisma.pageView.count({ where: { isBot: false } }),
    prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(DISTINCT "sessionHash")::bigint AS count
      FROM "PageView"
      WHERE "isBot" = false AND "sessionHash" IS NOT NULL
    `,
    prisma.pageView.count({ where: { isBot: false, createdAt: { gte: todayStart } } }),
    prisma.pageView.count({ where: { isBot: false, createdAt: { gte: weekStart } } }),
    prisma.pageView.count({ where: { isBot: false, createdAt: { gte: monthStart } } }),
    prisma.pageView.findMany({
      where: { isBot: false, createdAt: { gte: rangeStart } },
      select: { path: true, referrer: true, country: true, device: true, sessionHash: true, createdAt: true },
    }),
  ]);
  const uniqueVisitors = Number(uniqueRows[0]?.count ?? 0);

  // Build daily buckets
  const dailyMap = new Map<string, { views: number; sessions: Set<string> }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(rangeStart.getTime() + i * DAY_MS);
    dailyMap.set(formatDayKey(d), { views: 0, sessions: new Set() });
  }
  for (const row of windowRows) {
    const key = formatDayKey(startOfDayUTC(row.createdAt));
    const bucket = dailyMap.get(key);
    if (!bucket) continue;
    bucket.views += 1;
    if (row.sessionHash) bucket.sessions.add(row.sessionHash);
  }
  const daily = Array.from(dailyMap.entries()).map(([date, { views, sessions }]) => ({
    date,
    views,
    uniques: sessions.size,
  }));

  // Top pages/referrers/countries/devices from the last `days` window
  const tally = <T,>(rows: T[], key: (r: T) => string | null | undefined, limit = 10) => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      const k = key(r);
      if (!k) continue;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  };

  const topPages = tally(windowRows, (r) => r.path).map(([path, views]) => ({ path, views }));
  const topReferrers = tally(windowRows, (r) => {
    if (!r.referrer) return null;
    try {
      const u = new URL(r.referrer);
      return u.hostname || null;
    } catch {
      return r.referrer;
    }
  }).map(([referrer, views]) => ({ referrer, views }));
  const topCountries = tally(windowRows, (r) => r.country).map(([country, views]) => ({ country, views }));
  const deviceBreakdown = tally(windowRows, (r) => r.device, 5).map(([device, views]) => ({ device, views }));

  return {
    totals: {
      views: totalViews,
      uniques: uniqueVisitors,
      today: todayViews,
      thisWeek: weekViews,
      thisMonth: monthViews,
    },
    daily,
    topPages,
    topReferrers,
    topCountries,
    deviceBreakdown,
  };
}
