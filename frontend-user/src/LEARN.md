# 📘 LEARN — `src/` (the heart of the app)

Everything React-related lives here. The 4 important files at the top are:

| File | What it does |
|---|---|
| `main.jsx` | Boots React — runs first |
| `App.jsx` | Wraps the app with providers (auth, theme, motion) and the router |
| `index.css` | Global styles, color tokens, fonts |
| `setupTests.js` | Configures Vitest before tests run |

Folders:

| Folder | Meaning |
|---|---|
| `app/` | App-wide setup (router, AuthContext, ThemeContext) |
| `assets/` | Images and fonts |
| `components/` | (empty for now — for tiny shared widgets) |
| `invitation/` | Public wedding invitation page (no login needed) |
| `pages/` | Full pages (LoginPage, HomePage, DashboardPage, ...) |
| `shared/` | Reusable building blocks: api, hooks, services, ui, layout, motion |

---

## 1. `main.jsx` — the first file

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Step by step:
1. Import React and ReactDOM.
2. Import the main `<App />` component.
3. Import global CSS so all pages get the styles.
4. Find `<div id="root">` in `index.html`.
5. Tell React to render `<App />` inside it.

**`<React.StrictMode>`** is a safety wrapper. In dev mode, it runs some code twice on purpose to help catch bugs. It does nothing in production.

---

## 2. `App.jsx` — the providers

```jsx
const App = () => {
  useLenis();                                      // smooth scroll
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user" ...>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
};
```

**Order matters!** Each provider wraps the next so children can read data from any provider above them.

- `MotionConfig` — Framer Motion settings (e.g. respect "reduced motion" in OS).
- `ThemeProvider` — light/dark theme.
- `AuthProvider` — current user + JWT token.
- `AppRouter` — picks the right page based on URL.

Two custom hooks at the top:
- `useLenis()` — turns on smooth scrolling.
- `usePrefersReducedMotion()` — reads OS setting "Reduce motion" so animations stop for users who need that.

---

## 3. `index.css` — design tokens

This file holds **CSS variables** like `--color-primary`, `--font-display`, `--radius-lg`. By using `var(--color-primary)` in components, you can change the brand color in one place and it updates everywhere.

It also defines a `.glass` utility class for the glassmorphism cards used across the app.

---

## 4. `setupTests.js` — tests setup

Loaded once before each test. It usually imports `@testing-library/jest-dom` so we can write things like `expect(button).toBeInTheDocument()`.

---

## 5. Mental model

Think of `src/` as a tree:

```
main.jsx
  └─ App.jsx (providers)
      └─ AppRouter (URL → page)
          └─ Shell (Header / Aside / nothing)
              └─ Page (Login / Home / Dashboard / Invitation)
                  └─ UI components (Button, GlassCard, ScrollReveal...)
                      └─ Services (login, fetch events, submit RSVP)
                          └─ API client (axios → backend Java)
```

Each level only knows the level below it. That is why React apps stay manageable.

Next folders to read: `app/LEARN.md` ▶
