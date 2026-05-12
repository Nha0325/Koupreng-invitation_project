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
}
