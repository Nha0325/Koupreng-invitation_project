import { useEffect, useState } from "react";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { i18nService } from "../services/i18nService";

export function formatMessage(value, replacements = {}) {
    return Object.entries(replacements).reduce(
        (message, [key, replacement]) => message.replaceAll(`{${key}}`, String(replacement)),
        value
    );
}

export function useBackendMessages(namespace, fallbackMessages) {
    const lang = useLanguageStore((state) => state.lang);
    const fallback = fallbackMessages[lang] || fallbackMessages.km || {};
    const [messages, setMessages] = useState(fallback);

    useEffect(() => {
        let active = true;
        const nextFallback = fallbackMessages[lang] || fallbackMessages.km || {};
        setMessages(nextFallback);

        i18nService.messages(namespace)
            .then((response) => {
                if (!active) return;
                setMessages({
                    ...nextFallback,
                    ...(response?.messages || {}),
                });
            })
            .catch(() => {
                if (active) {
                    setMessages(nextFallback);
                }
            });

        return () => {
            active = false;
        };
    }, [fallbackMessages, lang, namespace]);

    return {
        lang,
        messages,
        text: (key, replacements) => formatMessage(messages[key] || fallback[key] || key, replacements),
    };
}
