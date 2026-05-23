import { useCallback, useState } from "react";
import {
    clearStoredAuth,
    isCookieAuthStorage,
    readStoredAuth,
    writeStoredAuth,
} from "../../shared/services/authStorage";
import { authService } from "../../shared/services/authService";
import { AuthContext } from "./AuthContextObject";

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(() => readStoredAuth());
    const user = authState?.user || null;
    const isAuthenticated = isCookieAuthStorage()
        ? Boolean(user)
        : Boolean(authState?.accessToken && user);

    const login = useCallback((authData) => {
        const nextState = isCookieAuthStorage()
            ? {
                storage: "cookie",
                expiresAt: authData.expiresAt,
                user: authData.user,
            }
            : {
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
