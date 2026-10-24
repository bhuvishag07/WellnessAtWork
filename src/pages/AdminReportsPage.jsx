import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Building,
  FileSpreadsheet
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill,
  StatCell
} from '../components/ui';
import { api } from '../services/api';

export const AdminReportsPage = () => {
  const { adminMetrics, dispatchToast } = useWellness();

  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [department, setDepartment] = useState('All Departments');
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Filter department list
  const departments = (adminMetrics.departmentParticipation || []).filter((d) => {
    if (department === 'All Departments') return true;
    return d.department === department;
  });

  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      const blob = await api.exportParticipationReport('csv');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wellness_participation_report_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dispatchToast({
        title: "CSV Export Complete 📊",
        message: "Participation report downloaded successfully.",
        type: "success"
      });
    } catch {
      // Graceful fallback: synthesize local CSV from active department participation data
      try {
        const headers = ['Department', 'Employees', 'ParticipationRate', 'AverageDailySteps', 'PointsEarned'];
        const rows = (adminMetrics.departmentParticipation || []).map(d => [
          `"${d.department}"`,
          d.employees,
          `"${d.participation}%"`,
          d.avgSteps,
          d.points
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const fallbackBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(fallbackBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wellness_participation_summary_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        dispatchToast({
          title: "CSV Report Downloaded 📊",
          message: "Saved local departmental participation summary.",
          type: "info"
        });
      } catch (fallbackErr) {
        dispatchToast({
          title: "Export Error",
          message: fallbackErr.message || "Could not generate CSV file",
          type: "info"
        });
      }
    } finally {
      setExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      dispatchToast({
        title: "PDF Report Compiling 📑",
        message: "Generating server-side PDF with PDFKit...",
        type: "info"
      });

      const blob = await api.exportParticipationReport('pdf');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `executive_wellness_audit_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dispatchToast({
        title: "PDF Report Downloaded 📑",
        message: "Executive wellness PDF report saved.",
        type: "success"
      });
    } catch (err) {
      dispatchToast({
        title: "PDF Generation Fallback",
        message: err.message || "Opening browser print view.",
        type: "info"
      });
      window.print();
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Context & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="indigo" className="border-2 border-ink text-[10px]">
              Executive Analytics & Auditing
            </Pill>
            <span className="font-display text-xs font-bold text-ink">Demo data view</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Wellness Reports
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
            Auditable corporate health engagement metrics, departmental aggregates, and exportable executive summaries.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <StickerButton
            variant="secondary"
            onClick={handleExportCSV}
            disabled={exportingCSV}
            className="text-xs"
          >
            <FileSpreadsheet className={`w-3.5 h-3.5 text-ink ${exportingCSV ? 'animate-spin' : ''}`} />
            <span>{exportingCSV ? 'Exporting...' : 'Export CSV'}</span>
          </StickerButton>

          <StickerButton
            variant="primary"
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="text-xs"
          >
            <Download className={`w-3.5 h-3.5 text-ink ${exportingPDF ? 'animate-bounce' : ''}`} />
            <span>{exportingPDF ? 'Generating PDF...' : 'Export PDF'}</span>
          </StickerButton>
        </div>
      </div>

      {/* Filter Toolbar */}
      <StickerCard tone="white" shadow="sticker" className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ink" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Q3 2026">Q3 2026 (Current Quarter)</option>
              <option value="Year-to-Date">Year-to-Date (2026)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-ink" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-1.5 border-[3px] border-ink bg-white shadow-sticker-sm text-xs font-bold text-ink cursor-pointer"
            >
              <option value="All Departments">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Marketing & Growth">Marketing & Growth</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales & Operations">Sales & Operations</option>
            </select>
          </div>
        </div>

        <span className="font-display text-xs font-bold text-ink">
          Showing: <strong>{dateRange}</strong> • <strong>{department}</strong>
        </span>
      </StickerCard>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StickerCard tone="white" shadow="sticker" className="p-4">
          <StatCell
            label="Participation Rate"
            value={adminMetrics.participationRate}
            subline="+8% vs last month"
          />
        </StickerCard>

        <StickerCard tone="sage" shadow="sticker" className="p-4">
          <StatCell
            label="Total Steps Logged"
            value="2.5M"
            subline="Across all employees"
          />
        </StickerCard>

        <StickerCard tone="peri" shadow="sticker" className="p-4">
          <StatCell
            label="Mindfulness Minutes"
            value="14.1k"
            subline="96 sessions held"
          />
        </StickerCard>

        <StickerCard tone="butter" shadow="sticker" className="p-4">
          <StatCell
            label="Burnout Index"
            value="-34%"
            subline="Clinical survey score"
          />
        </StickerCard>
      </div>

      {/* Visual Chart: Weekly Activity Trend Curve */}
      <StickerCard tone="white" shadow="sticker" className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
          <div>
            <h3 className="text-base font-display font-bold text-ink">
              Weekly Step & Movement Aggregation Curve
            </h3>
            <p className="text-xs text-muted">
              Daily aggregate physical movement (steps) recorded across registered employees
            </p>
          </div>
          <Pill tone="rose" className="border-2 border-ink text-xs">
            Company Aggregate
          </Pill>
        </div>

        {/* Flat Sticker Brutalist Bar Chart visualization */}
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end pb-2 border-b-[3px] border-ink">
            {adminMetrics.weeklyActivityTrend.map((day) => {
              const maxSteps = 450000;
              const heightPercent = Math.round((day.steps / maxSteps) * 100);

              return (
                <div key={day.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="font-display text-[10px] font-bold text-ink opacity-0 group-hover:opacity-100 transition-opacity">
                    {(day.steps / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full max-w-[42px] border-[3px] border-ink bg-rose shadow-sticker-sm transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="font-display text-xs font-bold text-ink">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between font-display text-xs font-bold text-ink pt-1">
            <span>Peak day: Friday (440,000 steps)</span>
            <span>Average: 364,500 steps / day</span>
          </div>
        </div>
      </StickerCard>

      {/* Department Breakdown Table */}
      <StickerCard tone="white" shadow="sticker" className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-[3px] border-ink">
          <h3 className="text-base font-display font-bold text-ink">
            Detailed Department Health Breakdown
          </h3>
          <span className="font-display text-xs font-bold text-muted">
            {departments.length} department(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-[3px] border-ink font-display text-ink uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Staff Count</th>
                <th className="py-3 px-4">Participation Rate</th>
                <th className="py-3 px-4">Daily Avg Steps</th>
                <th className="py-3 px-4 text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y-[2px] divide-dashed divide-ink/30">
              {departments.map((dept) => (
                <tr key={dept.department} className="hover:bg-paper transition-colors">
                  <td className="py-3.5 px-4 font-display font-bold text-ink">
                    {dept.department}
                  </td>
                  <td className="py-3.5 px-4 text-ink/80 font-medium">
                    {dept.employees} employees
                  </td>
                  <td className="py-3.5 px-4">
                    <Pill tone="sage" className="border-2 border-ink text-xs">
                      {dept.participation}%
                    </Pill>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-ink tabular-nums">
                    {dept.avgSteps.toLocaleString()} steps/day
                  </td>
                  <td className="py-3.5 px-4 text-right font-display font-bold tabular-nums text-ink">
                    {dept.points.toLocaleString()} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StickerCard>
    </div>
  );
};

export default AdminReportsPage;
