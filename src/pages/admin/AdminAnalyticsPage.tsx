import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { fetchAnalytics } from '../../services/analytics';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

const MADE_COLOR = '#00C896';
const FADE_COLOR = '#FF5C5C';

export function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalytics,
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-48" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-card" />
          <Skeleton className="h-72 rounded-card" />
        </div>
      </div>
    );
  }

  const ratioData = [
    { name: 'Made', value: data.madeVsFadeRatio.made },
    { name: 'Fade', value: data.madeVsFadeRatio.fade },
  ];

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-6">
        Analytics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h2 className="font-heading font-bold mb-4">Votes Over Time</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.votesOverTime}>
              <defs>
                <linearGradient id="voteGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={MADE_COLOR} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={MADE_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
              <Tooltip
                contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #E8E4D9' }}
              />
              <Area type="monotone" dataKey="count" stroke={MADE_COLOR} fill="url(#voteGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-bold mb-4">Made vs Fade Ratio</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={ratioData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                <Cell fill={MADE_COLOR} />
                <Cell fill={FADE_COLOR} />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #E8E4D9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: MADE_COLOR }} /> Made
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: FADE_COLOR }} /> Fade
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-bold mb-4">Most Popular Polls</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.mostPopularPolls} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #E8E4D9' }} />
              <Bar dataKey="totalVotes" fill={MADE_COLOR} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-bold mb-4">Conversion Rates</h2>
          <div className="space-y-5 mt-2">
            <RateRow label="Email Capture Rate" value={data.emailCaptureRate} />
            <RateRow label="Offer Click Rate" value={data.offerClickRate} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function RateRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="font-display font-extrabold text-made">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-line dark:bg-white/10 overflow-hidden">
        <div className="h-full bg-made rounded-full" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}
