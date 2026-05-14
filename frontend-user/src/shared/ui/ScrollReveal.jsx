import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/**
 * ScrollReveal
 * Animates children when they scroll into view.
 * NOTE: delay is baked into the variant transition to avoid
 * the framer-motion "transition prop overrides variants" bug.
 */
const ScrollReveal = ({ children, className = "", delay = 0, variants }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Build variant with delay baked in so the outer transition prop isn't needed
  const resolvedVariants = variants ?? {
    hidden: fadeUp.hidden,
    visible: {
      ...fadeUp.visible,
      transition: {
        ...fadeUp.visible.transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={resolvedVariants}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
