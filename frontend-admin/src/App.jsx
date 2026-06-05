import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import AdminShell from "./components/AdminShell";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./features/dashboard/AdminDashboardPage";
import AdminNotificationsPage from "./features/notifications/AdminNotificationsPage";
import AdminInvitationDetailPage from "./features/admin/AdminInvitationDetailPage";
import AdminInvitationsPage from "./features/admin/AdminInvitationsPage";
import AdminReportsPage from "./features/admin/AdminReportsPage";
import AdminSystemLogsPage from "./features/admin/AdminSystemLogsPage";
import AdminTemplateEditPage from "./features/admin/AdminTemplateEditPage";
import AdminTemplatesPage from "./features/admin/AdminTemplatesPage";
import AdminUserDetailPage from "./features/admin/AdminUserDetailPage";
import AdminUsersPage from "./features/admin/AdminUsersPage";
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
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetailPage />} />
            <Route path="/admin/templates" element={<AdminTemplatesPage />} />
            <Route path="/admin/templates/:templateId" element={<AdminTemplateEditPage />} />
            <Route path="/admin/invitations" element={<AdminInvitationsPage />} />
            <Route path="/admin/invitations/:invitationId" element={<AdminInvitationDetailPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/system-logs" element={<AdminSystemLogsPage />} />
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/users" element={<Navigate to="/admin/users" replace />} />
            <Route path="/invitations" element={<Navigate to="/admin/invitations" replace />} />
            <Route path="/payments" element={<Navigate to="/admin/reports" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
