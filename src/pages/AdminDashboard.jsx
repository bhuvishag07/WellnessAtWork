import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Trophy,
  Activity,
  CalendarCheck,
  TrendingUp,
  PlusCircle,
  FileBarChart,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Building
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill,
  StatCell,
  ProgressBar
} from '../components/ui';

export const AdminDashboard = () => {
  const { adminMetrics, challenges } = useWellness();

  return (
    <div className="space-y-6 text-left">
      {/* Context & Fast Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="indigo" className="border-2 border-ink text-[10px]">
              HR Administration Command
            </Pill>
            <span className="font-display text-xs font-bold text-ink">Anonymized Aggregate View</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">
            HR Command Center
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
            Real-time organizational health metrics, challenge engagement, and burnout mitigation indices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <StickerButton
            to="/admin/challenges/create"
            variant="primary"
            className="text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Challenge</span>
          </StickerButton>

          <StickerButton
            to="/admin/reports"
            variant="secondary"
            className="text-xs"
          >
            <FileBarChart className="w-3.5 h-3.5" />
            <span>View Reports</span>
          </StickerButton>
        </div>
      </div>

      {/* 6 Key Organizational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StickerCard tone="white" shadow="sticker" className="p-5">
          <StatCell
            label="Total Employees"
            value={adminMetrics.totalEmployees}
            subline="Registered company workforce"
            footer="+14 this month"
          />
        </StickerCard>

        <StickerCard tone="sage" shadow="sticker" className="p-5">
          <StatCell
            label="Active Challenges"
            value={adminMetrics.activeChallenges}
            subline="Running across departments"
            footer="84% Completion Rate"
          />
        </StickerCard>

        <StickerCard tone="peri" shadow="sticker" className="p-5">
          <StatCell
            label="Employee Participation"
            value={adminMetrics.participationRate}
            subline="Engaged in ≥1 wellness goal"
            footer="+8% QoQ Increase"
          />
        </StickerCard>

        <StickerCard tone="butter" shadow="sticker" className="p-5">
          <StatCell
            label="Total Activities Logged"
            value={adminMetrics.activitiesLogged}
            subline="Steps, stretches & meditation"
            footer="High engagement"
          />
        </StickerCard>

        <StickerCard tone="blush" shadow="sticker" className="p-5">
          <StatCell
            label="Points Distributed"
            value={adminMetrics.pointsDistributed}
            subline="Redeemable corporate budget"
            footer="Budget on track"
          />
        </StickerCard>

        <StickerCard tone="sticky" shadow="sticker" className="p-5">
          <StatCell
            label="Sessions Booked"
            value={adminMetrics.sessionsBooked}
            subline="Counseling & group yoga"
            footer="Confidential slots filled"
          />
        </StickerCard>
      </div>

      {/* Grid: Departmental Breakdown & Challenge Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Departmental Engagement */}
        <div className="lg:col-span-7 space-y-6">
          <StickerCard tone="white" shadow="sticker" className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <div>
                <h3 className="text-base font-display font-bold text-ink">
                  Departmental Engagement & Vitality
                </h3>
                <p className="text-xs text-muted">
                  Aggregated participation rate and daily average steps by team
                </p>
              </div>
              <Pill tone="sage" className="border-2 border-ink text-[11px]">
                Q3 Standings
              </Pill>
            </div>

            <div className="space-y-4">
              {adminMetrics.departmentParticipation.map((dept) => (
                <div key={dept.department} className="space-y-1.5 p-3.5 border-[2px] border-ink bg-paper shadow-sticker-sm">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-ink" />
                      <span className="font-display font-bold text-ink">{dept.department}</span>
                      <span className="text-[10px] text-muted">({dept.employees} employees)</span>
                    </div>
                    <span className="font-display font-bold text-ink">{dept.participation}% participation</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full border-2 border-ink bg-white h-3 overflow-hidden">
                    <div
                      className="bg-rose h-full border-r-2 border-ink"
                      style={{ width: `${dept.participation}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted pt-0.5">
                    <span>Avg Steps: <strong className="text-ink font-bold">{dept.avgSteps.toLocaleString()}</strong> / day</span>
                    <span>Total Team Points: <strong className="text-ink font-bold">{dept.points.toLocaleString()}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </StickerCard>
        </div>

        {/* Right Column (5 cols): Challenge Performance & Quick Launch */}
        <div className="lg:col-span-5 space-y-6">
          <StickerCard tone="white" shadow="sticker" className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
              <h3 className="text-base font-display font-bold text-ink">
                Challenge Performance
              </h3>
              <Link
                to="/admin/challenges/create"
                className="text-xs font-display font-bold text-ink underline hover:text-indigo"
              >
                + New Initiative
              </Link>
            </div>

            <div className="space-y-3">
              {challenges.slice(0, 3).map((chall) => (
                <div
                  key={chall.id}
                  className="p-3.5 border-[2px] border-ink bg-white shadow-sticker-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-display font-bold text-ink">
                      {chall.title}
                    </h5>
                    <Pill tone="butter" className="border border-ink text-[10px]">
                      {chall.participantsCount} enrolled
                    </Pill>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span>Category: {chall.category}</span>
                    <span className="font-display font-bold text-ink">+{chall.rewardPoints} pts</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <StickerButton
                to="/admin/reports"
                variant="secondary"
                className="w-full text-xs"
              >
                <span>Generate Comprehensive Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </StickerButton>
            </div>
          </StickerCard>

          {/* Privacy Isolation Notice for HR */}
          <StickerCard tone="butter" shadow="sticker" className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-display font-bold text-ink">
              <ShieldAlert className="w-4 h-4 text-ink" />
              <span>HR Privacy Protocol Active</span>
            </div>
            <p className="text-xs text-ink/85 leading-relaxed">
              All mental health counseling logs, individual session contents, and private biometric records remain cryptographically masked from the HR command layer.
            </p>
          </StickerCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
