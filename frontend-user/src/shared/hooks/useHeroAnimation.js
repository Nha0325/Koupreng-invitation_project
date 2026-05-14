<<<<<<< HEAD
import { useEffect } from "react";
import { animate, utils } from "animejs";

const { stagger } = utils;

/**
 * useHeroAnimation
 * Runs animejs v4 entrance animations for the hero section.
 * — float chips rise up from below
 * — hero title & desc fade in
 */
export function useHeroAnimation() {
    useEffect(() => {
        // Chips entrance
        animate(".float-chip", {
            translateY: [24, 0],
            opacity: [0, 1],
            delay: stagger(180, { start: 400 }),
            duration: 900,
            ease: "outElastic(1, .7)",
        });

        // Hero text entrance
        animate(".hero-title, .hero-desc, .hero-badge", {
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 800,
            delay: stagger(80, { start: 100 }),
            ease: "outExpo",
        });
    }, []);
=======
/**
 * useHeroAnimation
 *
 * No-op placeholder. The original implementation depended on `animejs`,
 * which has been removed in task 1.3 of the wedding-invitation-experience
 * spec. The hero animation is being rebuilt with Framer Motion as part of
 * the wider refactor (see tasks 11.x), so this hook is intentionally inert
 * to keep the legacy `HomePage.jsx` (slated for replacement in task 1.4)
 * compiling and the build green in the meantime.
 */
export function useHeroAnimation() {
    // intentionally empty
>>>>>>> 60dfe88 (Debug all Frontend pages.)
}
