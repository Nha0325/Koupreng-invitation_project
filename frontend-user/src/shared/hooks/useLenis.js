/**
 * កំណត់ចំណាំ: smooth scroll
 * ឯកសារ: src/shared/hooks/useLenis.js
 * ចាស់: ./hooks/useLenis.js
 */
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * useLenis — initialize Lenis smooth scroll and clean up on unmount.
 */
export function useLenis() {
    useEffect(() => {
        const lenis = new Lenis({ autoRaf: true });
        return () => lenis.destroy();
    }, []);
}
