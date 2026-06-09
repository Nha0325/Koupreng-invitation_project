import { Route } from "react-router-dom";

import AuthShell from "../../layouts/AuthShell";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";

export function authRoutes() {
  return (
    <Route element={<AuthShell />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
    </Route>
  );
}
