import axios from "axios";
import { ApiError } from "./ApiError";
import { getStoredLang } from "./helpers";
import { clearStoredAuth, getAccessToken, isCookieAuthStorage } from "../storage/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const useCookieAuth = isCookieAuthStorage();

    config.headers["Accept-Language"] = getStoredLang();

    const skipAuth = config.skipAuth === true;

    if (config.skipAuth !== undefined) {
      delete config.skipAuth;
    }

    if (!skipAuth && !useCookieAuth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (useCookieAuth) {
      config.withCredentials = true;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      clearStoredAuth();
      if (typeof window !== "undefined" && window.location && !window.location.pathname.startsWith("/login")) {
        const next = `${window.location.pathname}${window.location.search || ""}${window.location.hash || ""}`;
        window.location.href = `/login?next=${encodeURIComponent(next)}`;
      }
    }

    const message = data?.message || error.response?.statusText || error.message || "Request failed";

    throw new ApiError(message, status, data);
  },
);

export const api = {
  get: (path, opts) => apiClient.get(path, opts),
  post: (path, body, opts) => apiClient.post(path, body, opts),
  put: (path, body, opts) => apiClient.put(path, body, opts),
  patch: (path, body, opts) => apiClient.patch(path, body, opts),
  delete: (path, opts) => apiClient.delete(path, opts),
};

export { apiClient };
export default api;
