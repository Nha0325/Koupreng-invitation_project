import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "../shared/AdminContext";
import AdminGuard from "../admin/components/AdminGuard";
import Login from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard";
import Invitations from "../admin/pages/Invitations";
import Users from "../admin/pages/Users";
import Templates from "../admin/pages/Templates";
import Settings from "../admin/pages/Settings";
import EventEditor from "../admin/pages/EventEditor";

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AdminGuard>
                <Navigate to="/admin/dashboard" replace />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminGuard>
                <Dashboard />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/invitations"
            element={
              <AdminGuard>
                <Invitations />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminGuard>
                <Users />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/templates"
            element={
              <AdminGuard>
                <Templates />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminGuard>
                <Settings />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/events/:id/edit"
            element={
              <AdminGuard>
                <EventEditor />
              </AdminGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
