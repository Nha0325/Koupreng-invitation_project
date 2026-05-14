# 📘 LEARN — `src/app/theme/`

Handles **light / dark mode**. Same Context pattern as `auth/`, just simpler.

| File | Job |
|---|---|
| `ThemeContext.jsx` | `<ThemeProvider>` + the context |
| `useTheme.js` | Hook to read theme state |
| `*.test.jsx` | Tests |

---

## 1. `ThemeContext.jsx`

State:

```js
const [mode, setModeState] = useState(...) // 'light' or 'dark'
```

Two actions:

| Action | What it does |
|---|---|
| `toggle()` | Flip light ↔ dark |
| `setMode('light' \| 'dark')` | Set explicitly |

### Two side effects on every change:

```js
useEffect(() => {
  applyThemeAttribute(mode);  // <html data-theme="dark">
  writeStoredMode(mode);      // localStorage.koupreng.theme = 'dark'
}, [mode]);
```

So when `mode` changes:
1. The HTML element gets `data-theme="dark"` → CSS rules `[data-theme="dark"] { ... }` activate.
2. The choice is saved in `localStorage` so the next visit remembers it.

### Why is the default value `null` for the context?

```js
export const ThemeContext = createContext(null);
```

So `useTheme` can detect when used outside the provider and return a safe default (instead of crashing the public invitation page).

---

## 2. `useTheme.js`

```js
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === null || ctx === undefined) {
    return SAFE_DEFAULT; // { mode: 'light', toggle: noop, setMode: noop }
  }
  return ctx;
}
```

This is **different from `useAuth`**, which throws. Theme is non-critical — invitation pages must keep rendering even if theme provider is missing.

---

## 3. How to use in a component

```jsx
import { useTheme } from "../app/theme/useTheme";

function ThemeToggleBtn() {
  const { mode, toggle } = useTheme();
  return (
    <button onClick={toggle}>
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

That's it. The CSS variables in `index.css` do the visual work.

---

## TL;DR

- ThemeProvider keeps `mode` in memory + localStorage + on `<html data-theme>`.
- `useTheme()` reads it.
- Returns a safe default if not inside provider (so public pages don't crash).
