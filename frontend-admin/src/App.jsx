import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import AdminShell from "./components/AdminShell";
import LoginPage from "./pages/LoginPage";

// Modern Admin Pages from features/admin/...
import DashboardPage from "./features/admin/AdminDashboardPage";
import UsersPage from "./features/admin/AdminUsersPage";
import UserDetailPage from "./features/admin/AdminUserDetailPage";
import TemplatesPage from "./features/admin/AdminTemplatesPage";
import TemplateEditPage from "./features/admin/AdminTemplateEditPage";
import InvitationsPage from "./features/admin/AdminInvitationsPage";
import InvitationDetailPage from "./features/admin/AdminInvitationDetailPage";
import PaymentsPage from "./features/admin/AdminPaymentsPage";
import PackagesPage from "./features/admin/AdminPackagesPage";
import SystemLogsPage from "./features/admin/AdminSystemLogsPage";
import ReportsPage from "./features/admin/AdminReportsPage";

// Legacy fallback page kept for events reference
import EventsPage from "./pages/EventsPage";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AdminShell />
              </RequireAuth>
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
    </AuthProvider>
  );
}
