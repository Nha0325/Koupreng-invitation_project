import axios from 'axios';

/**
 * Storage key for the persisted JWT bearer token.
 *
 * Centralized so callers and the AuthContext stay in lockstep.
 */
export const TOKEN_STORAGE_KEY = 'koupreng.token';

/**
 * Window event dispatched whenever an authed request comes back with a 401.
 *
 * The AuthContext listens for this and forces a logout + redirect to /login.
 */
export const AUTH_EXPIRED_EVENT = 'auth:expired';

const DEFAULT_BASE_URL = 'http://localhost:8080/api';
const DEFAULT_TIMEOUT_MS = 15000;

const baseURL =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
    DEFAULT_BASE_URL;

/**
 * Single shared Axios instance for the SPA.
 *
 * - Uses bearer tokens, not cookies, so `withCredentials` stays false.
 * - Public invitation calls opt out of the Authorization header by setting
 *   `config.public = true` (see request interceptor below).
 */
const client = axios.create({
    baseURL,
    withCredentials: false,
    timeout: DEFAULT_TIMEOUT_MS,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    if (config && config.public === true) {
        return config;
    }

    let token = null;
    try {
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem(TOKEN_STORAGE_KEY);
        }
    } catch {
        // localStorage may be unavailable (SSR, locked-down browsers); fall through.
        token = null;
    }

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const sentAuthHeader = Boolean(error?.config?.headers?.Authorization);

        if (status === 401 && sentAuthHeader) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(TOKEN_STORAGE_KEY);
                }
            } catch {
                // ignore storage failures; we still want to dispatch the event.
            }

            try {
                if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
                }
            } catch {
                // dispatch failures are non-fatal; the rejection below still propagates.
            }
        }

        return Promise.reject(error);
    },
);

export default client;
