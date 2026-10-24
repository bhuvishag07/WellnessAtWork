import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Footprints,
  Brain,
  Dumbbell,
  Droplets,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill
} from '../components/ui';

export const LogActivityPage = () => {
  const navigate = useNavigate();
  const { challenges, logActivity } = useWellness();

  const [activityType, setActivityType] = useState('Walking');
  const [value, setValue] = useState('10000');
  const [duration, setDuration] = useState('45');
  const [dateTime, setDateTime] = useState('2026-10-01T09:30');
  const [selectedChallenge, setSelectedChallenge] = useState('30-day-walking');
  const [notes, setNotes] = useState('Morning brisk walk around campus and office park.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live points calculator
  const calculatePoints = () => {
    if (activityType === 'Walking' || activityType === 'Steps') {
      const steps = parseInt(value, 10) || 0;
      return Math.max(10, Math.round(steps / 100));
    }
    if (activityType === 'Meditation') {
      const mins = parseInt(duration, 10) || 0;
      return Math.round(mins * 2.5);
    }
    if (activityType === 'Exercise') {
      const mins = parseInt(duration, 10) || 0;
      return Math.round(mins * 2);
    }
    if (activityType === 'Hydration') {
      return 30;
    }
    return 50;
  };

  const estimatedPoints = calculatePoints();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value || parseInt(value, 10) <= 0) {
      setError('Please provide a valid activity value.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await logActivity({
        type: activityType,
        value,
        duration,
        challengeId: selectedChallenge
      });

      setLoading(false);
      sessionStorage.setItem('last_logged_activity', JSON.stringify({
        type: activityType,
        value,
        duration,
        points: result?.earnedPoints ?? estimatedPoints,
        challengeTitle: challenges.find(c => c.id === selectedChallenge)?.title || "30-Day Walking Challenge"
      }));

      navigate('/activities/success');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to log activity.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left py-2">
      {/* Context Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Log Activity
          </h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            Record your steps, mindful meditation, or hydration. Points are instantly credited.
          </p>
        </div>
        <Pill tone="rose">
          Live Calculation
        </Pill>
      </div>

      {/* Main Sticker Form Card */}
      <StickerCard tone="white" shadow="sticker" className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 border-[3px] border-ink bg-rose text-ink text-xs font-bold font-display shadow-sticker-sm">
              {error}
            </div>
          )}

          {/* Activity Type Selector */}
          <div>
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-2">
              Select Activity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Walking', icon: Footprints, defaultVal: '10000', unit: 'steps', tone: 'blush' },
                { label: 'Meditation', icon: Brain, defaultVal: '15', unit: 'mins', tone: 'peri' },
                { label: 'Exercise', icon: Dumbbell, defaultVal: '30', unit: 'mins', tone: 'butter' },
                { label: 'Hydration', icon: Droplets, defaultVal: '2.5', unit: 'liters', tone: 'sage' }
              ].map((item) => {
                const isSelected = activityType === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setActivityType(item.label);
                      setValue(item.defaultVal);
                    }}
                    className={`p-3.5 border-[3px] border-ink flex flex-col items-center justify-center gap-2 text-center transition-transform duration-100 ease-out cursor-pointer ${
                      isSelected
                        ? 'bg-ink text-butter shadow-[4px_4px_0_#111]'
                        : 'bg-white text-ink shadow-sticker-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-paper'
                    }`}
                  >
                    <item.icon className="w-5 h-5 stroke-[2]" />
                    <span className="font-display text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Value and Duration Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                {activityType === 'Walking' || activityType === 'Steps' ? 'Step Count' : activityType === 'Hydration' ? 'Water Intake (Liters)' : 'Intensity Units'}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo"
                required
              />
              <span className="text-[11px] text-muted mt-1 block">
                {activityType === 'Walking' ? 'Target: 10,000 steps daily' : 'Enter recorded amount'}
              </span>
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Duration (Minutes)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-ink absolute left-3.5 top-3" />
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full pl-10 pr-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo"
                  required
                />
              </div>
              <span className="text-[11px] text-muted mt-1 block">
                Active time spent in motion
              </span>
            </div>
          </div>

          {/* Date/Time and Associated Challenge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Date & Time
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-ink absolute left-3.5 top-3" />
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                />
              </div>
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Link to Challenge
              </label>
              <select
                value={selectedChallenge}
                onChange={(e) => setSelectedChallenge(e.target.value)}
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo cursor-pointer"
              >
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Note */}
          <div>
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
              Personal Reflection Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="How did you feel? Energy levels, mood..."
              className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
            />
          </div>

          {/* Live Point-Calculation Preview Box */}
          <div className="p-4 border-[3px] border-ink bg-butter shadow-sticker-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-ink bg-white flex items-center justify-center text-ink flex-shrink-0 shadow-[2px_2px_0_#111]">
                <Sparkles className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="font-display text-[10px] uppercase font-bold tracking-wider text-ink block">
                  Live Points Preview
                </span>
                <p className="text-sm font-display font-bold text-ink">
                  <span className="tabular-nums">{value}</span> {activityType === 'Walking' ? 'steps' : 'units'} → <span className="text-ink font-bold text-base tabular-nums">+{estimatedPoints} points</span>
                </p>
              </div>
            </div>

            <Pill tone="white" className="border-2 border-ink">
              Instant Credit
            </Pill>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <StickerButton
              to="/dashboard"
              variant="secondary"
              className="text-xs"
            >
              Cancel
            </StickerButton>

            <StickerButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="text-xs sm:text-sm"
            >
              {loading ? (
                <span>Submitting Log...</span>
              ) : (
                <>
                  <span>Save Activity & Earn +{estimatedPoints} Points</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </StickerButton>
          </div>
        </form>
      </StickerCard>
    </div>
  );
};

export default LogActivityPage;
