import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-line dark:border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display font-extrabold text-sm tracking-tight">
          Made<span className="text-made">or</span>Fade
        </span>
        <p className="text-xs text-ink-soft dark:text-paper/50 text-center sm:text-right">
          Vote on products. Unlock exclusive discounts.{' '}
          <Link to="/create" className="underline hover:text-made">
            Start your own poll
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
