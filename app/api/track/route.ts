import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Tunables — conservative defaults for a personal site on $10/mo Prisma Pro.
const DAILY_CAP = 10_000;          // hard stop per UTC day
const RATE_WINDOW_MS = 60_000;     // 1-minute window
const RATE_MAX_PER_IP = 30;        // per-IP burst limit per window
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|preview|lighthouse|headless/i;

// --- Module-level state (persists within a warm serverless instance) ---

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();
let lastRateCleanupAt = 0;

let daily = {
  date: '',            // UTC yyyy-mm-dd
  count: 0,            // local estimate of inserts today
  capReached: false,   // once true, short-circuit the rest of the day
};

// --- Helpers ---

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function detectDevice(ua: string): string {
  if (/mobile|iphone|android.*mobile/i.test(ua)) return 'mobile';
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

/**
 * In-memory per-IP rate limit. Best-effort across serverless instances —
 * imperfect but effectively blocks casual spam, and the DAILY_CAP is the real backstop.
 */
function isRateLimited(ip: string): boolean {
  if (!ip) return false; // local dev or missing header — don't block

  const now = Date.now();

  // Lazy cleanup once per window to keep the map bounded.
  if (now - lastRateCleanupAt > RATE_WINDOW_MS) {
    lastRateCleanupAt = now;
    rateBuckets.forEach((v, k) => {
      if (v.resetAt < now) rateBuckets.delete(k);
    });
  }

  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (bucket.count >= RATE_MAX_PER_IP) return true;
  bucket.count++;
  return false;
}

/**
 * Returns true if we can record another view today.
 * Consults DB only when local counter suggests we're at/over the cap.
 * Once cap is confirmed, locks `capReached=true` for the day — zero further DB reads.
 */
async function underDailyCap(): Promise<boolean> {
  const today = todayKey();

  // Day rollover → reset everything
  if (daily.date !== today) {
    daily = { date: today, count: 0, capReached: false };
  }

  if (daily.capReached) return false;

  // Cheap path: local count still under cap → trust it, increment, allow.
  if (daily.count < DAILY_CAP) {
    daily.count++;
    return true;
  }

  // Local count says we're at cap. Verify against DB (at most a few times per day).
  const startOfDay = new Date(today + 'T00:00:00.000Z');
  const actual = await prisma.pageView.count({
    where: { createdAt: { gte: startOfDay } },
  });

  if (actual >= DAILY_CAP) {
    daily.capReached = true;
    daily.count = actual;
    return false;
  }

  // Local was overestimating (likely multiple instances) — resync and continue.
  daily.count = actual + 1;
  return true;
}

// --- Route handler ---

export async function POST(request: Request) {
  try {
    const headers = request.headers;
    const ua = headers.get('user-agent') || '';

    // 1) Bot short-circuit — cheapest possible rejection, no DB work.
    if (BOT_UA_PATTERN.test(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    // 2) Per-IP rate limit (in-memory, per-instance).
    const ip =
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      '';
    if (isRateLimited(ip)) {
      return new NextResponse(null, { status: 429 });
    }

    // 3) Parse and validate payload.
    const body = await request.json().catch(() => ({}));
    const path: string | undefined = body.path;
    const referrer: string | undefined = body.referrer;

    if (!path || typeof path !== 'string' || path.length > 512) {
      return new NextResponse(null, { status: 204 });
    }
    if (path.startsWith('/mmm') || path.startsWith('/api') || path.startsWith('/_next')) {
      return new NextResponse(null, { status: 204 });
    }

    // 4) Daily cap — hard backstop on billable DB writes.
    if (!(await underDailyCap())) {
      return new NextResponse(null, { status: 204 });
    }

    // 5) Passed all gates — insert.
    const country = headers.get('x-vercel-ip-country') || null;
    const city = headers.get('x-vercel-ip-city')
      ? decodeURIComponent(headers.get('x-vercel-ip-city')!)
      : null;
    const device = detectDevice(ua);
    const sessionHash = ip
      ? createHash('sha256').update(`${ip}:${ua}`).digest('hex').slice(0, 32)
      : null;

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer && referrer.length <= 512 ? referrer : null,
        country,
        city,
        device,
        sessionHash,
        isBot: false,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('track beacon failed:', error);
    return new NextResponse(null, { status: 204 });
  }
}
