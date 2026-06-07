/**
 * Single HTTP client for the app. Wraps fetch with JSON handling and base URL.
 * All remote `*Service` modules should go through this.
 */
import { ApiError } from "./errors";
import { getAccessToken } from "../authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request(
    path,
    { method = "GET", body, headers = {}, ...rest } = {}) {
    const token = getAccessToken();
    
    const isFormData = body instanceof FormData;

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        credentials: "include",
        headers: {
            ...(!isFormData ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body !== undefined 
            ? isFormData 
                ? body 
                : JSON.stringify(body)
            : undefined,
        ...rest,
    });

    let data = null;
    let text = "";
    const contentType = res.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
        data = await res.json().catch(() => null);
    } else {
        text = await res.text().catch(() => "");
    }

    if (!res.ok) {
    const message = 
        data?.message ||
        data?.error ||
        text ||
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

    delete: (path, body, opts) => request(path, { ...opts, method: "DELETE", body }),
};

export default api;
