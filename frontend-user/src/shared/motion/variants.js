// Reusable Framer Motion variants for the wedding invitation experience.
// See `.kiro/specs/wedding-invitation-experience/design.md` → "Framer Motion Patterns".

export const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
    },
};

export const stagger = (gap = 0.08) => ({
    hidden: {},
    visible: { transition: { staggerChildren: gap } },
});

export const heroNames = {
    hidden: { opacity: 0, letterSpacing: "0.4em", y: 24 },
    visible: {
        opacity: 1,
        letterSpacing: "0.12em",
        y: 0,
        transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
    },
};

export const scrollCue = {
    animate: {
        y: [0, 10, 0],
        transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
    },
};
