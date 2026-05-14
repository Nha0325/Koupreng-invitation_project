import { createContext, useCallback, useEffect, useState } from "react";

/**
 * Theme context for the host + marketing apps.
 *
 * Shape:
 *   {
 *     mode:    'light' | 'dark',
 *     toggle:  () => void,                       // flips between light <-> dark
 *     setMode: (next: 'light' | 'dark') => void, // explicit set with validation
 *   }
 *
 * The active mode is mirrored onto `<html data-theme="...">` so the
 * `:root[data-theme="dark"]` overrides defined in `index.css` (task 2.1) take
 * effect. The user's choice is persisted in `localStorage` under the key
 * `koupreng.theme`.
 *
 * Default value is `null` so consumers (`useTheme`) can detect when the hook
 * is used outside of a `<ThemeProvider>` and fall back to a safe shape rather
 * than throwing — theme is non-critical and a missing provider should not
 * break public invitation pages.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

// Centralized storage key — referenced by tests and any future migration code.
export const THEME_STORAGE_KEY = "koupreng.theme";

const VALID_MODES = ["light", "dark"];
const DEFAULT_MODE = "light";

function isValidMode(value) {
    return VALID_MODES.includes(value);
}

function readStoredMode() {
    try {
        if (typeof localStorage !== "undefined") {
            const raw = localStorage.getItem(THEME_STORAGE_KEY);
            if (isValidMode(raw)) return raw;
        }
    } catch {
        // localStorage may be unavailable (SSR, locked-down browsers).
    }
    return DEFAULT_MODE;
}

function writeStoredMode(mode) {
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(THEME_STORAGE_KEY, mode);
        }
    } catch {
        // ignore — theme will simply not persist across reloads
    }
}

function applyThemeAttribute(mode) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (root && typeof root.setAttribute === "function") {
        root.setAttribute("data-theme", mode);
    }
}

/**
 * `<ThemeProvider>` owns the active light/dark mode for the app.
 *
 * - On mount, reads the persisted choice from `localStorage.koupreng.theme`
 *   (defaults to `'light'` when absent or invalid) and applies the
 *   `data-theme` attribute on `<html>`.
 * - Every change to `mode` is persisted and re-applied to the DOM.
 * - `toggle()` flips between `'light'` and `'dark'`.
 * - `setMode(next)` validates the input and updates explicitly; invalid
 *   inputs are ignored so callers cannot put the app into an unknown state.
 */
export function ThemeProvider({ children }) {
    const [mode, setModeState] = useState(() => readStoredMode());

    // Reflect mode → DOM + storage on every change (including the initial mount).
    useEffect(() => {
        applyThemeAttribute(mode);
        writeStoredMode(mode);
    }, [mode]);

    const setMode = useCallback((next) => {
        if (!isValidMode(next)) return;
        setModeState(next);
    }, []);

    const toggle = useCallback(() => {
        setModeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const value = {
        mode,
        toggle,
        setMode,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export default ThemeProvider;
