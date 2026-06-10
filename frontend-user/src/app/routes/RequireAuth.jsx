import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../pages/auth/context/useAuth";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  const nextPath = `${location.pathname}${location.search}${location.hash}`;
  return (
    <Navigate
      to={`/login?next=${encodeURIComponent(nextPath)}`}
      replace
    />
  );
}
