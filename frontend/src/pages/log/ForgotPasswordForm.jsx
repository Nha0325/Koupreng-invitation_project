import { useId, useRef, useState } from "react";

// ឧទាហរណ៍ ៣ - Destructuring Props
const FormInput = ({
  id,
  name,
  type,
  autoComplete,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const defaultClassName =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className || defaultClassName}
    />
  );
};

// ── Step 1: Request reset ──
const StepRequest = ({ onNext }) => {
  const emailId = useId();
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identifier.trim()) onNext(identifier.trim());
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ភ្លេចពាក្យសម្ងាត់
          </h1>
          <p className="text-gray-600">
            បញ្ចូលអ៊ីមែល ឬ លេខទូរស័ព្ទ ដើម្បីទទួលលេខកូដផ្លាស់ប្ដូរ
          </p>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              អ៊ីមែល ឬ លេខទូរស័ព្ទ
            </label>
            <FormInput
              id={emailId}
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="បញ្ចូលអ៊ីមែល ឬ លេខទូរស័ព្ទ"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!identifier.trim()}
          >
            ផ្ញើលេខកូដផ្លាស់ប្ដូរ
          </button>
        </form>
        <div className="text-center">
          <span className="text-sm text-gray-600">ចូលទៅ</span>
          <a
            href="/login"
            className="ml-2 text-blue-500 hover:text-blue-600 font-medium text-sm"
          >
            ចូលគណនី
          </a>
        </div>
      </div>
    </main>
  );
};

// ── Step 2: OTP ──
const StepOtp = ({ identifier, onNext, onResend }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(120);
  const inputRefs = useRef([]);

  // countdown timer
  useState(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  });

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) onNext(code);
  };

  const filled = otp.join("").length === 6;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div aria-hidden="true" className="w-8 h-8 bg-blue-500 rounded" />
            <span className="text-2xl font-bold text-gray-900">Koupreng</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">បញ្ជាក់ OTP</h1>
          <p className="text-gray-600">
            បញ្ចូលលេខកូដបញ្ជាក់ដែលបានផ្ញើទៅ{" "}
            <strong className="font-semibold">{identifier}</strong>
          </p>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none transition ${
                  digit ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!filled}
          >
            បញ្ជាក់
          </button>
          <p className="text-center text-sm text-gray-600">
            មិនទទួលបានលេខកូដមែនទេ?{" "}
            {countdown > 0 ? (
              <span className="text-gray-500">
                ផ្ញើម្ដងទៀតក្នុង {countdown} វិនាទី
              </span>
            ) : (
              <button
                type="button"
                className="text-blue-500 hover:text-blue-600 font-medium"
                onClick={onResend}
              >
                ផ្ញើម្ដងទៀត
              </button>
            )}
          </p>
        </form>
      </div>
    </main>
  );
};

// ── Step 3: New password ──
const StepNewPassword = ({ onDone }) => {
  const passwordId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const match = password && confirm && password === confirm;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (match) onDone();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div aria-hidden="true" className="w-8 h-8 bg-blue-500 rounded" />
            <span className="text-2xl font-bold text-gray-900">Koupreng</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            កំណត់ពាក្យសម្ងាត់របស់អ្នក
          </h1>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor={passwordId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              លេខសម្ងាត់
            </label>
            <div className="relative">
              <FormInput
                id={passwordId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label="toggle password"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor={confirmId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              បញ្ជាក់ពាក្យសម្ងាត់
            </label>
            <div className="relative">
              <FormInput
                id={confirmId}
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label="toggle confirm"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!match}
          >
            កំណត់ពាក្យសម្ងាត់របស់អ្នក
          </button>
        </form>
      </div>
    </main>
  );
};

// ── Step 4: Success toast ──
const StepSuccess = () => (
  <div className="fixed top-4 right-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg">
    <span className="text-2xl font-bold">✓</span>
    <span className="font-medium">ការផ្លាស់ប្ដូរបានដោយជោគជ័យ</span>
  </div>
);

// ── Main controller ──
const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [done, setDone] = useState(false);

  if (done)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
        <StepSuccess />
        <a
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg transition text-center w-80"
        >
          ចូលគណនី
        </a>
      </div>
    );

  if (step === 1)
    return (
      <StepRequest
        onNext={(id) => {
          setIdentifier(id);
          setStep(2);
        }}
      />
    );
  if (step === 2)
    return (
      <StepOtp
        identifier={identifier}
        onNext={() => setStep(3)}
        onResend={() => console.log("resend")}
      />
    );
  if (step === 3) return <StepNewPassword onDone={() => setDone(true)} />;
};

export default ForgotPasswordForm;
