const AUTH_STORAGE_KEY = "koupreng.auth";

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
        return parsed?.accessToken ? parsed : null;
    } catch {
        return null;
    }
}

export function writeStoredAuth(authData) {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

export function clearStoredAuth() {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAccessToken() {
    return readStoredAuth()?.accessToken || null;
}
