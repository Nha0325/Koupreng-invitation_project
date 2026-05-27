import { create } from "zustand";

/**
 * useAuthStore — Zustand store for authentication state.
 * Pattern: create((set, get) => ({...})) per pmndrs/zustand docs.
 *
 * Reads initial state from localStorage (koupreng.auth).
 * Components use this via the useAuth() hook for backward compatibility.
 */

const STORAGE_KEY = "koupreng.auth";

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.accessToken && isTokenExpired(parsed.accessToken)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredAuth(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

const initialAuth = readStoredAuth();

export const useAuthStore = create((set) => ({
  user: initialAuth?.user || null,
  accessToken: initialAuth?.accessToken || null,
  isAuthenticated: Boolean(initialAuth?.accessToken && initialAuth?.user && !isTokenExpired(initialAuth?.accessToken)),

  login: (authData) => {
    const nextState = {
      accessToken: authData.accessToken,
      tokenType: authData.tokenType || "Bearer",
      expiresAt: authData.expiresAt,
      user: authData.user,
    };
    writeStoredAuth(nextState);
    set({
      user: authData.user,
      accessToken: authData.accessToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    clearStoredAuth();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
