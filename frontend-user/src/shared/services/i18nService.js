import { api } from "../api/client";
import { getStoredLang, unwrap } from "../api/helpers";

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
