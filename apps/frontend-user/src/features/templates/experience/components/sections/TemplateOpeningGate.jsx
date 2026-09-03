import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";
import TemplateImage from "../shared/TemplateImage";

function KhmerCornerOrnament({ position }) {
    return (
        <svg
            className={`tx-gate__corner tx-gate__corner--${position}`}
            viewBox="0 0 96 96"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M7 89V25C7 15 15 7 25 7h64" />
            <path d="M15 78V30c0-8 7-15 15-15h48" />
            <path d="M24 68c12-5 19-15 20-29 8 10 19 16 33 17-12 8-20 19-23 33-7-11-17-18-30-21Z" />
            <path d="M29 29c8 2 14 8 16 16M42 20c7 5 11 12 11 21M20 43c5 7 12 11 21 11" />
        </svg>
    );
}

function videoUrl(value) {
    return typeof value === "string" ? value : value?.url || "";
}

export default function TemplateOpeningGate({
    content,
    lockDocumentScroll = true,
    onOpen,
    state = "closed",
}) {
    const reduced = usePrefersReducedMotion();
    const videoRef = useRef(null);
    const [videoFailed, setVideoFailed] = useState(false);
    const openingVideoUrl = videoUrl(content.openingVideo);
    const design = content.design || {};
    const opening = content.opening || {};
    const openingStyle = design.openingStyle || "khmer-royal";
    const frameStyle = design.frameStyle || "double-gold";
    const ornamentStyle = design.ornamentStyle || "khmer-corner-01";
    const guestText = content.guestName || opening.genericGuestText;

    useEffect(() => {
        if (!lockDocumentScroll) return undefined;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [lockDocumentScroll]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !openingVideoUrl) return undefined;
        let active = true;
        const playPromise = video.play?.();
        if (playPromise?.catch) {
            playPromise.catch(() => {
                if (active) setVideoFailed(true);
            });
        }

        return () => {
            active = false;
            video.pause?.();
            video.removeAttribute("src");
            video.load?.();
        };
    }, [openingVideoUrl]);

    const motionProps = reduced
        ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            initial: { opacity: 0, scale: 1.015 },
            animate: { opacity: 1, scale: state === "opening" ? 1.025 : 1 },
            exit: { opacity: 0, scale: 1.04 },
            transition: { duration: state === "opening" ? 0.42 : 0.65, ease: [0.22, 1, 0.36, 1] },
        };

    return (
        <motion.section
            className={`tx-gate tx-gate--${openingStyle} tx-gate--frame-${frameStyle} tx-gate--ornament-${ornamentStyle}${state === "opening" ? " is-opening" : ""}`}
            aria-label={opening.openButtonText}
            aria-busy={state === "opening"}
            style={{
                "--tx-gate-overlay-opacity": design.openingOverlayOpacity,
                "--tx-gate-primary": design.primaryColor,
                "--tx-gate-accent": design.accentColor,
            }}
            {...motionProps}
        >
            {openingVideoUrl && !videoFailed ? (
                <video
                    ref={videoRef}
                    className="tx-gate__media"
                    src={openingVideoUrl}
                    poster={content.coverImage || undefined}
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
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                />
            )}
            <div className="tx-gate__veil" aria-hidden="true" />
            <div className="tx-gate__paper" aria-hidden="true" />
            <div className="tx-gate__frame" aria-hidden="true" />
            <KhmerCornerOrnament position="top-left" />
            <KhmerCornerOrnament position="top-right" />
            <KhmerCornerOrnament position="bottom-left" />
            <KhmerCornerOrnament position="bottom-right" />

            <div className="tx-gate__content">
                <p className="tx-gate__eyebrow">{opening.heading}</p>
                <p className="tx-gate__invitation-text">{opening.invitationText}</p>
                <div className="tx-gate__crest" aria-label={`និមិត្តសញ្ញា ${content.monogramText}`}>
                    <strong>{content.monogramText}</strong>
                </div>
                <h1>
                    <span>{content.groom}</span>
                    <em aria-hidden="true">{content.amp}</em>
                    <span>{content.bride}</span>
                </h1>
                <div className="tx-gate__separator" aria-hidden="true"><span /></div>
                <p className="tx-gate__guest">សូមគោរពអញ្ជើញ {guestText}</p>
                {content.dateText && <p className="tx-gate__date">{content.dateText}</p>}
                <button
                    type="button"
                    className="tx-btn tx-btn--solid tx-gate__button"
                    onClick={onOpen}
                    disabled={state !== "closed"}
                >
                    {state === "opening" ? "កំពុងបើក..." : opening.openButtonText}
                </button>
            </div>
        </motion.section>
    );
}
