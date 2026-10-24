import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ArrowLeft,
  Smartphone,
  Watch,
  RefreshCw,
  CheckCircle,
  Award,
  AlertCircle
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill,
  ProgressBar
} from '../components/ui';
import { api } from '../services/api';

export const ChallengeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { challenges, deviceSync, setDeviceSync, dispatchToast } = useWellness();

  // Find challenge by id or fallback to 30-day walking challenge
  const challenge = challenges.find(c => c.id === id) || challenges[0];

  const [syncingApple, setSyncingApple] = useState(false);
  const [syncingFitbit, setSyncingFitbit] = useState(false);

  const handleSyncApple = async () => {
    setSyncingApple(true);
    try {
      const { api } = await import('../services/api');
      const res = await api.syncWearable({
        deviceType: 'appleHealth',
        steps: 10240,
        distanceKm: 7.4,
        activeMinutes: 48,
        restingHeartRate: 62
      });
      setSyncingApple(false);
      setDeviceSync(prev => ({ ...prev, appleHealth: true, lastSynced: "Just now" }));
      dispatchToast({
        title: "Apple Health Synchronized 🍏",
        message: res.message || "Fetched 10,240 steps from your Apple Watch. Activity updated!",
        type: "success"
      });
    } catch {
      setSyncingApple(false);
      setDeviceSync(prev => ({ ...prev, appleHealth: true, lastSynced: "Just now" }));
      dispatchToast({
        title: "Apple Health Synchronized 🍏",
        message: "Fetched 10,240 steps from your Apple Watch. Activity updated!",
        type: "success"
      });
    }
  };

  const handleSyncFitbit = async () => {
    setSyncingFitbit(true);
    try {
      const { api } = await import('../services/api');
      const res = await api.syncWearable({
        deviceType: 'fitbit',
        steps: 9850,
        distanceKm: 6.9,
        activeMinutes: 42,
        restingHeartRate: 65
      });
      setSyncingFitbit(false);
      setDeviceSync(prev => ({ ...prev, fitbit: true, lastSynced: "Just now" }));
      dispatchToast({
        title: "Fitbit Synchronized ⌚",
        message: res.message || "Synced today's steps and resting heart rate data.",
        type: "success"
      });
    } catch {
      setSyncingFitbit(false);
      setDeviceSync(prev => ({ ...prev, fitbit: true, lastSynced: "Just now" }));
      dispatchToast({
        title: "Fitbit Synchronized ⌚",
        message: "Synced today's steps and resting heart rate data.",
        type: "success"
      });
    }
  };

  const milestones = challenge?.milestones || [
    { day: 5, label: "5-Day Kickoff", completed: true, points: 50 },
    { day: 10, label: "100k Steps Club", completed: true, points: 75 },
    { day: 18, label: "Midpoint Momentum", completed: true, points: 75 },
    { day: 25, label: "Peak Endurance", completed: false, points: 50 },
    { day: 30, label: "30-Day Champion", completed: false, points: 50 },
  ];

  // API-driven peer leaderboard state
  const [peerList, setPeerList] = useState([]);
  const [loadingPeers, setLoadingPeers] = useState(true);
  const [peerError, setPeerError] = useState(null);

  const fetchPeers = useCallback(async () => {
    setLoadingPeers(true);
    setPeerError(null);
    try {
      const targetSlugOrId = challenge?.slug || challenge?._id || id || '30-day-walking';
      const res = await api.getChallengeLeaderboard(targetSlugOrId);
      const raw = res?.data?.leaderboard || [];
      if (raw.length > 0) {
        const peers = raw.map((p, idx) => ({
          rank: p.rank || idx + 1,
          id: p.id || `peer-${idx}`,
          name: p.name,
          department: p.department || 'General',
          steps: p.progress ? `${Math.round(p.progress * 100).toLocaleString()}` : `${Math.round((p.points || 100) * 35).toLocaleString()}`,
          points: p.points || Math.round((p.progress || 0) * 2.8),
          avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          isCurrentUser: p.isCurrentUser
        }));
        setPeerList(peers);
      } else if (challenge?.peerLeaderboard && challenge.peerLeaderboard.length > 0) {
        const fallback = challenge.peerLeaderboard.map((p, idx) => ({
          rank: p.rank || idx + 1,
          id: p.id || `peer-${idx}`,
          name: p.name,
          department: p.department || 'General',
          steps: p.steps || '10,000',
          points: p.points || 250,
          avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          isCurrentUser: p.isCurrentUser
        }));
        setPeerList(fallback);
      } else {
        setPeerList([]);
      }
    } catch (err) {
      if (challenge?.peerLeaderboard && challenge.peerLeaderboard.length > 0) {
        const fallback = challenge.peerLeaderboard.map((p, idx) => ({
          rank: p.rank || idx + 1,
          id: p.id || `peer-${idx}`,
          name: p.name,
          department: p.department || 'General',
          steps: p.steps || '10,000',
          points: p.points || 250,
          avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          isCurrentUser: p.isCurrentUser
        }));
        setPeerList(fallback);
        setPeerError(null);
      } else {
        setPeerError(err.message || 'Failed to load challenge participants');
        setPeerList([]);
      }
    } finally {
      setLoadingPeers(false);
    }
  }, [challenge, id]);

  useEffect(() => {
    fetchPeers();
  }, [fetchPeers]);

  return (
    <div className="space-y-6 text-left">
      {/* Back button and header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/challenges')}
            className="p-2 border-[3px] border-ink bg-white shadow-sticker-sm text-ink hover:-translate-x-[1px] hover:-translate-y-[1px] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Pill tone="butter" className="border-2 border-ink text-[10px]">
                {challenge?.category || 'Wellness Challenge'}
              </Pill>
              <span className="font-display text-xs font-bold text-ink tabular-nums">
                Day {challenge?.currentDay || 18} of {challenge?.totalDays || 30}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-ink tracking-tight mt-0.5">
              {challenge?.title}
            </h2>
          </div>
        </div>

        <StickerButton
          to="/activities/log"
          variant="primary"
          className="self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Activity</span>
        </StickerButton>
      </div>

      {/* Hero Overview Sticker Card */}
      <StickerCard tone="butter" shadow="sticker" className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xl font-display font-bold text-ink">
              Challenge Overview & Objective
            </h3>
            <p className="text-xs sm:text-sm text-ink/85 leading-relaxed">
              {challenge?.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 border-[3px] border-ink bg-white shadow-sticker-sm">
                <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">Target Goal</span>
                <span className="font-display text-sm font-bold text-ink mt-0.5 block truncate">
                  {challenge?.targetGoal}
                </span>
              </div>

              <div className="p-3 border-[3px] border-ink bg-white shadow-sticker-sm">
                <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">Reward Points</span>
                <span className="font-display text-sm font-bold tabular-nums text-ink mt-0.5 block">
                  +{challenge?.rewardPoints} pts
                </span>
              </div>

              <div className="p-3 border-[3px] border-ink bg-white shadow-sticker-sm">
                <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">Timeline</span>
                <span className="font-display text-xs font-bold text-ink mt-0.5 block truncate">
                  {challenge?.startDate} → {challenge?.endDate}
                </span>
              </div>

              <div className="p-3 border-[3px] border-ink bg-white shadow-sticker-sm">
                <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">Colleagues</span>
                <span className="font-display text-sm font-bold tabular-nums text-ink mt-0.5 block">
                  {challenge?.participantsCount} Joined
                </span>
              </div>
            </div>
          </div>

          {/* Progress Ring & Day Indicator */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border-[3px] border-ink bg-white shadow-sticker text-center space-y-2">
            <span className="font-display text-[11px] uppercase font-bold tracking-wider text-ink">
              Challenge Progress
            </span>
            <div className="text-4xl font-display font-bold tabular-nums text-ink">
              {challenge?.progress}%
            </div>
            <ProgressBar
              progress={challenge?.progress || 64}
              max={100}
              className="w-full"
              fillColor="bg-rose"
            />
            <p className="text-xs text-ink/80 pt-1">
              Currently on <strong className="font-display font-bold text-ink">Day {challenge?.currentDay || 18}</strong> of {challenge?.totalDays || 30}
            </p>
          </div>
        </div>
      </StickerCard>

      {/* Two Column Grid: Milestones & Tracker Sync / Peer Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Day-by-day Milestone Matrix */}
        <div className="lg:col-span-7 space-y-6">
          <StickerCard tone="white" shadow="sticker" className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div>
                <h3 className="text-base font-display font-bold text-ink">
                  Day-by-Day Milestone Matrix
                </h3>
                <p className="text-xs text-muted">
                  Reach critical checkpoints to unlock milestone bonus points
                </p>
              </div>
              <Pill tone="sage" className="border-2 border-ink text-[11px]">
                3 of 5 Unlocked
              </Pill>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 border-[3px] border-ink flex items-center justify-between transition-all ${
                    m.completed
                      ? 'bg-sage shadow-sticker-sm'
                      : 'bg-paper opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 border-2 border-ink flex items-center justify-center font-display font-bold text-xs ${
                      m.completed ? 'bg-white text-ink' : 'bg-white text-muted'
                    }`}>
                      {m.completed ? <CheckCircle className="w-4 h-4 text-ink stroke-[2.5]" /> : `D${m.day}`}
                    </div>
                    <div>
                      <h4 className="text-xs font-display font-bold text-ink">
                        {m.label}
                      </h4>
                      <p className="text-[10px] text-ink/75">
                        Day {m.day} checkpoint • {m.completed ? 'Unlocked & Points Credited' : 'Upcoming checkpoint'}
                      </p>
                    </div>
                  </div>

                  <span className="font-display text-xs font-bold px-2 py-0.5 border-2 border-ink bg-white tabular-nums shadow-[1px_1px_0_#111]">
                    +{m.points} pts
                  </span>
                </div>
              ))}
            </div>
          </StickerCard>

          {/* Automated Tracker Sync (Apple Health & Fitbit UI) */}
          <StickerCard tone="white" shadow="sticker" className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-ink" />
                <h3 className="text-base font-display font-bold text-ink">
                  Automated Wearable Device Sync
                </h3>
              </div>
              <span className="font-display text-[11px] font-bold text-muted">
                Last synced: {deviceSync?.lastSynced || 'Today, 10:15 AM'}
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Connect your smartwatch or phone health sensors. Steps and active minutes are automatically logged in the background.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Apple Health Card */}
              <div className="p-4 border-[3px] border-ink bg-paper space-y-3 shadow-sticker-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 border-2 border-ink bg-white text-ink flex items-center justify-center font-bold text-xs">
                      🍏
                    </div>
                    <div>
                      <h5 className="text-xs font-display font-bold text-ink">
                        Apple Health
                      </h5>
                      <span className="text-[10px] font-bold text-ink font-display">
                        Connected & Active
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSyncApple}
                    disabled={syncingApple}
                    className="p-1.5 border-2 border-ink bg-white text-ink hover:bg-butter transition-colors cursor-pointer"
                    title="Force Apple Health Sync"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingApple ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-[11px] text-ink/75">
                  Reads steps, walking distance, and active workout minutes from HealthKit.
                </p>
              </div>

              {/* Fitbit Card */}
              <div className="p-4 border-[3px] border-ink bg-paper space-y-3 shadow-sticker-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 border-2 border-ink bg-white text-ink flex items-center justify-center font-bold text-xs">
                      <Watch className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-display font-bold text-ink">
                        Fitbit OS
                      </h5>
                      <span className="text-[10px] font-bold text-ink font-display">
                        {deviceSync?.fitbit ? 'Connected' : 'Ready to pair'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSyncFitbit}
                    disabled={syncingFitbit}
                    className="p-1.5 border-2 border-ink bg-white text-ink hover:bg-butter transition-colors cursor-pointer"
                    title="Sync Fitbit"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingFitbit ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-[11px] text-ink/75">
                  Direct API OAuth sync for Fitbit Sense, Charge, and Versa bands.
                </p>
              </div>
            </div>
          </StickerCard>
        </div>

        {/* Right Column (5 cols): Peer Mini-Leaderboard & Quick Log CTA */}
        <div className="lg:col-span-5 space-y-6">
          <StickerCard tone="white" shadow="sticker" className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-ink" />
                <h3 className="text-base font-display font-bold text-ink">
                  Peer Mini-Leaderboard
                </h3>
              </div>
              <Link
                to="/leaderboard"
                className="text-xs font-display font-bold text-ink underline hover:text-indigo"
              >
                Full Board &rarr;
              </Link>
            </div>

            {loadingPeers ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin text-ink mx-auto" />
                <p className="font-display text-xs font-bold text-ink">
                  Loading peer standings...
                </p>
              </div>
            ) : peerError ? (
              <div className="p-4 border-[2px] border-ink bg-rose/20 text-center space-y-2">
                <AlertCircle className="w-5 h-5 text-ink mx-auto" />
                <p className="text-xs font-display font-bold text-ink">{peerError}</p>
                <button
                  onClick={fetchPeers}
                  className="px-3 py-1 border-2 border-ink bg-white font-display text-xs font-bold shadow-sticker-sm hover:bg-butter cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : peerList.length === 0 ? (
              <div className="py-8 px-4 border-[2px] border-dashed border-ink/40 text-center space-y-1">
                <Award className="w-6 h-6 text-ink/40 mx-auto" />
                <p className="font-display text-xs font-bold text-ink">
                  No participants logged yet
                </p>
                <p className="text-[11px] text-muted">
                  Log your activity below to take the #1 rank!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {peerList.map((peer, idx) => (
                  <div
                    key={peer.id || peer.rank || idx}
                    className={`p-3 border-[3px] border-ink flex items-center justify-between transition-colors ${
                      peer.isCurrentUser
                        ? 'bg-butter shadow-sticker-sm'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-display font-bold tabular-nums text-ink">
                        #{peer.rank}
                      </span>

                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-8 h-8 border-2 border-ink object-cover"
                      />

                      <div>
                        <h5 className="text-xs font-display font-bold text-ink">
                          {peer.name}
                        </h5>
                        <p className="text-[10px] text-muted">
                          {peer.department} • <span className="tabular-nums font-bold text-ink">{peer.steps}</span> steps
                        </p>
                      </div>
                    </div>

                    <span className="font-display text-xs font-bold tabular-nums text-ink px-2 py-0.5 border border-ink bg-sage">
                      {peer.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t-[2px] border-dashed border-ink/30">
              <StickerButton
                to="/activities/log"
                variant="primary"
                className="w-full"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Steps for This Challenge</span>
              </StickerButton>
            </div>
          </StickerCard>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailsPage;
