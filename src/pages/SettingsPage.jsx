import React, { useState } from 'react';
import {
  User,
  Smartphone,
  Bell,
  Lock,
  CheckCircle2,
  Watch,
  Save,
  ShieldCheck
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill
} from '../components/ui';

export const SettingsPage = () => {
  const {
    user,
    setUser,
    universalAvatars,
    selectAvatar,
    deviceSync,
    setDeviceSync,
    privacySettings,
    setPrivacySettings,
    notificationSettings,
    setNotificationSettings,
    dispatchToast
  } = useWellness();

  // Local state for profile form
  const [fullName, setFullName] = useState(user.fullName);
  const [department, setDepartment] = useState(user.department);
  const [role, setRole] = useState(user.role);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const { api } = await import('../services/api');
      await api.updateProfile({ fullName, department });
      setUser(prev => ({
        ...prev,
        fullName,
        firstName: fullName.split(' ')[0],
        department,
        role
      }));

      dispatchToast({
        title: "Profile Updated ✨",
        message: "Personal details and departmental settings saved to database.",
        type: "success"
      });
    } catch (err) {
      dispatchToast({
        title: "Update Error",
        message: err.message || "Failed to update profile",
        type: "info"
      });
    }
  };

  const handleToggleDevice = (deviceKey) => {
    const isNowActive = !deviceSync[deviceKey];
    setDeviceSync(prev => ({
      ...prev,
      [deviceKey]: isNowActive,
      lastSynced: isNowActive ? "Just now" : prev.lastSynced
    }));

    dispatchToast({
      title: `${deviceKey === 'appleHealth' ? 'Apple Health' : deviceKey === 'fitbit' ? 'Fitbit OS' : 'Google Fit'} ${isNowActive ? 'Connected' : 'Disconnected'}`,
      message: isNowActive ? "Biometric background sync enabled." : "Device sync disabled.",
      type: "info"
    });
  };

  const handleTogglePrivacy = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    dispatchToast({
      title: "Privacy Preferences Saved 🔒",
      message: "Your visibility and HR firewall settings were updated.",
      type: "info"
    });
  };

  const handleToggleNotification = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    dispatchToast({
      title: "Notification Settings Saved 🔔",
      message: "Preferences synchronized.",
      type: "info"
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      dispatchToast({
        title: "Error",
        message: "Please fill in all password fields.",
        type: "info"
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      dispatchToast({
        title: "Password Mismatch",
        message: "New passwords do not match.",
        type: "info"
      });
      return;
    }

    try {
      const { api } = await import('../services/api');
      await api.updatePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password successfully updated and encrypted in database.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      dispatchToast({
        title: "Security Credentials Updated 🛡️",
        message: "Your corporate password was rotated successfully.",
        type: "success"
      });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      dispatchToast({
        title: "Password Error",
        message: err.message || "Could not update password",
        type: "info"
      });
    }
  };

  return (
    <div className="space-y-6 text-left py-2">
      {/* Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Profile & Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
            Manage your identity, universal profile avatar, wearable hardware sync, and confidentiality fences.
          </p>
        </div>
        <Pill tone="butter">
          Settings Active
        </Pill>
      </div>

      {/* 1. Profile & Avatar Section */}
      <StickerCard tone="white" shadow="sticker" className="p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-ink" />
            <h3 className="text-base font-display font-bold text-ink">
              Personal & Academic Profile
            </h3>
          </div>
          <Pill tone="rose" className="border-2 border-ink text-xs">
            {user?.tier || 'Silver Pioneer'}
          </Pill>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-2">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-16 h-16 border-[3px] border-ink object-cover shadow-[2px_2px_0_#111]"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-display font-bold text-ink">
                {user.fullName}
              </h4>
              <p className="text-xs text-muted font-medium">
                {user.email} • {user.department}
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="font-display text-[10px] font-bold text-ink bg-paper px-2.5 py-0.5 border border-ink">
                  Case Study 72 • ITM Skills University
                </span>
                <span className="font-display text-[10px] font-bold text-ink bg-sage px-2.5 py-0.5 border border-ink">
                  {user.totalPoints} pts • Rank #{user.currentRank}
                </span>
              </div>
            </div>
          </div>

          {/* Universal Avatar Selection Library */}
          <div className="pt-3 border-t-[2px] border-dashed border-ink/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink">
                  Select Profile Avatar
                </label>
                <p className="text-[11px] text-muted">
                  Choose from {universalAvatars?.length || 10} professional, minimalist, or abstract SaaS avatar styles
                </p>
              </div>
              <Pill tone="butter" className="border border-ink text-[10px]">
                Universal Library
              </Pill>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
              {universalAvatars?.map((av) => {
                const isSelected = user.avatarUrl === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => selectAvatar(av.url)}
                    className={`relative p-1 border-[2px] border-ink transition-transform duration-100 ease-out cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-butter shadow-[3px_3px_0_#111] -translate-x-[1px] -translate-y-[1px]'
                        : 'bg-white hover:bg-paper hover:shadow-[2px_2px_0_#111]'
                    }`}
                    title={`${av.name} (${av.category})`}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      className="w-9 h-9 object-cover"
                    />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-ink text-butter flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                required
              />
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Corporate Email Address (SSO)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3.5 py-2 border-[3px] border-ink bg-paper text-xs font-bold text-muted cursor-not-allowed shadow-sticker-sm"
              />
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo cursor-pointer"
              >
                <option value="Engineering (Frontend)">Engineering (Frontend)</option>
                <option value="Engineering (Backend)">Engineering (Backend)</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing & Growth">Marketing & Growth</option>
                <option value="Finance & Operations">Finance & Operations</option>
              </select>
            </div>

            <div>
              <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Organizational Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <StickerButton
              type="submit"
              variant="primary"
              className="text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </StickerButton>
          </div>
        </form>
      </StickerCard>

      {/* Middle Row: Privacy Controls & Wearable Sync (2-column balanced grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* 2. Wellness Privacy Controls */}
        <StickerCard tone="white" shadow="sticker" className="p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ink" />
                <h3 className="text-base font-display font-bold text-ink">
                  Wellness Privacy & Confidentiality
                </h3>
              </div>
              <Pill tone="sage" className="border-2 border-ink text-xs">
                HR Isolated
              </Pill>
            </div>

            <p className="text-xs text-ink/80 leading-relaxed">
              WellnessAtWork guarantees that your private mental health consultation notes, stress logs, and reflection diaries can <strong>never be accessed or viewed by HR, managers, or company leadership</strong>.
            </p>

            <div className="space-y-2.5 pt-1">
              {/* Strict Mental Health Fence */}
              <div className="p-3 border-[3px] border-ink bg-butter flex items-center justify-between gap-3 shadow-sticker-sm">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-display font-bold text-ink flex items-center gap-1.5">
                    <span>Psychological Care Isolation Fence</span>
                    <span className="text-[9px] bg-white text-ink font-bold px-1.5 py-0.2 border border-ink">LOCKED</span>
                  </h4>
                  <p className="text-[10px] text-ink/80">
                    Cryptographic isolation of 1-on-1 counseling appointment records from employer management dashboards.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.counselingConfidentialityFence}
                  disabled
                  className="w-4 h-4 border-2 border-ink text-ink opacity-70 cursor-not-allowed shrink-0"
                />
              </div>

              {/* Leaderboard Visibility Toggle */}
              <div className="p-3 border-[3px] border-ink bg-white flex items-center justify-between gap-3 shadow-sticker-sm">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-display font-bold text-ink">
                    Show on Community Leaderboard
                  </h4>
                  <p className="text-[10px] text-muted">
                    Display your points and step rank to company colleagues on the public podium.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePrivacy('leaderboardVisibility')}
                  className={`w-11 h-6 border-2 border-ink transition-colors relative cursor-pointer flex-shrink-0 ${
                    privacySettings.leaderboardVisibility ? 'bg-indigo' : 'bg-paper'
                  }`}
                >
                  <div
                    className={`w-4 h-4 border border-ink bg-white transition-transform transform shadow-sm ${
                      privacySettings.leaderboardVisibility ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Share Step Counts Toggle */}
              <div className="p-3 border-[3px] border-ink bg-white flex items-center justify-between gap-3 shadow-sticker-sm">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-display font-bold text-ink">
                    Share Milestones in Department Feed
                  </h4>
                  <p className="text-[10px] text-muted">
                    Allow teammates in Engineering to see your daily 10k step completions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePrivacy('shareStepCounts')}
                  className={`w-11 h-6 border-2 border-ink transition-colors relative cursor-pointer flex-shrink-0 ${
                    privacySettings.shareStepCounts ? 'bg-indigo' : 'bg-paper'
                  }`}
                >
                  <div
                    className={`w-4 h-4 border border-ink bg-white transition-transform transform shadow-sm ${
                      privacySettings.shareStepCounts ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </StickerCard>

        {/* 3. Wearable & Device Sync */}
        <StickerCard tone="white" shadow="sticker" className="p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-ink" />
                <h3 className="text-base font-display font-bold text-ink">
                  Wearable Device Sync
                </h3>
              </div>
              <span className="font-display text-xs font-bold text-muted">
                {deviceSync.lastSynced}
              </span>
            </div>

            <p className="text-xs text-ink/80 leading-relaxed">
              Connect corporate wearable hardware to automatically ingest steps, active movement minutes, and biometric recovery scores.
            </p>

            <div className="space-y-3 pt-1">
              {/* Apple Health */}
              <div className="p-3.5 border-[3px] border-ink bg-paper flex items-center justify-between shadow-sticker-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border-2 border-ink bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🍏
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-bold text-ink">
                      Apple Health (HealthKit)
                    </h4>
                    <p className="text-[10px] text-muted">
                      iPhone & Apple Watch steps
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleDevice('appleHealth')}
                  className={`px-3 py-1.5 border-2 border-ink font-display text-xs font-bold transition-all cursor-pointer ${
                    deviceSync.appleHealth
                      ? 'bg-sage text-ink shadow-[2px_2px_0_#111]'
                      : 'bg-white text-muted hover:bg-paper'
                  }`}
                >
                  {deviceSync.appleHealth ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Fitbit */}
              <div className="p-3.5 border-[3px] border-ink bg-paper flex items-center justify-between shadow-sticker-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border-2 border-ink bg-peri text-ink flex items-center justify-center font-bold text-sm shrink-0">
                    <Watch className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-bold text-ink">
                      Fitbit OS
                    </h4>
                    <p className="text-[10px] text-muted">
                      Fitbit Sense & Charge
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleDevice('fitbit')}
                  className={`px-3 py-1.5 border-2 border-ink font-display text-xs font-bold transition-all cursor-pointer ${
                    deviceSync.fitbit
                      ? 'bg-sage text-ink shadow-[2px_2px_0_#111]'
                      : 'bg-white text-muted hover:bg-paper'
                  }`}
                >
                  {deviceSync.fitbit ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </StickerCard>
      </div>

      {/* Bottom Row: Notifications & Security (2-column balanced grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* 4. Notification Preferences */}
        <StickerCard tone="white" shadow="sticker" className="p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-ink" />
                <h3 className="text-base font-display font-bold text-ink">
                  Notification Preferences
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'challengeAlerts', label: 'Challenge Milestones & Alerts', desc: 'Notify when team reaches 25%, 50%, or 100% of a goal.' },
                { key: 'sessionReminders', label: 'Wellness Session Reminders', desc: 'Alerts sent 2 hours before counseling or guided stretches.' },
                { key: 'rewardUpdates', label: 'Reward Store Announcements', desc: 'Alerts when points qualify for merchandise redemption.' },
                { key: 'emailWeeklyDigest', label: 'Weekly Email Digest', desc: 'Weekly summary of steps and upcoming health sessions.' },
              ].map((item) => (
                <div key={item.key} className="p-2.5 sm:p-3 border-[2px] border-ink bg-paper flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-display font-bold text-ink">{item.label}</h4>
                    <p className="text-[10px] text-muted">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotification(item.key)}
                    className={`w-11 h-6 border-2 border-ink transition-colors relative cursor-pointer flex-shrink-0 ${
                      notificationSettings[item.key] ? 'bg-indigo' : 'bg-white'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 border border-ink bg-white transition-transform transform shadow-sm ${
                        notificationSettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </StickerCard>

        {/* 5. Security & Password Management */}
        <StickerCard tone="white" shadow="sticker" className="p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-ink" />
                <h3 className="text-base font-display font-bold text-ink">
                  Security & Password Management
                </h3>
              </div>
            </div>

            {passwordSuccess && (
              <div className="p-2.5 border-[2px] border-ink bg-sage text-xs font-display font-bold text-ink flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3.5">
              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink"
                />
              </div>

              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink"
                />
              </div>

              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink"
                />
              </div>

              <div className="flex justify-end pt-1">
                <StickerButton
                  type="submit"
                  variant="secondary"
                  className="text-xs"
                >
                  Update Security Password
                </StickerButton>
              </div>
            </form>
          </div>
        </StickerCard>
      </div>
    </div>
  );
};

export default SettingsPage;
