import { api } from "../api/client";

function getLang() {
    try {
        const v = localStorage.getItem("koupreng.lang") || localStorage.getItem("koupreng.locale");
        return v === "en" ? "en" : "km";
    } catch {
        return "km";
    }
}

function unwrap(response) {
    return response?.data ?? response;
}

export const i18nService = {
    messages: (namespace) =>
        api.get(`/v1/i18n/messages?namespace=${encodeURIComponent(namespace)}&lang=${getLang()}`, { skipAuth: true }).then(unwrap),
};

export default i18nService;
