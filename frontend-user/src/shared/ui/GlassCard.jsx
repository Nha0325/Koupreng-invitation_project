/**
 * កំណត់ចំណាំ: ម៉ូឌុល
 * ឯកសារ: src/shared/ui/GlassCard.jsx
 */
import { motion } from "framer-motion";

/**
 * GlassCard — soft elevated card with hover lift.
 */
export function GlassCard({ children, className = "", ...props }) {
    return (
        <motion.div
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default GlassCard;
