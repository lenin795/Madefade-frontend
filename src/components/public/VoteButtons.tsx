import { motion } from 'framer-motion';
import clsx from 'clsx';

interface VoteButtonsProps {
  onVote: (choice: 'made' | 'fade') => void;
  disabled?: boolean;
  selectedChoice?: 'made' | 'fade' | null;
}

export function VoteButtons({ onVote, disabled, selectedChoice }: VoteButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => onVote('made')}
        whileTap={{ scale: 0.96 }}
        className={clsx(
          'group relative overflow-hidden rounded-2xl py-7 sm:py-9 font-display font-extrabold text-2xl sm:text-3xl tracking-tight transition-all duration-200 disabled:cursor-not-allowed',
          selectedChoice === 'made'
            ? 'bg-made text-ink ring-4 ring-made/30'
            : 'bg-made/10 text-made hover:bg-made hover:text-ink dark:bg-made/15',
          disabled && selectedChoice !== 'made' && 'opacity-40'
        )}
      >
        <span className="relative z-10 flex flex-col items-center gap-1">
          <span>MADE</span>
          <span className="text-[10px] font-body font-semibold uppercase tracking-[0.2em] opacity-70">
            yes, this works
          </span>
        </span>
      </motion.button>

      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => onVote('fade')}
        whileTap={{ scale: 0.96 }}
        className={clsx(
          'group relative overflow-hidden rounded-2xl py-7 sm:py-9 font-display font-extrabold text-2xl sm:text-3xl tracking-tight transition-all duration-200 disabled:cursor-not-allowed',
          selectedChoice === 'fade'
            ? 'bg-fade text-white ring-4 ring-fade/30'
            : 'bg-fade/10 text-fade hover:bg-fade hover:text-white dark:bg-fade/15',
          disabled && selectedChoice !== 'fade' && 'opacity-40'
        )}
      >
        <span className="relative z-10 flex flex-col items-center gap-1">
          <span>FADE</span>
          <span className="text-[10px] font-body font-semibold uppercase tracking-[0.2em] opacity-70">
            no, hard pass
          </span>
        </span>
      </motion.button>
    </div>
  );
}
