import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const fadeUp = {
    hidden: { opacity: 0, y: 48, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

/**
 * ScrollReveal
 * Wrapper component ដែល animate children នៅពេល scroll ចូលមក
 *
 * @param {React.ReactNode} children
 * @param {string} className
 * @param {number} delay - delay ជា seconds (default: 0)
 * @param {object} variants - framer-motion variants (default: fadeUp)
 */
export function ScrollReveal({ children, className = "", delay = 0, variants = fadeUp }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
            transition={{ delay }}
        >
            {children}
        </motion.div>
    );
}
