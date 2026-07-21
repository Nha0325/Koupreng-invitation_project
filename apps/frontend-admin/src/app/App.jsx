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
import { ADMIN_ROUTE_PATHS } from "./routes";

import "../styles/App.css";

export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ADMIN_ROUTE_PATHS.login} element={<LoginPage />} />
            <Route
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path={ADMIN_ROUTE_PATHS.dashboard} element={<DashboardPage />} />
              <Route path={ADMIN_ROUTE_PATHS.users} element={<UsersPage />} />
              <Route path={ADMIN_ROUTE_PATHS.userDetail} element={<UserDetailPage />} />
              <Route path={ADMIN_ROUTE_PATHS.events} element={<EventsPage />} />
              <Route path={ADMIN_ROUTE_PATHS.invitations} element={<InvitationsPage />} />
              <Route path={ADMIN_ROUTE_PATHS.invitationDetail} element={<InvitationDetailPage />} />
              <Route path={ADMIN_ROUTE_PATHS.templates} element={<TemplatesPage />} />
              <Route path={ADMIN_ROUTE_PATHS.templateNew} element={<TemplateEditPage />} />
              <Route path={ADMIN_ROUTE_PATHS.templateEdit} element={<TemplateEditPage />} />
              <Route path={ADMIN_ROUTE_PATHS.payments} element={<PaymentsPage />} />
              <Route path={ADMIN_ROUTE_PATHS.packages} element={<PackagesPage />} />
              <Route path={ADMIN_ROUTE_PATHS.systemLogs} element={<SystemLogsPage />} />
              <Route path={ADMIN_ROUTE_PATHS.reports} element={<ReportsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
}
