import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Auth pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// Master pages
import MasterDashboard from './pages/master/MasterDashboard.jsx';
import ApprovalCentre from './pages/master/ApprovalCentre.jsx';
import EmployeeManagement from './pages/master/EmployeeManagement.jsx';
import DepartmentsRoles from './pages/master/DepartmentsRoles.jsx';
import PackagesManagement from './pages/master/PackagesManagement.jsx';
import AuditLogs from './pages/master/AuditLogs.jsx';
import SystemSettings from './pages/master/SystemSettings.jsx';

// Sales pages
import SalesDashboard from './pages/sales/SalesDashboard.jsx';
import EnquiriesList from './pages/sales/EnquiriesList.jsx';
import TripRequestsList from './pages/sales/TripRequestsList.jsx';
import SupplierCoordination from './pages/sales/SupplierCoordination.jsx';

// Finance pages
import FinanceDashboard from './pages/finance/FinanceDashboard.jsx';
import InvoicesList from './pages/finance/InvoicesList.jsx';
import PaymentVerification from './pages/finance/PaymentVerification.jsx';
import RefundsManagement from './pages/finance/RefundsManagement.jsx';

// Marketing pages
import MarketingDashboard from './pages/marketing/MarketingDashboard.jsx';
import TripMediaWorkspace from './pages/marketing/TripMediaWorkspace.jsx';
import BlogManagement from './pages/marketing/BlogManagement.jsx';

// ─── Protected route wrapper ───────────────────────────────────────────────
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-600 font-medium">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <AdminLayout><Outlet /></AdminLayout>;
}

// ─── Smart home redirect ────────────────────────────────────────────────────
function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const dept = (user.departments?.[0] || 'MASTER').toLowerCase();
  return <Navigate to={`/${dept}/dashboard`} replace />;
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes — all wrapped inside AdminLayout */}
          <Route element={<ProtectedRoute />}>
            {/* Root → smart redirect */}
            <Route index element={<HomeRedirect />} />

            {/* Master workspace */}
            <Route path="master/dashboard" element={<MasterDashboard />} />
            <Route path="master/approvals" element={<ApprovalCentre />} />
            <Route path="master/employees" element={<EmployeeManagement />} />
            <Route path="master/roles" element={<DepartmentsRoles />} />
            <Route path="master/packages" element={<PackagesManagement />} />
            <Route path="master/audit-logs" element={<AuditLogs />} />
            <Route path="master/settings" element={<SystemSettings />} />

            {/* Sales workspace */}
            <Route path="sales/dashboard" element={<SalesDashboard />} />
            <Route path="sales/enquiries" element={<EnquiriesList />} />
            <Route path="sales/trip-requests" element={<TripRequestsList />} />
            <Route path="sales/suppliers" element={<SupplierCoordination />} />

            {/* Finance workspace */}
            <Route path="finance/dashboard" element={<FinanceDashboard />} />
            <Route path="finance/invoices" element={<InvoicesList />} />
            <Route path="finance/payments" element={<PaymentVerification />} />
            <Route path="finance/refunds" element={<RefundsManagement />} />

            {/* Marketing workspace */}
            <Route path="marketing/dashboard" element={<MarketingDashboard />} />
            <Route path="marketing/trips" element={<TripMediaWorkspace />} />
            <Route path="marketing/blogs" element={<BlogManagement />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
