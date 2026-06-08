import { useEffect, useState } from "react";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { i18nService } from "../services/i18nService";

export function formatMessage(value, replacements = {}) {
    return Object.entries(replacements).reduce(
        (message, [key, replacement]) => message.replaceAll(`{${key}}`, String(replacement)),
        value
    );
}

export function useBackendMessages(namespace, fallbackMessages = null) {
    const lang = useLanguageStore((state) => state.lang);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        let active = true;

        i18nService.messages(namespace)
            .then((response) => {
                if (active) {
                    setMessages(response?.messages || {});
                }
            })
            .catch(() => {
                if (active) {
                    setMessages({});
                }
            });

        return () => {
            active = false;
        };
    }, [lang, namespace]);

    return {
        lang,
        messages,
        text: (key, replacements) => formatMessage(
            messages[key] || fallbackMessages?.[lang]?.[key] || fallbackMessages?.en?.[key] || key,
            replacements
        ),
    };
}
