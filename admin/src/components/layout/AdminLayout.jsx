import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
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
  CalendarCheck
} from 'lucide-react';

export default function AdminLayout() {
  const { user, activeDepartment, setActiveDepartment, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {
      // ignore in background
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const markNotificationRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation Items per Department
  const getNavItems = () => {
    if (activeDepartment === 'MASTER' || user?.departments?.includes('MASTER')) {
      return [
        { label: 'Executive Dashboard', path: '/master/dashboard', icon: Compass },
        { label: 'Approval Centre', path: '/master/approvals', icon: CheckCircle2, highlight: true },
        { label: 'All Enquiries', path: '/sales/enquiries', icon: FileText },
        { label: 'Trip Requests', path: '/sales/trip-requests', icon: CalendarCheck },
        { label: 'Packages & Itineraries', path: '/master/packages', icon: Package },
        { label: 'Finance & Invoices', path: '/finance/invoices', icon: DollarSign },
        { label: 'Payment Verification', path: '/finance/payments', icon: CreditCard },
        { label: 'Refunds & Cancellations', path: '/finance/refunds', icon: AlertCircle },
        { label: 'Employee Management', path: '/master/employees', icon: Users },
        { label: 'Departments & Roles', path: '/master/roles', icon: ShieldCheck },
        { label: 'Business Audit Logs', path: '/master/audit-logs', icon: History },
        { label: 'System Settings', path: '/master/settings', icon: Settings },
      ];
    }

    if (activeDepartment === 'SALES') {
      return [
        { label: 'Sales Dashboard', path: '/sales/dashboard', icon: Compass },
        { label: 'Enquiries Pipeline', path: '/sales/enquiries', icon: FileText },
        { label: 'Trip Requests', path: '/sales/trip-requests', icon: CalendarCheck },
        { label: 'Supplier Bookings', path: '/sales/suppliers', icon: Briefcase },
        { label: 'Tour Packages', path: '/master/packages', icon: Package },
      ];
    }

    if (activeDepartment === 'FINANCE') {
      return [
        { label: 'Finance Dashboard', path: '/finance/dashboard', icon: Compass },
        { label: 'Invoices & Requests', path: '/finance/invoices', icon: FileText },
        { label: 'Payment Verification', path: '/finance/payments', icon: CreditCard },
        { label: 'Refunds Management', path: '/finance/refunds', icon: AlertCircle },
        { label: 'Trip Requests Queue', path: '/sales/trip-requests', icon: CalendarCheck },
      ];
    }

    if (activeDepartment === 'MARKETING') {
      return [
        { label: 'Media Dashboard', path: '/marketing/dashboard', icon: Compass },
        { label: 'Trip Media Workspace', path: '/marketing/trips', icon: Camera },
        { label: 'Customer Archives', path: '/marketing/archives', icon: Layers },
        { label: 'Blog Stories', path: '/marketing/blogs', icon: BookOpen },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  const handleDeptSwitch = (dept) => {
    setActiveDepartment(dept);
    setShowWorkspaceMenu(false);
    // Auto navigate to department's home
    const deptHome = {
      MASTER: '/master/dashboard',
      SALES: '/sales/dashboard',
      FINANCE: '/finance/dashboard',
      MARKETING: '/marketing/dashboard',
    }[dept] || '/master/dashboard';
    navigate(deptHome);
  };

  const departmentColors = {
    MASTER: 'bg-purple-100 text-purple-800 border-purple-300',
    SALES: 'bg-blue-100 text-blue-800 border-blue-300',
    FINANCE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MARKETING: 'bg-amber-100 text-amber-800 border-amber-300'
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold font-serif shadow">
              M
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white uppercase font-serif">
                Mountain & Memories
              </div>
              <div className="text-[10px] tracking-widest text-brand-300 font-mono uppercase">
                Admin Portal
              </div>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Workspace Tag */}
        <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Current Workspace
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${departmentColors[activeDepartment] || 'bg-slate-700 text-white'}`}>
              {activeDepartment}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {user?.empId}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                } ${item.highlight && !isActive ? 'border border-amber-500/30 text-amber-300' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile / Switcher Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-brand-100 flex items-center justify-center font-bold text-xs">
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
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Department / Workspace Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
              >
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                <span>Workspace: <strong className="text-slate-900">{activeDepartment}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showWorkspaceMenu && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Workspace
                  </div>
                  {['MASTER', 'SALES', 'FINANCE', 'MARKETING'].map((dept) => {
                    const isPermitted = user?.departments?.includes(dept) || user?.departments?.includes('MASTER');
                    if (!isPermitted) return null;
                    return (
                      <button
                        key={dept}
                        onClick={() => handleDeptSwitch(dept)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                          activeDepartment === dept ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{dept} Department</span>
                        {activeDepartment === dept && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications ({unreadCount} new)</span>
                    <button 
                      onClick={async () => {
                        await api.post('/notifications/read-all', {});
                        setUnreadCount(0);
                        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                      }}
                      className="text-[11px] text-brand-600 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition ${
                            !n.isRead ? 'bg-amber-50/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">{user?.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user?.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{user?.empId}</div>
                    <div className="text-[10px] text-brand-600 font-medium mt-0.5">{user?.departments?.join(' • ')}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
