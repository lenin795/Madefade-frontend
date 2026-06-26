import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: 'made' | 'fade' | 'amber' | 'ink';
  delay?: number;
}

const accentMap = {
  made: 'bg-made/12 text-made',
  fade: 'bg-fade/12 text-fade',
  amber: 'bg-amber/12 text-amber',
  ink: 'bg-ink/8 text-ink dark:bg-white/10 dark:text-paper',
};

export function StatCard({ label, value, icon, accent = 'ink', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-5">
        <div className={`inline-flex size-9 items-center justify-center rounded-xl mb-3 ${accentMap[accent]}`}>
          {icon}
        </div>
        <p className="text-2xl font-display font-extrabold tracking-tight">{value}</p>
        <p className="text-xs text-ink-soft dark:text-paper/60 mt-0.5">{label}</p>
      </Card>
    </motion.div>
  );
}
