import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function RedirectIfAuth({ children }) {
  const { isAuthenticated } = useAuth(); // Assume hook exists

  if (isAuthenticated) {
    return <Navigate to="/host" replace />;
  }

  return children;
}
