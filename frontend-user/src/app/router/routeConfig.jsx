import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { RequireAuth } from "./guards/RequireAuth";

// We'll map the exact paths needed, you may need to import layouts correctly
const HomePage = lazy(() => import("@/pages/marketing/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const HostDashboardPage = lazy(() => import("@/pages/host/DashboardPage"));
const PublicInvitationPage = lazy(() => import("@/pages/public/PublicInvitationPage"));

export const routes = [
  {
    path: "/",
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: "/auth",
    children: [
      { path: "login", element: <LoginPage /> },
    ],
  },
  {
    path: "/host",
    element: (
      <RequireAuth>
        <HostDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/i/:inviteToken",
    element: <PublicInvitationPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
