const AUTH_STORAGE_KEY = "koupreng.auth";
const AUTH_STORAGE_MODE = (import.meta.env.VITE_AUTH_STORAGE || "sessionStorage").trim().toLowerCase();

export function isCookieAuthStorage() {
  return AUTH_STORAGE_MODE === "cookie";
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }
  if (AUTH_STORAGE_MODE === "localstorage") {
    return window.localStorage || null;
  }
  return window.sessionStorage || null;
}

export function readStoredAuth() {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (isCookieAuthStorage()) {
      if (!parsed?.user) {
        storage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }
      const sanitized = {
        storage: "cookie",
        expiresAt: parsed.expiresAt,
        user: parsed.user,
      };
      if (parsed.accessToken) {
        storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sanitized));
      }
      return sanitized;
    }
    return parsed?.accessToken ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredAuth(authData) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const storedAuth = isCookieAuthStorage()
    ? {
        storage: "cookie",
        expiresAt: authData.expiresAt,
        user: authData.user,
      }
    : authData;

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedAuth));
}

export function clearStoredAuth() {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_STORAGE_KEY);
}

export function getAccessToken() {
  if (isCookieAuthStorage()) {
    return null;
  }
  return readStoredAuth()?.accessToken || null;
}
