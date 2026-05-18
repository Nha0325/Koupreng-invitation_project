/**
 * កំណត់ចំណាំ: ការពារទំព័រត្រូវ login
 * ឯកសារ: src/app/auth/RequireAuth.jsx
 * ចាស់: ./components/RequireAuth.jsx
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/auth/useAuth";

export default function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}
