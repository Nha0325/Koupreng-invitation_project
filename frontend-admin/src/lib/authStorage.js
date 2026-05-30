/**
 * Persists the admin auth session in localStorage.
 * Mirrors the shape used by the user app (koupreng.auth).
 */
const STORAGE_KEY = "koupreng.admin.auth";

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        const { exp } = JSON.parse(json);
        if (!exp) return false;
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}

export function readAuth() {
    if (!canUseStorage()) return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed?.accessToken && isTokenExpired(parsed.accessToken)) {
            window.localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return parsed?.accessToken ? parsed : null;
    } catch {
        return null;
    }
}

export function writeAuth(authData) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
}

export function clearAuth() {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken() {
    return readAuth()?.accessToken || null;
}
