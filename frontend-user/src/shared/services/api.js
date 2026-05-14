import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_STORAGE_KEY = "koupreng_access_token";
const USER_STORAGE_KEY = "koupreng_user";

const PUBLIC_AUTH_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/telegram",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
]);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const path = config.url?.split("?", 1)[0] || "";
  if (PUBLIC_AUTH_PATHS.has(path)) {
    return config;
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authStorage = {
  tokenKey: TOKEN_STORAGE_KEY,
  userKey: USER_STORAGE_KEY,
  getToken: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  getUser: () => {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  },
  saveSession: ({ accessToken, user }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: ({ email, password, fullName }) => api.post("/auth/register", { email, password, fullName }),
  loginWithGoogle: (idToken) => api.post("/auth/google", { idToken }),
  loginWithTelegram: (telegramUser) => api.post("/auth/telegram", telegramUser),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) => api.post("/auth/reset-password", { token, newPassword }),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resendVerificationEmail: (email) => api.post("/auth/resend-verification", { email }),
};

export const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (profile) => api.patch("/users/me", profile),
  changePassword: (currentPassword, newPassword) =>
    api.post("/users/me/change-password", { currentPassword, newPassword }),
};

export const guestService = {
  getGuests: () => api.get("/guests"),
  addGuest: (guest) => api.post("/guests", guest),
  updateGuest: (id, guest) => api.put(`/guests/${id}`, guest),
  deleteGuest: (id) => api.delete(`/guests/${id}`),
};

export const weddingService = {
  createWedding: (data) => api.post("/weddings", data),
  getWeddings: () => api.get("/weddings"),
  updateWedding: (id, data) => api.put(`/weddings/${id}`, data),
};

export default api;
