/**
 * Spinner
 *
 * Small accessible spinner. Renders a `role="status"` container with an
 * `aria-label` (defaults to "Loading") so screen readers announce that
 * the UI is busy. The visible affordance is a CSS-animated circle.
 *
 * Props:
 *   - size:        diameter in pixels for the spinning circle (default 24)
 *   - aria-label:  accessible label, defaulting to "Loading"
 *   - className:   forwarded to the wrapper div
 *
 * Used by `<RequireAuth />` while auth is hydrating, and by the public
 * invitation while the event payload is in flight.
 */
const Spinner = ({
    size = 24,
    "aria-label": ariaLabel = "Loading",
    className = "",
    ...rest
}) => {
    const stroke = Math.max(2, Math.round(size / 12));

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={ariaLabel}
            className={className}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: size,
                height: size,
            }}
            {...rest}
        >
            <span
                aria-hidden="true"
                style={{
                    display: "inline-block",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: `${stroke}px solid var(--color-border, rgba(0,0,0,0.12))`,
                    borderTopColor: "var(--color-primary, #7033ff)",
                    animation: "koupreng-spin 0.9s linear infinite",
                }}
            />
            <style>{`
        @keyframes koupreng-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="status"] > span[aria-hidden="true"] {
            animation-duration: 3s;
          }
        }
      `}</style>
        </div>
    );
};

export default Spinner;
