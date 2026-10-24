import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate, NavLink } from 'react-router-dom';
import {
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Radio,
  PlusCircle,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, unreadNotificationsCount, dispatchToast, logout } = useWellness();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'Admin';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSimulateSocket = async () => {
    try {
      const { getSocket } = await import('../services/socket');
      const socket = getSocket();
      socket.emit('simulate:event', {
        title: "Real-Time Event ⚡",
        message: `${user.firstName || 'Colleague'} logged activity! Real-time Socket.io synchronized across clients.`,
        type: "points",
        actionLink: "/leaderboard"
      });
    } catch {
      dispatchToast({
        title: "Real-Time Event",
        message: `${user.firstName} logged activity! Team is now at 84% goal.`,
        type: "points",
        actionLink: "/leaderboard"
      });
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    if (logout) {
      await logout();
    } else {
      dispatchToast({
        title: "Signed Out",
        message: "You have signed out of your account.",
        type: "info"
      });
    }
    navigate('/login');
  };

  const employeeNavLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Challenges", path: "/challenges" },
    { name: "Log activity", path: "/activities/log" },
    { name: "Wellness sessions", path: "/sessions" },
    { name: "Resources", path: "/resources" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Rewards store", path: "/rewards" },
    { name: "Profile and settings", path: "/settings" },
  ];

  const navTabClass = ({ isActive }) =>
    `inline-flex items-center px-3.5 py-1.5 text-xs font-bold font-display border-[3px] border-ink transition-transform duration-100 ease-out select-none whitespace-nowrap ${
      isActive
        ? "bg-ink text-butter shadow-sticker-sm"
        : "bg-white text-ink shadow-sticker-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-paper"
    }`;

  return (
    <header className="w-full mb-6 text-left">
      {/* 1. Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b-[3px] border-ink pb-4">
        {/* Left: Sticker Logo Block */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-ink text-butter px-3 py-1.5 border-[3px] border-ink shadow-[4px_4px_0_#E58FA9] transform -rotate-2 group-hover:rotate-0 transition-transform">
            <span className="font-display font-bold text-base sm:text-lg block leading-tight tracking-tight">
              WellnessAtWork
            </span>
            <span className="text-[10px] text-white/90 font-medium block leading-none pt-0.5">
              Small steps. Better wellness.
            </span>
          </div>
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="lg:hidden p-2 border-[3px] border-ink bg-white shadow-sticker-sm text-ink"
          aria-label="Toggle Navigation Menu"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Right Action Items */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Simulate Live Event Button */}
          {isAdmin && <button
            onClick={handleSimulateSocket}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border-[3px] border-ink bg-white text-ink text-xs font-bold font-display shadow-sticker-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            title="Simulate Real-Time Socket Event"
          >
            <span>Simulate live event</span>
          </button>}

          {/* Notifications Button with Rose Badge */}
          <Link
            to="/notifications"
            className="inline-flex items-center gap-2 px-3 py-1.5 border-[3px] border-ink bg-white text-ink text-xs font-bold font-display shadow-sticker-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            title="Notifications"
          >
            <span>Alerts</span>
            <span className="px-1.5 py-0.2 bg-rose text-ink border-[2px] border-ink text-[11px] font-bold font-display tabular-nums">
              {unreadNotificationsCount}
            </span>
          </Link>

          {/* User Chip with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 border-[3px] border-ink bg-white text-ink text-xs font-bold font-display shadow-sticker-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <span>{user?.firstName || 'User'} · {user?.totalPoints || 0} pts</span>
              <ChevronDown className={`w-3.5 h-3.5 text-ink transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Sticker Brutalist Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 border-[3px] border-ink bg-white shadow-sticker-lg p-2 z-50 text-left">
                <div className="px-2 py-1.5 border-b-2 border-dashed border-ink/40 mb-1">
                  <p className="text-xs font-bold text-ink truncate">{user?.fullName}</p>
                  <p className="text-[10px] text-muted truncate">{user?.department}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold font-display px-1.5 py-0.5 bg-butter border border-ink">
                    {user?.tier || 'Silver Pioneer'}
                  </span>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-ink hover:bg-paper transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-2 py-1.5 text-xs font-bold text-ink hover:bg-paper transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notifications</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose text-ink border border-ink text-[10px] font-bold">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-ink hover:bg-rose transition-colors cursor-pointer text-left border-t border-ink/20 mt-1 pt-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Top Actions (visible when mobile menu is toggled or on small screens) */}
      {mobileNavOpen && (
        <div className="lg:hidden p-3 border-[3px] border-ink bg-white shadow-sticker mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateSocket}
              className="px-3 py-1 border-2 border-ink bg-white text-xs font-bold font-display"
            >
              Simulate live event
            </button>
            <Link
              to="/notifications"
              onClick={() => setMobileNavOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-ink bg-white text-xs font-bold font-display"
            >
              <span>Alerts</span>
              <span className="px-1.5 bg-rose border border-ink text-[10px]">{unreadNotificationsCount}</span>
            </Link>
            <span className="px-3 py-1 border-2 border-ink bg-butter text-xs font-bold font-display">
              {user?.firstName} · {user?.totalPoints} pts
            </span>
          </div>
        </div>
      )}

      {/* 2. Navigation Row */}
      <nav className={`mt-3 ${mobileNavOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex flex-wrap items-center gap-2">
          {employeeNavLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className={navTabClass}
            >
              {item.name}
            </NavLink>
          ))}

          {/* HR-Only Nav Items (Preserving existing role checks) */}
          {isAdmin && (
            <>
              <div className="hidden sm:block h-6 w-[2px] bg-ink mx-1 self-center" />
              <NavLink
                to="/admin"
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold font-display border-[3px] border-ink transition-transform duration-100 ease-out select-none whitespace-nowrap ${
                    isActive
                      ? "bg-indigo text-white shadow-sticker-sm"
                      : "bg-indigo text-white shadow-sticker-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-[#5060a3]"
                  }`
                }
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HR: Admin command</span>
              </NavLink>
            </>
          )}
        </div>

        {/* HR Sub-nav row if Admin: Create challenge button */}
        {isAdmin && (
          <div className="mt-2.5 flex items-center gap-2">
            <NavLink
              to="/admin/challenges/create"
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold font-display border-[3px] border-ink transition-transform duration-100 ease-out select-none whitespace-nowrap ${
                  isActive
                    ? "bg-indigo text-white shadow-sticker-sm"
                    : "bg-indigo text-white shadow-sticker-sm hover:-translate-x-[1px] hover:-translate-y-[1px]"
                }`
              }
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create challenge</span>
            </NavLink>

            <NavLink
              to="/admin/reports"
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-display border-[3px] border-ink transition-transform duration-100 ease-out select-none whitespace-nowrap ${
                  isActive
                    ? "bg-white text-ink shadow-sticker-sm underline"
                    : "bg-white text-ink shadow-sticker-sm hover:bg-paper"
                }`
              }
            >
              <span>Wellness reports</span>
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
