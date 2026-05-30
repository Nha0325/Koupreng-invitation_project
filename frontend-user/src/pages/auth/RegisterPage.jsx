import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { useToggle } from "../../shared/hooks/useToggle";
import authService from "../../services/remote/authService";
import SocialAuthButtons from "./SocialAuthButtons";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const passwordMatch = confirmPassword && password !== confirmPassword;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !password) {
      setError("Please fill in your name, phone number, and password.");
      return;
    }
    if (passwordMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const authData = await authService.register({
        fullName: name.trim(),
        phone: phone.trim(),
        password,
      });
      login(authData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
          <h1 className="auth-title">បង្កើតគណនី</h1>
          <p className="auth-subtitle">ចាប់ផ្តើមរៀបចំពិធីមង្គលការជាមួយ Koupreng</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

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
              required
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
              required
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
                required
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
                required
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
          <button type="submit" className="auth-submit" disabled={loading || Boolean(passwordMatch)}>
            {loading ? "កំពុងចុះឈ្មោះ..." : "ចុះឈ្មោះ"}
          </button>
        </form>

        {/* Divider */}
        <p className="auth-divider">ឬ បន្តជាមួយ</p>

        {/* Social buttons */}
        <SocialAuthButtons />

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
