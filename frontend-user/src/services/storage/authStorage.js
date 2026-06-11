const AUTH_STORAGE_KEY = "koupreng.auth";
const AUTH_STORAGE_MODE = (import.meta.env.VITE_AUTH_STORAGE || "localStorage").trim().toLowerCase();

export function isCookieAuthStorage() {
    return AUTH_STORAGE_MODE === "cookie";
}

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStoredAuth() {
    if (!canUseStorage()) {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        if (isCookieAuthStorage()) {
            if (!parsed?.user) {
                window.localStorage.removeItem(AUTH_STORAGE_KEY);
                return null;
            }
            const sanitized = {
                storage: "cookie",
                expiresAt: parsed.expiresAt,
                user: parsed.user,
            };
            if (parsed.accessToken) {
                window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sanitized));
            }
            return sanitized;
        }
        return parsed?.accessToken ? parsed : null;
    } catch {
        return null;
    }
}

export function writeStoredAuth(authData) {
    if (!canUseStorage()) {
        return;
    }

    const storedAuth = isCookieAuthStorage()
        ? {
            storage: "cookie",
            expiresAt: authData.expiresAt,
            user: authData.user,
        }
        : authData;

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedAuth));
}

export function clearStoredAuth() {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAccessToken() {
    if (isCookieAuthStorage()) {
        return null;
    }
    return readStoredAuth()?.accessToken || null;
}
