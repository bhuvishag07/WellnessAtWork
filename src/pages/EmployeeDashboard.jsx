import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill,
  ProgressBar,
  StatCell,
  ActivityRow
} from '../components/ui';

export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, challenges, activities, logActivity, dispatchToast } = useWellness();

  // Quick log handler
  const handleQuickLog = async (challenge) => {
    try {
      await logActivity({
        type: challenge.categoryKey === 'meditation' ? 'Meditation' : challenge.categoryKey === 'habit' ? 'Hydration' : 'Walking',
        value: challenge.categoryKey === 'habit' ? '2.5L' : challenge.categoryKey === 'meditation' ? '15 min' : '10,000 steps',
        duration: 15,
        challengeId: challenge.id
      });
    } catch {
      navigate('/activities/log');
    }
  };

  const handlePlayRecap = () => {
    setRecapPlayed(true);
    dispatchToast({
      title: "Weekly Wellness Recap 🎬",
      message: "94% consistency score! 5 out of 5 workdays completed. Keep up the momentum!",
      type: "success"
    });
  };

  // Days of the week for streak
  const streakDays = [
    { day: "M", completed: true },
    { day: "T", completed: true },
    { day: "W", completed: true },
    { day: "T", completed: true },
    { day: "F", completed: true },
    { day: "S", completed: false },
    { day: "S", completed: false },
  ];

  const totalPoints = user?.totalPoints || 950;
  const streakCount = user?.streakDays || 15;
  const currentRank = user?.currentRank || 8;
  const activeCount = user?.activeChallengesCount || 3;
  const sessionsCount = user?.upcomingSessionsCount || 2;

  return (
    <div className="space-y-6 text-left">
      {/* 1. HERO STICKER CARD */}
      <StickerCard tone="butter" shadow="sticker" className="relative p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Hero Details */}
          <div className="space-y-3 flex-1">
            {/* Tier Pill */}
            <div>
              <Pill tone="white" className="border-[3px] border-ink text-xs">
                {user?.tier || 'SILVER PIONEER'}
              </Pill>
            </div>

            {/* Greeting */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold text-ink leading-tight tracking-tight">
                Good morning, {user?.firstName || 'Bhuvisha'}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-ink mt-1">
                You're on a {streakCount}-day wellness streak. Ready for today's micro-movement?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <StickerButton
                to="/activities/log"
                variant="primary"
                className="px-4 py-2 text-xs"
              >
                + Log activity
              </StickerButton>

              <StickerButton
                to="/challenges"
                variant="secondary"
                className="px-4 py-2 text-xs"
              >
                Explore challenges
              </StickerButton>
            </div>

            {/* Streak Days Row */}
            <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
              {streakDays.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-display font-bold text-xs select-none ${
                    item.completed
                      ? "border-[2px] sm:border-[3px] border-ink bg-rose text-ink"
                      : "border-[2px] sm:border-[3px] border-dashed border-ink bg-white text-ink"
                  }`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>

          {/* Right Circular Streak Sticker */}
          <div className="flex items-center justify-center lg:pr-2 py-1 shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[3px] sm:border-[4px] border-ink bg-rose shadow-[4px_4px_0_#111111] flex flex-col items-center justify-center text-center p-2 select-none">
              <span className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink leading-none">
                {streakCount}
              </span>
              <span className="font-display text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink mt-1">
                DAY STREAK
              </span>
            </div>
          </div>
        </div>
      </StickerCard>

      {/* 2. STATS ROW (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Points */}
        <StickerCard tone="white" shadow="sticker" className="p-3.5 sm:p-4.5">
          <StatCell
            label="TOTAL POINTS"
            value={totalPoints}
            subline="+100 pts earned this quarter"
            footer="Next tier at 1,000 pts"
          />
        </StickerCard>

        {/* Active Challenges */}
        <StickerCard tone="sage" shadow="sticker" className="p-3.5 sm:p-4.5">
          <StatCell
            label="ACTIVE CHALLENGES"
            value={activeCount}
            subline="In progress, ongoing initiatives"
            footer="64% avg completion"
          />
        </StickerCard>

        {/* Current Rank */}
        <StickerCard tone="peri" shadow="sticker" className="p-3.5 sm:p-4.5">
          <StatCell
            label="CURRENT RANK"
            value={`#${currentRank}`}
            subline="Top 5%, Engineering department"
            footer="Climbed +2 places"
          />
        </StickerCard>

        {/* Upcoming Sessions */}
        <StickerCard tone="blush" shadow="sticker" className="p-3.5 sm:p-4.5">
          <StatCell
            label="UPCOMING SESSIONS"
            value={sessionsCount}
            subline="Confidential mindful care scheduled"
            footer="Next: tomorrow 3:30 PM"
          />
        </StickerCard>
      </div>

      {/* 3. MIDDLE SECTION: Your Wellness Journey + Daily Tip & Weekly Recap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Left Column (7 cols): Your wellness journey */}
        <div className="lg:col-span-7 h-full">
          <StickerCard tone="white" shadow="sticker" className="p-5 sm:p-6 space-y-4 sm:space-y-5 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between gap-2 border-b-[3px] border-ink pb-3">
              <div>
                <span className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-indigo block">
                  STATUS AND MILESTONES
                </span>
                <h2 className="text-lg sm:text-xl font-display font-bold text-ink">
                  Your wellness journey
                </h2>
              </div>
              <Pill tone="butter" className="border-[2px] border-ink text-xs">
                {streakCount}-DAY STREAK
              </Pill>
            </div>

            {/* Progress Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold font-display">
                <span>Tier progress</span>
                <span className="tabular-nums">{totalPoints} / 1500 pts</span>
              </div>

              {/* Exact 34px high Sticker Brutalist ProgressBar */}
              <ProgressBar
                progress={totalPoints}
                max={1500}
                className="w-full"
                fillColor="bg-rose"
              />

              <div className="flex items-center justify-between text-[11px] font-semibold text-muted pt-0.5">
                <span>Bronze</span>
                <span className="text-ink font-bold">
                  Silver Pioneer: you are here ({Math.round((totalPoints / 1500) * 100)}% to Gold)
                </span>
                <span>Gold Explorer</span>
              </div>
            </div>

            {/* Mini Summary Boxes (Consistency & Reward Ready) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="border-[3px] border-ink bg-sage p-3.5 text-left shadow-sticker-sm">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.1em] text-ink block">
                  CONSISTENCY
                </span>
                <div className="text-xl font-display font-bold text-ink mt-0.5">
                  94% active
                </div>
                <p className="text-[11px] text-ink/80 mt-0.5">
                  Last 30 calendar days
                </p>
              </div>

              <div className="border-[3px] border-ink bg-peri p-3.5 text-left shadow-sticker-sm">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.1em] text-ink block">
                  REWARD READY
                </span>
                <div className="text-xl font-display font-bold text-ink mt-0.5">
                  2 available
                </div>
                <Link
                  to="/rewards"
                  className="text-[11px] font-bold text-ink underline hover:text-indigo mt-0.5 inline-block"
                >
                  View rewards &rarr;
                </Link>
              </div>
            </div>
          </StickerCard>
        </div>

        {/* Right Column (5 cols): Daily Wellness Tip & Weekly Recap */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between gap-4">
          {/* Daily Wellness Tip */}
          <StickerCard tone="butter" shadow="sticker" className="p-4 sm:p-4.5 space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1">
                <Pill tone="white" className="border border-ink text-[10px] py-0.5">
                  DAILY WELLNESS TIP
                </Pill>
              </div>

              <h3 className="text-sm sm:text-base font-display font-bold text-ink leading-snug pt-1">
                The 20-20-20 visual reset technique
              </h3>

              <p className="text-xs text-ink/85 leading-relaxed mt-1">
                Every 20 minutes, look at an object 20 feet away for 20 seconds. This relaxes eye muscles and counters mental fatigue from high-resolution screens.
              </p>
            </div>

            <div className="pt-2 border-t-[2px] border-dashed border-ink/30 flex items-center justify-between text-xs">
              <span className="text-[10px] text-ink/75 font-medium">
                Curated by ErgoCare Specialists
              </span>
              <Link
                to="/resources"
                className="font-bold text-ink underline hover:text-indigo text-xs"
              >
                Browse resources &rarr;
              </Link>
            </div>
          </StickerCard>

          {/* Weekly Recap */}
          <StickerCard tone="ink" shadow="sticker" className="p-4 sm:p-4.5 space-y-1.5">
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.1em] text-butter block">
              WEEKLY RECAP
            </span>

            <div className="text-3xl font-display font-bold text-butter leading-none pt-0.5">
              94%
            </div>

            <p className="text-xs text-butter/90 leading-snug">
              consistency this month. Swipe through your week.
            </p>

            <div className="pt-1.5">
              <StickerButton
                variant="butter"
                onClick={handlePlayRecap}
                className="text-xs py-1 px-2.5"
              >
                Play recap &rarr;
              </StickerButton>
            </div>
          </StickerCard>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: Active Challenges + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Left Column (7 cols): Active Challenges */}
        <div className="lg:col-span-7 h-full">
          <StickerCard tone="white" shadow="sticker" className="p-5 sm:p-6 space-y-3.5 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b-[3px] border-ink pb-2.5">
              <div>
                <h3 className="text-base font-display font-bold text-ink">
                  Active challenges
                </h3>
                <p className="text-xs text-muted">
                  Track and log your daily progress
                </p>
              </div>
              <Link
                to="/challenges"
                className="text-xs font-bold font-display underline text-ink hover:text-indigo"
              >
                View all ({challenges.length || 6}) &rarr;
              </Link>
            </div>

            {/* 3 Challenge Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 flex-1">
              {/* Card 1: Hydration Hero (Sage) */}
              <div className="border-[3px] border-ink bg-sage p-3.5 flex flex-col justify-between shadow-sticker-sm text-left h-full">
                <div>
                  <span className="font-display text-[9px] font-bold uppercase tracking-[0.1em] text-ink block">
                    HABIT AND VITALITY
                  </span>
                  <h4 className="text-xs font-display font-bold text-ink mt-1 leading-snug">
                    Hydration Hero
                  </h4>
                  <p className="text-xs font-bold font-display text-ink mt-0.5">
                    +150 pts
                  </p>
                </div>
                <div className="pt-3">
                  <StickerButton
                    variant="secondary"
                    onClick={() => handleQuickLog({ categoryKey: 'habit', id: 'hydration-hero' })}
                    className="w-full text-xs py-1 bg-white shadow-none hover:shadow-sticker-sm"
                  >
                    Log today
                  </StickerButton>
                </div>
              </div>

              {/* Card 2: Daily Meditation Challenge (Peri) */}
              <div className="border-[3px] border-ink bg-peri p-3.5 flex flex-col justify-between shadow-sticker-sm text-left h-full">
                <div>
                  <span className="font-display text-[9px] font-bold uppercase tracking-[0.1em] text-ink block">
                    MINDFULNESS
                  </span>
                  <h4 className="text-xs font-display font-bold text-ink mt-1 leading-snug">
                    Daily Meditation Challenge
                  </h4>
                  <p className="text-xs font-bold font-display text-ink mt-0.5">
                    +250 pts
                  </p>
                </div>
                <div className="pt-3">
                  <StickerButton
                    variant="secondary"
                    onClick={() => handleQuickLog({ categoryKey: 'meditation', id: 'mindful-minutes' })}
                    className="w-full text-xs py-1 bg-white shadow-none hover:shadow-sticker-sm"
                  >
                    Log today
                  </StickerButton>
                </div>
              </div>

              {/* Card 3: 30-Day Walking Challenge (Blush) */}
              <div className="border-[3px] border-ink bg-blush p-3.5 flex flex-col justify-between shadow-sticker-sm text-left h-full">
                <div>
                  <span className="font-display text-[9px] font-bold uppercase tracking-[0.1em] text-ink block">
                    MOVEMENT
                  </span>
                  <h4 className="text-xs font-display font-bold text-ink mt-1 leading-snug">
                    30-Day Walking Challenge
                  </h4>
                  <p className="text-xs font-bold font-display text-ink mt-0.5">
                    +100 pts per log
                  </p>
                </div>
                <div className="pt-3">
                  <StickerButton
                    variant="secondary"
                    onClick={() => handleQuickLog({ categoryKey: 'steps', id: '30-day-walking' })}
                    className="w-full text-xs py-1 bg-white shadow-none hover:shadow-sticker-sm"
                  >
                    Log today
                  </StickerButton>
                </div>
              </div>
            </div>
          </StickerCard>
        </div>

        {/* Right Column (5 cols): Recent Activity */}
        <div className="lg:col-span-5 h-full">
          <StickerCard tone="white" shadow="sticker" className="p-5 sm:p-6 space-y-3.5 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b-[3px] border-ink pb-2.5">
              <h3 className="text-base font-display font-bold text-ink">
                Recent activity
              </h3>
              <Link
                to="/activities/log"
                className="text-xs font-bold font-display underline text-ink hover:text-indigo"
              >
                + Log new
              </Link>
            </div>

            {/* Activity Rows */}
            <div className="space-y-2.5 flex-1">
              {activities && activities.length > 0 ? (
                activities.slice(0, 3).map((activity) => (
                  <ActivityRow
                    key={activity.id}
                    title={`${activity.type} · ${activity.value} ${activity.unit || ''}`}
                    subtitle={`${activity.timestamp || 'Today'} · ${activity.challengeTitle || 'Initiative'}`}
                    points={activity.points}
                  />
                ))
              ) : (
                <>
                  <ActivityRow
                    title="Walking · 10,000 steps"
                    subtitle="Oct 6, 3:36 PM · 30-Day Walking Challenge"
                    points={100}
                  />
                  <ActivityRow
                    title="Walking · 10,240 steps"
                    subtitle="Oct 6, 3:35 PM · 30-Day Walking Challenge"
                    points={100}
                  />
                </>
              )}
            </div>
          </StickerCard>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
