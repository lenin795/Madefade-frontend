import { useQuery } from '@tanstack/react-query';
import { fetchEmailCaptures } from '../../services/analytics';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminEmailsPage() {
  const { data: captures, isLoading } = useQuery({
    queryKey: ['admin-emails'],
    queryFn: fetchEmailCaptures,
  });

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-6">
        Email Captures
      </h1>

      {isLoading ? (
        <Skeleton className="h-64 rounded-card" />
      ) : captures && captures.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line dark:border-white/10 text-left text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
                  <th className="px-4 sm:px-5 py-3 font-semibold">Email</th>
                  <th className="px-4 sm:px-5 py-3 font-semibold">Poll</th>
                  <th className="px-4 sm:px-5 py-3 font-semibold">Code</th>
                  <th className="px-4 sm:px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-white/10">
                {captures.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 sm:px-5 py-3 font-medium whitespace-nowrap">{c.email}</td>
                    <td className="px-4 sm:px-5 py-3 text-ink-soft dark:text-paper/60 whitespace-nowrap">
                      {c.poll?.title || '—'}
                    </td>
                    <td className="px-4 sm:px-5 py-3 font-mono text-xs whitespace-nowrap">{c.offerCode}</td>
                    <td className="px-4 sm:px-5 py-3 text-ink-soft dark:text-paper/60 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="text-center py-16 text-ink-soft dark:text-paper/50">
          No emails captured yet.
        </div>
      )}
    </div>
  );
}
