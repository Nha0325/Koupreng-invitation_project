import { Navigate, Route } from "react-router-dom";

export function adminRoutes() {
  return <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />;
}
