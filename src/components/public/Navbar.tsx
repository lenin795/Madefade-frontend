import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-line dark:border-white/10 bg-paper/90 dark:bg-ink/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-extrabold text-xl tracking-tight">
          Made<span className="text-made">or</span>Fade
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link to="/create" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              Create Poll
            </Button>
          </Link>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="size-9 rounded-full flex items-center justify-center hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
