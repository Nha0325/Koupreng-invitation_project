import { useCallback, useId, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToggle } from "../../shared/hooks/useToggle";
import { useAuth } from "../../app/auth/useAuth";
import authService from "../../shared/services/authService";
import SocialAuthButtons from "./SocialAuthButtons";
import { hasSocialAuthProvider } from "./socialAuthConfig";
import "./AuthPage.css";

function getNextPath(search) {
  try {
    const params = new URLSearchParams(search);
    const next = params.get("next");
    if (next && next.startsWith("/")) return next;
  } catch {
    // malformed query strings fall through to the default destination
  }
  return "/app/dashboard";
}

function apiMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

const Login = () => {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, togglePassword] = useToggle();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const nextPath = getNextPath(location.search);

  const completeLogin = useCallback(
    (session) => {
      login(session);
      navigate(nextPath, { replace: true });
    },
    [login, navigate, nextPath],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!email.trim() || !password) {
      setError("សូមបំពេញគ្រប់ប្រអប់");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      completeLogin(
        await authService.login({
          email: email.trim(),
          password,
        }),
      );
    } catch (err) {
      setError(apiMessage(err, "មិនអាចចូលគណនីបានទេ"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = useCallback(
    async (idToken) => {
      setError("");
      try {
        completeLogin(await authService.loginWithGoogle({ idToken }));
      } catch (err) {
        setError(apiMessage(err, "Google login failed"));
      }
    },
    [completeLogin],
  );

  const handleTelegramLogin = useCallback(
    async (telegramUser) => {
      setError("");
      try {
        completeLogin(await authService.loginWithTelegram(telegramUser));
      } catch (err) {
        setError(apiMessage(err, "Telegram login failed"));
      }
    },
    [completeLogin],
  );

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">ចូលគណនី</h1>
          <p className="auth-subtitle">ចូលទៅកាន់គណនី Koupreng របស់អ្នក</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor={emailId} className="auth-label">
              អ៊ីមែល
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor={passwordId} className="auth-label">
              លេខសម្ងាត់
            </label>
            <div className="auth-input-wrap">
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់"
                autoComplete="current-password"
                className="auth-input"
              />
              <button
                type="button"
                onClick={togglePassword}
                aria-label="Toggle password"
                className="auth-eye-btn"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="auth-error-msg" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "កំពុងចូលគណនី..." : "ចូលគណនី"}
          </button>
        </form>

        {hasSocialAuthProvider && (
          <>
            <p className="auth-divider">ឬ បន្តជាមួយ</p>
            <SocialAuthButtons
              onGoogleCredential={handleGoogleLogin}
              onTelegramUser={handleTelegramLogin}
            />
          </>
        )}

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-footer-link">
            ភ្លេចលេខសម្ងាត់?
          </Link>
        </div>

        <p className="auth-footer-text">
          មិនទាន់មានគណនីមែនទេ? <Link to="/register">ចុះឈ្មោះ</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
