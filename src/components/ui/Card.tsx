import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-card border border-line bg-white dark:bg-white/[0.04] dark:border-white/10',
        className
      )}
      {...props}
    />
  );
}
