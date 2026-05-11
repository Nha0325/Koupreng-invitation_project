import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AnimatedButton = ({ to, children, className = "", ...props }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        to={to}
        className={`inline-block px-6 py-3 bg-primary-color text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors ${className}`}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
};

export { AnimatedButton };