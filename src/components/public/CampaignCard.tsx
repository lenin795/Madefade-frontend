import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CommercePoll } from '../../types';

export function CampaignCard({ poll, index }: { poll: CommercePoll; index: number }) {
  const total = poll.madeCount + poll.fadeCount;
  const madePercent = total ? Math.round((poll.madeCount / total) * 100) : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/campaign/${poll._id}`}
        className="group block rounded-card overflow-hidden border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="aspect-[4/3] overflow-hidden bg-paper-dim dark:bg-white/5 relative">
          {poll.image ? (
            <img
              src={poll.image}
              alt={poll.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-soft text-sm">
              No image
            </div>
          )}
          <div className="absolute top-3 left-3 rounded-full bg-ink/80 backdrop-blur-sm text-paper text-[11px] font-bold uppercase tracking-wide px-3 py-1">
            {total.toLocaleString()} votes
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="font-heading font-bold text-lg leading-tight mb-1">{poll.title}</h3>
          <p className="text-sm text-ink-soft dark:text-paper/60 line-clamp-2 mb-3">{poll.question}</p>

          <div className="h-2 w-full rounded-full bg-line dark:bg-white/10 overflow-hidden flex">
            <div className="h-full bg-made" style={{ width: `${madePercent}%` }} />
            <div className="h-full bg-fade" style={{ width: `${100 - madePercent}%` }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
