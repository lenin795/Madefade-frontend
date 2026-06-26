import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { PublicLayout } from './layouts/PublicLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { CreatePollPage } from './pages/CreatePollPage';
import { PrivatePollPage } from './pages/PrivatePollPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin pages are lazy-loaded as a separate chunk — most visitors never
// touch /admin, so there's no reason to ship analytics/chart libraries
// in the public-site bundle.
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminPollsPage = lazy(() => import('./pages/admin/AdminPollsPage').then((m) => ({ default: m.AdminPollsPage })));
const AdminPollFormPage = lazy(() => import('./pages/admin/AdminPollFormPage').then((m) => ({ default: m.AdminPollFormPage })));
const AdminEmailsPage = lazy(() => import('./pages/admin/AdminEmailsPage').then((m) => ({ default: m.AdminEmailsPage })));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="size-8 rounded-full border-2 border-line border-t-made animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaign/:id" element={<CampaignDetailPage />} />
        <Route path="/create" element={<CreatePollPage />} />
        <Route path="/p/:slug" element={<PrivatePollPage />} />
      </Route>

      {/* Admin auth */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      {/* Admin app (protected) */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="polls" element={<AdminPollsPage />} />
          <Route path="polls/new" element={<AdminPollFormPage />} />
          <Route path="polls/:id/edit" element={<AdminPollFormPage />} />
          <Route path="emails" element={<AdminEmailsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
