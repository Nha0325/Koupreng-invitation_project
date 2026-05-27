import { useAuthStore, isTokenExpired } from "../../../stores/useAuthStore";

/**
 * useAuth — hook that returns { user, isAuthenticated, login, logout }.
 * Now backed by Zustand store instead of React Context.
 * Same API shape so all existing components work unchanged.
 */
export function useAuth() {
    const user = useAuthStore((s) => s.user);
    const accessToken = useAuthStore((s) => s.accessToken);
    const login = useAuthStore((s) => s.login);
    const logout = useAuthStore((s) => s.logout);

    const isExpired = isTokenExpired(accessToken);
    const isAuthenticated = Boolean(accessToken && user && !isExpired);

    return { user, isAuthenticated, login, logout };
}
