import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth Service
export const authService = {
  // Login
  login: (email, password) => api.post("/auth/login", { email, password }),

  // Register
  register: (userData) => api.post("/auth/register", userData),

  // Logout
  logout: () => api.post("/auth/logout"),

  // Get current user
  getCurrentUser: () => api.get("/auth/me"),

  // Refresh token
  refreshToken: (refreshToken) =>
    api.post("/auth/refresh", { refreshToken }),

  // Forgot password
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  // Reset password
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),

  // Change password
  changePassword: (oldPassword, newPassword) =>
    api.post("/auth/change-password", { oldPassword, newPassword }),
};

export default authService;
