import React, { useEffect } from 'react';
import { Trophy, CheckCircle2, LayoutDashboard, Flame } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill,
  ProgressBar
} from '../components/ui';
import confetti from 'canvas-confetti';

export const ActivitySuccessPage = () => {
  const { user } = useWellness();

  // Retrieve last logged activity or fallback
  const lastLog = JSON.parse(sessionStorage.getItem('last_logged_activity') || '{}');
  const pointsEarned = Number(lastLog.points ?? 0);
  const challengeTitle = lastLog.challengeTitle || 'your wellness activity';

  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#111111', '#E58FA9', '#F2D98B', '#A8D5BA', '#B9C4E8']
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-6">
      <StickerCard tone="butter" shadow="sticker" className="p-8 sm:p-10 space-y-6">
        {/* Confirmed Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 border-[4px] border-ink bg-rose flex items-center justify-center shadow-[4px_4px_0_#111]">
            <CheckCircle2 className="w-10 h-10 text-ink stroke-[2.5]" />
          </div>
          <span className="absolute -top-2 -right-3 px-2 py-0.5 border-[2px] border-ink bg-white text-ink text-[10px] font-display font-bold uppercase shadow-[2px_2px_0_#111]">
            Confirmed
          </span>
        </div>

        {/* Text Announcements */}
        <div className="space-y-2">
          <Pill tone="white" className="border-[3px] border-ink">
            +{pointsEarned} Points Added to Ledger
          </Pill>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight pt-1">
            Great work, {user?.firstName || 'there'}!
          </h2>
          <p className="text-xs text-ink/80 max-w-sm mx-auto leading-relaxed">
            Your activity was successfully synchronized and recorded for <strong>{challengeTitle}</strong>.
          </p>
        </div>

        {/* Updated Metrics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
          <div className="p-3 border-[3px] border-ink bg-white shadow-sticker-sm">
            <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">
              Updated Balance
            </span>
            <span className="text-lg font-display font-bold text-ink mt-0.5 block tabular-nums">
              {user?.totalPoints ?? 0} pts
            </span>
            <span className="text-[10px] font-bold text-ink tabular-nums">
              +{pointsEarned} just earned
            </span>
          </div>

          <div className="p-3 border-[3px] border-ink bg-peri shadow-sticker-sm">
            <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">
              Company Rank
            </span>
            <span className="text-lg font-display font-bold text-ink mt-0.5 block tabular-nums">
              #{user?.currentRank ?? '—'}
            </span>
            <span className="text-[10px] text-ink font-semibold">
              Engineering Div
            </span>
          </div>

          <div className="p-3 border-[3px] border-ink bg-sage shadow-sticker-sm">
            <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">
              Daily Streak
            </span>
            <span className="text-lg font-display font-bold text-ink mt-0.5 block flex items-center gap-1 tabular-nums">
              <Flame className="w-4 h-4 text-ink" />
              {user?.streakDays ?? 0} Days
            </span>
            <span className="text-[10px] text-ink/80 font-medium">
              Streak preserved
            </span>
          </div>
        </div>

        {/* Progress advancement bar */}
        <div className="p-4 border-[3px] border-ink bg-white text-left space-y-2 shadow-sticker-sm">
          <div className="flex items-center justify-between text-xs font-display font-bold">
            <span className="text-ink">Tier Advancement</span>
            <span className="tabular-nums text-ink">
              {user?.totalPoints ?? 0} / 1500 pts
            </span>
          </div>
          <ProgressBar
            progress={user?.totalPoints ?? 0}
            max={1500}
            className="w-full"
            fillColor="bg-rose"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <StickerButton
            to="/dashboard"
            variant="dark"
            className="w-full sm:w-auto"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </StickerButton>

          <StickerButton
            to="/leaderboard"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <Trophy className="w-4 h-4" />
            <span>View Leaderboard</span>
          </StickerButton>
        </div>
      </StickerCard>
    </div>
  );
};

export default ActivitySuccessPage;
