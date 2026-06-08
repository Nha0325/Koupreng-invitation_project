import { api } from "../api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const i18nService = {
    messages: (namespace) =>
        api.get(`/v1/i18n/messages?namespace=${encodeURIComponent(namespace)}`, { auth: false }).then(unwrap),
};

export default i18nService;
