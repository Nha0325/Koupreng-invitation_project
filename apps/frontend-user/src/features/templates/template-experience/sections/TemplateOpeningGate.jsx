import { useState } from "react";
import { motion } from "framer-motion";
import { GiDiamondRing } from "react-icons/gi";
import { IoEnterOutline } from "react-icons/io5";

import { usePrefersReducedMotion } from "../../../../shared/hooks/usePrefersReducedMotion";
import TemplateImage from "../TemplateImage";

export default function TemplateOpeningGate({ content, onOpen }) {
    const reduced = usePrefersReducedMotion();
    const [videoFailed, setVideoFailed] = useState(false);
    const openingVideoUrl = typeof content.openingVideo === "string"
        ? content.openingVideo
        : content.openingVideo?.url || "";
    const motionProps = reduced
        ? {}
        : {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        };
    const openingStyle = content.design?.openingStyle || "cinematic";

    return (
        <motion.section
            className={`tx-gate tx-gate--${openingStyle}`}
            aria-label="បើកសន្លឹកការ"
            {...motionProps}
        >
            {openingVideoUrl && !videoFailed ? (
                <video
                    className="tx-gate__media"
                    src={openingVideoUrl}
                    poster={content.coverImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onError={() => setVideoFailed(true)}
                    aria-hidden="true"
                />
            ) : (
                <TemplateImage
                    className="tx-gate__media"
                    src={content.coverImage}
                    alt={`${content.groom} និង ${content.bride}`}
                    loading="eager"
                    fetchPriority="high"
                />
            )}
            <div className="tx-gate__veil" aria-hidden="true" />
            <div className="tx-gate__paper" aria-hidden="true" />
            <div className="tx-gate__frame" aria-hidden="true">
                <i /><i /><i /><i />
            </div>
            <div className="tx-gate__ornament tx-gate__ornament--top" aria-hidden="true" />
            <div className="tx-gate__ornament tx-gate__ornament--bottom" aria-hidden="true" />
            {!reduced && (
                <>
                    <motion.span
                        className="tx-gate__petal tx-gate__petal--one"
                        animate={{ y: [0, 28, 0], rotate: [0, 24, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        aria-hidden="true"
                    />
                    <motion.span
                        className="tx-gate__petal tx-gate__petal--two"
                        animate={{ y: [18, -12, 18], rotate: [15, -18, 15] }}
                        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
                        aria-hidden="true"
                    />
                </>
            )}

            <div className="tx-gate__content">
                <p className="tx-gate__eyebrow">សិរីមង្គលអាពាហ៍ពិពាហ៍</p>
                <p className="tx-gate__english">The Wedding Celebration</p>
                <div className="tx-gate__crest" aria-hidden="true">
                    <GiDiamondRing />
                    <strong>{content.monogramText}</strong>
                </div>
                <h1>
                    <span>{content.groom}</span>
                    <em>{content.amp}</em>
                    <span>{content.bride}</span>
                </h1>
                {content.dateText && <p className="tx-gate__date">{content.dateText}</p>}
                <button type="button" className="tx-btn tx-btn--solid tx-gate__button" onClick={onOpen}>
                    <IoEnterOutline aria-hidden="true" />
                    ចុចដើម្បីបើក
                </button>
                <p className="tx-gate__hint">Tap to open your invitation</p>
            </div>
        </motion.section>
    );
}
