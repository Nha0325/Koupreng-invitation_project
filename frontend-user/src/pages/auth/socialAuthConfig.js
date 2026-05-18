function isConfigured(value) {
  return Boolean(
    value &&
      !value.startsWith("your-") &&
      !value.includes("replace_with"),
  );
}

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const telegramBotUsername =
  import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";
export const hasSocialAuthProvider =
  isConfigured(googleClientId) || isConfigured(telegramBotUsername);

export { isConfigured };
