import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import NotificationToast from '../components/NotificationToast';
import { StickerButton, Pill } from '../components/ui';

export const PublicLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-body selection:bg-rose selection:text-ink">
      {/* Public Navigation Header */}
      <header className="w-full px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto border-[3px] border-ink bg-white shadow-sticker px-5 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-ink text-butter px-3 py-1.5 border-[3px] border-ink shadow-[4px_4px_0_#E58FA9] transform -rotate-2 group-hover:rotate-0 transition-transform">
              <span className="font-display font-bold text-base sm:text-lg block leading-tight tracking-tight">
                WellnessAtWork
              </span>
              <span className="text-[10px] text-white/90 font-medium block leading-none pt-0.5">
                Small steps. Better wellness.
              </span>
            </div>
          </Link>

          {/* Academic Context Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border-[2px] border-ink bg-paper text-xs font-display font-bold text-ink shadow-[2px_2px_0_#111]">
            <Shield className="w-3.5 h-3.5 text-ink" />
            <span>Case Study 72 • ITM Skills University • Bhuvisha Manish Gohil</span>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            {location.pathname !== '/login' && (
              <Link
                to="/login"
                className="px-3.5 py-1.5 border-[2px] border-transparent hover:border-ink font-display text-xs font-bold text-ink transition-all"
              >
                Sign In
              </Link>
            )}

            {location.pathname !== '/register' && (
              <StickerButton
                to="/register"
                variant="primary"
                className="text-xs py-1.5 px-4"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </StickerButton>
            )}

            {location.pathname !== '/dashboard' && (
              <StickerButton
                to="/dashboard"
                variant="secondary"
                className="hidden sm:inline-flex text-xs py-1.5 px-3.5"
              >
                Demo App &rarr;
              </StickerButton>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t-[3px] border-ink py-6 px-4 sm:px-8 mt-auto bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-display font-bold text-ink">
          <div className="flex items-center gap-2">
            <span>WellnessAtWork</span>
            <span className="text-muted font-normal">• Corporate Employee Wellness Platform</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span>Built by</span>
            <span className="font-bold text-ink">Bhuvisha Manish Gohil</span>
            <span>(Second Year B.Tech CSE, ITM Skills University)</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:underline">Sign In</Link>
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/dashboard" className="hover:underline">Employee Portal</Link>
            <Link to="/admin" className="hover:underline">HR Admin</Link>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <NotificationToast />
    </div>
  );
};

export default PublicLayout;
