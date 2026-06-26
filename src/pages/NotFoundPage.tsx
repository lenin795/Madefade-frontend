import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display font-extrabold text-7xl sm:text-8xl tracking-tight text-line dark:text-white/10">
        404
      </p>
      <h1 className="font-heading font-bold text-xl sm:text-2xl mt-2 mb-2">
        This page didn't make the cut
      </h1>
      <p className="text-ink-soft dark:text-paper/60 mb-7">
        It might have faded away, or maybe it never existed.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
