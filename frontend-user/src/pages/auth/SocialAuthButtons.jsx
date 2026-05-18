import { useEffect, useRef, useState } from "react";
import {
  googleClientId,
  hasSocialAuthProvider,
  isConfigured,
  telegramBotUsername,
} from "./socialAuthConfig";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#2AABEE" />
    <path
      d="M17.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.07-.18c-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.2 3.45-.49.34-.94.5-1.35.49-.45-.01-1.32-.26-1.96-.47-.79-.26-1.42-.39-1.37-.83.03-.22.33-.44.91-.68 3.56-1.55 5.94-2.58 7.12-3.07 3.39-1.41 4.1-1.65 4.56-1.66.1 0 .32.02.46.12.12.09.15.22.16.32.01.07.02.16.02.24z"
      fill="white"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const ProviderShell = ({ icon, label, providerRef, tone }) => (
  <div className="auth-social-shell">
    <div className={`auth-social-visual ${tone}`} aria-hidden="true">
      <span className="auth-social-icon">{icon}</span>
      <span className="auth-social-copy">
        <strong>{label}</strong>
      </span>
      <span className="auth-social-arrow">
        <ArrowIcon />
      </span>
    </div>
    <div className="auth-social-provider-overlay" ref={providerRef} />
  </div>
);

const SocialAuthButtons = ({ onGoogleCredential, onTelegramUser }) => {
  const googleContainerRef = useRef(null);
  const telegramContainerRef = useRef(null);
  const googleHandlerRef = useRef(onGoogleCredential);
  const telegramHandlerRef = useRef(onTelegramUser);
  const [error, setError] = useState("");

  useEffect(() => {
    googleHandlerRef.current = onGoogleCredential;
  }, [onGoogleCredential]);

  useEffect(() => {
    telegramHandlerRef.current = onTelegramUser;
  }, [onTelegramUser]);

  useEffect(() => {
    if (!isConfigured(googleClientId) || !googleContainerRef.current) {
      return undefined;
    }

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleContainerRef.current) {
        return;
      }

      googleContainerRef.current.replaceChildren();
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => {
          if (credential) {
            googleHandlerRef.current?.(credential);
          }
        },
      });
      window.google.accounts.id.renderButton(googleContainerRef.current, {
        theme: "outline",
        size: "large",
        width: 292,
        text: "continue_with",
        shape: "rectangular",
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    let script = document.querySelector("script[data-google-identity]");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      document.head.appendChild(script);
    }

    const handleLoad = () => renderGoogleButton();
    const handleError = () => setError("Google login could not load");
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (!isConfigured(telegramBotUsername) || !telegramContainerRef.current) {
      return undefined;
    }

    const container = telegramContainerRef.current;
    const callbackName = `kouprengTelegramAuth_${Math.random()
      .toString(36)
      .slice(2)}`;
    window[callbackName] = (user) => {
      telegramHandlerRef.current?.(user);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", telegramBotUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", `${callbackName}(user)`);
    script.addEventListener("error", () =>
      setError("Telegram login could not load"),
    );

    container.replaceChildren(script);

    return () => {
      delete window[callbackName];
      container.replaceChildren();
    };
  }, []);

  if (!hasSocialAuthProvider) {
    return null;
  }

  return (
    <div className="auth-socials">
      {isConfigured(googleClientId) && (
        <ProviderShell
          icon={<GoogleIcon />}
          label="Continue with Google"
          providerRef={googleContainerRef}
          tone="google"
        />
      )}
      {isConfigured(telegramBotUsername) && (
        <ProviderShell
          icon={<TelegramIcon />}
          label="Continue with Telegram"
          providerRef={telegramContainerRef}
          tone="telegram"
        />
      )}
      {error && <p className="auth-error-msg">{error}</p>}
    </div>
  );
};

export default SocialAuthButtons;
