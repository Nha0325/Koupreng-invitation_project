import { useId, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useToggle } from "../../hooks/useToggle";
import "./AuthPage.css";

/* ── Eye icon ── */
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

/* ── Step 1 — Email/Phone ── */
function StepEmail({ onNext }) {
  const emailId = useId();
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identifier.trim()) onNext(identifier.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label htmlFor={emailId} className="auth-label">
          លេខទូរស័ព្ទ ឬ អ៊ីមែល
        </label>
        <input
          id={emailId}
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="បញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល"
          required
          className="auth-input"
        />
        <p className="auth-hint">យើងនឹងផ្ញើ OTP ៦ ខ្ទង់ទៅកាន់អ្នក</p>
      </div>
      <button type="submit" className="auth-submit">
        ផ្ញើ OTP
      </button>
    </form>
  );
}

/* ── Step 2 — OTP ── */
function StepOTP({ identifier, onNext, onResend }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) { setOtp(text.split("")); inputs.current[5]?.focus(); }
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) onNext(code);
  };

  const filled = otp.every((d) => d !== "");

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <p className="auth-otp-hint">
          OTP បានផ្ញើទៅ <span>{identifier}</span>
        </p>
        <div className="auth-otp-row" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`auth-otp-box${digit ? " filled" : ""}`}
            />
          ))}
        </div>
        <p className="auth-resend">
          មិនទទួលបាន OTP?{" "}
          <button type="button" onClick={onResend}>ផ្ញើម្តងទៀត</button>
        </p>
      </div>
      <button type="submit" disabled={!filled} className="auth-submit">
        បញ្ជាក់ OTP
      </button>
    </form>
  );
}

/* ── Step 3 — New Password ── */
function StepNewPassword({ onDone }) {
  const newPassId = useId();
  const confirmPassId = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, togglePass] = useToggle();

  const mismatch = confirm && password !== confirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mismatch && password) onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label htmlFor={newPassId} className="auth-label">លេខសម្ងាត់ថ្មី</label>
        <div className="auth-input-wrap">
          <input
            id={newPassId}
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="បញ្ចូលលេខសម្ងាត់ថ្មី"
            required
            className="auth-input"
          />
          <button type="button" onClick={togglePass} className="auth-eye-btn" aria-label="Toggle password">
            <EyeIcon open={showPass} />
          </button>
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor={confirmPassId} className="auth-label">បញ្ជាក់លេខសម្ងាត់</label>
        <input
          id={confirmPassId}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="បញ្ជាក់លេខសម្ងាត់"
          required
          className={`auth-input${mismatch ? " error" : ""}`}
        />
        {mismatch && <p className="auth-error-msg">លេខសម្ងាត់មិនត្រូវគ្នា</p>}
      </div>

      <button
        type="submit"
        disabled={!!mismatch || !password || !confirm}
        className="auth-submit"
      >
        កំណត់លេខសម្ងាត់ឡើងវិញ
      </button>
    </form>
  );
}

/* ── Step 4 — Success ── */
function StepSuccess() {
  return (
    <div className="auth-success">
      <div className="auth-success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2>ជោគជ័យ!</h2>
        <p>លេខសម្ងាត់ត្រូវបានកំណត់ឡើងវិញដោយជោគជ័យ</p>
      </div>
      <Link to="/login" className="auth-submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", marginTop: "4px" }}>
        ចូលគណនី
      </Link>
    </div>
  );
}

/* ── Step config ── */
const STEPS = [
  { num: 1, label: "អ៊ីមែល" },
  { num: 2, label: "OTP" },
  { num: 3, label: "លេខសម្ងាត់" },
];

const STEP_META = {
  1: { title: "ភ្លេចលេខសម្ងាត់", sub: "បញ្ចូលអ៊ីមែល ឬ លេខទូរស័ព្ទ ដើម្បីទទួល OTP" },
  2: { title: "បញ្ចូល OTP", sub: "OTP ៦ ខ្ទង់ត្រូវបានផ្ញើទៅអ្នក" },
  3: { title: "លេខសម្ងាត់ថ្មី", sub: "កំណត់លេខសម្ងាត់ថ្មីរបស់អ្នក" },
  4: { title: "រួចរាល់", sub: "" },
};

/* ── Main ── */
function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");

  const meta = STEP_META[step];

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
          <h1 className="auth-title">{meta.title}</h1>
          {meta.sub && <p className="auth-subtitle">{meta.sub}</p>}
        </div>

        {/* Step indicator */}
        {step <= 3 && (
          <div className="auth-steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className="auth-step-row">
                <div className={`auth-step-dot ${step > s.num ? "done" : step === s.num ? "active" : "pending"}`}>
                  {step > s.num ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`auth-step-line ${step > s.num ? "done" : "pending"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step content */}
        {step === 1 && <StepEmail onNext={(id) => { setIdentifier(id); setStep(2); }} />}
        {step === 2 && <StepOTP identifier={identifier} onNext={() => setStep(3)} onResend={() => { }} />}
        {step === 3 && <StepNewPassword onDone={() => setStep(4)} />}
        {step === 4 && <StepSuccess />}

        {/* Back */}
        {step < 4 && (
          <div className="auth-back">
            {step === 1 ? (
              <Link to="/login" className="auth-back-btn">← ត្រឡប់ទៅចូលគណនី</Link>
            ) : (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="auth-back-btn">
                ← ត្រឡប់ក្រោយ
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
