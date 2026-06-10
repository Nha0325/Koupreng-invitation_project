import axios from "axios";
import { ApiError } from "./errors";
import { getAccessToken, isCookieAuthStorage } from "../services/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function getLang() {
    try {
        const v = localStorage.getItem("koupreng.lang") || localStorage.getItem("koupreng.locale");
        return v === "en" ? "en" : "km";
    } catch {
        return "km";
    }
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        const useCookieAuth = isCookieAuthStorage();
        
        config.headers["Accept-Language"] = getLang();
        
        if (!useCookieAuth && config.auth !== false && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (useCookieAuth) {
            config.withCredentials = true;
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
        const message = data?.message || error.response?.statusText || error.message || "Request failed";
        
        throw new ApiError(message, status, data);
    }
);

export const api = {
    get: (path, opts) => apiClient.get(path, opts),
    post: (path, body, opts) => apiClient.post(path, body, opts),
    put: (path, body, opts) => apiClient.put(path, body, opts),
    patch: (path, body, opts) => apiClient.patch(path, body, opts),
    delete: (path, opts) => apiClient.delete(path, opts),
};

export default api;
