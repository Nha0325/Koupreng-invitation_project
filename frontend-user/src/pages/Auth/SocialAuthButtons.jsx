import { useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { authService } from "../../shared/services/api";

const GOOGLE_SCRIPT_ID = "google-identity-services-script";
const TELEGRAM_OIDC_ORIGIN = "https://oauth.telegram.org";
const TELEGRAM_LEGACY_SCRIPT_SRC = "https://telegram.org/js/telegram-widget.js?22";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const telegramClientId = import.meta.env.VITE_TELEGRAM_CLIENT_ID || "";
const telegramBotUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";
const GOOGLE_LABEL = "Continue with Google";
const TELEGRAM_LABEL = "Continue with Telegram";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#0088cc" />
    <path d="M17.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.07-.18c-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.2 3.45-.49.34-.94.5-1.35.49-.45-.01-1.32-.26-1.96-.47-.79-.26-1.42-.39-1.37-.83.03-.22.33-.44.91-.68 3.56-1.55 5.94-2.58 7.12-3.07 3.39-1.41 4.1-1.65 4.56-1.66.1 0 .32.02.46.12.12.09.15.22.16.32.01.07.02.16.02.24z" fill="white" />
  </svg>
);

const ProviderPlaceholder = ({ icon, label, detail }) => (
  <span className="auth-social-placeholder">
    <span className="auth-social-icon">{icon}</span>
    <span className="auth-social-copy">
      <span>{label}</span>
      {detail && <small>{detail}</small>}
    </span>
  </span>
);

function loadScript(id, src, isReady = () => false) {
  const existingScript = document.getElementById(id);
  if (existingScript) {
    if (existingScript.dataset.status === "loaded" || isReady()) {
      return Promise.resolve(existingScript);
    }

    if (existingScript.dataset.status === "error") {
      existingScript.remove();
    } else if (existingScript.dataset.status !== "loading") {
      existingScript.remove();
    } else {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener("load", () => resolve(existingScript), { once: true });
        existingScript.addEventListener("error", reject, { once: true });
      });
    }
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

function sessionDestination(session) {
  return session.user?.role === "ADMIN" ? "/dashboard" : "/events";
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
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    return JSON.parse(window.atob(paddedPayload));
  } catch {
    return null;
  }
}

function telegramAuthResult(data) {
  if (data?.error) {
    return { error: data.error };
  }

  const idToken = data?.result;
  if (!idToken || typeof idToken !== "string") {
    return { error: "Telegram did not return a login token." };
  }

  return {
    id_token: idToken,
    user: decodeJwtPayload(idToken),
  };
}

function telegramPopupFeatures() {
  const width = 550;
  const height = 650;
  const left = Math.max(0, (window.screen.width - width) / 2) + (window.screen.availLeft || 0);
  const top = Math.max(0, (window.screen.height - height) / 2) + (window.screen.availTop || 0);
  return `width=${width},height=${height},left=${left},top=${top},status=0,location=0,menubar=0,toolbar=0`;
}

function openTelegramPopup(clientId, callback) {
  const authUrl = new URL(`${TELEGRAM_OIDC_ORIGIN}/auth`);
  authUrl.searchParams.set("response_type", "post_message");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", window.location.origin + window.location.pathname);
  authUrl.searchParams.set("origin", window.location.origin);
  authUrl.searchParams.set("scope", "openid profile");

  let popup;
  let finished = false;
  let closeTimer;

  const finish = (result) => {
    if (finished) {
      return;
    }
    finished = true;
    window.removeEventListener("message", handleMessage);
    if (closeTimer) {
      window.clearTimeout(closeTimer);
    }
    callback(result);
  };

  const checkClosed = () => {
    if (!popup || popup.closed) {
      finish({ error: "popup_closed" });
      return;
    }
    closeTimer = window.setTimeout(checkClosed, 200);
  };

  function handleMessage(event) {
    if (event.origin !== TELEGRAM_OIDC_ORIGIN || (popup && event.source !== popup)) {
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

  window.addEventListener("message", handleMessage);
  popup = window.open(authUrl.toString(), "telegram_oidc_login", telegramPopupFeatures());

  if (!popup) {
    finish({ error: "popup_blocked" });
    return;
  }

  popup.focus();
  checkClosed();
}

function telegramDomainHint() {
  const { hostname, origin, pathname, port } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `Open http://lvh.me:${port || "5173"}/login and set BotFather /setdomain to lvh.me.`;
  }

  return `In BotFather, set /setdomain to ${hostname}. For Web Login, add ${origin} and ${origin}${pathname}.`;
}

function telegramErrorMessage(error) {
  if (error === "popup_blocked") {
    return "Telegram popup was blocked. Allow pop-ups for this site and try again.";
  }

  if (error === "popup_closed") {
    return "Telegram login popup was closed.";
  }

  if (/domain/i.test(error || "")) {
    return `Telegram says this domain is invalid. ${telegramDomainHint()}`;
  }

  return error || "Telegram login failed.";
}

function authRequestErrorMessage(error, fallback) {
  const responseMessage = error?.response?.data?.message;
  if (responseMessage) {
    return responseMessage;
  }

  const status = error?.response?.status;
  if (status) {
    return `${fallback} Server returned HTTP ${status}.`;
  }

  if (error?.message) {
    return `${fallback} ${error.message}.`;
  }

  return fallback;
}

const SocialAuthButtons = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const googleButtonRef = useRef(null);
  const telegramButtonRef = useRef(null);
  const telegramCallbackId = useId();
  const [error, setError] = useState("");
  const [busyProvider, setBusyProvider] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [telegramLegacyReady, setTelegramLegacyReady] = useState(false);

  const telegramCallbackName = useMemo(
    () => `kouprengTelegramAuth_${telegramCallbackId.replace(/\W/g, "_")}`,
    [telegramCallbackId],
  );

  const normalizedTelegramBot = useMemo(
    () => telegramBotUsername.trim().replace(/^@/, ""),
    [],
  );

  const normalizedTelegramClientId = useMemo(
    () => telegramClientId.trim(),
    [],
  );

  const hasTelegramClientId = /^\d+$/.test(normalizedTelegramClientId);

  const completeLogin = useCallback((session) => {
    login(session);
    navigate(sessionDestination(session), { replace: true });
  }, [login, navigate]);

  const handleGoogleCredential = useCallback(async (response) => {
    if (!response?.credential) {
      setError("Google did not return a login token.");
      return;
    }

    setError("");
    setBusyProvider("google");
    try {
      const { data } = await authService.loginWithGoogle(response.credential);
      completeLogin(data);
    } catch (err) {
      setError(authRequestErrorMessage(err, "Google login failed."));
    } finally {
      setBusyProvider("");
    }
  }, [completeLogin]);

  const handleGoogleClick = useCallback(() => {
    setError("");
    if (!googleReady || !window.google?.accounts?.id) {
      setError("Google login is still loading. Try again in a moment.");
    }
  }, [googleReady]);

  const renderGoogleButton = useCallback(() => {
    const host = googleButtonRef.current;
    if (!host || !window.google?.accounts?.id) {
      return;
    }

    const buttonWidth = Math.max(
      220,
      Math.min(400, Math.round(host.getBoundingClientRect().width || 360)),
    );

    host.innerHTML = "";
    window.google.accounts.id.renderButton(host, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: buttonWidth,
    });
  }, []);

  const handleTelegramAuth = useCallback(async (telegramUser) => {
    setError("");
    setBusyProvider("telegram");
    try {
      const { data } = await authService.loginWithTelegram(normalizeTelegramUser(telegramUser));
      completeLogin(data);
    } catch (err) {
      setError(authRequestErrorMessage(err, "Telegram login failed."));
    } finally {
      setBusyProvider("");
    }
  }, [completeLogin]);

  const handleTelegramOidcAuth = useCallback(async (response) => {
    if (!response || response.error) {
      setError(telegramErrorMessage(response?.error));
      return;
    }

    if (!response.id_token) {
      setError("Telegram did not return a login token.");
      return;
    }

    setError("");
    setBusyProvider("telegram");
    try {
      const { data } = await authService.loginWithTelegram({ idToken: response.id_token });
      completeLogin(data);
    } catch (err) {
      setError(authRequestErrorMessage(err, "Telegram login failed."));
    } finally {
      setBusyProvider("");
    }
  }, [completeLogin]);

  const handleTelegramClick = useCallback(() => {
    setError("");
    if (!hasTelegramClientId) {
      setError("Telegram login is not configured.");
      return;
    }

    openTelegramPopup(normalizedTelegramClientId, handleTelegramOidcAuth);
  }, [handleTelegramOidcAuth, hasTelegramClientId, normalizedTelegramClientId]);

  useEffect(() => {
    if (!googleClientId) {
      return undefined;
    }

    let cancelled = false;
    loadScript(GOOGLE_SCRIPT_ID, "https://accounts.google.com/gsi/client", () => Boolean(window.google?.accounts?.id))
      .then(() => {
        if (cancelled) {
          return;
        }

        if (!window.google?.accounts?.id) {
          setError("Google login script is unavailable.");
          setGoogleReady(false);
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
          ux_mode: "popup",
        });
        renderGoogleButton();
        setGoogleReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Google login script could not load.");
          setGoogleReady(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [handleGoogleCredential, renderGoogleButton]);

  useEffect(() => {
    if (!googleReady || !googleClientId) {
      return undefined;
    }

    window.addEventListener("resize", renderGoogleButton);

    return () => {
      window.removeEventListener("resize", renderGoogleButton);
    };
  }, [googleReady, renderGoogleButton]);

  useEffect(() => {
    const host = telegramButtonRef.current;
    if (hasTelegramClientId || !normalizedTelegramBot || !host) {
      return undefined;
    }

    let cancelled = false;
    let renderTimer;
    let unavailableTimer;
    let stopPolling = false;
    window[telegramCallbackName] = handleTelegramAuth;

    const updateTelegramReady = () => {
      if (cancelled || stopPolling) {
        return;
      }

      const isRendered = Boolean(host.querySelector("iframe"));
      setTelegramLegacyReady(isRendered);

      if (!isRendered) {
        renderTimer = window.setTimeout(updateTelegramReady, 150);
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
    script.onload = updateTelegramReady;
    script.onerror = () => {
      if (!cancelled) {
        setError("Telegram login widget could not load.");
      }
    };

    setTelegramLegacyReady(false);
    host.innerHTML = "";
    host.appendChild(script);
    unavailableTimer = window.setTimeout(() => {
      if (!cancelled && !host.querySelector("iframe")) {
        stopPolling = true;
        setError(`Telegram login is not available for this domain. ${telegramDomainHint()}`);
      }
    }, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(renderTimer);
      window.clearTimeout(unavailableTimer);
      delete window[telegramCallbackName];
      host.innerHTML = "";
    };
  }, [handleTelegramAuth, hasTelegramClientId, normalizedTelegramBot, telegramCallbackName]);

  return (
    <>
      <div className="auth-socials">
        {googleClientId ? (
          <div
            className={`auth-social-widget google google-provider-widget${busyProvider === "google" ? " loading" : ""}`}
            onClick={handleGoogleClick}
            aria-label="Continue with Google"
            aria-busy={busyProvider === "google"}
          >
            <div
              ref={googleButtonRef}
              className={`auth-social-provider-host${googleReady ? "" : " pending"}`}
            />
            <ProviderPlaceholder
              icon={<GoogleIcon />}
              label={GOOGLE_LABEL}
            />
          </div>
        ) : (
          <button type="button" className="auth-social-btn google" disabled>
            <span className="auth-social-icon"><GoogleIcon /></span>
            <span className="auth-social-copy">
              <span>{GOOGLE_LABEL}</span>
              <small>Not configured yet</small>
            </span>
          </button>
        )}

        {hasTelegramClientId ? (
          <button
            type="button"
            className={`auth-social-btn telegram${busyProvider === "telegram" ? " loading" : ""}`}
            onClick={handleTelegramClick}
            disabled={busyProvider === "telegram"}
            aria-label="Continue with Telegram"
            aria-busy={busyProvider === "telegram"}
          >
            <ProviderPlaceholder
              icon={<TelegramIcon />}
              label={TELEGRAM_LABEL}
            />
          </button>
        ) : normalizedTelegramBot ? (
          <div
            className={`auth-social-widget telegram telegram-provider-widget${busyProvider === "telegram" ? " loading" : ""}`}
            aria-label="Continue with Telegram"
            aria-busy={busyProvider === "telegram"}
          >
            <div
              ref={telegramButtonRef}
              className={`auth-social-provider-host telegram-provider-host${telegramLegacyReady ? "" : " pending"}`}
            />
            <ProviderPlaceholder
              icon={<TelegramIcon />}
              label={TELEGRAM_LABEL}
            />
          </div>
        ) : (
          <button type="button" className="auth-social-btn telegram" disabled>
            <span className="auth-social-icon"><TelegramIcon /></span>
            <span className="auth-social-copy">
              <span>{TELEGRAM_LABEL}</span>
              <small>Not configured yet</small>
            </span>
          </button>
        )}
      </div>

      {busyProvider && <p className="auth-success-msg">Completing {busyProvider} login...</p>}
      {error && <p className="auth-error-msg">{error}</p>}
    </>
  );
};

export default SocialAuthButtons;
