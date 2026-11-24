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
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Package,
  CalendarCheck,
  SlidersHorizontal,
  Crown,
  TrendingUp,
  Wallet,
  Megaphone,
} from 'lucide-react';

export const DEPARTMENTS = ['MASTER', 'SALES', 'FINANCE', 'MARKETING'];

export const DEPARTMENT_META = {
  MASTER: { label: 'Master', description: 'Executive control & approvals', icon: Crown, dot: 'bg-purple-500', chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  SALES: { label: 'Sales', description: 'Enquiries, requests & suppliers', icon: TrendingUp, dot: 'bg-blue-500', chip: 'bg-blue-50 text-blue-700 border-blue-200' },
  FINANCE: { label: 'Finance', description: 'Invoices, payments & refunds', icon: Wallet, dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  MARKETING: { label: 'Marketing', description: 'Trip media & blog stories', icon: Megaphone, dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export const DEPARTMENT_HOME = {
  MASTER: '/master/dashboard',
  SALES: '/sales/dashboard',
  FINANCE: '/finance/dashboard',
  MARKETING: '/marketing/dashboard',
};

/** Sidebar navigation grouped into sections, per workspace. */
export const NAV = {
  MASTER: [
    {
      section: 'Overview',
      items: [
        { label: 'Executive Dashboard', path: '/master/dashboard', icon: Compass },
        { label: 'Approval Centre', path: '/master/approvals', icon: CheckCircle2, highlight: true },
      ],
    },
    {
      section: 'Operations',
      items: [
        { label: 'All Enquiries', path: '/sales/enquiries', icon: FileText },
        { label: 'Trip Requests', path: '/sales/trip-requests', icon: CalendarCheck },
        { label: 'Packages & Itineraries', path: '/master/packages', icon: Package },
      ],
    },
    {
      section: 'Finance',
      items: [
        { label: 'Finance & Invoices', path: '/finance/invoices', icon: DollarSign },
        { label: 'Payment Verification', path: '/finance/payments', icon: CreditCard },
        { label: 'Refunds & Cancellations', path: '/finance/refunds', icon: AlertCircle },
      ],
    },
    {
      section: 'Administration',
      items: [
        { label: 'Employee Management', path: '/master/employees', icon: Users },
        { label: 'Departments & Roles', path: '/master/roles', icon: ShieldCheck },
        { label: 'Business Audit Logs', path: '/master/audit-logs', icon: History },
        { label: 'System Settings', path: '/master/settings', icon: Settings },
      ],
    },
  ],
  SALES: [
    {
      section: 'Sales',
      items: [
        { label: 'Sales Dashboard', path: '/sales/dashboard', icon: Compass },
        { label: 'Enquiries Pipeline', path: '/sales/enquiries', icon: FileText },
        { label: 'Trip Requests', path: '/sales/trip-requests', icon: CalendarCheck },
        { label: 'Supplier Bookings', path: '/sales/suppliers', icon: Briefcase },
        { label: 'Tour Packages', path: '/master/packages', icon: Package },
      ],
    },
  ],
  FINANCE: [
    {
      section: 'Finance',
      items: [
        { label: 'Finance Dashboard', path: '/finance/dashboard', icon: Compass },
        { label: 'Invoices & Requests', path: '/finance/invoices', icon: FileText },
        { label: 'Payment Verification', path: '/finance/payments', icon: CreditCard },
        { label: 'Refunds Management', path: '/finance/refunds', icon: AlertCircle },
        { label: 'Trip Requests Queue', path: '/sales/trip-requests', icon: CalendarCheck },
      ],
    },
  ],
  MARKETING: [
    {
      section: 'Marketing',
      items: [
        { label: 'Media Dashboard', path: '/marketing/dashboard', icon: Compass },
        { label: 'Trip Media Workspace', path: '/marketing/trips', icon: Camera },
        { label: 'Blog Stories', path: '/marketing/blogs', icon: BookOpen },
      ],
    },
  ],
};

/** Items available to everyone regardless of workspace. */
export const PERSONAL_NAV = [{ label: 'Preferences', path: '/preferences', icon: SlidersHorizontal }];

export const flatNav = (dept) => (NAV[dept] || []).flatMap((s) => s.items);

/**
 * Can a user with `departments` open `pathname`? MASTER may open anything;
 * other users may open any page that appears in one of their workspaces.
 */
export function canAccessPath(departments = [], pathname) {
  if (departments.includes('MASTER')) return true;
  if (pathname.startsWith('/preferences')) return true;
  return departments.some((d) => flatNav(d).some((item) => pathname === item.path || pathname.startsWith(`${item.path}/`)));
}

/** Map a notification's linked record to the page that manages it. */
export const NOTIFICATION_ROUTES = {
  ENQUIRY: '/sales/enquiries',
  TRIP_REQUEST: '/sales/trip-requests',
  INVOICE: '/finance/invoices',
  PAYMENT: '/finance/payments',
  REFUND: '/finance/refunds',
  EMPLOYEE: '/master/employees',
  BLOG: '/marketing/blogs',
  TRIP: '/marketing/trips',
};

/** All pages a user may reach — used by the command palette. */
export function searchableNav(departments = []) {
  const depts = departments.includes('MASTER') ? DEPARTMENTS : departments;
  const seen = new Map();
  depts.forEach((d) =>
    flatNav(d).forEach((item) => {
      if (!seen.has(item.path)) seen.set(item.path, { ...item, dept: d });
    })
  );
  PERSONAL_NAV.forEach((item) => seen.set(item.path, { ...item, dept: null }));
  return [...seen.values()];
}
