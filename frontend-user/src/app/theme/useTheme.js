import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

/**
 * Safe default returned when `useTheme()` is called outside a
 * `<ThemeProvider>`. Theme is intentionally non-critical: public invitation
 * pages must keep rendering even if the host app's provider is missing, so
 * this hook never throws.
 */
const SAFE_DEFAULT = Object.freeze({
    mode: "light",
    toggle: () => { },
    setMode: () => { },
});

/**
 * Read the ThemeContext value.
 *
 * Returns the safe default `{ mode: 'light', toggle: () => {}, setMode: () => {} }`
 * when used outside a `<ThemeProvider>` instead of throwing. This keeps the
 * public invitation routes robust: they can read `mode` for a themed loader
 * even when the host providers haven't mounted.
 *
 * @returns {{
 *   mode: 'light' | 'dark',
 *   toggle: () => void,
 *   setMode: (next: 'light' | 'dark') => void,
 * }}
 */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (ctx === null || ctx === undefined) {
        return SAFE_DEFAULT;
    }
    return ctx;
}

export default useTheme;
