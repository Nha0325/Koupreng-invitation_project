/**
 * កំណត់ចំណាំ: hook theme
 * ឯកសារ: src/app/theme/useTheme.js
 * ចាស់: ./hooks/useTheme.js
 */
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
