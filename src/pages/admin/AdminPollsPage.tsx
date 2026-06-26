import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Copy, Trash2, Pause, Play, Eye } from 'lucide-react';
import clsx from 'clsx';
import { fetchAdminPolls, setPollStatus, duplicatePoll, deletePoll } from '../../services/polls';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import type { PollStatus } from '../../types';

const STATUS_STYLES: Record<PollStatus, string> = {
  published: 'bg-made/15 text-made',
  draft: 'bg-line text-ink-soft dark:bg-white/10 dark:text-paper/60',
  paused: 'bg-amber/15 text-amber',
  archived: 'bg-fade/15 text-fade',
};

export function AdminPollsPage() {
  const [filter, setFilter] = useState<PollStatus | 'all'>('all');
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: polls, isLoading } = useQuery({
    queryKey: ['admin-polls', filter],
    queryFn: () => fetchAdminPolls(filter === 'all' ? undefined : filter),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-polls'] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => setPollStatus(id, status),
    onSuccess: invalidate,
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicatePoll(id),
    onSuccess: () => {
      invalidate();
      showToast('Poll duplicated.', 'success');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePoll(id),
    onSuccess: () => {
      invalidate();
      showToast('Poll deleted.', 'success');
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
          Commerce Polls
        </h1>
        <Link to="/admin/polls/new">
          <Button>
            <Plus className="size-4" /> New Poll
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(['all', 'published', 'draft', 'paused', 'archived'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={clsx(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors',
              filter === s
                ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                : 'bg-white dark:bg-white/5 text-ink-soft dark:text-paper/60 border border-line dark:border-white/10'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-card" />
          ))}
        </div>
      ) : polls && polls.length > 0 ? (
        <div className="space-y-3">
          {polls.map((poll, i) => (
            <motion.div
              key={poll._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="p-4 flex items-center gap-4">
                <div className="size-16 rounded-xl overflow-hidden bg-paper-dim dark:bg-white/5 shrink-0">
                  {poll.image && (
                    <img src={poll.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-heading font-bold truncate">{poll.title}</h3>
                    <span
                      className={clsx(
                        'shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full',
                        STATUS_STYLES[poll.status]
                      )}
                    >
                      {poll.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft dark:text-paper/50">
                    {poll.madeCount + poll.fadeCount} votes · {poll.offerUnlockCount} unlocks
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/campaign/${poll._id}`}
                    target="_blank"
                    className="size-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-ink/5 dark:hover:bg-white/10"
                    aria-label="Preview"
                  >
                    <Eye className="size-4" />
                  </Link>
                  <Link
                    to={`/admin/polls/${poll._id}/edit`}
                    className="size-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-ink/5 dark:hover:bg-white/10"
                    aria-label="Edit"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    onClick={() =>
                      statusMutation.mutate({
                        id: poll._id,
                        status: poll.status === 'published' ? 'paused' : 'published',
                      })
                    }
                    className="size-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-ink/5 dark:hover:bg-white/10"
                    aria-label={poll.status === 'published' ? 'Pause' : 'Publish'}
                  >
                    {poll.status === 'published' ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </button>
                  <button
                    onClick={() => duplicateMutation.mutate(poll._id)}
                    className="size-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-ink/5 dark:hover:bg-white/10"
                    aria-label="Duplicate"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${poll.title}"? This cannot be undone.`)) {
                        deleteMutation.mutate(poll._id);
                      }
                    }}
                    className="size-9 rounded-lg flex items-center justify-center text-fade hover:bg-fade/10"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-ink-soft dark:text-paper/50">
          No polls match this filter.
        </div>
      )}
    </div>
  );
}
