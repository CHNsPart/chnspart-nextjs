import { AdminPage, AdminPageHeader } from '@/components/layout/AdminPage';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/ui/table';
import { getAnalyticsSnapshot } from '@/lib/analytics';
import { Eye, Users, Calendar, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

const RANGE_DAYS = 30;

function DailyChart({ data }: { data: Array<{ date: string; views: number; uniques: number }> }) {
  const max = Math.max(1, ...data.map((d) => d.views));
  const width = 100;
  const height = 28;
  return (
    <div className="rounded-xl border border-[var(--jet)] bg-[var(--eerie-black-2)] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--white-2)]">Daily views</h2>
          <p className="text-sm text-[var(--light-gray-70)]">Last {RANGE_DAYS} days · max {max}/day</p>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${data.length * width} ${height * 100}`}
          preserveAspectRatio="none"
          className="w-full h-48"
          role="img"
          aria-label="Daily page views bar chart"
        >
          {data.map((d, i) => {
            const barHeight = (d.views / max) * (height * 100);
            const x = i * width;
            const y = height * 100 - barHeight;
            return (
              <g key={d.date}>
                <rect
                  x={x + width * 0.15}
                  y={y}
                  width={width * 0.7}
                  height={barHeight || 1}
                  fill="hsl(45, 100%, 72%)"
                  opacity={d.views === 0 ? 0.15 : 0.9}
                  rx={2}
                >
                  <title>{`${d.date} — ${d.views} views · ${d.uniques} uniques`}</title>
                </rect>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-xs text-[var(--light-gray-70)]">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-[var(--orange-yellow-crayola)]">{icon}</div>
        <div className="min-w-0">
          <p className="text-[var(--light-gray-70)] text-sm truncate">{label}</p>
          <p className="text-2xl font-bold text-[var(--white-2)] truncate">{value}</p>
          {sub && <p className="text-xs text-[var(--light-gray-70)] mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default async function VisitorsPage() {
  const snap = await getAnalyticsSnapshot(RANGE_DAYS);
  const fmt = (n: number) => n.toLocaleString();

  return (
    <AdminPage>
      <AdminPageHeader
        title="Visitors"
        description={`Abstract traffic to the public site — last ${RANGE_DAYS} days of activity.`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Eye size={22} />} label="Total views" value={fmt(snap.totals.views)} sub="all time" />
        <StatCard icon={<Users size={22} />} label="Unique visitors" value={fmt(snap.totals.uniques)} sub="all time" />
        <StatCard icon={<Calendar size={22} />} label="Today" value={fmt(snap.totals.today)} sub="views" />
        <StatCard icon={<Calendar size={22} />} label="Last 7 days" value={fmt(snap.totals.thisWeek)} sub="views" />
      </div>

      <DailyChart data={snap.daily} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--white-2)] mb-3 flex items-center gap-2">
            <Globe size={18} className="text-[var(--orange-yellow-crayola)]" />
            Top pages
          </h2>
          {snap.topPages.length === 0 ? (
            <TableEmpty>No page views recorded yet.</TableEmpty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snap.topPages.map((row) => (
                  <TableRow key={row.path}>
                    <TableCell className="font-mono text-sm">{row.path}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(row.views)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--white-2)] mb-3 flex items-center gap-2">
            <Globe size={18} className="text-[var(--orange-yellow-crayola)]" />
            Top referrers
          </h2>
          {snap.topReferrers.length === 0 ? (
            <TableEmpty>No referrers yet — most traffic is direct.</TableEmpty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snap.topReferrers.map((row) => (
                  <TableRow key={row.referrer}>
                    <TableCell className="text-sm">{row.referrer}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(row.views)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--white-2)] mb-3">Top countries</h2>
          {snap.topCountries.length === 0 ? (
            <TableEmpty>No country data yet (only captured in production on Vercel).</TableEmpty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snap.topCountries.map((row) => (
                  <TableRow key={row.country}>
                    <TableCell>{row.country}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(row.views)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--white-2)] mb-3">Devices</h2>
          {snap.deviceBreakdown.length === 0 ? (
            <TableEmpty>No device data yet.</TableEmpty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snap.deviceBreakdown.map((row) => (
                  <TableRow key={row.device}>
                    <TableCell className="capitalize">{row.device}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(row.views)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
