import { create } from "zustand";
import authService from "../features/auth/api/authApi";
import {
  clearStoredAuth,
  readStoredAuth,
  writeStoredAuth,
} from "../shared/storage/authStorage";

/**
 * useAuthStore — Zustand store for authentication state.
 * Pattern: create((set, get) => ({...})) per pmndrs/zustand docs.
 *
 * Reads initial state from the configured auth storage (koupreng.auth).
 * Components use this via the useAuth() hook for backward compatibility.
 */

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

const initialAuth = readStoredAuth();
if (initialAuth?.accessToken && isTokenExpired(initialAuth.accessToken)) {
  clearStoredAuth();
}

const validInitialAuth = initialAuth?.accessToken && !isTokenExpired(initialAuth.accessToken)
  ? initialAuth
  : null;

export const useAuthStore = create((set) => ({
  user: validInitialAuth?.user || null,
  accessToken: validInitialAuth?.accessToken || null,
  isAuthenticated: Boolean(validInitialAuth?.accessToken && validInitialAuth?.user),

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

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network/logout errors; clear the local session regardless.
    }
    clearStoredAuth();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
