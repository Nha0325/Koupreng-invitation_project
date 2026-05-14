# 📘 LEARN — `src/pages/auth/`

The 4 auth pages + their shared CSS.

| File | Route | Job |
|---|---|---|
| `LoginPage.jsx` | `/login` | Email / phone + password sign-in |
| `RegisterPage.jsx` | `/register` | Create new account |
| `ForgotPasswordPage.jsx` | `/forgot-password` | 4-step flow: email → OTP → new password → success |
| `ResetPasswordPage.jsx` | `/reset-password` | Placeholder (TODO) |
| `AuthPage.css` | — | Shared styles for all auth pages |

---

## 1. The form pattern (used in all auth pages)

```jsx
const [identifier, setIdentifier] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();
  // call authService.login(...) here later
  navigate("/events");
};

<form onSubmit={handleSubmit}>
  <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
  ...
</form>
```

Key ideas:
- **Controlled input**: `value` + `onChange` together. React owns the value.
- `e.preventDefault()` stops the page from reloading.
- `useId()` generates unique HTML `id`s so `<label htmlFor>` works for accessibility.

---

## 2. `useToggle` for password visibility

```jsx
const [showPassword, togglePassword] = useToggle();

<input type={showPassword ? "text" : "password"} ... />
<button type="button" onClick={togglePassword}>👁️</button>
```

The eye icon flips type between `text` and `password`. The `togglePassword` is just `() => setShowPassword(v => !v)` from `useToggle`.

---

## 3. `RegisterPage.jsx` — confirm password

Extra field: **confirm password**. Validation on the fly:

```jsx
const passwordMatch = confirmPassword && password !== confirmPassword;
```

If they don't match, show error class on the input + a small message:
```jsx
className={`auth-input${passwordMatch ? " error" : ""}`}
{passwordMatch && <p className="auth-error-msg">លេខសម្ងាត់មិនត្រូវគ្នា</p>}
```

---

## 4. `ForgotPasswordPage.jsx` — multi-step wizard

Four steps stored in a single state:

```js
const [step, setStep] = useState(1);
const [identifier, setIdentifier] = useState("");
```

Each step is its own sub-component:
- `<StepEmail />` — collect email/phone, then `setStep(2)`.
- `<StepOTP />` — 6-input OTP grid, then `setStep(3)`.
- `<StepNewPassword />` — new password + confirm, then `setStep(4)`.
- `<StepSuccess />` — final screen with a "Login" link.

### OTP cool details

```js
const inputs = useRef([]);  // store refs to each input
```

When the user types a digit, focus the next input automatically:
```js
if (val && i < 5) inputs.current[i + 1]?.focus();
```

Backspace on empty input goes back:
```js
if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
```

Pasting a 6-digit code splits it into all boxes:
```js
const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
if (text.length === 6) { setOtp(text.split("")); inputs.current[5]?.focus(); }
```

### Step indicator

The progress dots at the top use a simple boolean compared to the `step` state:

```js
className={`auth-step-dot ${step > s.num ? "done" : step === s.num ? "active" : "pending"}`}
```

---

## 5. `ResetPasswordPage.jsx`

Currently a placeholder:

```jsx
return <main><h1>Reset password</h1></main>;
```

It exists so the router can lazy-load `/reset-password` without crashing. Real implementation (call `authService.resetPassword`) is a TODO.

---

## TL;DR

- All auth pages use **controlled inputs** + `useId()` for accessibility.
- Password show/hide uses `useToggle`.
- Forgot Password is a **wizard** with `step` state + 4 sub-components.
- OTP inputs auto-focus next box and accept paste.
