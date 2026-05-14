import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "../motion/variants";

/**
 * ScrollReveal
 *
 * Animates children when they scroll into view. Re-animates every time the
 * element re-enters the viewport so the effect plays on scroll-down and
 * again on scroll-up. Pass `once` to opt back into single-shot behavior.
 *
 * The default variant is the shared `fadeUp` from `src/shared/motion/variants.js`
 * (added in task 2.3). Callers may override via the `variants` prop.
 *
 * NOTE: `delay` is baked into the variant transition to avoid the
 * framer-motion "transition prop overrides variants" gotcha.
 */
const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  variants,
  once = false,
  amount = 0.2,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px", amount });

  // Build variant with delay baked in so the outer transition prop isn't needed.
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
};

export default ScrollReveal;
