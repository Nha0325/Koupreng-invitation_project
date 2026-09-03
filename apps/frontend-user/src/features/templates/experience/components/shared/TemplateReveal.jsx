import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

/**
 * TemplateReveal — light editorial fade-up on scroll (shared engine version of
 * RoyalReveal). Respects prefers-reduced-motion by rendering content statically.
 *
 * Props:
 *  - as: element/tag to render (default "div")
 *  - delay: seconds before animation starts
 *  - y: initial vertical offset (px)
 *  - className, children, ...rest pass through
 */
export function TemplateReveal({
    as = "div",
    delay = 0,
    y = 28,
    className = "",
    children,
    ...rest
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const reduced = usePrefersReducedMotion();

    const MotionTag = motion[as] || motion.div;

    if (reduced) {
        const Tag = as;
        return (
            <Tag ref={ref} className={className} {...rest}>
                {children}
            </Tag>
        );
    }

    return (
        <MotionTag
            ref={ref}
            className={className}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

export default TemplateReveal;
