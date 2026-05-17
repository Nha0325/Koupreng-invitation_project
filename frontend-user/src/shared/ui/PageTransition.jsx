import { motion } from "framer-motion";
import { pageTransition } from "../motion/variants";

/**
 * PageTransition — fades and slides children when the route changes.
 */
export function PageTransition({ children }) {
    return (
        <motion.div
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
        >
            {children}
        </motion.div>
    );
}
