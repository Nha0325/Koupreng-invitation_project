import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AnimatedButton = ({
  to,
  children,
  className = "",
  onClick,
  ...props
}) => {
  const inner = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.75rem 1.75rem",
        background:
          "linear-gradient(135deg, var(--purple-main), var(--purple-dark))",
        color: "#fff",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: "0.95rem",
        textDecoration: "none",
        boxShadow: "0 4px 18px rgba(124,58,237,0.3)",
        transition: "box-shadow 0.2s",
        cursor: "pointer",
        border: "none",
      }}
      className={className}
    >
      {children}
    </span>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{ display: "inline-block" }}
    >
      {to ? (
        <Link to={to} style={{ textDecoration: "none" }} {...props}>
          {inner}
        </Link>
      ) : (
        <button
          onClick={onClick}
          style={{ background: "none", border: "none", padding: 0 }}
          {...props}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
};

export default AnimatedButton;
