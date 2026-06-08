import { useLanguageStore } from "../../stores/useLanguageStore";
import translations from "./translations";

/**
 * Hook for UI translations.
 *
 * Usage:
 *   const t = useT();
 *   t.nav.login        → "ចូលប្រើ"  (km) or "Sign In" (en)
 *   t.auth.loginTitle  → "ចូលគណនី"  (km) or "Sign In" (en)
 */
export function useT() {
    const lang = useLanguageStore((s) => s.lang);
    return translations[lang] ?? translations.km;
}
