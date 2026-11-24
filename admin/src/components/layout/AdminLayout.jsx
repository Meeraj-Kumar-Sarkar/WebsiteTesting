import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useToast } from '../../context/FeedbackContext';
import { api } from '../../api/client';
import {
  NAV,
  PERSONAL_NAV,
  DEPARTMENT_META,
  DEPARTMENT_HOME,
  NOTIFICATION_ROUTES,
  searchableNav
} from '../../config/navigation';
import {
  Compass,
  CheckCircle2,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  Camera,
  BookOpen,
  History,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Layers,
  MapPin,
  DollarSign,
  AlertCircle,
  Menu,
  X,
  ShieldCheck,
  Package,
  CalendarCheck,
  Sun,
  Moon,
  Laptop,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Command,
  ArrowRight
} from 'lucide-react';

export default function AdminLayout() {
  const { user, activeDepartment, setActiveDepartment, logout } = useAuth();
  const { prefs, setPref, resolvedTheme, toggleTheme, formatDate, formatTime } = usePreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const workspaceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
      if (workspaceRef.current && !workspaceRef.current.contains(event.target)) setShowWorkspaceMenu(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick Command Palette Hotkey (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Fetch notifications with configurable polling
  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {
      // background polling fail - ignore
    }
  };

  useEffect(() => {
    loadNotifications();
    const intervalSeconds = prefs.notificationInterval || 30;
    if (intervalSeconds <= 0) return;
    const interval = setInterval(loadNotifications, intervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [prefs.notificationInterval]);

  const markNotificationRead = async (n) => {
    try {
      if (!n.isRead) {
        await api.patch(`/notifications/${n.id}/read`, {});
        setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setShowNotifications(false);

      // Navigate to linked page if any
      const targetPath = NOTIFICATION_ROUTES[n.linkedRecordType];
      if (targetPath) {
        navigate(targetPath);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all', {});
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch (e) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeptSwitch = (dept) => {
    setActiveDepartment(dept);
    setShowWorkspaceMenu(false);
    navigate(DEPARTMENT_HOME[dept] || DEPARTMENT_HOME.MASTER);
  };

  // Nav sections for active workspace
  const currentNavSections = NAV[activeDepartment] || NAV.MASTER;

  // Filtered searchable items for Command Palette
  const searchResults = searchQuery.trim()
    ? searchableNav(user?.departments).filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.dept && item.dept.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : searchableNav(user?.departments);

  // Content width container class
  const contentWidthClass = {
    contained: 'max-w-7xl',
    wide: 'max-w-[1750px]',
    full: 'max-w-full',
  }[prefs.contentWidth || 'contained'];

  const meta = DEPARTMENT_META[activeDepartment] || DEPARTMENT_META.MASTER;

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* ─── Mobile Sidebar Backdrop ────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/90">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold font-serif shadow-glow">
              M
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white uppercase font-serif">
                Mountain &amp; Memories
              </div>
              <div className="text-[10px] tracking-widest text-brand-400 font-mono uppercase">
                Enterprise Portal
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Switcher Pill */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Workspace</span>
            <span className="font-mono text-slate-500">{user?.empId}</span>
          </div>

          <div className="relative" ref={workspaceRef}>
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-white transition group"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                <span>{activeDepartment} Dept</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
            </button>

            {showWorkspaceMenu && (
              <div className="absolute left-0 top-full mt-1.5 w-full rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 animate-pop-in">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Workspace
                </div>
                {['MASTER', 'SALES', 'FINANCE', 'MARKETING'].map((dept) => {
                  const isPermitted = user?.departments?.includes(dept) || user?.departments?.includes('MASTER');
                  if (!isPermitted) return null;
                  const itemMeta = DEPARTMENT_META[dept];
                  return (
                    <button
                      key={dept}
                      onClick={() => handleDeptSwitch(dept)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                        activeDepartment === dept
                          ? 'bg-brand-600/20 text-brand-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${itemMeta.dot}`} />
                        <span>{dept}</span>
                      </div>
                      {activeDepartment === dept && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {currentNavSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.section && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {section.section}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-soft font-semibold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    } ${item.highlight && !isActive ? 'border border-amber-500/40 text-amber-300 bg-amber-500/10' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span className="truncate">{item.label}</span>
                    {item.highlight && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* System & Preferences Section */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Personal
            </div>
            {PERSONAL_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-brand-100 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user?.fullName}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Viewport ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-md border-b border-line flex items-center justify-between px-4 sm:px-6 shadow-soft transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Command Palette Search Launcher */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-line bg-canvas hover:border-slate-300 text-xs text-slate-500 transition shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search pages or jump to…</span>
              <span className="sm:hidden">Search…</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded bg-surface border border-line text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Dark/Light Theme Switcher */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle color theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-transparent hover:border-line"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Menu */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-transparent hover:border-line"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-pop-in">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-brand-600 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-84 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        You're all caught up! No recent alerts.
                      </div>
                    ) : (
                      notifications.slice(0, 12).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n)}
                          className={`p-3.5 text-left hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                            !n.isRead ? 'bg-brand-50/40' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-brand-600 ring-2 ring-brand-300' : 'bg-slate-300'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-semibold text-slate-900 truncate">{n.title}</span>
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                {formatTime(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                            {n.linkedRecordType && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-brand-600 font-semibold mt-1">
                                Open record <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-line hover:bg-slate-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden md:inline truncate max-w-[120px]">
                  {user?.fullName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-pop-in">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{user?.empId} • {user?.email}</div>
                    <div className="text-[10px] text-brand-600 font-medium mt-1">
                      Depts: {user?.departments?.join(', ')}
                    </div>
                  </div>

                  <Link
                    to="/preferences"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    Portal Preferences
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto ${contentWidthClass}`}>
          <Outlet />
        </main>
      </div>

      {/* ─── Command Palette Modal ─────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-pop-in">
            <div className="flex items-center px-4 py-3 border-b border-slate-200">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Jump to any dashboard, enquiry, invoice, settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-500">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching admin pages found.
                </div>
              ) : (
                searchResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-brand-600">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.path}</div>
                        </div>
                      </div>
                      {item.dept && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                          {item.dept}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
