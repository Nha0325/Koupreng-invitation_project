import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AdminAuthProvider";

export default function RequireAdmin({ children }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (isAuthenticated && user?.role === "ADMIN") {
        return children;
    }

    const nextPath = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(nextPath)}`} replace />;
}
