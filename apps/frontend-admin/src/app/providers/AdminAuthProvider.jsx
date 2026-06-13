/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { readAuth, writeAuth, clearAuth } from "../../lib/authStorage";
import { authService } from "../../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => readAuth());

    const login = useCallback(async (identifier, password) => {
        const res = await authService.login(identifier, password);
        const role = res?.user?.role;
        if (role !== "ADMIN") {
            throw new Error("គណនីនេះមិនមែនជា Admin ទេ។ សូមប្រើគណនី Admin ដើម្បីចូល។");
        }
        const session = {
            accessToken: res.accessToken,
            tokenType: res.tokenType || "Bearer",
            expiresAt: res.expiresAt,
            user: res.user,
        };
        writeAuth(session);
        setAuth(session);
        return session;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // ignore network/logout errors; clear locally regardless
        }
        clearAuth();
        setAuth(null);
    }, []);

    const value = useMemo(
        () => ({
            user: auth?.user || null,
            accessToken: auth?.accessToken || null,
            isAuthenticated: Boolean(auth?.accessToken),
            login,
            logout,
        }),
        [auth, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
