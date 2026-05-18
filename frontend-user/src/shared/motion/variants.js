/**
 * កំណត់ចំណាំ: framer variants
 * ឯកសារ: src/shared/motion/variants.js
 * ចាស់: ./lib/motionVariants.js
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: "easeOut" },
};
