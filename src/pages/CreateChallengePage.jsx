import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill
} from '../components/ui';

export const CreateChallengePage = () => {
  const navigate = useNavigate();
  const { createChallenge } = useWellness();

  const [title, setTitle] = useState('October Ergonomics & Movement Sprint');
  const [category, setCategory] = useState('Flexibility');
  const [description, setDescription] = useState('Encourage employees to perform 10 minutes of guided desk stretches and posture realignment daily.');
  const [duration, setDuration] = useState('21');
  const [startDate, setStartDate] = useState('2026-10-05');
  const [endDate, setEndDate] = useState('2026-10-26');
  const [targetGoal, setTargetGoal] = useState('10 min');
  const [unit, setUnit] = useState('minutes');
  const [rewardPoints, setRewardPoints] = useState('250');
  const [departmentEligibility, setDepartmentEligibility] = useState('All Departments');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !rewardPoints) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await createChallenge({
        title,
        category,
        description,
        duration,
        startDate,
        endDate,
        targetGoal,
        unit,
        rewardPoints: parseInt(rewardPoints, 10),
        departmentEligibility
      });

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/challenges');
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to create challenge.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left py-2">
      {/* Back & Context Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 border-[3px] border-ink bg-white shadow-sticker-sm text-ink hover:-translate-x-[1px] hover:-translate-y-[1px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Pill tone="indigo" className="border-2 border-ink text-[10px]">
              HR Challenge Wizard
            </Pill>
            <span className="font-display text-xs font-bold text-ink">Company-wide Launch</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Create Challenge
          </h2>
          <p className="text-xs text-muted font-medium">
            Configure and launch a new gamified wellness initiative for employees.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 border-[3px] border-ink bg-sage text-ink flex items-center gap-3 shadow-sticker-sm">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5] flex-shrink-0" />
          <div>
            <h4 className="text-sm font-display font-bold">Challenge Successfully Published!</h4>
            <p className="text-xs text-ink/80 mt-0.5">
              "{title}" is now active in the catalog. Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* Main Sticker Form Card */}
      <StickerCard tone="white" shadow="sticker" className="p-7 sm:p-9">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 border-[3px] border-ink bg-rose text-ink text-xs font-display font-bold shadow-sticker-sm">
              {error}
            </div>
          )}

          {/* Title and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Challenge Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. October Ergonomics & Movement Sprint"
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                required
              />
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo cursor-pointer"
              >
                <option value="Steps & Fitness">Steps & Fitness</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Habit & Vitality">Habit & Vitality</option>
                <option value="Micro-Breaks">Micro-Breaks</option>
                <option value="Sleep Hygiene">Sleep Hygiene</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
              Description & Employee Incentive Motivation *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Explain the purpose of this challenge..."
              className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
              required
            />
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Duration (Days)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink"
                required
              />
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink"
                required
              />
            </div>
          </div>

          {/* Target Goal, Unit, Reward Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Target Daily Goal
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. 10,000 steps"
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink"
                required
              />
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Unit of Measurement
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink cursor-pointer"
              >
                <option value="steps">Steps</option>
                <option value="minutes">Minutes</option>
                <option value="liters">Liters</option>
                <option value="breaks">Micro-Breaks</option>
                <option value="sessions">Sessions</option>
              </select>
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Reward Points Awarded *
              </label>
              <input
                type="number"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink tabular-nums"
                required
              />
            </div>
          </div>

          {/* Department Eligibility */}
          <div>
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
              Department Eligibility
            </label>
            <select
              value={departmentEligibility}
              onChange={(e) => setDepartmentEligibility(e.target.value)}
              className="w-full px-4 py-2.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink cursor-pointer"
            >
              <option value="All Departments">All Departments (Company-wide)</option>
              <option value="Engineering Only">Engineering Only</option>
              <option value="Product & Design Only">Product & Design Only</option>
              <option value="Sales & Operations Only">Sales & Operations Only</option>
            </select>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t-[2px] border-dashed border-ink/30 flex items-center justify-end gap-3">
            <StickerButton
              to="/admin"
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
                <span>Publishing Initiative...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Launch & Notify Employees</span>
                </>
              )}
            </StickerButton>
          </div>
        </form>
      </StickerCard>
    </div>
  );
};

export default CreateChallengePage;
