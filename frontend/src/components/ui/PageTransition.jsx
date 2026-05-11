import { motion } from "framer-motion";

/**
 * PageTransition
 * Wrap page components ដើម្បីបន្ថែម fade + slide animation
 * នៅពេលប្តូរ route
 */
export function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}
