/* eslint-disable react-refresh/only-export-components */
import { Route } from "react-router-dom";

import AdminShell from "./layouts/AdminShell";
import AdminDashboardPage from "./pages/DashboardPage";
import AdminTemplatesPage from "./pages/TemplatesPage";
import AdminUsersPage from "./pages/UsersPage";

const AdminPlaceholder = ({ children }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">
    {children}
  </div>
);

export function adminRoutes() {
  return (
    <Route path="/admin" element={<AdminShell />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="templates" element={<AdminTemplatesPage />} />
      <Route path="subscriptions" element={<AdminPlaceholder>គ្រប់គ្រងកញ្ចប់សេវាកម្ម</AdminPlaceholder>} />
      <Route path="venues" element={<AdminPlaceholder>គ្រប់គ្រងព័ត៌មានសាលមង្គល</AdminPlaceholder>} />
      <Route path="transactions" element={<AdminPlaceholder>របាយការណ៍ថវិកាដែលទទួលបាន</AdminPlaceholder>} />
      <Route path="logs" element={<AdminPlaceholder>ប្រវត្តិប្រព័ន្ធ System Audit Logs</AdminPlaceholder>} />
    </Route>
  );
}
