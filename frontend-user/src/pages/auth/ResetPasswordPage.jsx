import { useId, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useToggle } from "../../shared/hooks/useToggle";
import authService from "../../shared/services/authService";
import "./AuthPage.css";

function apiMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

const EyeIcon = ({ open }) => {
  return open ? (
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
  );
};

const ResetPasswordPage = () => {
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, togglePassword] = useToggle();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const mismatch =
    confirmPassword.length > 0 && confirmPassword !== newPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!token) {
      setError("តំណកំណត់លេខសម្ងាត់មិនត្រឹមត្រូវ");
      return;
    }
    if (newPassword.length < 8) {
      setError("លេខសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួ");
      return;
    }
    if (mismatch) {
      setError("លេខសម្ងាត់មិនត្រូវគ្នា");
      return;
    }

    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const response = await authService.resetPassword({
        token,
        newPassword,
      });
      setMessage(response.message);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(apiMessage(err, "មិនអាចកំណត់លេខសម្ងាត់ឡើងវិញបានទេ"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">កំណត់លេខសម្ងាត់ឡើងវិញ</h1>
          <p className="auth-subtitle">
            បញ្ចូលលេខសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor={newPasswordId} className="auth-label">
              លេខសម្ងាត់ថ្មី
            </label>
            <div className="auth-input-wrap">
              <input
                id={newPasswordId}
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                className="auth-input"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="auth-eye-btn"
                aria-label="Toggle password"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor={confirmPasswordId} className="auth-label">
              បញ្ជាក់លេខសម្ងាត់
            </label>
            <input
              id={confirmPasswordId}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className={`auth-input${mismatch ? " error" : ""}`}
            />
          </div>

          {error && (
            <p className="auth-error-msg" role="alert">
              {error}
            </p>
          )}
          {message && <p className="auth-success-msg">{message}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកលេខសម្ងាត់ថ្មី"}
          </button>
        </form>

        <div className="auth-back">
          <Link to="/login" className="auth-back-btn">
            ← ត្រឡប់ទៅចូលគណនី
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
