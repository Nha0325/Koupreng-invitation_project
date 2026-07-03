import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "../../../../shared/hooks/usePrefersReducedMotion";

export default function TemplateOpeningGate({ content, onOpen }) {
    const reduced = usePrefersReducedMotion();
    const openingVideoUrl = typeof content.openingVideo === "string"
        ? content.openingVideo
        : content.openingVideo?.url || "";
    const motionProps = reduced
        ? {}
        : {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.45, ease: "easeOut" },
        };

    return (
        <motion.section
            className="tx-gate"
            aria-label="បើកសន្លឹកការ"
            {...motionProps}
        >
            {openingVideoUrl ? (
                <video
                    className="tx-gate__media"
                    src={openingVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                />
            ) : (
                <div
                    className="tx-gate__media"
                    style={{ backgroundImage: `url("${content.coverImage}")` }}
                    aria-hidden="true"
                />
            )}
            <div className="tx-gate__veil" aria-hidden="true" />
            <div className="tx-gate__ornament tx-gate__ornament--top" aria-hidden="true" />
            <div className="tx-gate__ornament tx-gate__ornament--bottom" aria-hidden="true" />

            <div className="tx-gate__content">
                <p className="tx-kicker">សូមគោរពអញ្ជើញ</p>
                <div className="tx-gate__crest" aria-hidden="true">{content.monogramText}</div>
                <h1>{content.groom} <em>{content.amp}</em> {content.bride}</h1>
                {content.dateText && <p className="tx-gate__date">{content.dateText}</p>}
                <button type="button" className="tx-btn tx-btn--solid tx-gate__button" onClick={onOpen}>
                    ចុចដើម្បីបើក
                </button>
            </div>
        </motion.section>
    );
}
