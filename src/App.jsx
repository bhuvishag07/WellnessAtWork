import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WellnessProvider } from './context/WellnessContext';

// Layouts
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import WelcomeLandingPage from './pages/WelcomeLandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Employee Core Experience Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import ChallengesPage from './pages/ChallengesPage';
import ChallengeDetailsPage from './pages/ChallengeDetailsPage';
import LogActivityPage from './pages/LogActivityPage';
import ActivitySuccessPage from './pages/ActivitySuccessPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SessionsPage from './pages/SessionsPage';
import ResourcesPage from './pages/ResourcesPage';
import RewardsPage from './pages/RewardsPage';
import NotificationsPage from './pages/NotificationsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import CreateChallengePage from './pages/CreateChallengePage';
import AdminReportsPage from './pages/AdminReportsPage';

// User Settings Page
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <WellnessProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication & Welcome Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<WelcomeLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated Application Routes (Persistent Sidebar & Header) */}
          <Route element={<AppLayout />}>
            {/* Employee Experience */}
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/challenges/:id" element={<ChallengeDetailsPage />} />
            <Route path="/activities/log" element={<LogActivityPage />} />
            <Route path="/activities/success" element={<ActivitySuccessPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* HR Administration */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/challenges/create" element={<CreateChallengePage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />

            {/* Settings & Privacy */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WellnessProvider>
  );
}

export default App;
