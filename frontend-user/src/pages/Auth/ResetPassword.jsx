import { useId, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useToggle } from "../../shared/hooks/useToggle";
import { authService } from "../../shared/services/api";
import "./AuthPage.css";

const EyeIcon = ({ open }) => (
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
);

const ResetPassword = () => {
  const passwordId = useId();
  const confirmPasswordId = useId();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, togglePassword] = useToggle();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token || passwordMismatch) return;

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await authService.resetPassword(token, password);
      setMessage(data.message || "Password reset successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">លេខសម្ងាត់ថ្មី</h1>
          <p className="auth-subtitle">កំណត់លេខសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក</p>
        </div>

        {!token && <p className="auth-error-msg">Reset token is missing.</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor={passwordId} className="auth-label">លេខសម្ងាត់ថ្មី</label>
            <div className="auth-input-wrap">
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់ថ្មី"
                required
                className="auth-input"
              />
              <button type="button" onClick={togglePassword} className="auth-eye-btn" aria-label="Toggle password">
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor={confirmPasswordId} className="auth-label">បញ្ជាក់លេខសម្ងាត់</label>
            <input
              id={confirmPasswordId}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="បញ្ជាក់លេខសម្ងាត់"
              required
              className={`auth-input${passwordMismatch ? " error" : ""}`}
            />
            {passwordMismatch && <p className="auth-error-msg">លេខសម្ងាត់មិនត្រូវគ្នា</p>}
          </div>

          {message && <p className="auth-success-msg">{message}</p>}
          {error && <p className="auth-error-msg">{error}</p>}

          <button type="submit" className="auth-submit" disabled={!token || isSubmitting || !!passwordMismatch}>
            {isSubmitting ? "កំពុងកំណត់..." : "កំណត់លេខសម្ងាត់ឡើងវិញ"}
          </button>
        </form>

        <div className="auth-back">
          <Link to="/login" className="auth-back-btn">ត្រឡប់ទៅចូលគណនី</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
