/**
 * Single HTTP client for the app. Wraps axios with JSON handling and base URL.
 * All remote `*Service` modules should go through this.
 */
import axios from "axios";
import { ApiError } from "./errors";
import { getAccessToken } from "../authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;
        const message = 
            data?.message || 
            data?.error || 
            (typeof data === "string" ? data : null) || 
            error.response?.statusText || 
            error.message ||
            "Request failed";

        throw new ApiError(message, status, data);
    }
);

export const api = {
    get: (path, opts) => apiClient.get(path, opts),
    post: (path, body, opts) => apiClient.post(path, body, opts),
    put: (path, body, opts) => apiClient.put(path, body, opts),
    patch: (path, body, opts) => apiClient.patch(path, body, opts),
    delete: (path, body, opts) => apiClient.delete(path, { ...opts, data: body }),
};

export default api;
