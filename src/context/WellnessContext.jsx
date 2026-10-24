import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  universalAvatars,
  initialChallenges,
  initialActivities,
  leaderboardData as defaultLeaderboard,
  wellnessSessions as defaultSessions,
  wellnessResources as defaultResources,
  rewardsStore as defaultRewards,
  initialNotifications,
  adminMetrics as defaultAdminMetrics
} from '../data/demoData';
import api from '../services/api';
import { initSocketClient, disconnectSocket } from '../services/socket';

const WellnessContext = createContext(null);

export const WellnessProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [backendError, setBackendError] = useState('');

  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('waw_challenges');
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('waw_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('waw_sessions');
    return saved ? JSON.parse(saved) : defaultSessions;
  });

  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem('waw_rewards');
    return saved ? JSON.parse(saved) : defaultRewards;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('waw_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [leaderboardData, setLeaderboardData] = useState(defaultLeaderboard);
  const [wellnessResources, setWellnessResources] = useState(defaultResources);
  const [adminMetrics, setAdminMetrics] = useState(defaultAdminMetrics);

  const [deviceSync, setDeviceSync] = useState({
    appleHealth: true,
    fitbit: false,
    googleFit: false,
    lastSynced: "Today, 10:15 AM"
  });

  const [privacySettings, setPrivacySettings] = useState(() => {
    return user?.privacySettings || {
      leaderboardVisibility: true,
      shareStepCounts: true,
      counselingConfidentialityFence: true,
      activityFeedVisibility: "colleagues"
    };
  });

  const [notificationSettings, setNotificationSettings] = useState(() => {
    return user?.notificationPreferences || {
      challengeAlerts: true,
      sessionReminders: true,
      rewardUpdates: true,
      emailWeeklyDigest: true
    };
  });

  useEffect(() => {
    if (!user) return;
    setPrivacySettings(user.privacySettings || {});
    setNotificationSettings(user.notificationPreferences || {});
  }, [user?.id]);

  // Real-time toast state (Screen 14)
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
    actionLink: null
  });

  const dispatchToast = useCallback(({ title, message, type = "info", actionLink = null }) => {
    setToast({
      show: true,
      title,
      message,
      type,
      actionLink
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 6000);
  }, []);

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('waw_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('waw_user');
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    api.getMe()
      .then((res) => {
        if (active) setUser(res.data?.user || null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('waw_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('waw_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('waw_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('waw_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Load live data from MongoDB Backend
  const refreshBackendData = useCallback(async () => {
    if (!user) return;
    setBackendError('');
    try {
      // 1. Fetch Dashboard / Profile
      const dashRes = await api.getDashboard();
      if (dashRes && dashRes.data && dashRes.data.user) {
        setUser(prev => ({ ...prev, ...dashRes.data.user }));
        if (dashRes.data.recentActivities) {
          setActivities(dashRes.data.recentActivities);
        }
      }

      // 2. Fetch Challenges
      const chRes = await api.getChallenges();
      if (Array.isArray(chRes.data?.challenges)) {
        setChallenges(chRes.data.challenges);
      }

      // 3. Fetch Sessions
      const sessRes = await api.getSessions();
      if (Array.isArray(sessRes.data?.sessions)) {
        setSessions(sessRes.data.sessions);
      }

      // 4. Fetch Rewards
      const rewRes = await api.getRewards();
      if (Array.isArray(rewRes.data?.rewards)) {
        setRewards(rewRes.data.rewards);
      }

      // 5. Fetch Notifications
      const notifRes = await api.getNotifications();
      if (notifRes && notifRes.data && notifRes.data.notifications) {
        setNotifications(notifRes.data.notifications);
      }

      // 6. Fetch Leaderboard
      const leadRes = await api.getLeaderboard();
      if (leadRes && leadRes.data && leadRes.data.overall) {
        setLeaderboardData({ overall: leadRes.data.overall });
      }

      // 7. Fetch Resources
      const resRes = await api.getResources();
      if (Array.isArray(resRes.data?.resources)) {
        setWellnessResources(resRes.data.resources);
      }

      // 8. Fetch Reports / Admin metrics if admin
      if (user.role === 'admin' || user.role === 'Admin') {
        const partRes = await api.getParticipationReport();
        if (partRes && partRes.data && partRes.data.report) {
          setAdminMetrics(prev => ({ ...prev, ...partRes.data.report }));
        }
      }
    } catch (err) {
      setBackendError(err.message || 'Could not load current account data from the backend.');
    }
  }, [user?.role]);

  // Initial load on startup
  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  // Connect Real-Time Socket.io client
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return undefined;
    }
    const socket = initSocketClient();

    if (user && user.id) {
      socket.emit('join:user', user.id);
    }

    if (user.role === 'admin' || user.role === 'Admin') {
      socket.emit('join:admin');
    }

    // Listen to real-time events
    const handlePushNotification = (notif) => {
      dispatchToast({
        title: notif.title || 'Notification',
        message: notif.message,
        type: notif.type || 'info',
        actionLink: notif.actionLink || null
      });
      setNotifications(prev => [notif, ...prev]);
    };

    const handleActivityLogged = (event) => {
      // If event came from another colleague
      if (event.user && event.user.id !== user.id) {
        dispatchToast({
          title: "Colleague Activity! 🏃",
          message: `${event.user.name} logged activity: +${event.points} points!`,
          type: "points"
        });
      }
      refreshBackendData();
    };

    const handleLeaderboardUpdate = () => {
      api.getLeaderboard().then(res => {
        if (res.data?.overall) setLeaderboardData({ overall: res.data.overall });
      }).catch((error) => {
        setBackendError(error.message || 'Could not refresh leaderboard data.');
      });
    };

    socket.on('notification:push', handlePushNotification);
    socket.on('activity:logged', handleActivityLogged);
    socket.on('leaderboard:updated', handleLeaderboardUpdate);
    socket.on('challenge:joined', refreshBackendData);
    socket.on('challenge:completed', refreshBackendData);
    socket.on('session:updated', refreshBackendData);

    return () => {
      socket.off('notification:push', handlePushNotification);
      socket.off('activity:logged', handleActivityLogged);
      socket.off('leaderboard:updated', handleLeaderboardUpdate);
      socket.off('challenge:joined', refreshBackendData);
      socket.off('challenge:completed', refreshBackendData);
      socket.off('session:updated', refreshBackendData);
    };
  }, [user?.id, user?.role, dispatchToast, refreshBackendData]);

  // Login handler
  const login = async (email, password, rememberMe = true) => {
    const res = await api.login({ email, password, rememberMe });
    if (res.data?.user) {
      setUser(res.data.user);
    }
    await refreshBackendData();
    return res.data;
  };

  // Register handler
  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.data?.user) {
      setUser(res.data.user);
    }
    await refreshBackendData();
    return res.data;
  };

  // Logout handler
  const logout = async () => {
    let logoutError = null;
    try {
      await api.logout();
    } catch (error) {
      logoutError = error;
    }
    disconnectSocket();
    setUser(null);
    dispatchToast(logoutError ? {
      title: 'Signed Out Locally',
      message: logoutError.message || 'The server could not confirm session revocation.',
      type: 'info'
    } : {
      title: 'Signed Out',
      message: 'You have signed out of your account.',
      type: 'info'
    });
  };

  // Join challenge
  const joinChallenge = async (challengeId) => {
    try {
      await api.joinChallenge(challengeId);
      await refreshBackendData();

      dispatchToast({
        title: "Challenge Joined! 🎯",
        message: "You have joined the wellness challenge. Start logging to earn points!",
        type: "challenge",
        actionLink: `/challenges/${challengeId}`
      });
    } catch (err) {
      dispatchToast({
        title: 'Could Not Join Challenge',
        message: err.message || 'The server could not enroll you.',
        type: 'error'
      });
    }
  };

  // Admin create challenge
  const createChallenge = async (newChallenge) => {
    try {
      const res = await api.createChallenge(newChallenge);
      await refreshBackendData();
      dispatchToast({
        title: "Challenge Created 🚀",
        message: `"${newChallenge.title}" is now live for all employees!`,
        type: "success",
        actionLink: "/challenges"
      });
      return res.data?.challenge;
    } catch (err) {
      dispatchToast({
        title: 'Could Not Create Challenge',
        message: err.message || 'The server could not create this challenge.',
        type: 'error'
      });
      return null;
    }
  };

  // Log activity
  const logActivity = async ({ type, value, duration, challengeId }) => {
    try {
      const res = await api.logActivity({
        activityType: type,
        value,
        durationMinutes: duration,
        challengeId
      });

      await refreshBackendData();

      const earnedPoints = res.data?.earnedPoints ?? 0;
      dispatchToast({
        title: "Challenge Update",
        message: res.data?.duplicate
          ? 'This activity was already processed; no additional points were awarded.'
          : `${user.firstName || 'You'} completed today’s ${type.toLowerCase()} goal! +${earnedPoints} points`,
        type: "points",
        actionLink: "/activities/success"
      });

      return { earnedPoints, newActivity: res.data?.activity };
    } catch (err) {
      dispatchToast({
        title: 'Activity Was Not Logged',
        message: err.message || 'The backend could not save this activity.',
        type: 'error'
      });
      throw err;
    }
  };

  // Book session
  const bookSession = async (sessionId) => {
    try {
      await api.bookSession(sessionId);
      await refreshBackendData();
      const sessionObj = sessions.find(s => s.id === sessionId);
      dispatchToast({
        title: "Session Confirmed! 📅",
        message: `Your booking for "${sessionObj?.title || 'Wellness Session'}" is confirmed.`,
        type: "session",
        actionLink: "/sessions"
      });
    } catch (err) {
      dispatchToast({
        title: 'Session Booking Failed',
        message: err.message || 'The backend could not reserve this session.',
        type: 'error'
      });
    }
  };

  // Cancel booking
  const cancelSessionBooking = async (sessionId) => {
    try {
      await api.cancelSession(sessionId);
      await refreshBackendData();
      dispatchToast({
        title: "Booking Cancelled",
        message: "Your session slot has been released.",
        type: "info"
      });
    } catch (error) {
      dispatchToast({
        title: 'Could Not Cancel Booking',
        message: error.message || 'The backend could not release this session slot.',
        type: 'error'
      });
    }
  };

  // Redeem Reward
  const redeemReward = async (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, message: "Reward not found" };

    if (user.totalPoints < reward.pointsCost) {
      dispatchToast({
        title: "Insufficient Points",
        message: `You need ${reward.pointsCost - user.totalPoints} more points to redeem this reward.`,
        type: "info"
      });
      return { success: false, message: "Insufficient points" };
    }

    try {
      const res = await api.redeemReward(rewardId);
      await refreshBackendData();

      const newPoints = res.data?.remainingPoints || (user.totalPoints - reward.pointsCost);

      dispatchToast({
        title: "Reward Redeemed! 🎁",
        message: `Successfully claimed "${reward.title}". Code: ${res.data?.voucherCode || 'WAW-CLAIMED'}`,
        type: "success",
        actionLink: "/rewards"
      });

      return { success: true, reward, newPoints };
    } catch (err) {
      dispatchToast({
        title: "Redemption Error",
        message: err.message || "Could not claim reward.",
        type: "info"
      });
      return { success: false, message: err.message };
    }
  };

  // Notifications helper
  const markAsRead = async (notifId) => {
    try {
      await api.markAsRead(notifId);
      setNotifications(prev =>
        prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      dispatchToast({ title: 'Could Not Update Notification', message: error.message, type: 'error' });
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      dispatchToast({
        title: "Inbox Cleared",
        message: "All notifications marked as read.",
        type: "info"
      });
    } catch (error) {
      dispatchToast({ title: 'Could Not Update Notifications', message: error.message, type: 'error' });
    }
  };

  // Avatar update
  const selectAvatar = async (avatarUrl) => {
    try {
      await api.updateAvatar(avatarUrl);
      setUser(prev => ({ ...prev, avatarUrl, avatar: avatarUrl }));
      dispatchToast({
        title: "Avatar Updated",
        message: "Your new profile avatar is now active across the platform.",
        type: "success"
      });
    } catch (error) {
      dispatchToast({ title: 'Could Not Update Avatar', message: error.message, type: 'error' });
    }
  };

  // Privacy update
  const handleSetPrivacySettings = async (settingsOrUpdater) => {
    const updated = typeof settingsOrUpdater === 'function' ? settingsOrUpdater(privacySettings) : settingsOrUpdater;
    try {
      await api.updatePrivacy(updated);
      setPrivacySettings(updated);
    } catch (error) {
      dispatchToast({ title: 'Could Not Save Privacy Settings', message: error.message, type: 'error' });
    }
  };

  // Notification settings update
  const handleSetNotificationSettings = async (settingsOrUpdater) => {
    const updated = typeof settingsOrUpdater === 'function' ? settingsOrUpdater(notificationSettings) : settingsOrUpdater;
    try {
      await api.updateNotifications(updated);
      setNotificationSettings(updated);
    } catch (error) {
      dispatchToast({ title: 'Could Not Save Notification Settings', message: error.message, type: 'error' });
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <WellnessContext.Provider
      value={{
        user,
        authLoading,
        backendError,
        setUser,
        login,
        register,
        logout,
        universalAvatars,
        selectAvatar,
        challenges,
        joinChallenge,
        createChallenge,
        activities,
        logActivity,
        sessions,
        bookSession,
        cancelSessionBooking,
        rewards,
        redeemReward,
        notifications,
        markAsRead,
        markAllAsRead,
        unreadNotificationsCount,
        toast,
        dispatchToast,
        closeToast,
        deviceSync,
        setDeviceSync,
        privacySettings,
        setPrivacySettings: handleSetPrivacySettings,
        notificationSettings,
        setNotificationSettings: handleSetNotificationSettings,
        leaderboardData,
        wellnessResources,
        adminMetrics,
        refreshBackendData
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error("useWellness must be used within a WellnessProvider");
  }
  return context;
};

export default WellnessContext;
