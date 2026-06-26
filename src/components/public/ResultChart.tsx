import { motion } from 'framer-motion';

interface ResultChartProps {
  madePercent: number;
  fadePercent: number;
  total: number;
}

export function ResultChart({ madePercent, fadePercent, total }: ResultChartProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-extrabold text-2xl text-made">{madePercent}%</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-paper/60">
            Made
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-paper/60">
            Fade
          </span>
          <span className="font-display font-extrabold text-2xl text-fade">{fadePercent}%</span>
        </div>
      </div>

      <div className="h-4 w-full rounded-full bg-line dark:bg-white/10 overflow-hidden flex">
        <motion.div
          className="h-full bg-made"
          initial={{ width: 0 }}
          animate={{ width: `${madePercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <motion.div
          className="h-full bg-fade"
          initial={{ width: 0 }}
          animate={{ width: `${fadePercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>

      <p className="mt-2 text-center text-xs text-ink-soft dark:text-paper/50">
        {total.toLocaleString()} {total === 1 ? 'vote' : 'votes'} cast
      </p>
    </div>
  );
}
