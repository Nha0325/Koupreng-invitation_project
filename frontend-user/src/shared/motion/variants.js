/**
 * Reusable framer-motion variants used across the app.
 */
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

export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeInOut" },
};
