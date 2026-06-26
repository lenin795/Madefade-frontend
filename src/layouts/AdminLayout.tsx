import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Vote,
  Mail,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { logout as logoutApi } from '../services/auth';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/polls', label: 'Commerce Polls', icon: Vote },
  { to: '/admin/emails', label: 'Email Captures', icon: Mail },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { admin, setAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutApi();
    setAdmin(null);
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-paper-dim dark:bg-ink">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-line dark:border-white/10 bg-white dark:bg-white/[0.03] shrink-0">
        <SidebarContent onLogout={handleLogout} adminName={admin?.name} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-ink border-r border-line dark:border-white/10 lg:hidden"
            >
              <SidebarContent
                onLogout={handleLogout}
                adminName={admin?.name}
                onNavigate={() => setDrawerOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b border-line dark:border-white/10 bg-white dark:bg-ink">
          <button onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <span className="font-display font-extrabold text-sm tracking-tight">
            Made<span className="text-made">or</span>Fade Admin
          </span>
          <div className="size-5" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  onLogout,
  adminName,
  onNavigate,
}: {
  onLogout: () => void;
  adminName?: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="h-16 flex items-center px-6 border-b border-line dark:border-white/10 justify-between">
        <span className="font-display font-extrabold text-lg tracking-tight">
          Made<span className="text-made">or</span>Fade
        </span>
        {onNavigate && (
          <button onClick={onNavigate} aria-label="Close menu" className="lg:hidden">
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                  : 'text-ink-soft hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-white/10'
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-line dark:border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-ink-soft dark:text-paper/50">Signed in as</p>
          <p className="text-sm font-semibold truncate">{adminName || 'Admin'}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fade hover:bg-fade/10 transition-colors"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </>
  );
}
