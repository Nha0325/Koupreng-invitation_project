import { useId, useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/remote/authService";
import "./AuthPage.css";

export default function ForgotPasswordPage() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email.trim());
      setMessage(response?.message || "If the email exists, reset instructions will be sent.");
    } catch (err) {
      setError(err.message || "Could not request a password reset. Please try again.");
    } finally {
      setLoading(false);
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
          <p className="auth-subtitle">Enter your email and we will send reset instructions if the account exists.</p>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success-text">{message}</p>}

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label htmlFor={emailId} className="auth-label">Email</label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset instructions"}
          </button>
        </form>

        <div className="auth-back">
          <Link to="/login" className="auth-back-btn">← Back to login</Link>
        </div>
      </div>
    </div>
  );
}
