/**
 * កំណត់ចំណាំ: ម៉ូឌុល
 * ឯកសារ: src/shared/ui/ScrollReveal.jsx
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "../motion/variants";

/**
 * ScrollReveal — animates children into view on scroll.
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
