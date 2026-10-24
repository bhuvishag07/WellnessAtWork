const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:7500/api').replace(/\/+$/, '');

/**
 * Standard fetch wrapper with credentials and error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // include HTTP-only cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// API Client Methods
export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  firebaseLogin: (idToken) => request('/auth/firebase', { method: 'POST', body: JSON.stringify({ idToken }) }),

  // User & Dashboard
  getDashboard: () => request('/user/dashboard'),
  updateProfile: (payload) => request('/user/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  updateAvatar: (avatarUrl) => request('/user/avatar', { method: 'PUT', body: JSON.stringify({ avatarUrl }) }),
  updatePrivacy: (payload) => request('/user/privacy', { method: 'PUT', body: JSON.stringify(payload) }),
  updateNotifications: (payload) => request('/user/notifications', { method: 'PUT', body: JSON.stringify(payload) }),
  updatePassword: (payload) => request('/user/password', { method: 'PUT', body: JSON.stringify(payload) }),

  // Challenges
  getChallenges: () => request('/challenges'),
  getChallenge: (id) => request(`/challenges/${id}`),
  joinChallenge: (id, teamId = null) => request(`/challenges/${id}/join`, { method: 'POST', body: JSON.stringify({ teamId }) }),
  leaveChallenge: (id) => request(`/challenges/${id}/leave`, { method: 'POST' }),
  createChallenge: (payload) => request('/challenges', { method: 'POST', body: JSON.stringify(payload) }),
  updateChallenge: (id, payload) => request(`/challenges/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteChallenge: (id) => request(`/challenges/${id}`, { method: 'DELETE' }),

  // Activities
  logActivity: (payload) => request('/activities/log', { method: 'POST', body: JSON.stringify(payload) }),
  getActivities: (params = '') => request(`/activities${params}`),
  getActivity: (id) => request(`/activities/${id}`),

  // Points & Ledger
  getPoints: () => request('/points'),
  getPointsHistory: () => request('/points/history'),
  earnPoints: (payload) => request('/points/earn', { method: 'POST', body: JSON.stringify(payload) }),

  // Leaderboard
  getLeaderboard: (params = '') => request(`/leaderboard${params}`),
  getChallengeLeaderboard: (id) => request(`/leaderboard/challenge/${id}`),
  getTeamLeaderboard: () => request('/leaderboard/team/all'),

  // Sessions
  getSessions: () => request('/sessions'),
  getSession: (id) => request(`/sessions/${id}`),
  bookSession: (sessionId, notes = '') => request('/sessions/book', { method: 'POST', body: JSON.stringify({ sessionId, notes }) }),
  cancelSession: (sessionId) => request(`/sessions/${sessionId}`, { method: 'DELETE' }),

  // Resources
  getResources: (params = '') => request(`/resources${params}`),
  getResource: (id) => request(`/resources/${id}`),

  // Rewards
  getRewards: () => request('/rewards'),
  redeemReward: (rewardId) => request('/rewards/redeem', { method: 'POST', body: JSON.stringify({ rewardId }) }),
  getRewardHistory: () => request('/rewards/history'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Teams
  getTeams: () => request('/teams'),
  joinTeam: (teamId) => request(`/teams/${teamId}/join`, { method: 'POST' }),

  // Webinars
  getWebinars: () => request('/webinars'),
  registerWebinar: (webinarId) => request(`/webinars/${webinarId}/register`, { method: 'POST' }),

  // Anonymous Check-Ins
  submitCheckIn: (payload) => request('/check-ins', { method: 'POST', body: JSON.stringify(payload) }),
  getCheckInSummary: () => request('/check-ins/summary'),

  // Wearables
  syncWearable: (payload) => request('/wearable/sync', { method: 'POST', body: JSON.stringify(payload) }),

  // Reports
  getParticipationReport: () => request('/reports/participation'),
  getWellnessReport: () => request('/reports/wellness'),
  exportParticipationReport: async (format = 'csv') => {
    const response = await fetch(`${API_BASE_URL}/reports/participation/export?format=${format}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Export failed with status ${response.status}`);
    }
    return await response.blob();
  },
  exportWellnessReport: async (format = 'csv') => {
    const response = await fetch(`${API_BASE_URL}/reports/wellness/export?format=${format}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Export failed with status ${response.status}`);
    }
    return await response.blob();
  }
};

export default api;
