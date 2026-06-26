import { type ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]',
          {
            'bg-ink text-paper hover:bg-ink/90 dark:bg-paper dark:text-ink dark:hover:bg-paper/90':
              variant === 'primary',
            'bg-paper-dim text-ink hover:bg-line dark:bg-white/10 dark:text-paper dark:hover:bg-white/15':
              variant === 'secondary',
            'bg-transparent text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-white/10':
              variant === 'ghost',
            'bg-fade text-white hover:bg-fade-deep': variant === 'danger',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
