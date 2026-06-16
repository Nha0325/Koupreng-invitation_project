import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AdminAuthProvider";
import QueryProvider from "./providers/QueryProvider";
import RequireAdmin from "./guards/RequireAdmin";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/auth/LoginPage";

// Modern Admin Pages from features/admin/...
import DashboardPage from "../pages/dashboard/AdminDashboardPage";
import UsersPage from "../pages/users/AdminUsersPage";
import UserDetailPage from "../pages/users/AdminUserDetailPage";
import TemplatesPage from "../pages/templates/AdminTemplatesPage";
import TemplateEditPage from "../pages/templates/AdminTemplateEditPage";
import InvitationsPage from "../pages/invitations/AdminInvitationsPage";
import InvitationDetailPage from "../pages/invitations/AdminInvitationDetailPage";
import PaymentsPage from "../pages/payments/AdminPaymentsPage";
import PackagesPage from "../pages/payments/AdminPackagesPage";
import SystemLogsPage from "../features/admin/AdminSystemLogsPage";
import ReportsPage from "../pages/reports/AdminReportsPage";

// Legacy fallback page kept for events reference
import EventsPage from "../pages/EventsPage";

import "../styles/App.css";

export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:userId" element={<UserDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/invitations" element={<InvitationsPage />} />
              <Route path="/invitations/:invitationId" element={<InvitationDetailPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/templates/new" element={<TemplateEditPage />} />
              <Route path="/templates/:templateId" element={<TemplateEditPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/system-logs" element={<SystemLogsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
}
