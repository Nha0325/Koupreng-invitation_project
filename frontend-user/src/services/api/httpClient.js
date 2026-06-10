import { ApiError } from "./ApiError";
import { getAccessToken, isCookieAuthStorage } from "../storage/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getLang() {
    try {
        const v = localStorage.getItem("koupreng.lang") || localStorage.getItem("koupreng.locale");
        return v === "en" ? "en" : "km";
    } catch {
        return "km";
    }
}

async function request(path, { method = "GET", body, headers = {}, auth = true, credentials, ...rest } = {}) {
    const token = getAccessToken();
    const useCookieAuth = isCookieAuthStorage();
    const isFormData = body instanceof FormData;
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            ...(!isFormData ? { "Content-Type": "application/json" } : {}),
            "Accept-Language": getLang(),
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
