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

const Login = () => {
  const emailId = useId();
  const passwordId = useId();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Identifier:", identifier, "Password:", password);
  };

  const socialButtons = useMemo(
    () => [
      {
        id: "telegram",
        label: "ចូលបានតាមរយៈ Telegram",
        icon: <IconComponentNode />,
      },
      {
        id: "google",
        label: "ចូលបានតាមរយៈ Google",
        icon: <Component2_1 />,
      },
      {
        id: "facebook",
        label: "ចូលបានតាមរយៈ Facebook",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
              fill="#1877F2"
            />
          </svg>
        ),
      },
      {
        id: "apple",
        label: "ចូលបានតាមរយៈ Apple",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.32 2.99-2.54 4zm-3.1-17.6c.06 2.06-1.52 3.72-3.44 3.56-.27-1.97 1.52-3.72 3.44-3.56z"
              fill="#000"
            />
          </svg>
        ),
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
            ចូលទៅកាន់គណនីរបស់អ្នក
          </h1>
          <p className="text-gray-600">
            ចូលទៅកាន់គណនីរបស់អ្នកប្រកបដោយសុវត្ថិភាព និងភាពងាយស្រួល។
          </p>
        </header>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Identifier */}
          <div>
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              លេខទូរស័ព្ទ ឬ អ៊ីមែល
            </label>
            <FormInput
              id={emailId}
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="សូមបញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor={passwordId}
                className="block text-sm font-medium text-gray-700"
              >
                លេខសម្ងាត់
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                ភ្លេចលេខសម្ងាត់?
              </a>
            </div>
            <div className="relative">
              <FormInput
                id={passwordId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            ចូល
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
                <div className="w-5 h-5">{button.icon}</div>
                <span>{button.label}</span>
              </button>
            ))}
          </div>
        </form>

        {/* Footer link */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            <span>មិនទាន់មានគណនីមែនទេ?</span>
            <a
              href="/register"
              className="ml-2 text-blue-500 hover:text-blue-600 font-medium"
            >
              ចុះឈ្មោះនៅទីនេះ
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

export default Login;
