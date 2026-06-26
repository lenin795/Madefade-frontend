import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { fetchPrivatePoll, votePrivatePoll } from '../services/privatePolls';
import { VoteButtons } from '../components/public/VoteButtons';
import { ResultChart } from '../components/public/ResultChart';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function PrivatePollPage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; choice: 'made' | 'fade' }[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['private-poll', slug],
    queryFn: () => fetchPrivatePoll(slug!),
    enabled: Boolean(slug),
  });

  const voteMutation = useMutation({
    mutationFn: (finalAnswers: { questionId: string; choice: 'made' | 'fade' }[]) =>
      votePrivatePoll(slug!, finalAnswers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['private-poll', slug] });
    },
    onError: () => showToast('Something went wrong submitting your vote.', 'error'),
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-14">
        <Skeleton className="h-7 w-2/3 mb-6" />
        <Skeleton className="h-28 rounded-card" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-ink-soft dark:text-paper/60">Poll not found.</p>
      </div>
    );
  }

  const { poll, hasVoted, results } = data;
  const showResults = hasVoted || poll.closed || Boolean(results);

  if (showResults && results) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-1">
          {poll.name}
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper/60 mb-7">
          {poll.closed
            ? `Closed — ${poll.voteCount} of ${poll.maxVotes} votes cast.`
            : `${poll.voteCount} of ${poll.maxVotes} votes cast so far.`}
        </p>

        <div className="space-y-5">
          {results.map((r, i) => (
            <motion.div
              key={r.questionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-card border border-line dark:border-white/10 p-5"
            >
              <p className="font-heading font-bold mb-3">{r.text}</p>
              <ResultChart madePercent={r.madePercent} fadePercent={r.fadePercent} total={r.total} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/create">
            <Button variant="secondary">Create your own poll</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = poll.questions[step];

  const handleVote = (choice: 'made' | 'fade') => {
    const nextAnswers = [...answers, { questionId: currentQuestion._id, choice }];
    setAnswers(nextAnswers);

    if (step < poll.questions.length - 1) {
      setStep(step + 1);
    } else {
      voteMutation.mutate(nextAnswers);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-paper/50 mb-2">
        <Lock className="size-3" /> Private poll
      </div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-6">
        {poll.name}
      </h1>

      {poll.questions.length > 1 && (
        <div className="flex gap-1.5 mb-6">
          {poll.questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-made' : 'bg-line dark:bg-white/10'}`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-heading font-bold text-xl sm:text-2xl mb-6">{currentQuestion.text}</p>
          <VoteButtons onVote={handleVote} disabled={voteMutation.isPending} />

          {step < poll.questions.length - 1 && (
            <p className="mt-4 text-center text-xs text-ink-soft dark:text-paper/40 flex items-center justify-center gap-1">
              Question {step + 1} of {poll.questions.length} <ArrowRight className="size-3" />
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
