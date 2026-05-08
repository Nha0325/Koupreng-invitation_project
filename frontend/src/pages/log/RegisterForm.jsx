import { useId, useMemo, useState } from "react";
import { Component2 } from "./Component2";
import { Component2_1 } from "./Component2_1";
import { IconComponentNode } from "./IconComponentNode";

// ឧទាហរណ៍ ៣ - Destructuring Props
// ដក props ចេញដោយផ្ទាល់ក្នុង parameter
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

const Register = () => {
  // Multiple States (Section 2)
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration:", {
      name,
      email,
      phone,
      password,
      confirmPassword,
      agreed,
    });
  };

  const socialButtons = useMemo(
    () => [
      {
        id: "telegram",
        label: "ចុះឈ្មោះបានតាមរយៈ Telegram",
        icon: <IconComponentNode />,
      },
      {
        id: "google",
        label: "ចុះឈ្មោះបានតាមរយៈ Google",
        icon: <Component2_1 />,
      },
    ],
    [],
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <header className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div aria-hidden="true" className="w-8 h-8 bg-blue-500 rounded" />
            <span className="text-2xl font-bold text-gray-900">Koupreng</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ចុះឈ្មោះគណនីថ្មី
          </h1>
          <p className="text-gray-600">
            ចុះឈ្មោះដើម្បីចូលប្រើប្រាស់គណនីរបស់អ្នកប្រកបដោយសុវត្ថិភាព
          </p>
        </header>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ឈ្មោះពេញ */}
          <div>
            <label
              htmlFor={nameId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ឈ្មោះពេញ
            </label>
            <FormInput
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="សូមបញ្ចូលឈ្មោះពេញ"
            />
          </div>

          {/* អ៊ីមែល */}
          <div>
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              អ៊ីមែល
            </label>
            <FormInput
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="សូមបញ្ចូលអ៊ីមែល"
            />
          </div>

          {/* លេខទូរស័ព្ទ */}
          <div>
            <label
              htmlFor={phoneId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              លេខទូរស័ព្ទ
            </label>
            <FormInput
              id={phoneId}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="សូមបញ្ចូលលេខទូរស័ព្ទ"
            />
          </div>

          {/* លេខសម្ងាត់ */}
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
                onChange={(event) => setPassword(event.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label={
                  showPassword ? "លាក់លេខសម្ងាត់" : "បង្ហាញលេខសម្ងាត់"
                }
                aria-pressed={showPassword}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Component2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* បញ្ជាក់លេខសម្ងាត់ */}
          <div>
            <label
              htmlFor={confirmPasswordId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              បញ្ជាក់លេខសម្ងាត់
            </label>
            <div className="relative">
              <FormInput
                id={confirmPasswordId}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់ម្ដងទៀត"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword ? "លាក់លេខសម្ងាត់" : "បង្ហាញលេខសម្ងាត់"
                }
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Component2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* យល់ព្រម */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="agreement" className="text-sm text-gray-700">
              ខ្ញុំយល់ព្រមលើលក្ខខណ្ឌ និងគោលការណ៍ភាពឯកជន
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!agreed}
          >
            ចុះឈ្មោះ
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500">ឬ</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social buttons */}
          <div className="space-y-2">
            {socialButtons.map((button) => (
              <button
                key={button.id}
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                {button.icon}
                <span>{button.label}</span>
              </button>
            ))}
          </div>
        </form>

        {/* Footer link */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            <span>មានគណនីរួចហើយ?</span>
            <a
              href="/login"
              className="ml-2 text-blue-500 hover:text-blue-600 font-medium"
            >
              ចូលទីនេះ
            </a>
          </div>
          <footer className="text-xs text-gray-500">
            កំណែលេខ 1.2.0 - production
          </footer>
        </div>
      </div>
    </main>
  );
};

export default Register;
