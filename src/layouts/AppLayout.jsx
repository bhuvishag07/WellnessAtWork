import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import NotificationToast from '../components/NotificationToast';
import { useWellness } from '../context/WellnessContext';

export const AppLayout = () => {
  const { user, authLoading, backendError } = useWellness();
  const location = useLocation();

  if (authLoading) {
    return (
      <main className="min-h-screen bg-paper text-ink flex items-center justify-center font-display font-bold">
        Restoring your session...
      </main>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (location.pathname.startsWith('/admin') && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-body selection:bg-rose selection:text-ink">
      {/* Top Header & Navigation */}
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 pt-3 sm:pt-4">
        <Header />
      </div>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 pb-8">
        {backendError && (
          <p role="status" className="mb-4 border-2 border-ink bg-rose px-4 py-2 text-sm font-bold">
            Live data could not be refreshed: {backendError}
          </p>
        )}
        <Outlet />
      </main>

      {/* Persistent Academic & Student Bottom Bar */}
      <footer className="w-full max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-3.5 border-t-[3px] border-ink mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold font-display uppercase tracking-wider text-ink/80">
          <div>
            <span>CASE STUDY 72 · ITM SKILLS UNIV</span>
          </div>
          <div>
            <span>
              {user.fullName} · B.Tech CSE, Year 2 · {user.totalPoints || 0} pts · #{user.currentRank || '—'}
            </span>
          </div>
        </div>
      </footer>

      {/* Real-time Notification Toast */}
      <NotificationToast />
    </div>
  );
};

export default AppLayout;
