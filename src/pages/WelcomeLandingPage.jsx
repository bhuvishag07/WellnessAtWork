import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Trophy,
  HeartHandshake,
  Award,
  Gift,
  CheckCircle,
  Activity,
  Flame
} from 'lucide-react';
import {
  StickerCard,
  StickerButton,
  Pill,
  ProgressBar
} from '../components/ui';

export const WelcomeLandingPage = () => {
  return (
    <div className="space-y-12 py-4 sm:py-8 text-left">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Value Prop */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Academic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border-[2px] border-ink bg-white font-display text-xs font-bold text-ink shadow-[2px_2px_0_#111]">
            <span className="w-2 h-2 rounded-full bg-rose border border-ink" />
            <span>Case Study 72 • ITM Skills University</span>
            <span className="text-muted font-normal">| Bhuvisha Manish Gohil</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink tracking-tight leading-[1.05]">
            Small steps. <br />
            <span className="bg-rose px-2 text-ink border-[3px] border-ink shadow-[4px_4px_0_#111] inline-block mt-1 transform -rotate-1">
              Better wellness.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-ink/85 leading-relaxed max-w-xl">
            WellnessAtWork transforms employee vitality with gamified daily movement challenges, confidential 1-on-1 counseling, real-time team leaderboards, and tangible corporate reward points.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <StickerButton
              to="/register"
              variant="primary"
              className="text-xs sm:text-sm px-6 py-3"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </StickerButton>

            <StickerButton
              to="/login"
              variant="secondary"
              className="text-xs sm:text-sm px-5 py-3"
            >
              Sign In to Account
            </StickerButton>

            <Link
              to="/dashboard"
              className="px-4 py-2.5 border-[2px] border-dashed border-ink font-display text-xs font-bold text-ink hover:bg-butter transition-colors"
            >
              Direct Live Demo &rarr;
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="pt-4 border-t-[3px] border-ink grid grid-cols-3 gap-4">
            <div className="p-3 border-[2px] border-ink bg-white shadow-sticker-sm">
              <p className="text-2xl font-display font-bold text-ink tabular-nums">78%</p>
              <p className="text-[11px] text-muted font-medium mt-0.5">Participation Rate</p>
            </div>
            <div className="p-3 border-[2px] border-ink bg-sage shadow-sticker-sm">
              <p className="text-2xl font-display font-bold text-ink tabular-nums">-34%</p>
              <p className="text-[11px] text-ink/80 font-medium mt-0.5">Burnout Reduction</p>
            </div>
            <div className="p-3 border-[2px] border-ink bg-butter shadow-sticker-sm">
              <p className="text-2xl font-display font-bold text-ink tabular-nums">100%</p>
              <p className="text-[11px] text-ink/80 font-medium mt-0.5">HR Privacy Fence</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticker Dashboard Preview Card */}
        <div className="lg:col-span-5 relative">
          <StickerCard tone="butter" shadow="sticker-lg" className="p-6 space-y-5">
            {/* Header chip inside card */}
            <div className="flex items-center justify-between pb-3.5 border-b-[3px] border-ink">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Bhuvisha"
                  className="w-10 h-10 border-2 border-ink object-cover"
                />
                <div className="text-left">
                  <h4 className="text-xs font-display font-bold text-ink">
                    Good morning, Bhuvisha 👋
                  </h4>
                  <p className="text-[11px] text-muted">
                    Engineering • Silver Pioneer
                  </p>
                </div>
              </div>
              <Pill tone="rose" className="border-2 border-ink text-[10px]">
                Rank #8
              </Pill>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 border-[2px] border-ink bg-white shadow-sticker-sm">
                <span className="font-display text-[10px] uppercase font-bold text-ink block">
                  Total Points
                </span>
                <span className="text-2xl font-display font-bold text-ink mt-0.5 block tabular-nums">
                  950
                </span>
                <span className="text-[11px] font-bold text-ink flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-ink" />
                  +100 pts today
                </span>
              </div>

              <div className="p-3 border-[2px] border-ink bg-sage shadow-sticker-sm">
                <span className="font-display text-[10px] uppercase font-bold text-ink block">
                  Active Challenges
                </span>
                <span className="text-2xl font-display font-bold text-ink mt-0.5 block tabular-nums">
                  3
                </span>
                <span className="text-[11px] font-bold text-ink flex items-center gap-1 mt-0.5">
                  <Flame className="w-3 h-3 text-ink" />
                  15-Day Streak
                </span>
              </div>
            </div>

            {/* Wellness Progress Section */}
            <div className="p-4 border-[2px] border-ink bg-white shadow-sticker-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-display font-bold">
                <span className="text-ink">Silver Pioneer Tier</span>
                <span className="tabular-nums text-ink">950 / 1500 pts</span>
              </div>
              <ProgressBar
                progress={950}
                max={1500}
                className="w-full"
                fillColor="bg-rose"
              />
            </div>

            {/* Active Challenge Mini Row */}
            <div className="p-3 border-[2px] border-ink bg-white shadow-sticker-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 border border-ink bg-peri flex items-center justify-center text-ink">
                  <Activity className="w-3.5 h-3.5 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs font-display font-bold text-ink">
                    30-Day Walking Challenge
                  </p>
                  <p className="text-[10px] text-muted">
                    10,240 / 10,000 steps today
                  </p>
                </div>
              </div>
              <span className="font-display text-xs font-bold text-ink bg-sage px-2 py-0.5 border border-ink">
                64%
              </span>
            </div>
          </StickerCard>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <Pill tone="butter" className="border-2 border-ink">
            Holistic Corporate Architecture
          </Pill>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
            Designed for human vitality at work
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium">
            Not a clinical medical checklist, but an engaging daily wellness platform employees love returning to.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          <StickerCard tone="white" shadow="sticker" className="p-5 space-y-2.5">
            <div className="w-10 h-10 border-2 border-ink bg-sage flex items-center justify-center text-ink shadow-[2px_2px_0_#111]">
              <Trophy className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base font-display font-bold text-ink">
              Gamified Challenges
            </h3>
            <p className="text-xs text-ink/80 leading-relaxed">
              Step goals, mindfulness minutes, hydration, and posture breaks with day-by-day milestone tracking and automatic sync.
            </p>
          </StickerCard>

          <StickerCard tone="white" shadow="sticker" className="p-5 space-y-2.5">
            <div className="w-10 h-10 border-2 border-ink bg-peri flex items-center justify-center text-ink shadow-[2px_2px_0_#111]">
              <HeartHandshake className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base font-display font-bold text-ink">
              Confidential Care
            </h3>
            <p className="text-xs text-ink/80 leading-relaxed">
              Book private 1-on-1 licensed counseling and live desk yoga with an HR-independent privacy fence guarantee.
            </p>
          </StickerCard>

          <StickerCard tone="white" shadow="sticker" className="p-5 space-y-2.5">
            <div className="w-10 h-10 border-2 border-ink bg-butter flex items-center justify-center text-ink shadow-[2px_2px_0_#111]">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base font-display font-bold text-ink">
              Live Leaderboard
            </h3>
            <p className="text-xs text-ink/80 leading-relaxed">
              Friendly team competitions, podium rankings, departmental stats, and synchronous live notification alerts.
            </p>
          </StickerCard>

          <StickerCard tone="white" shadow="sticker" className="p-5 space-y-2.5">
            <div className="w-10 h-10 border-2 border-ink bg-rose flex items-center justify-center text-ink shadow-[2px_2px_0_#111]">
              <Gift className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base font-display font-bold text-ink">
              Rewards Ledger
            </h3>
            <p className="text-xs text-ink/80 leading-relaxed">
              Redeem earned activity points for artisan coffee vouchers, ergonomic workspace kits, and gym allowances.
            </p>
          </StickerCard>
        </div>
      </section>

      {/* Case Study 72 Callout Card */}
      <section>
        <StickerCard tone="peri" shadow="sticker-lg" className="p-6 sm:p-8 text-left">
          <div className="max-w-2xl space-y-2.5">
            <Pill tone="white" className="border-2 border-ink text-xs">
              Academic Engineering Specification
            </Pill>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-ink">
              Case Study 72 • ITM Skills University
            </h3>
            <p className="text-xs sm:text-sm text-ink/85 leading-relaxed">
              Authored by <strong className="font-bold text-ink">Bhuvisha Manish Gohil</strong> (B.Tech Computer Science & Engineering, Second Year). This frontend implementation provides all specified views, responsive soft sticker brutalism, and reactive state ready for Node/MongoDB/Socket.io backend integration.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <StickerButton
                to="/dashboard"
                variant="primary"
                className="text-xs"
              >
                Enter Employee Dashboard
              </StickerButton>
              <StickerButton
                to="/admin"
                variant="secondary"
                className="text-xs"
              >
                View HR Admin Command
              </StickerButton>
            </div>
          </div>
        </StickerCard>
      </section>
    </div>
  );
};

export default WelcomeLandingPage;
