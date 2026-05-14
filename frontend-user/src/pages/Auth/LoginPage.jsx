import { useContext, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useToggle } from "../../shared/hooks/useToggle";
import { authService } from "../../shared/services/api";
import SocialAuthButtons from "./SocialAuthButtons";
import "./AuthPage.css";

const Login = () => {
  const emailId = useId();
  const passwordId = useId();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, togglePassword] = useToggle();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await authService.login(identifier.trim(), password);
      login(data);
      navigate(data.user?.role === "ADMIN" ? "/dashboard" : "/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* Card */}
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">ចូលគណនី</h1>
          <p className="auth-subtitle">ចូលទៅកាន់គណនី Koupreng របស់អ្នក</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email / Phone */}
          <div className="auth-field">
            <label htmlFor={emailId} className="auth-label">
              អ៊ីមែល
            </label>
            <input
              id={emailId}
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="បញ្ចូលអ៊ីមែល"
              required
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor={passwordId} className="auth-label">
              លេខសម្ងាត់
            </label>
            <div className="auth-input-wrap">
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់"
                required
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

          {error && <p className="auth-error-msg">{error}</p>}

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "កំពុងចូល..." : "ចូលគណនី"}
          </button>
        </form>

        {/* Divider */}
        <p className="auth-divider">ឬ បន្តជាមួយ</p>

        <SocialAuthButtons />

        {/* Forgot password */}
        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-footer-link">
            ភ្លេចលេខសម្ងាត់?
          </Link>
        </div>

        {/* Register link */}
        <p className="auth-footer-text">
          មិនទាន់មានគណនីមែនទេ? <Link to="/register">ចុះឈ្មោះ</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
