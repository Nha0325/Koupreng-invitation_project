import { api } from "@/services/api/httpClient";
import { getStoredLang, unwrap } from "@/services/api/helpers";

export const i18nService = {
  messages: (namespace, lang = getStoredLang()) =>
    api
      .get(
        `/v1/i18n/messages?namespace=${encodeURIComponent(namespace)}&lang=${lang}`,
        { auth: false }
      )
      .then(unwrap),
};

export default i18nService;
