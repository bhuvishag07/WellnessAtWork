import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Trophy,
  Calendar,
  Award,
  Gift,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill
} from '../components/ui';

export const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, unreadNotificationsCount } = useWellness();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'challenge':
        return <Trophy className="w-5 h-5 text-ink" />;
      case 'session':
        return <Calendar className="w-5 h-5 text-ink" />;
      case 'leaderboard':
        return <Award className="w-5 h-5 text-ink" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-ink" />;
      default:
        return <Sparkles className="w-5 h-5 text-ink" />;
    }
  };

  // Category counts
  const categoryCounts = {
    challenge: notifications.filter(n => n.type === 'challenge').length,
    session: notifications.filter(n => n.type === 'session').length,
    leaderboard: notifications.filter(n => n.type === 'leaderboard').length,
    reward: notifications.filter(n => n.type === 'reward').length
  };

  return (
    <div className="space-y-6 text-left py-2">
      {/* Context & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="butter" className="border-2 border-ink text-[10px]">
              Inbox
            </Pill>
            <span className="font-display text-xs font-bold text-ink">Real-time Event Logs</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Notifications
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
            Stay informed on challenge milestones, scheduled sessions, and live leaderboard advancements.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <StickerButton
            variant="secondary"
            onClick={markAllAsRead}
            className="text-xs self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </StickerButton>
        )}
      </div>

      {/* Main Grid: Feed (8 cols) + Summary Card (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Filters & Feed */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-[3px] border-ink">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 border-[3px] border-ink font-display text-xs font-bold transition-transform cursor-pointer ${
                  filter === 'all'
                    ? 'bg-ink text-butter shadow-sticker-sm'
                    : 'bg-white text-ink shadow-sticker-sm hover:bg-paper'
                }`}
              >
                All Alerts ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3.5 py-1.5 border-[3px] border-ink font-display text-xs font-bold transition-transform cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-ink text-butter shadow-sticker-sm'
                    : 'bg-white text-ink shadow-sticker-sm hover:bg-paper'
                }`}
              >
                Unread Only ({unreadNotificationsCount})
              </button>
            </div>

            <span className="font-display text-xs font-bold text-ink">
              {unreadNotificationsCount} unread
            </span>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <StickerCard tone="white" shadow="sticker" className="p-10 text-center space-y-3">
                <Bell className="w-9 h-9 text-ink mx-auto stroke-[2]" />
                <h4 className="text-base font-display font-bold text-ink">No notifications to display</h4>
                <p className="text-xs text-muted">
                  You're all caught up with your wellness alerts!
                </p>
              </StickerCard>
            ) : (
              filtered.map((notif) => (
                <StickerCard
                  key={notif.id}
                  tone={!notif.read ? "butter" : "white"}
                  shadow="sticker"
                  className="p-4 sm:p-4.5 flex items-start gap-3.5 transition-all"
                >
                  {/* Icon Container */}
                  <div className="w-9 h-9 border-2 border-ink bg-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[2px_2px_0_#111]">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-display font-bold text-ink">
                        {notif.title}
                      </h4>
                      <span className="font-display text-[10px] sm:text-[11px] font-bold text-muted whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-ink/80 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="pt-1.5 flex items-center gap-4">
                      {notif.actionLink && (
                        <Link
                          to={notif.actionLink}
                          onClick={() => markAsRead(notif.id)}
                          className="font-display text-xs font-bold text-ink underline hover:text-indigo inline-flex items-center gap-1"
                        >
                          <span>Take Action</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}

                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="font-display text-[10px] font-bold text-muted hover:text-ink cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </StickerCard>
              ))
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Inbox Summary & Distribution */}
        <div className="lg:col-span-4 space-y-4">
          <StickerCard tone="white" shadow="sticker" className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-[3px] border-ink">
              <span className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-indigo block">
                INBOX SUMMARY
              </span>
              <Pill tone={unreadNotificationsCount > 0 ? "rose" : "sage"} className="border border-ink text-[10px]">
                {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} Actionable` : 'All Caught Up'}
              </Pill>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 border-[2px] border-ink bg-paper shadow-sticker-sm text-left">
                <span className="font-display text-[10px] font-bold text-muted uppercase">Total</span>
                <div className="text-xl font-display font-bold text-ink mt-0.5">
                  {notifications.length}
                </div>
              </div>

              <div className="p-3 border-[2px] border-ink bg-butter shadow-sticker-sm text-left">
                <span className="font-display text-[10px] font-bold text-muted uppercase">Unread</span>
                <div className="text-xl font-display font-bold text-ink mt-0.5">
                  {unreadNotificationsCount}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t-[2px] border-dashed border-ink/30 space-y-2">
              <span className="font-display text-[11px] font-bold uppercase tracking-wider text-ink block">
                Category Distribution
              </span>
              <div className="space-y-1.5 text-xs font-display font-bold text-ink">
                <div className="flex items-center justify-between p-2 border border-ink bg-white">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-ink" />
                    Challenges
                  </span>
                  <span className="tabular-nums">{categoryCounts.challenge}</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-ink bg-white">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ink" />
                    Live Sessions
                  </span>
                  <span className="tabular-nums">{categoryCounts.session}</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-ink bg-white">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-ink" />
                    Leaderboard
                  </span>
                  <span className="tabular-nums">{categoryCounts.leaderboard}</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-ink bg-white">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-ink" />
                    Rewards
                  </span>
                  <span className="tabular-nums">{categoryCounts.reward}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t-[2px] border-dashed border-ink/30">
              <Link
                to="/settings"
                className="text-xs font-display font-bold text-ink underline hover:text-indigo block text-center"
              >
                Manage Notification Preferences &rarr;
              </Link>
            </div>
          </StickerCard>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
