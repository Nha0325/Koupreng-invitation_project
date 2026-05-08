import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const AnimatedButton = ({ children, to, className = '', ...props }) => {
  const Component = to ? Link : motion.button;
  const linkProps = to ? { to } : {};

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-full ${className}`}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <Component
        {...linkProps}
        {...props}
        className="inline-flex items-center justify-center w-full h-full px-8 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-full bg-slate-950 backdrop-blur-3xl hover:bg-slate-900/90"
      >
        {children}
      </Component>
    </motion.div>
  );
};
