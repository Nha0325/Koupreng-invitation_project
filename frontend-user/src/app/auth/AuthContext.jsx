import { createContext, useCallback, useState } from "react";
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from "../../shared/services/authStorage";
import { authService } from "../../shared/services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(() => readStoredAuth());
    const user = authState?.user || null;
    const isAuthenticated = Boolean(authState?.accessToken && user);

    const login = useCallback((authData) => {
        const nextState = {
            accessToken: authData.accessToken,
            tokenType: authData.tokenType || "Bearer",
            expiresAt: authData.expiresAt,
            user: authData.user,
        };
        writeStoredAuth(nextState);
        setAuthState(nextState);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // Clear local auth even if the token is already expired or the network is unavailable.
        } finally {
            clearStoredAuth();
            setAuthState(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
