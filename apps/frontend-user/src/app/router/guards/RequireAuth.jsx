import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth(); // Assume hook exists
  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  const nextPath = `${location.pathname}${location.search}${location.hash}`;
  return (
    <Navigate
      to={`/auth/login?next=${encodeURIComponent(nextPath)}`}
      replace
    />
  );
}
