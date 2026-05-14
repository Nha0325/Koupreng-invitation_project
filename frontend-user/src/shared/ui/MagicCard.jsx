import { useRef } from "react";
import { motion } from "framer-motion";

/**
 * MagicCard
 * Subtle mouse-tracking glow effect + lift on hover.
 * Does NOT inject its own background/shadow — lets the parent CSS class control that.
 */
const MagicCard = ({ children, className = "", ...props }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.removeProperty("--mouse-x");
    card.style.removeProperty("--mouse-y");
  };

  return (
    <motion.div
      ref={cardRef}
      className={`magic-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      {...props}
    >
      {/* Glow spotlight */}
      <div className="magic-card-glow" aria-hidden="true" />
      {children}
    </motion.div>
  );
};

export default MagicCard;
