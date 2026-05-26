import { ApiError } from "./errors";
import { getAccessToken, isCookieAuthStorage } from "../services/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request(path, { method = "GET", body, headers = {}, auth = true, credentials, ...rest } = {}) {
    const token = getAccessToken();
    const useCookieAuth = isCookieAuthStorage();
    const isFormData = body instanceof FormData;
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            ...(!isFormData ? { "Content-Type": "application/json" } : {}),
            ...(!useCookieAuth && auth && token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
        ...rest,
        credentials: useCookieAuth ? "include" : credentials,
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
    patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
    delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export default api;
