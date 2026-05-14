/**
 * GlassCard
 *
 * Replaces the legacy `MagicCard` with a simple, semantic glass container.
 * Wraps children in a `div.glass` (the utility class added in task 2.1) and
 * applies sensible defaults for radius and padding via the design tokens.
 *
 * Props:
 *   - children:  card contents
 *   - className: forwarded; appended after the `glass` utility class so the
 *                caller can override / extend styling
 *   - style:     forwarded; merged after the defaults so callers can tweak
 *
 * The glassmorphism look (background, blur, border, shadow) is provided by
 * the `.glass` utility in `index.css` and the CSS custom properties defined
 * in `:root` / `:root[data-theme="dark"]`.
 */
const GlassCard = ({ children, className = "", style, ...rest }) => {
    return (
        <div
            className={`glass ${className}`.trim()}
            style={{
                borderRadius: "var(--radius-lg, 22px)",
                padding: 24,
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>
    );
};

export default GlassCard;
