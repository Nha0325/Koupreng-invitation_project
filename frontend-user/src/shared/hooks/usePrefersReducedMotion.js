import { useEffect, useState } from "react";

/**
 * Reads the current value of the `prefers-reduced-motion: reduce` media
 * query without throwing in environments where `window.matchMedia` is
 * unavailable (e.g. SSR, very old browsers, jsdom without polyfills).
 */
function getInitialPrefersReducedMotion() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * usePrefersReducedMotion
 *
 * Subscribes to the `prefers-reduced-motion: reduce` media query and returns
 * a boolean that flips whenever the OS-level setting changes. Used by the
 * root `<MotionConfig>` so Framer Motion (and any consumer) can short-circuit
 * entrance/transition animations to zero duration when the user requests
 * reduced motion.
 *
 * Implementation notes:
 *   - Uses a lazy `useState` initializer to read the initial value once,
 *     avoiding a synchronous `setState` inside `useEffect`.
 *   - Subscribes via `MediaQueryList.addEventListener('change', handler)`
 *     and removes the listener on unmount to avoid leaks across HMR / route
 *     changes.
 *   - Falls back to `false` (no reduction) when `window.matchMedia` is
 *     unavailable so the calling tree always renders.
 *
 * See: design.md → "Correctness Properties → Accessibility (reduced motion)"
 *      design.md → "Error Scenario 6"
 *
 * @returns {boolean} true when the user prefers reduced motion.
 */
export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(
        getInitialPrefersReducedMotion
    );

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return undefined;
        }

        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

        const handleChange = (event) => {
            setPrefersReducedMotion(event.matches);
        };

        mql.addEventListener("change", handleChange);
        return () => {
            mql.removeEventListener("change", handleChange);
        };
    }, []);

    return prefersReducedMotion;
}

export default usePrefersReducedMotion;
