import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/auth/useAuth";
import authService from "../../shared/services/authService";

const GOOGLE_SCRIPT_ID = "google-identity-services-script";
const TELEGRAM_OIDC_ORIGIN = "https://oauth.telegram.org";
const TELEGRAM_LEGACY_SCRIPT_SRC = "https://telegram.org/js/telegram-widget.js?22";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const telegramClientId = import.meta.env.VITE_TELEGRAM_CLIENT_ID || "";
const telegramBotUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="white" />
      <path d="M17.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.07-.18c-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.2 3.45-.49.34-.94.5-1.35.49-.45-.01-1.32-.26-1.96-.47-.79-.26-1.42-.39-1.37-.83.03-.22.33-.44.91-.68 3.56-1.55 5.94-2.58 7.12-3.07 3.39-1.41 4.1-1.65 4.56-1.66.1 0 .32.02.46.12.12.09.15.22.16.32.01.07.02.16.02.24z" fill="#0088cc" />
    </svg>
  );
}

function loadScript(id, src, isReady = () => false) {
  const existingScript = document.getElementById(id);
  if (existingScript) {
    if (existingScript.dataset.status === "loaded" || isReady()) {
      return Promise.resolve(existingScript);
    }

    if (existingScript.dataset.status === "loading") {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener("load", () => resolve(existingScript), { once: true });
        existingScript.addEventListener("error", reject, { once: true });
      });
    }

    existingScript.remove();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.dataset.status = "loading";
    script.onload = () => {
      script.dataset.status = "loaded";
      resolve(script);
    };
    script.onerror = (event) => {
      script.dataset.status = "error";
      reject(event);
    };
    document.head.appendChild(script);
  });
}

function normalizeTelegramUser(user) {
  return {
    idToken: user.id_token,
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    photo_url: user.photo_url,
    auth_date: user.auth_date,
    hash: user.hash,
  };
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

function telegramAuthResult(data) {
  if (data?.error) {
    return { error: data.error };
  }

  if (!data?.result || typeof data.result !== "string") {
    return { error: "Telegram did not return a login token." };
  }

  return {
    id_token: data.result,
    user: decodeJwtPayload(data.result),
  };
}

function openTelegramPopup(clientId, callback) {
  const authUrl = new URL(`${TELEGRAM_OIDC_ORIGIN}/auth`);
  authUrl.searchParams.set("response_type", "post_message");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", window.location.origin + window.location.pathname);
  authUrl.searchParams.set("origin", window.location.origin);
  authUrl.searchParams.set("scope", "openid profile");

  const width = 550;
  const height = 650;
  const left = Math.max(0, (window.screen.width - width) / 2);
  const top = Math.max(0, (window.screen.height - height) / 2);
  const popup = window.open(
    authUrl.toString(),
    "telegram_oidc_login",
    `width=${width},height=${height},left=${left},top=${top},status=0,location=0,menubar=0,toolbar=0`,
  );

  if (!popup) {
    callback({ error: "Telegram popup was blocked." });
    return;
  }

  let finished = false;
  let closeTimer;

  const finish = (result) => {
    if (finished) {
      return;
    }
    finished = true;
    window.removeEventListener("message", handleMessage);
    window.clearTimeout(closeTimer);
    callback(result);
  };

  function handleMessage(event) {
    if (event.origin !== TELEGRAM_OIDC_ORIGIN || event.source !== popup) {
      return;
    }

    let data = event.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return;
      }
    }

    if (data?.event === "auth_result") {
      finish(telegramAuthResult(data));
    }
  }

  const checkClosed = () => {
    if (popup.closed) {
      finish({ error: "Telegram login popup was closed." });
      return;
    }
    closeTimer = window.setTimeout(checkClosed, 200);
  };

  window.addEventListener("message", handleMessage);
  popup.focus();
  checkClosed();
}

export default function SocialAuthButtons() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const telegramButtonRef = useRef(null);
  const telegramCallbackId = useId();
  const [error, setError] = useState("");
  const [busyProvider, setBusyProvider] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [telegramReady, setTelegramReady] = useState(false);

  const normalizedTelegramBot = telegramBotUsername.trim().replace(/^@/, "");
  const normalizedTelegramClientId = telegramClientId.trim();
  const hasTelegramClientId = /^\d+$/.test(normalizedTelegramClientId);

  const telegramCallbackName = useMemo(
    () => `kouprengTelegramAuth_${telegramCallbackId.replace(/\W/g, "_")}`,
    [telegramCallbackId],
  );

  const completeLogin = useCallback((authData) => {
    login(authData);
    navigate("/dashboard", { replace: true });
  }, [login, navigate]);

  const handleGoogleCredential = useCallback(async (response) => {
    if (!response?.credential) {
      setError("Google did not return a login token.");
      return;
    }

    setError("");
    setBusyProvider("google");
    try {
      completeLogin(await authService.loginWithGoogle(response.credential));
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setBusyProvider("");
    }
  }, [completeLogin]);

  const handleTelegramAuth = useCallback(async (telegramUser) => {
    setError("");
    setBusyProvider("telegram");
    try {
      completeLogin(await authService.loginWithTelegram(normalizeTelegramUser(telegramUser)));
    } catch (err) {
      setError(err.message || "Telegram login failed.");
    } finally {
      setBusyProvider("");
    }
  }, [completeLogin]);

  const handleTelegramOidcAuth = useCallback(async (response) => {
    if (!response || response.error) {
      setError(response?.error || "Telegram login failed.");
      return;
    }

    setError("");
    setBusyProvider("telegram");
    try {
      completeLogin(await authService.loginWithTelegram({ idToken: response.id_token }));
    } catch (err) {
      setError(err.message || "Telegram login failed.");
    } finally {
      setBusyProvider("");
    }
  }, [completeLogin]);

  useEffect(() => {
    if (!googleClientId) {
      return undefined;
    }

    let cancelled = false;
    const renderGoogleButton = () => {
      const host = googleButtonRef.current;
      if (!host || !window.google?.accounts?.id) {
        return;
      }

      host.innerHTML = "";
      window.google.accounts.id.renderButton(host, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: Math.max(220, Math.round(host.getBoundingClientRect().width || 292)),
      });
    };

    loadScript(GOOGLE_SCRIPT_ID, "https://accounts.google.com/gsi/client", () => Boolean(window.google?.accounts?.id))
      .then(() => {
        if (cancelled) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
          ux_mode: "popup",
        });
        renderGoogleButton();
        setGoogleReady(true);
        window.addEventListener("resize", renderGoogleButton);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Google login script could not load.");
        }
      });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", renderGoogleButton);
    };
  }, [handleGoogleCredential]);

  useEffect(() => {
    const host = telegramButtonRef.current;
    if (hasTelegramClientId || !normalizedTelegramBot || !host) {
      return undefined;
    }

    let cancelled = false;
    let renderTimer;
    window[telegramCallbackName] = handleTelegramAuth;

    const updateReady = () => {
      if (cancelled) {
        return;
      }

      setTelegramReady(Boolean(host.querySelector("iframe")));
      if (!host.querySelector("iframe")) {
        renderTimer = window.setTimeout(updateReady, 150);
      }
    };

    const script = document.createElement("script");
    script.src = TELEGRAM_LEGACY_SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-telegram-login", normalizedTelegramBot);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", `${telegramCallbackName}(user)`);
    script.onload = updateReady;
    script.onerror = () => {
      if (!cancelled) {
        setError("Telegram login widget could not load.");
      }
    };

    host.innerHTML = "";
    host.appendChild(script);

    return () => {
      cancelled = true;
      window.clearTimeout(renderTimer);
      delete window[telegramCallbackName];
      host.innerHTML = "";
    };
  }, [handleTelegramAuth, hasTelegramClientId, normalizedTelegramBot, telegramCallbackName]);

  return (
    <>
      <div className="auth-socials">
        {googleClientId ? (
          <div className={`auth-social-widget google${busyProvider === "google" ? " loading" : ""}`}>
            <div ref={googleButtonRef} className={`auth-social-provider-host${googleReady ? "" : " pending"}`} />
            <span className="auth-social-placeholder">
              <GoogleIcon />
              បន្តជាមួយ Google
            </span>
          </div>
        ) : (
          <button type="button" className="auth-social-btn google" disabled>
            <GoogleIcon />
            Google មិនទាន់កំណត់
          </button>
        )}

        {hasTelegramClientId ? (
          <button
            type="button"
            className="auth-social-btn telegram"
            disabled={busyProvider === "telegram"}
            onClick={() => openTelegramPopup(normalizedTelegramClientId, handleTelegramOidcAuth)}
          >
            <TelegramIcon />
            បន្តជាមួយ Telegram
          </button>
        ) : normalizedTelegramBot ? (
          <div className={`auth-social-widget telegram${busyProvider === "telegram" ? " loading" : ""}`}>
            <div ref={telegramButtonRef} className={`auth-social-provider-host telegram${telegramReady ? "" : " pending"}`} />
            <span className="auth-social-placeholder">
              <TelegramIcon />
              បន្តជាមួយ Telegram
            </span>
          </div>
        ) : (
          <button type="button" className="auth-social-btn telegram" disabled>
            <TelegramIcon />
            Telegram មិនទាន់កំណត់
          </button>
        )}
      </div>

      {busyProvider && <p className="auth-hint">Completing {busyProvider} login...</p>}
      {error && <p className="auth-error-msg">{error}</p>}
    </>
  );
}
