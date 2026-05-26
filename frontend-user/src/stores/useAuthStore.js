import { create } from "zustand";

/**
 * useAuthStore — Zustand store for authentication state.
 * Pattern: create((set, get) => ({...})) per pmndrs/zustand docs.
 *
 * Reads initial state from localStorage (koupreng.auth).
 * Components use this via the useAuth() hook for backward compatibility.
 */

const STORAGE_KEY = "koupreng.auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
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
  isAuthenticated: Boolean(initialAuth?.accessToken && initialAuth?.user),

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
