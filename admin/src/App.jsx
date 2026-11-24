import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { PreferencesProvider } from './context/PreferencesContext.jsx';
import { FeedbackProvider } from './context/FeedbackContext.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { PageLoader, FullScreenLoader } from './components/common/Loaders.jsx';
import AccessDenied from './pages/AccessDenied.jsx';
import { canAccessPath, DEPARTMENT_HOME } from './config/navigation.js';

// Auth pages (eager — first screen for signed-out users)
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// Workspace pages are code-split so each workspace only loads what it needs
const MasterDashboard = lazy(() => import('./pages/master/MasterDashboard.jsx'));
const ApprovalCentre = lazy(() => import('./pages/master/ApprovalCentre.jsx'));
const EmployeeManagement = lazy(() => import('./pages/master/EmployeeManagement.jsx'));
const DepartmentsRoles = lazy(() => import('./pages/master/DepartmentsRoles.jsx'));
const PackagesManagement = lazy(() => import('./pages/master/PackagesManagement.jsx'));
const AuditLogs = lazy(() => import('./pages/master/AuditLogs.jsx'));
const SystemSettings = lazy(() => import('./pages/master/SystemSettings.jsx'));

const SalesDashboard = lazy(() => import('./pages/sales/SalesDashboard.jsx'));
const EnquiriesList = lazy(() => import('./pages/sales/EnquiriesList.jsx'));
const TripRequestsList = lazy(() => import('./pages/sales/TripRequestsList.jsx'));
const SupplierCoordination = lazy(() => import('./pages/sales/SupplierCoordination.jsx'));

const FinanceDashboard = lazy(() => import('./pages/finance/FinanceDashboard.jsx'));
const InvoicesList = lazy(() => import('./pages/finance/InvoicesList.jsx'));
const PaymentVerification = lazy(() => import('./pages/finance/PaymentVerification.jsx'));
const RefundsManagement = lazy(() => import('./pages/finance/RefundsManagement.jsx'));

const MarketingDashboard = lazy(() => import('./pages/marketing/MarketingDashboard.jsx'));
const TripMediaWorkspace = lazy(() => import('./pages/marketing/TripMediaWorkspace.jsx'));
const BlogManagement = lazy(() => import('./pages/marketing/BlogManagement.jsx'));

const Preferences = lazy(() => import('./pages/settings/Preferences.jsx'));

// ─── Protected route wrapper ───────────────────────────────────────────────
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading && !user) return <FullScreenLoader label="Loading workspace…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return <AdminLayout />;
}

// ─── Department guard — blocks pages outside the user's workspaces ─────────
function Guarded({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!canAccessPath(user?.departments, location.pathname)) return <AccessDenied />;
  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// ─── Smart home redirect → home of the *active* workspace ──────────────────
function HomeRedirect() {
  const { user, activeDepartment } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const permitted = user.departments?.includes('MASTER') || user.departments?.includes(activeDepartment);
  const dept = permitted ? activeDepartment : user.departments?.[0] || 'MASTER';
  return <Navigate to={DEPARTMENT_HOME[dept] || DEPARTMENT_HOME.MASTER} replace />;
}

// Public-only pages bounce signed-in users to their workspace
function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user && localStorage.getItem('mm_token')) return <Navigate to="/" replace />;
  return children;
}

const page = (Component) => (
  <Guarded>
    <Component />
  </Guarded>
);

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <PreferencesProvider>
      <FeedbackProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
              <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
              <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />

              {/* Protected routes — all rendered inside AdminLayout */}
              <Route element={<ProtectedRoute />}>
                <Route index element={<HomeRedirect />} />

                {/* Master workspace */}
                <Route path="master/dashboard" element={page(MasterDashboard)} />
                <Route path="master/approvals" element={page(ApprovalCentre)} />
                <Route path="master/employees" element={page(EmployeeManagement)} />
                <Route path="master/roles" element={page(DepartmentsRoles)} />
                <Route path="master/packages" element={page(PackagesManagement)} />
                <Route path="master/audit-logs" element={page(AuditLogs)} />
                <Route path="master/settings" element={page(SystemSettings)} />

                {/* Sales workspace */}
                <Route path="sales/dashboard" element={page(SalesDashboard)} />
                <Route path="sales/enquiries" element={page(EnquiriesList)} />
                <Route path="sales/trip-requests" element={page(TripRequestsList)} />
                <Route path="sales/suppliers" element={page(SupplierCoordination)} />

                {/* Finance workspace */}
                <Route path="finance/dashboard" element={page(FinanceDashboard)} />
                <Route path="finance/invoices" element={page(InvoicesList)} />
                <Route path="finance/payments" element={page(PaymentVerification)} />
                <Route path="finance/refunds" element={page(RefundsManagement)} />

                {/* Marketing workspace */}
                <Route path="marketing/dashboard" element={page(MarketingDashboard)} />
                <Route path="marketing/trips" element={page(TripMediaWorkspace)} />
                <Route path="marketing/blogs" element={page(BlogManagement)} />

                {/* Personal */}
                <Route path="preferences" element={page(Preferences)} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </FeedbackProvider>
    </PreferencesProvider>
  );
}
