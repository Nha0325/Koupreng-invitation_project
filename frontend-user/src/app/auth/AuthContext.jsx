import { createContext, useCallback, useEffect, useState } from "react";
import {
    AUTH_EXPIRED_EVENT,
    TOKEN_STORAGE_KEY,
} from "../../shared/api/client";
import authService from "../../shared/services/authService";
import userService from "../../shared/services/userService";

/**
 * Authentication context.
 *
 * Shape:
 *   {
 *     user:    object | null,            // hydrated profile from /users/me
 *     token:   string | null,            // raw JWT bearer
 *     status:  'loading' | 'authenticated' | 'unauthenticated',
 *     login:   (token, user) => void  |  ({ accessToken, user }) => void,
 *     logout:  () => void,
 *     refresh: () => Promise<object>,    // re-fetches /users/me
 *   }
 *
 * Default value is `null` so that `useAuth()` can detect when the hook is used
 * outside of an `<AuthProvider>` and throw early instead of silently returning
 * an empty object.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function readStoredToken() {
    try {
        if (typeof localStorage !== "undefined") {
            return localStorage.getItem(TOKEN_STORAGE_KEY);
        }
    } catch {
        // localStorage may be unavailable (SSR, locked-down browsers).
    }
    return null;
}

function writeStoredToken(token) {
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        }
    } catch {
        // ignore — token will simply not persist across reloads
    }
}

function clearStoredToken() {
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    } catch {
        // ignore
    }
}

/**
 * `<AuthProvider>` owns the token + profile lifecycle for the host app.
 *
 * - On mount, hydrates from `localStorage.koupreng.token` via `userService.getMe()`.
 * - Listens for the `auth:expired` window event dispatched by the API client on
 *   401 responses and forces a logout.
 * - Exposes `login`, `logout`, and `refresh` for callers (auth pages, etc.).
 */
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => readStoredToken());
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(() =>
        readStoredToken() ? "loading" : "unauthenticated",
    );

    /**
     * Clears the persisted token, resets state, and fire-and-forgets the server
     * logout. Safe to call from anywhere (event listeners, UI handlers, etc.).
     */
    const logout = useCallback(() => {
        clearStoredToken();
        setToken(null);
        setUser(null);
        setStatus("unauthenticated");
        // Best-effort server-side invalidation. Failures are intentionally swallowed:
        // the local session is already gone, so the user experience continues.
        authService.logout().catch(() => { });
    }, []);

    /**
     * Persists a fresh token + user pair and flips the provider into the
     * `authenticated` state.
     *
     * Two call shapes are accepted to keep auth pages ergonomic:
     *
     *   login(token, user)
     *   login({ accessToken, user })
     */
    const login = useCallback((tokenOrPayload, maybeUser) => {
        let nextToken;
        let nextUser;

        if (
            tokenOrPayload !== null &&
            typeof tokenOrPayload === "object" &&
            maybeUser === undefined
        ) {
            nextToken = tokenOrPayload.accessToken ?? tokenOrPayload.token ?? null;
            nextUser = tokenOrPayload.user ?? null;
        } else {
            nextToken = tokenOrPayload ?? null;
            nextUser = maybeUser ?? null;
        }

        if (nextToken) {
            writeStoredToken(nextToken);
        }
        setToken(nextToken);
        setUser(nextUser);
        setStatus("authenticated");
    }, []);

    /**
     * Re-fetches the authenticated profile and updates `user`. Surfaces network
     * errors to the caller; auth-expired errors are still handled by the
     * `auth:expired` listener via the API client interceptor.
     */
    const refresh = useCallback(async () => {
        const profile = await userService.getMe();
        setUser(profile);
        setStatus("authenticated");
        return profile;
    }, []);

    // Hydrate the session on mount.
    useEffect(() => {
        const stored = readStoredToken();
        if (!stored) {
            // No token → nothing to hydrate. Status is already 'unauthenticated'.
            return undefined;
        }

        let cancelled = false;
        userService
            .getMe()
            .then((profile) => {
                if (cancelled) return;
                setUser(profile);
                setStatus("authenticated");
            })
            .catch(() => {
                if (cancelled) return;
                // Token is stale or rejected; drop it and force a re-login.
                clearStoredToken();
                setToken(null);
                setUser(null);
                setStatus("unauthenticated");
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Listen for 401-driven session expiration from the API client.
    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const handler = () => {
            logout();
        };

        window.addEventListener(AUTH_EXPIRED_EVENT, handler);
        return () => {
            window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
        };
    }, [logout]);

    const value = {
        user,
        token,
        status,
        login,
        logout,
        refresh,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
