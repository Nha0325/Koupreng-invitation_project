import { useId, useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../shared/services/authService";
import "./AuthPage.css";

function apiMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

const ForgotPasswordPage = () => {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!email.trim()) {
      setError("សូមបញ្ចូលអ៊ីមែល");
      return;
    }

    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const response = await authService.forgotPassword({
        email: email.trim(),
      });
      setMessage(response.message);
    } catch (err) {
      setError(apiMessage(err, "មិនអាចផ្ញើតំណកំណត់លេខសម្ងាត់បានទេ"));
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
          <h1 className="auth-title">ភ្លេចលេខសម្ងាត់</h1>
          <p className="auth-subtitle">
            បញ្ចូលអ៊ីមែល ដើម្បីទទួលតំណកំណត់លេខសម្ងាត់ឡើងវិញ
          </p>
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

          {error && (
            <p className="auth-error-msg" role="alert">
              {error}
            </p>
          )}
          {message && <p className="auth-success-msg">{message}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "កំពុងផ្ញើ..." : "ផ្ញើតំណកំណត់លេខសម្ងាត់"}
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

export default ForgotPasswordPage;
