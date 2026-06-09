/**
 * Shared API helper utilities.
 * Import from here instead of duplicating in each service file.
 */

export function unwrap(response) {
    return response?.data ?? response;
}

export function toQuery(params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            search.set(key, value);
        }
    });
    const query = search.toString();
    return query ? `?${query}` : "";
}

export function getStoredLang() {
    try {
        const v = localStorage.getItem("koupreng.lang") || localStorage.getItem("koupreng.locale");
        return v === "en" ? "en" : "km";
    } catch {
        return "km";
    }
}
