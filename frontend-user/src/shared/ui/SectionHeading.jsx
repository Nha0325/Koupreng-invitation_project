/**
 * SectionHeading
 *
 * Display-font heading with an optional eyebrow tag, an optional subtitle
 * line, and a small decorative divider underneath the title. Used by
 * invitation sections (Schedule, Gallery, RSVP, ...) and host-app sections
 * that want a consistent editorial heading treatment.
 *
 * Props:
 *   - eyebrow?:   optional small label rendered above the title
 *   - title:      required heading text (rendered in `--font-display`)
 *   - subtitle?:  optional supporting copy under the divider
 *   - align?:     'left' | 'center' (default 'center')
 *   - className?: forwarded to the wrapper element
 */
const SectionHeading = ({
    eyebrow,
    title,
    subtitle,
    align = "center",
    className = "",
    ...rest
}) => {
    const isCenter = align === "center";

    return (
        <header
            className={className}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isCenter ? "center" : "flex-start",
                textAlign: isCenter ? "center" : "left",
                gap: "0.75rem",
                width: "100%",
            }}
            {...rest}
        >
            {eyebrow && (
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.78rem",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                    }}
                >
                    {eyebrow}
                </span>
            )}

            <h2
                style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(1.75rem, 3vw + 1rem, 2.75rem)",
                    lineHeight: 1.15,
                    color: "var(--color-text)",
                    margin: 0,
                }}
            >
                {title}
            </h2>

            <span
                aria-hidden="true"
                style={{
                    display: "block",
                    width: 56,
                    height: 1,
                    background: "var(--color-accent, #c9a84c)",
                    opacity: 0.7,
                    marginTop: "0.25rem",
                    alignSelf: isCenter ? "center" : "flex-start",
                }}
            />

            {subtitle && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        lineHeight: 1.55,
                        color: "var(--color-text-muted)",
                        maxWidth: "52ch",
                        margin: 0,
                    }}
                >
                    {subtitle}
                </p>
            )}
        </header>
    );
};

export default SectionHeading;
