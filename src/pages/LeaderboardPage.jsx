import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Flame,
  Search,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  Pill
} from '../components/ui';
import { api } from '../services/api';

export const LeaderboardPage = () => {
  const { leaderboardData, user, challenges } = useWellness();
  const [boardType, setBoardType] = useState('overall');
  const [selectedChallengeId, setSelectedChallengeId] = useState('30-day-walking');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Challenge leaderboard state
  const [challengeBoard, setChallengeBoard] = useState([]);
  const [loadingChallenge, setLoadingChallenge] = useState(false);
  const [challengeError, setChallengeError] = useState(null);

  const fetchChallengeLeaderboard = useCallback((challengeId) => {
    setLoadingChallenge(true);
    setChallengeError(null);
    api.getChallengeLeaderboard(challengeId)
      .then((res) => {
        const raw = res?.data?.leaderboard || [];
        if (raw.length > 0) {
          const formatted = raw.map((item, idx) => ({
            rank: item.rank || idx + 1,
            id: item.id || `cl-${idx}`,
            name: item.name,
            department: item.department || 'General',
            points: item.points || Math.round((item.progress || 0) * 2.8),
            streak: item.progress ? `${item.progress}% done` : (item.steps ? `${item.steps} steps` : 'Active'),
            badge: item.badge || 'Challenge Contender',
            avatar: item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            isCurrentUser: item.isCurrentUser
          }));
          setChallengeBoard(formatted);
        } else {
          // Fallback to challenge peerLeaderboard from demo / context data
          const currentCh = (challenges || []).find(c => c.id === challengeId || c.slug === challengeId) || challenges?.[0];
          if (currentCh?.peerLeaderboard && currentCh.peerLeaderboard.length > 0) {
            const fallback = currentCh.peerLeaderboard.map((item, idx) => ({
              rank: item.rank || idx + 1,
              id: item.id || `peer-${idx}`,
              name: item.name,
              department: item.department || 'General',
              points: item.points || 250,
              streak: item.steps ? `${item.steps} steps` : `${item.progress || 60}% done`,
              badge: 'Walking Club',
              avatar: item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              isCurrentUser: item.isCurrentUser
            }));
            setChallengeBoard(fallback);
          } else {
            setChallengeBoard([]);
          }
        }
        setLoadingChallenge(false);
      })
      .catch(() => {
        // Fallback to challenge peerLeaderboard on error / offline mode
        const currentCh = (challenges || []).find(c => c.id === challengeId || c.slug === challengeId) || challenges?.[0];
        if (currentCh?.peerLeaderboard && currentCh.peerLeaderboard.length > 0) {
          const fallback = currentCh.peerLeaderboard.map((item, idx) => ({
            rank: item.rank || idx + 1,
            id: item.id || `peer-${idx}`,
            name: item.name,
            department: item.department || 'General',
            points: item.points || 250,
            streak: item.steps ? `${item.steps} steps` : `${item.progress || 60}% done`,
            badge: 'Walking Club',
            avatar: item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            isCurrentUser: item.isCurrentUser
          }));
          setChallengeBoard(fallback);
          setChallengeError(null);
        } else {
          setChallengeError('Could not load challenge standings');
          setChallengeBoard([]);
        }
        setLoadingChallenge(false);
      });
  }, [challenges]);

  useEffect(() => {
    if (boardType === 'challenge') {
      fetchChallengeLeaderboard(selectedChallengeId);
    }
  }, [boardType, selectedChallengeId, fetchChallengeLeaderboard]);

  const departments = ['All', 'Engineering', 'Product Design', 'Product Ops', 'Marketing', 'Human Resources', 'Finance'];

  // Base list selected by active tab
  const rawList = boardType === 'challenge' ? challengeBoard : (leaderboardData.overall || []);
  let list = rawList;

  // Filter department
  if (departmentFilter !== 'All') {
    list = list.filter(item => item.department && item.department.toLowerCase().includes(departmentFilter.toLowerCase()));
  }

  // Filter search
  if (searchQuery.trim() !== '') {
    list = list.filter(item => 
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.department && item.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Top 3 Podium
  const topThree = rawList.slice(0, 3);

  // User position in current board
  const userPosition = rawList.find(item => item.isCurrentUser || (user?.fullName && item.name?.includes(user.fullName.split(' ')[0])));

  return (
    <div className="space-y-6 text-left">
      {/* Context & User Rank Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="butter" className="border-2 border-ink text-[10px]">
              Community Health
            </Pill>
            <span className="font-display text-xs font-bold text-ink">
              {boardType === 'challenge' ? 'Challenge Specific Standings' : 'Real-time company standing'}
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Community Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
            {boardType === 'challenge'
              ? 'Real-time peer rankings and progress verified for this active wellness initiative.'
              : 'Celebrating consistent daily vitality across teams. All points verified automatically.'}
          </p>
        </div>

        {/* User Rank Fast Card */}
        <div className="p-3 px-4 border-[3px] border-ink bg-white shadow-sticker-sm flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-10 h-10 border-2 border-ink object-cover"
          />
          <div>
            <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">
              {boardType === 'challenge' ? 'Challenge Position' : 'Your Current Position'}
            </span>
            <span className="text-xs font-display font-bold text-ink">
              <span className="tabular-nums">#{userPosition?.rank || user.currentRank}</span> • {user.fullName}
            </span>
            <span className="text-xs text-ink font-bold block tabular-nums">
              {userPosition?.points || user.totalPoints} Points
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* 2nd Place (Sage) */}
        {topThree[1] && (
          <StickerCard tone="sage" shadow="sticker" className="p-6 text-center space-y-3 order-2 md:order-1">
            <div className="w-10 h-10 border-2 border-ink bg-white text-ink font-display font-bold text-sm flex items-center justify-center mx-auto shadow-[2px_2px_0_#111] tabular-nums">
              2nd
            </div>
            <img
              src={topThree[1].avatar}
              alt={topThree[1].name}
              className="w-16 h-16 border-[3px] border-ink object-cover mx-auto"
            />
            <div>
              <h4 className="text-sm font-display font-bold text-ink">{topThree[1].name}</h4>
              <p className="text-xs text-ink/80">{topThree[1].department}</p>
            </div>
            <div className="p-2 border-[2px] border-ink bg-white shadow-sticker-sm">
              <span className="text-xl font-display font-bold tabular-nums text-ink">{topThree[1].points}</span>
              <span className="text-[11px] text-muted block">wellness points</span>
            </div>
            <Pill tone="white" className="border-2 border-ink text-[10px]">{topThree[1].badge}</Pill>
          </StickerCard>
        )}

        {/* 1st Place (Center Podium - Butter) */}
        {topThree[0] && (
          <StickerCard tone="butter" shadow="sticker-lg" className="p-7 text-center space-y-3.5 order-1 md:order-2 transform md:-translate-y-2">
            <div className="w-12 h-12 border-[3px] border-ink bg-white text-ink font-display font-bold text-base flex items-center justify-center mx-auto shadow-[3px_3px_0_#111]">
              👑 1st
            </div>
            <img
              src={topThree[0].avatar}
              alt={topThree[0].name}
              className="w-20 h-20 border-[3px] border-ink object-cover mx-auto shadow-[3px_3px_0_#111]"
            />
            <div>
              <h4 className="text-base font-display font-bold text-ink">{topThree[0].name}</h4>
              <p className="text-xs text-ink/85">{topThree[0].department}</p>
            </div>
            <div className="p-2.5 border-[3px] border-ink bg-white shadow-sticker-sm">
              <span className="text-2xl font-display font-bold tabular-nums text-ink">{topThree[0].points}</span>
              <span className="text-xs text-ink/80 block font-semibold">points • <span className="tabular-nums font-bold">{topThree[0].streak}</span>-day streak</span>
            </div>
            <Pill tone="rose" className="border-2 border-ink text-xs">{topThree[0].badge}</Pill>
          </StickerCard>
        )}

        {/* 3rd Place (Peri) */}
        {topThree[2] && (
          <StickerCard tone="peri" shadow="sticker" className="p-6 text-center space-y-3 order-3">
            <div className="w-10 h-10 border-2 border-ink bg-white text-ink font-display font-bold text-sm flex items-center justify-center mx-auto shadow-[2px_2px_0_#111] tabular-nums">
              3rd
            </div>
            <img
              src={topThree[2].avatar}
              alt={topThree[2].name}
              className="w-16 h-16 border-[3px] border-ink object-cover mx-auto"
            />
            <div>
              <h4 className="text-sm font-display font-bold text-ink">{topThree[2].name}</h4>
              <p className="text-xs text-ink/80">{topThree[2].department}</p>
            </div>
            <div className="p-2 border-[2px] border-ink bg-white shadow-sticker-sm">
              <span className="text-xl font-display font-bold tabular-nums text-ink">{topThree[2].points}</span>
              <span className="text-[11px] text-muted block">wellness points</span>
            </div>
            <Pill tone="white" className="border-2 border-ink text-[10px]">{topThree[2].badge}</Pill>
          </StickerCard>
        )}
      </div>

      {/* Filter and Search Controls */}
      <StickerCard tone="white" shadow="sticker" className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Board Category Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setBoardType('overall')}
              className={`px-3.5 py-1.5 border-[3px] border-ink font-display text-xs font-bold transition-all cursor-pointer ${
                boardType === 'overall' ? 'bg-ink text-butter shadow-sticker-sm' : 'bg-white text-ink shadow-sticker-sm hover:bg-paper'
              }`}
            >
              Overall Leaderboard
            </button>
            <button
              onClick={() => setBoardType('challenge')}
              className={`px-3.5 py-1.5 border-[3px] border-ink font-display text-xs font-bold transition-all cursor-pointer ${
                boardType === 'challenge' ? 'bg-ink text-butter shadow-sticker-sm' : 'bg-white text-ink shadow-sticker-sm hover:bg-paper'
              }`}
            >
              Challenge Standings
            </button>
            {boardType === 'challenge' && (
              <select
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                className="px-3 py-1.5 border-[3px] border-ink bg-butter font-display text-xs font-bold text-ink shadow-sticker-sm cursor-pointer"
              >
                {(challenges || []).map((ch) => (
                  <option key={ch.id || ch.slug} value={ch.slug || ch.id}>
                    {ch.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Department Filter and Search */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3.5 py-2 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-ink absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleague..."
                className="w-full pl-9 pr-3 py-2 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
              />
            </div>
          </div>
        </div>

        {/* Ranking Table or Loading/Empty States */}
        {loadingChallenge ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-ink mx-auto" />
            <p className="font-display text-xs font-bold text-ink">
              Loading challenge standings...
            </p>
          </div>
        ) : challengeError ? (
          <div className="py-8 px-4 border-[3px] border-ink bg-rose/20 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-ink mx-auto" />
            <p className="font-display text-xs font-bold text-ink">{challengeError}</p>
            <button
              onClick={() => fetchChallengeLeaderboard(selectedChallengeId)}
              className="px-3 py-1 border-2 border-ink bg-white font-display text-xs font-bold shadow-sticker-sm hover:bg-butter cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="py-12 text-center space-y-2 border-[2px] border-dashed border-ink/40">
            <Trophy className="w-8 h-8 text-ink/40 mx-auto" />
            <p className="font-display text-xs font-bold text-ink">
              No participants found matching the current filters.
            </p>
            <p className="text-[11px] text-muted">
              {boardType === 'challenge'
                ? 'Be the first to log activity for this challenge!'
                : 'Try adjusting your search query or department filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pt-2 border-t-[3px] border-ink">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-[3px] border-ink font-display text-ink uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">{boardType === 'challenge' ? 'Progress / Activity' : 'Streak'}</th>
                  <th className="py-3 px-4">Tier Badge</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y-[2px] divide-dashed divide-ink/30">
                {list.map((row) => {
                  const isCurrent = row.isCurrentUser || row.name.includes("Bhuvisha");
                  const streakLabel = typeof row.streak === 'number' || /^\d+$/.test(String(row.streak))
                    ? `${row.streak} days`
                    : row.streak;

                  return (
                    <tr
                      key={row.id || row.rank}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-butter font-bold text-ink border-[2px] border-ink'
                          : 'hover:bg-paper text-ink'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span className={`w-7 h-7 border-2 border-ink flex items-center justify-center font-display font-bold tabular-nums shadow-[1px_1px_0_#111] ${
                          row.rank === 1 ? 'bg-butter text-ink' :
                          row.rank === 2 ? 'bg-sage text-ink' :
                          row.rank === 3 ? 'bg-peri text-ink' :
                          isCurrent ? 'bg-ink text-butter' : 'bg-white text-ink'
                        }`}>
                          #{row.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.avatar}
                            alt={row.name}
                            className="w-8 h-8 border-2 border-ink object-cover"
                          />
                          <div>
                            <span className="font-bold text-ink block">
                              {row.name} {isCurrent && !row.name.includes("(You)") && "(You)"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-ink/80 font-medium">
                        {row.department}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-ink tabular-nums">
                          <Flame className="w-3.5 h-3.5 text-rose" />
                          {streakLabel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Pill tone={isCurrent ? "rose" : "white"} className="border-[2px] border-ink text-[10px]">
                          {row.badge}
                        </Pill>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="font-display font-bold tabular-nums text-ink text-sm">
                          {row.points}
                        </span>
                        <span className="text-[10px] text-muted block font-display">pts</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </StickerCard>
    </div>
  );
};

export default LeaderboardPage;
