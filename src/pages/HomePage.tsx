import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Vote, Gift } from 'lucide-react';
import { fetchPublicPolls } from '../services/polls';
import { CampaignCard } from '../components/public/CampaignCard';
import { CampaignCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const { data: polls, isLoading } = useQuery({
    queryKey: ['public-polls'],
    queryFn: fetchPublicPolls,
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl tracking-tight leading-[0.95]">
              Made <span className="text-made">or</span> Fade?
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-ink-soft dark:text-paper/70 max-w-xl mx-auto">
              Vote on products. Unlock exclusive discounts. Create your own polls.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/create">
                <Button size="lg">
                  Create Poll <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#campaigns">
                <Button variant="secondary" size="lg">
                  Explore Campaigns
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Signature: a live mini-ballot illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-14 mx-auto max-w-md grid grid-cols-2 gap-3"
          >
            <div className="rounded-2xl bg-made/10 dark:bg-made/15 py-6 font-display font-extrabold text-2xl text-made">
              MADE
            </div>
            <div className="rounded-2xl bg-fade/10 dark:bg-fade/15 py-6 font-display font-extrabold text-2xl text-fade">
              FADE
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Campaigns */}
      <section id="campaigns" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
            Current Campaigns
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        ) : polls && polls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {polls.map((poll, i) => (
              <CampaignCard key={poll._id} poll={poll} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-ink-soft dark:text-paper/50">
            No campaigns live right now. Check back soon.
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-paper-dim dark:bg-white/[0.03] border-y border-line dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-10 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Step
              icon={<Vote className="size-5" />}
              title="Vote"
              text="Made or fade? Tap your verdict on a product in seconds."
            />
            <Step
              icon={<Sparkles className="size-5" />}
              title="See the results"
              text="Watch the live split — your take against everyone else's."
            />
            <Step
              icon={<Gift className="size-5" />}
              title="Unlock a discount"
              text="Drop your email and grab an exclusive code on the spot."
            />
          </div>
        </div>
      </section>

      {/* Create Your Own Poll */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-3">
          Got something to settle?
        </h2>
        <p className="text-ink-soft dark:text-paper/60 max-w-md mx-auto mb-7">
          Make your own poll, send the link to your friends, and get a verdict in minutes — no
          account needed.
        </p>
        <Link to="/create">
          <Button size="lg">
            Create Your Own Poll <ArrowRight className="size-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="inline-flex size-10 items-center justify-center rounded-full bg-made/15 text-made mb-3">
        {icon}
      </div>
      <h3 className="font-heading font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-ink-soft dark:text-paper/60">{text}</p>
    </div>
  );
}
