import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  PlusCircle,
  CalendarDays,
  BookOpen,
  Award,
  Gift,
  Settings,
  ShieldCheck,
  FileBarChart,
  Sparkles,
  HeartHandshake,
  X
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, unreadNotificationsCount } = useWellness();

  const employeeNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Challenges", path: "/challenges", icon: Trophy },
    { name: "Log Activity", path: "/activities/log", icon: PlusCircle },
    { name: "Wellness Sessions", path: "/sessions", icon: CalendarDays },
    { name: "Resources", path: "/resources", icon: BookOpen },
    { name: "Leaderboard", path: "/leaderboard", icon: Award },
    { name: "Rewards Store", path: "/rewards", icon: Gift },
    { name: "Profile & Settings", path: "/settings", icon: Settings },
  ];

  const adminNavItems = [
    { name: "Admin Command", path: "/admin", icon: ShieldCheck },
    { name: "Create Challenge", path: "/admin/challenges/create", icon: PlusCircle },
    { name: "Wellness Reports", path: "/admin/reports", icon: FileBarChart },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
      isActive
        ? "bg-[#EDE3CC] text-[#2A4BD7] border border-[#2A4BD7]/50 shadow-xs"
        : "text-[#5B4A6F] hover:bg-[#EDE3CC]/60 hover:text-[#2A1B3D] border border-transparent"
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#2A1B3D]/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 glass-panel-elevated bg-[#F6EFE0] border-r border-[#EDE3CC] p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo / Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#EDE3CC] mb-4 flex-shrink-0">
            <Link to="/dashboard" className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE3CC] border border-[#2A4BD7]/30 p-0.5 shadow-xs flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-[#F6EFE0] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#2A4BD7]" />
                </div>
              </div>
              <div>
                <span className="text-base font-extrabold text-[#2A1B3D] tracking-tight block leading-tight">
                  WellnessAtWork
                </span>
                <span className="text-[11px] font-semibold text-[#5B4A6F] block">
                  Small steps. Better wellness.
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-[#5B4A6F] hover:bg-[#EDE3CC]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Scrollable) */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-6">
            <div>
              <p className="px-4 text-[11px] font-bold uppercase tracking-[1px] text-[#2A4BD7] mb-2">
                Employee Wellness
              </p>
              <nav className="space-y-1">
                {employeeNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={navLinkClass}
                  >
                    <item.icon className="w-4 h-4 text-[#2A4BD7] group-hover:text-[#2A4BD7] transition-colors" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div>
              <p className="px-4 text-[11px] font-bold uppercase tracking-[1px] text-[#2A4BD7] mb-2 flex items-center gap-1.5">
                <span>HR & Administrator</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-[#EDE3CC] text-[#2A4BD7] border border-[#2A4BD7]/30 rounded-md font-bold">HR</span>
              </p>
              <nav className="space-y-1">
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={navLinkClass}
                  >
                    <item.icon className="w-4 h-4 text-[#2A4BD7] group-hover:text-[#2A4BD7] transition-colors" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Academic Badge & User Card Footer */}
          <div className="pt-4 border-t border-[#EDE3CC] flex-shrink-0 space-y-3">
            {/* ITM Skills University Academic Badge */}
            <div className="p-3 rounded-2xl bg-[#EDE3CC] border border-[#2A4BD7]/30 text-left">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-[1px] text-[#2A4BD7] mb-1">
                <span>CASE STUDY 72</span>
                <span>ITM SKILLS UNIV</span>
              </div>
              <p className="text-xs font-semibold text-[#2A1B3D] truncate">
                Bhuvisha Manish Gohil
              </p>
              <p className="text-[10px] text-[#5B4A6F]">
                B.Tech CSE • Year 2
              </p>
            </div>

            {/* Quick User Summary */}
            <Link
              to="/settings"
              onClick={() => onClose && onClose()}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#EDE3CC] transition-colors border border-transparent hover:border-[#EDE3CC]"
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#EDE3CC] shadow-xs"
              />
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-[#2A1B3D] truncate">
                  {user.fullName}
                </p>
                <p className="text-[11px] text-[#2A4BD7] font-semibold tabular-nums">
                  {user.totalPoints} pts • #{user.currentRank}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
