import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Gift } from 'lucide-react';
import { fetchPublicPoll, castVote, unlockOffer, trackOfferClick } from '../services/polls';
import { VoteButtons } from '../components/public/VoteButtons';
import { ResultChart } from '../components/public/ResultChart';
import { UnlockOfferModal } from '../components/public/UnlockOfferModal';
import { Confetti } from '../components/public/Confetti';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { getBrowserFingerprint } from '../utils/fingerprint';
import { useToast } from '../components/ui/Toast';

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [voted, setVoted] = useState<{ choice: 'made' | 'fade'; madePercent: number; fadePercent: number; total: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { showToast } = useToast();

  const { data: poll, isLoading } = useQuery({
    queryKey: ['poll', id],
    queryFn: () => fetchPublicPoll(id!),
    enabled: Boolean(id),
  });

  const voteMutation = useMutation({
    mutationFn: (choice: 'made' | 'fade') => castVote(id!, choice, getBrowserFingerprint()),
    onSuccess: (data, choice) => {
      setVoted({
        choice,
        madePercent: data.madePercent ?? 0,
        fadePercent: data.fadePercent ?? 0,
        total: data.total ?? 0,
      });
      if (data.alreadyVoted) {
        showToast("You've already voted on this one.", 'info');
      }
    },
    onError: () => showToast('Something went wrong casting your vote. Try again.', 'error'),
  });

  const unlockMutation = useMutation({
    mutationFn: (email?: string) => unlockOffer(id!, email),
  });

  const handleUnlockSubmit = async (email?: string) => {
    try {
      const result = await unlockMutation.mutateAsync(email);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2200);
      return result;
    } catch {
      showToast('Could not unlock the offer. Please try again.', 'error');
      return null;
    }
  };

  const handleShopNowClick = () => {
    if (poll?.offers?.[0]?._id) {
      trackOfferClick(id!, poll.offers[0]._id).catch(() => {});
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="aspect-[4/3] rounded-card mb-6" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-8" />
        <Skeleton className="h-28 rounded-card" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-ink-soft dark:text-paper/60">Campaign not found.</p>
        <Link to="/" className="inline-block mt-4">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft dark:text-paper/60 hover:text-ink dark:hover:text-paper mb-6"
      >
        <ChevronLeft className="size-4" /> Back to campaigns
      </Link>

      {poll.image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-[4/3] rounded-card overflow-hidden mb-6 bg-paper-dim dark:bg-white/5"
        >
          <img src={poll.image} alt={poll.title} className="w-full h-full object-cover" />
        </motion.div>
      )}

      <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-2">
        {poll.title}
      </h1>
      {poll.description && (
        <p className="text-ink-soft dark:text-paper/60 mb-6">{poll.description}</p>
      )}

      <p className="font-heading font-bold text-xl sm:text-2xl mb-5">{poll.question}</p>

      {!voted ? (
        <VoteButtons
          onVote={(choice) => voteMutation.mutate(choice)}
          disabled={voteMutation.isPending}
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-card border border-line dark:border-white/10 p-6 mb-5">
            <ResultChart
              madePercent={voted.madePercent}
              fadePercent={voted.fadePercent}
              total={voted.total}
            />
          </div>

          {poll.offerEnabled && poll.offers.length > 0 && (
            <Button size="lg" className="w-full" onClick={() => setModalOpen(true)}>
              <Gift className="size-4" /> Unlock Offer
            </Button>
          )}
        </motion.div>
      )}

      <UnlockOfferModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        emailRequired={poll.emailRequired}
        onSubmit={handleUnlockSubmit}
        onShopNowClick={handleShopNowClick}
      />
    </div>
  );
}
