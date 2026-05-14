import { useEffect } from "react";
import Lenis from "lenis";

/**
 * useLenis
 * Initialize Lenis smooth scroll ហើយ cleanup ដោយស្វ័យប្រវត្តិ
 * នៅពេល component unmount
 */
export function useLenis() {
    useEffect(() => {
        const lenis = new Lenis({ autoRaf: true });
        return () => lenis.destroy();
    }, []);
}
