import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useToggle } from "../../hooks/useToggle";
import "./AuthPage.css";

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function Register() {
  const nameId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, togglePassword] = useToggle();
  const [showConfirm, toggleConfirm] = useToggle();

  const passwordMatch = confirmPassword && password !== confirmPassword;
  const handleSubmit = (e) => e.preventDefault();

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
          <h1 className="auth-title">បង្កើតគណនី</h1>
          <p className="auth-subtitle">ចាប់ផ្តើមរៀបចំពិធីមង្គលការជាមួយ Koupreng</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name */}
          <div className="auth-field">
            <label htmlFor={nameId} className="auth-label">ឈ្មោះ</label>
            <input
              id={nameId} type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
              className="auth-input"
            />
          </div>

          {/* Phone */}
          <div className="auth-field">
            <label htmlFor={phoneId} className="auth-label">លេខទូរស័ព្ទ</label>
            <input
              id={phoneId} type="tel" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0xx xxx xxx"
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor={passwordId} className="auth-label">លេខសម្ងាត់</label>
            <div className="auth-input-wrap">
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់"
                className="auth-input"
              />
              <button type="button" onClick={togglePassword} className="auth-eye-btn" aria-label="Toggle password">
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor={confirmPasswordId} className="auth-label">បញ្ជាក់លេខសម្ងាត់</label>
            <div className="auth-input-wrap">
              <input
                id={confirmPasswordId}
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="បញ្ជាក់លេខសម្ងាត់"
                className={`auth-input${passwordMatch ? " error" : ""}`}
              />
              <button type="button" onClick={toggleConfirm} className="auth-eye-btn" aria-label="Toggle confirm">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {passwordMatch && (
              <p className="auth-error-msg">លេខសម្ងាត់មិនត្រូវគ្នា</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit">
            ចុះឈ្មោះ
          </button>
        </form>

        {/* Divider */}
        <p className="auth-divider">ឬ បន្តជាមួយ</p>

        {/* Social buttons */}
        <div className="auth-socials">
          <button type="button" className="auth-social-btn google">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            បន្តជាមួយ Google
          </button>

          <button type="button" className="auth-social-btn telegram">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#0088cc" />
              <path d="M17.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.07-.18c-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.2 3.45-.49.34-.94.5-1.35.49-.45-.01-1.32-.26-1.96-.47-.79-.26-1.42-.39-1.37-.83.03-.22.33-.44.91-.68 3.56-1.55 5.94-2.58 7.12-3.07 3.39-1.41 4.1-1.65 4.56-1.66.1 0 .32.02.46.12.12.09.15.22.16.32.01.07.02.16.02.24z" fill="white" />
            </svg>
            បន្តជាមួយ Telegram
          </button>
        </div>

        {/* Login link */}
        <p className="auth-footer-text" style={{ marginTop: "14px" }}>
          មានគណនីរួចហើយ?{" "}
          <Link to="/login">ចូលគណនី</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
