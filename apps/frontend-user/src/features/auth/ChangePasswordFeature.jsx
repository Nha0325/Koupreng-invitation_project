import { useId, useState } from "react";
import authService from "./api/authApi";

export default function ChangePasswordPage() {
  const oldId = useId();
  const newId = useId();
  const confirmId = useId();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const mismatch = confirm && newPassword !== confirm;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (mismatch) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const response = await authService.changePassword(oldPassword, newPassword);
      setMessage(response?.message || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setError(err.message || "Could not change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="dash-main">
      <section className="dash-panel" style={{ maxWidth: 560 }}>
        <div className="dash-section-head">
          <div>
            <h1>Change password</h1>
            <p>ប្តូរលេខសម្ងាត់គណនីរបស់អ្នក</p>
          </div>
        </div>

        {error && <div className="dash-alert is-error">{error}</div>}
        {message && <div className="dash-alert">{message}</div>}

        <form onSubmit={submit} className="dash-form">
          <label htmlFor={oldId}>
            Current password
            <input
              id={oldId}
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              required
            />
          </label>

          <label htmlFor={newId}>
            New password
            <input
              id={newId}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>

          <label htmlFor={confirmId}>
            Confirm new password
            <input
              id={confirmId}
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </label>

          {mismatch && <div className="dash-alert is-error">Passwords do not match.</div>}

          <button type="submit" className="dash-btn" disabled={saving || !!mismatch}>
            {saving ? "Saving..." : "Change password"}
          </button>
        </form>
      </section>
    </main>
  );
}
