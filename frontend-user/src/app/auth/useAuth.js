import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Read the AuthContext value.
 *
 * Throws when called outside an `<AuthProvider>` to surface integration bugs
 * eagerly instead of returning an undefined object that would crash deeper in
 * the tree.
 *
 * @returns {{
 *   user: object | null,
 *   token: string | null,
 *   status: 'loading' | 'authenticated' | 'unauthenticated',
 *   login: (tokenOrPayload: string | { accessToken: string, user?: object }, user?: object) => void,
 *   logout: () => void,
 *   refresh: () => Promise<object>,
 * }}
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (ctx === null || ctx === undefined) {
        throw new Error(
            "useAuth must be used within an <AuthProvider>. " +
            "Wrap your component tree with <AuthProvider> from src/app/auth/AuthContext.jsx.",
        );
    }
    return ctx;
}

export default useAuth;
