import { useQuery } from '@tanstack/react-query';
import { Vote, Users, Percent, Mail, Gift, MousePointerClick, Megaphone, Pause } from 'lucide-react';
import { fetchDashboard } from '../../services/analytics';
import { StatCard } from '../../components/admin/StatCard';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchDashboard,
  });

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-6">
        Dashboard
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-card" />
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard label="Total Polls" value={data.totalPolls} icon={<Vote className="size-4" />} delay={0} />
          <StatCard label="Total Votes" value={data.totalVotes.toLocaleString()} icon={<Users className="size-4" />} accent="made" delay={0.03} />
          <StatCard label="Conversion Rate" value={`${data.conversionRate}%`} icon={<Percent className="size-4" />} accent="amber" delay={0.06} />
          <StatCard label="Emails Collected" value={data.emailsCollected.toLocaleString()} icon={<Mail className="size-4" />} delay={0.09} />
          <StatCard label="Offer Unlocks" value={data.offerUnlocks.toLocaleString()} icon={<Gift className="size-4" />} accent="made" delay={0.12} />
          <StatCard label="Offer Clicks" value={data.offerClicks.toLocaleString()} icon={<MousePointerClick className="size-4" />} accent="amber" delay={0.15} />
          <StatCard label="Active Campaigns" value={data.activeCampaigns} icon={<Megaphone className="size-4" />} accent="made" delay={0.18} />
          <StatCard label="Paused Campaigns" value={data.pausedCampaigns} icon={<Pause className="size-4" />} accent="fade" delay={0.21} />
        </div>
      ) : null}
    </div>
  );
}
