import { type TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            'w-full rounded-xl border bg-white dark:bg-white/5 px-4 py-2.5 text-sm transition-colors resize-none',
            'placeholder:text-ink-soft/50 dark:placeholder:text-paper/30',
            'focus:outline-none focus:ring-2 focus:ring-made/40 focus:border-made',
            error ? 'border-fade' : 'border-line dark:border-white/15',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-fade font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
