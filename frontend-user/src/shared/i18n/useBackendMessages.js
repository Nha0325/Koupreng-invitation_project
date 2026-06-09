import { useCallback, useEffect, useState } from "react";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { i18nService } from "../services/i18nService";

export function formatMessage(value, replacements = {}) {
  if (!value) return "";

  return Object.entries(replacements).reduce(
    (message, [key, replacement]) =>
      message.replaceAll(`{${key}}`, String(replacement)),
    value
  );
}

export function useBackendMessages(namespace) {
  const lang = useLanguageStore((state) => state.lang);

  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      try {
        setLoading(true);
        setError(null);

        const response = await i18nService.messages(namespace, lang);

        if (active) {
          setMessages(response?.messages || response || {});
        }
      } catch (err) {
        if (active) {
          setError(err);
          setMessages({});
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, [lang, namespace]);

  const text = useCallback(
    (key, replacements) => {
      const message = messages[key] || key;
      return formatMessage(message, replacements);
    },
    [messages]
  );

  return {
    lang,
    messages,
    loading,
    error,
    text,
  };
}
