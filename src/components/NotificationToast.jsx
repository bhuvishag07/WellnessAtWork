import React from 'react';
import { useWellness } from '../context/WellnessContext';
import { X, Sparkles, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationToast = () => {
  const { toast, closeToast } = useWellness();

  if (!toast.show) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'points':
      case 'challenge':
        return <Trophy className="w-5 h-5 text-ink" />;
      case 'session':
        return <Calendar className="w-5 h-5 text-ink" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-ink" />;
      default:
        return <Sparkles className="w-5 h-5 text-ink" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slide-up">
      <div className="p-4 border-[3px] border-ink shadow-sticker-lg bg-butter rounded-none relative text-left">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 border-2 border-ink bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[2px_2px_0_#111]">
            {getIcon()}
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink">
                Real-Time Event
              </span>
              <span className="w-2 h-2 rounded-full bg-rose border border-ink" />
            </div>

            <h4 className="text-sm font-bold font-display text-ink">
              {toast.title}
            </h4>

            <p className="text-xs text-ink/80 mt-1 leading-relaxed">
              {toast.message}
            </p>

            {toast.actionLink && (
              <div className="mt-2.5">
                <Link
                  to={toast.actionLink}
                  onClick={closeToast}
                  className="text-xs font-bold font-display text-ink underline hover:text-indigo inline-flex items-center gap-1"
                >
                  View details &rarr;
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={closeToast}
            className="p-1 border border-ink bg-white text-ink hover:bg-rose transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
