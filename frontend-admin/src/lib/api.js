/**
 * Single HTTP client for the admin app.
 * Wraps fetch with JSON handling, base URL, and JWT bearer auth.
 */
import { getAccessToken, clearAuth } from "./authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

async function parseResponse(res) {
    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return res.json().catch(() => null);
    }

    const text = await res.text().catch(() => "");
    return text || null;
}

async function request(path, { method = "GET", body, headers = {}, auth = true, ...rest } = {}) {
    const token = getAccessToken();
    const isFormData = body instanceof FormData;

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            ...(!isFormData ? { "Content-Type": "application/json" } : {}),
            ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
        ...rest,
    });

    const data = await parseResponse(res);

    if (!res.ok) {
        // Auto-logout on auth failure so the UI can redirect to login.
        if (res.status === 401) {
            clearAuth();
        }
        const message =
            data?.message ||
            data?.error ||
            (typeof data === "string" ? data : "") ||
            res.statusText ||
            "Request failed";
        throw new ApiError(message, res.status, data);
    }

    return data;
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: "GET" }),
    post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
    put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
    patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
    delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export default api;
