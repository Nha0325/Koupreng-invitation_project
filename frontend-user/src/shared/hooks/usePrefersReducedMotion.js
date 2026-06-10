import { useEffect, useState } from "react";

/**
 * usePrefersReducedMotion — detects the user's OS-level reduced motion preference.
 */
export function usePrefersReducedMotion() {
    const [prefers, setPrefers] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = (e) => setPrefers(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return prefers;
}
