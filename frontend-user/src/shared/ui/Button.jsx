import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

/**
 * Button
 *
 * Primitive button with variants, sizes, and an optional loading spinner.
 * Renders a real `<button>` by default; if `to` is provided, renders a
 * react-router `<Link>`; if `href` is provided, renders an `<a>`. This
 * keeps semantics and keyboard navigation intact across navigation
 * patterns.
 *
 * Press feedback is a Framer Motion `whileTap` scale (skipped automatically
 * when `prefers-reduced-motion: reduce` is set, via the app-level
 * `<MotionConfig>`).
 *
 * Props:
 *   - variant?: 'primary' | 'ghost' | 'outline'   (default 'primary')
 *   - size?:    'sm' | 'md' | 'lg'                (default 'md')
 *   - loading?: boolean                            shows spinner + disables
 *   - to?:      string                             react-router link target
 *   - href?:    string                             plain anchor target
 *   - children, className, style, onClick, type, disabled, ...rest
 */

const SIZE_PADDING = {
    sm: "0.5rem 1rem",
    md: "0.75rem 1.4rem",
    lg: "0.95rem 1.85rem",
};

const SIZE_FONT = {
    sm: "0.82rem",
    md: "0.95rem",
    lg: "1.05rem",
};

const SIZE_SPINNER = {
    sm: 14,
    md: 16,
    lg: 18,
};

const variantStyles = (variant) => {
    switch (variant) {
        case "ghost":
            return {
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid transparent",
                boxShadow: "none",
            };
        case "outline":
            return {
                background: "transparent",
                color: "var(--color-primary)",
                border: "1px solid var(--color-primary)",
                boxShadow: "none",
            };
        case "primary":
        default:
            return {
                background:
                    "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                color: "var(--color-primary-foreground, #fff)",
                border: "1px solid transparent",
                boxShadow: "0 4px 18px rgba(112, 51, 255, 0.25)",
            };
    }
};

const Button = ({
    variant = "primary",
    size = "md",
    loading = false,
    to,
    href,
    type,
    disabled,
    className = "",
    style,
    children,
    onClick,
    ...rest
}) => {
    const isDisabled = Boolean(disabled || loading);

    const baseStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: SIZE_PADDING[size] ?? SIZE_PADDING.md,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: SIZE_FONT[size] ?? SIZE_FONT.md,
        borderRadius: "var(--radius-pill, 999px)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        textDecoration: "none",
        outlineOffset: 2,
        transition: "box-shadow var(--duration-fast, 220ms) ease",
        opacity: isDisabled ? 0.7 : 1,
        ...variantStyles(variant),
        ...style,
    };

    const inner = (
        <>
            {loading && (
                <Spinner
                    size={SIZE_SPINNER[size] ?? SIZE_SPINNER.md}
                    aria-label="Loading"
                />
            )}
            <span>{children}</span>
        </>
    );

    // Press animation is light and reduced-motion safe via MotionConfig.
    const motionProps = {
        whileTap: isDisabled ? undefined : { scale: 0.97 },
        transition: { type: "spring", stiffness: 420, damping: 22 },
        style: { display: "inline-block" },
    };

    if (to && !isDisabled) {
        return (
            <motion.span {...motionProps}>
                <Link
                    to={to}
                    className={className}
                    style={baseStyle}
                    aria-disabled={isDisabled || undefined}
                    onClick={onClick}
                    {...rest}
                >
                    {inner}
                </Link>
            </motion.span>
        );
    }

    if (href && !isDisabled) {
        return (
            <motion.span {...motionProps}>
                <a
                    href={href}
                    className={className}
                    style={baseStyle}
                    aria-disabled={isDisabled || undefined}
                    onClick={onClick}
                    {...rest}
                >
                    {inner}
                </a>
            </motion.span>
        );
    }

    return (
        <motion.button
            type={type ?? "button"}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            className={className}
            style={baseStyle}
            onClick={onClick}
            whileTap={motionProps.whileTap}
            transition={motionProps.transition}
            {...rest}
        >
            {inner}
        </motion.button>
    );
};

export default Button;
