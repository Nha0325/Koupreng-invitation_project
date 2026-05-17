/**
 * Single HTTP client for the app. Wraps fetch with JSON handling and base URL.
 * All `*Service` modules in shared/services/ should go through this.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

import { ApiError } from "./errors";

async function request(path, { method = "GET", body, headers = {}, ...rest } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...rest,
    });

    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await res.json().catch(() => null);
    }

    if (!res.ok) {
        throw new ApiError(data?.message || res.statusText, res.status, data);
    }
    return data;
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: "GET" }),
    post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
    put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
    delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export default api;
