import { Link } from "react-router-dom";
import { IoNavigate, IoArrowUp, IoSparkles } from "react-icons/io5";

/**
 * TemplateStickyCta — mobile-only bottom bar.
 * Compact actions: Top, Use template, RSVP, Direction.
 * Safe-area padding handled in CSS. Hidden on desktop via CSS.
 */
export default function TemplateStickyCta({ onTop, mapLink, useTemplateLink, primaryCtaLabel = "ប្រើគំរូ" }) {
    return (
        <div className="tx-sticky" role="group" aria-label="សកម្មភាពរហ័ស">
            <button type="button" className="tx-sticky__btn" onClick={onTop}>
                <IoArrowUp aria-hidden="true" />
                <span>ដើម</span>
            </button>

            {mapLink ? (
                <a
                    className="tx-sticky__btn"
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IoNavigate aria-hidden="true" />
                    <span>ទិសដៅ</span>
                </a>
            ) : (
                <button type="button" className="tx-sticky__btn" disabled aria-disabled="true">
                    <IoNavigate aria-hidden="true" />
                    <span>ទិសដៅ</span>
                </button>
            )}

            {useTemplateLink && (
                <Link to={useTemplateLink} className="tx-sticky__btn tx-sticky__btn--primary">
                    <IoSparkles aria-hidden="true" />
                    <span>{primaryCtaLabel}</span>
                </Link>
            )}
        </div>
    );
}
