import { useId, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import authService from "../../services/remote/authService";
import "./AuthPage.css";

export default function ResetPasswordPage() {
  const tokenId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const mismatch = confirm && password !== confirm;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token.trim()) {
      setError("Reset token is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (mismatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(token.trim(), password);
      setMessage(response?.message || "Password reset successfully.");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(err.message || "Could not reset your password.");
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
          <h1 className="auth-title">កំណត់លេខសម្ងាត់ថ្មី</h1>
          <p className="auth-subtitle">Use the reset token from your email or development server log.</p>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success-text">{message}</p>}

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label htmlFor={tokenId} className="auth-label">Reset token</label>
            <input
              id={tokenId}
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste reset token"
              required
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor={passwordId} className="auth-label">New password</label>
            <input
              id={passwordId}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor={confirmId} className="auth-label">Confirm password</label>
            <input
              id={confirmId}
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Repeat new password"
              required
              className={`auth-input${mismatch ? " error" : ""}`}
            />
            {mismatch && <p className="auth-error-msg">Passwords do not match.</p>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading || !!mismatch}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <div className="auth-back">
          <Link to="/login" className="auth-back-btn">← Back to login</Link>
        </div>
      </div>
    </div>
  );
}
