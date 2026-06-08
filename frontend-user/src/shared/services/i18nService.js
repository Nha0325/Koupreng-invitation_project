import { api } from "../api/client";
import { unwrap, getStoredLang } from "../api/helpers";

export const i18nService = {
    messages: (namespace) =>
        api.get(`/v1/i18n/messages?namespace=${encodeURIComponent(namespace)}&lang=${getStoredLang()}`, { auth: false }).then(unwrap),
};

export default i18nService;
