import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";

import { usePrefersReducedMotion } from "../../../../shared/hooks/usePrefersReducedMotion";

/**
 * TemplateHero — fullscreen opening for the shared experience engine.
 * Background image + themed overlay, couple names, date, short venue,
 * style badge, families line, open CTA + scroll indicator.
 */
export default function TemplateHero({ content, onOpen }) {
    const reduced = usePrefersReducedMotion();
    const venueShort = (content.venue.name || "").split(",")[0].trim();

    const rise = (delay) =>
        reduced
            ? {}
            : {
                initial: { opacity: 0, y: 26 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
            };

    return (
        <section className="tx-hero" data-tx-section="hero" aria-label="ការអញ្ជើញ">
            <div
                className="tx-hero__bg"
                style={{ backgroundImage: `url("${content.coverImage}")` }}
                role="img"
                aria-label={`${content.groom} និង ${content.bride}`}
            />
            <div className="tx-hero__overlay" aria-hidden="true" />

            <div className="tx-hero__inner">
                {content.badge && (
                    <motion.span className="tx-hero__badge" {...rise(0.05)}>
                        {content.badge}
                    </motion.span>
                )}

                <motion.p className="tx-kicker tx-hero__kicker" {...rise(0.12)}>
                    សូមគោរពអញ្ជើញ
                </motion.p>

                <motion.h1 className="tx-hero__names" {...rise(0.2)}>
                    <span>{content.groom}</span>
                    <em className="tx-hero__amp">{content.amp}</em>
                    <span>{content.bride}</span>
                </motion.h1>

                <motion.div className="tx-hero__rule" aria-hidden="true" {...rise(0.32)}>
                    <span /><i /><span />
                </motion.div>

                {content.dateText && (
                    <motion.p className="tx-hero__date" {...rise(0.4)}>
                        {content.dateText}
                    </motion.p>
                )}

                {venueShort && (
                    <motion.p className="tx-hero__venue" {...rise(0.48)}>
                        {venueShort}
                    </motion.p>
                )}

                <motion.p className="tx-hero__families" {...rise(0.56)}>
                    {content.families}
                </motion.p>

                <motion.div {...rise(0.66)}>
                    <button type="button" className="tx-btn tx-btn--solid tx-hero__cta" onClick={onOpen}>
                        បើកសន្លឹកការ
                    </button>
                </motion.div>
            </div>

            <button
                type="button"
                className="tx-hero__scroll"
                onClick={onOpen}
                aria-label="រំកិលចុះក្រោម"
            >
                <span>រំកិលចុះក្រោម</span>
                <IoChevronDown aria-hidden="true" />
            </button>
        </section>
    );
}
