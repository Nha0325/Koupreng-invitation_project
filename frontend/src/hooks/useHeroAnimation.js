import { useEffect } from "react";
import { animate, stagger } from "animejs";

/**
 * useHeroAnimation
 * ដំណើរការ animation anime.js សម្រាប់ hero section
 * — float chips លេចឡើងពីក្រោម
 * — hero title & desc fade in
 */
export function useHeroAnimation() {
    useEffect(() => {
        animate(".float-chip", {
            translateY: [20, 0],
            opacity: [0, 1],
            delay: stagger(200, { start: 500 }),
            ease: "outElastic(1, .8)",
        });

        animate(".hero-title, .hero-desc", {
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 1000,
            delay: stagger(100),
            ease: "outExpo",
        });
    }, []);
}
