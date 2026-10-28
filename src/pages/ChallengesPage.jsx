import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  PlusCircle,
  Search,
  ArrowRight
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill
} from '../components/ui';

export const ChallengesPage = () => {
  const { challenges, catalogStatus, joinChallenge, refreshBackendData } = useWellness();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Steps & Fitness', 'Mindfulness', 'Habit & Vitality', 'Micro-Breaks', 'Flexibility', 'Sleep Hygiene'];

  // Filter logic
  const filteredChallenges = challenges.filter(c => {
    // Tab filter
    if (activeTab === 'Active' && (!c.joined || c.completed)) return false;
    if (activeTab === 'Joined' && !c.joined) return false;
    if (activeTab === 'Completed' && !c.completed) return false;

    // Category filter
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      const matchCat = c.category?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Wellness Challenges
          </h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            Enroll in collaborative wellness initiatives, hit personal targets, and earn corporate points.
          </p>
        </div>

        <StickerButton
          to="/activities/log"
          variant="primary"
          className="self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Activity Now</span>
        </StickerButton>
      </div>

      {/* Tabs and Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-[3px] border-ink">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Active', 'Joined', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 border-[3px] border-ink font-display text-xs font-bold transition-transform duration-100 ease-out select-none cursor-pointer ${
                  activeTab === tab
                    ? 'bg-ink text-butter shadow-sticker-sm'
                    : 'bg-white text-ink shadow-sticker-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-paper'
                }`}
              >
                {tab}
                {tab === 'All' && ` (${challenges.length})`}
                {tab === 'Active' && ` (${challenges.filter(c => c.joined && !c.completed).length})`}
                {tab === 'Joined' && ` (${challenges.filter(c => c.joined).length})`}
                {tab === 'Completed' && ` (${challenges.filter(c => c.completed).length})`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges..."
              className="w-full pl-10 pr-4 py-2 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 border-[2px] border-ink font-display text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo text-white shadow-[2px_2px_0_#111]'
                  : 'bg-white text-ink hover:bg-butter shadow-[2px_2px_0_#111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {catalogStatus.challenges.loading ? (
        <p role="status" className="py-10 text-center font-display text-sm font-bold text-ink">
          Loading challenges...
        </p>
      ) : catalogStatus.challenges.error ? (
        <StickerCard tone="white" shadow="sticker" className="p-8 text-center space-y-3">
          <p role="alert" className="text-sm font-bold text-ink">
            Could not load challenges: {catalogStatus.challenges.error}
          </p>
          <StickerButton variant="secondary" onClick={refreshBackendData}>
            Try Again
          </StickerButton>
        </StickerCard>
      ) : filteredChallenges.length === 0 ? (
        <StickerCard tone="white" shadow="sticker" className="p-12 text-center space-y-3">
          <Trophy className="w-10 h-10 text-ink mx-auto" />
          <h4 className="text-base font-display font-bold text-ink">
            {challenges.length ? 'No challenges found' : 'No challenges are available yet'}
          </h4>
          <p className="text-xs text-muted">
            {challenges.length
              ? 'Try adjusting your search criteria or switch back to the "All" tab.'
              : 'Check back later for new wellness challenges.'}
          </p>
          {challenges.length > 0 && (
            <StickerButton
              variant="secondary"
              onClick={() => { setActiveTab('All'); setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-2"
            >
              Reset Filters
            </StickerButton>
          )}
        </StickerCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            return (
              <StickerCard
                key={challenge.id}
                tone="white"
                shadow="sticker"
                className="flex flex-col justify-between space-y-4 p-5"
              >
                <div className="space-y-3">
                  {/* Meta info header */}
                  <div className="flex items-start justify-between gap-2">
                    <Pill
                      tone={challenge.completed ? 'peri' : challenge.joined ? 'rose' : 'butter'}
                      className="border-[2px] border-ink text-[11px]"
                    >
                      {challenge.category}
                    </Pill>

                    <span className="font-display text-xs font-bold tabular-nums text-ink px-2 py-0.5 bg-sage border-[2px] border-ink shadow-[2px_2px_0_#111]">
                      +{challenge.rewardPoints} pts
                    </span>
                  </div>

                  <Link to={`/challenges/${challenge.id}`}>
                    <h3 className="text-base font-display font-bold text-ink hover:text-indigo transition-colors leading-snug">
                      {challenge.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-ink/80 leading-relaxed line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* Target & Duration specs */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2 border-[2px] border-ink bg-paper">
                      <span className="font-display text-[10px] text-ink font-bold block uppercase tracking-wider">Goal</span>
                      <span className="font-bold text-ink text-[11px] truncate block">
                        {challenge.targetGoal}
                      </span>
                    </div>
                    <div className="p-2 border-[2px] border-ink bg-paper">
                      <span className="font-display text-[10px] text-ink font-bold block uppercase tracking-wider">Duration</span>
                      <span className="font-bold text-ink text-[11px] block">
                        {challenge.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress & CTA footer */}
                <div className="space-y-3 pt-3 border-t-[2px] border-dashed border-ink/30">
                  {challenge.joined ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold font-display">
                        <span className="text-ink">
                          {challenge.completed ? 'Completed! 🎉' : `Day ${challenge.currentDay} of ${challenge.totalDays}`}
                        </span>
                        <span className="tabular-nums text-ink">
                          {challenge.progress}%
                        </span>
                      </div>
                      <div className="h-3 border-[2px] border-ink bg-white overflow-hidden">
                        <div
                          className="bg-rose h-full border-r-[2px] border-ink transition-all duration-500"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                      <Users className="w-3.5 h-3.5 text-ink" />
                      <span><strong className="text-ink tabular-nums">{challenge.participantsCount}</strong> colleagues joined</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <StickerButton
                      to={`/challenges/${challenge.id}`}
                      variant="secondary"
                      className="flex-1 py-1.5 text-xs"
                    >
                      Details
                    </StickerButton>

                    {!challenge.joined ? (
                      <StickerButton
                        variant="primary"
                        onClick={() => joinChallenge(challenge.id)}
                        className="flex-1 py-1.5 text-xs"
                      >
                        Join
                      </StickerButton>
                    ) : (
                      <StickerButton
                        to="/activities/log"
                        variant="primary"
                        className="flex-1 py-1.5 text-xs"
                      >
                        <span>Log Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </StickerButton>
                    )}
                  </div>
                </div>
              </StickerCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;
