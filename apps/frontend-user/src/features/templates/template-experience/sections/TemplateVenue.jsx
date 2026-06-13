import { IoLocationSharp, IoNavigate } from "react-icons/io5";

import TemplateReveal from "../TemplateReveal";

/**
 * TemplateVenue — venue panel with name, address, decorative image.
 * Direction button appears only when a usable map link exists; otherwise a
 * clear disabled-state line is shown.
 */
export default function TemplateVenue({ content }) {
    const { venue } = content;
    const hasMap = Boolean(venue.mapLink);

    return (
        <section className="tx-section tx-venue" data-tx-section="venue" aria-labelledby="tx-venue-title">
            <div className="tx-shell tx-venue__grid">
                <TemplateReveal className="tx-venue__media">
                    <img src={venue.image} alt={venue.name || "ទីតាំងពិធី"} loading="lazy" />
                    <span className="tx-venue__media-frame" aria-hidden="true" />
                </TemplateReveal>

                <TemplateReveal className="tx-venue__body" delay={0.08}>
                    <p className="tx-kicker">ទីតាំង</p>
                    <h2 id="tx-venue-title" className="tx-section__title tx-venue__name">
                        {venue.name || "ទីតាំងពិធីមង្គលការ"}
                    </h2>

                    {venue.address && (
                        <p className="tx-venue__address">
                            <IoLocationSharp aria-hidden="true" />
                            <span>{venue.address}</span>
                        </p>
                    )}

                    {hasMap ? (
                        <a
                            className="tx-btn tx-btn--solid tx-venue__cta"
                            href={venue.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <IoNavigate aria-hidden="true" />
                            មើលទិសដៅ
                        </a>
                    ) : (
                        <p className="tx-venue__no-map">ព័ត៌មានទីតាំងលម្អិតនឹងបញ្ជាក់បន្ថែម</p>
                    )}
                </TemplateReveal>
            </div>
        </section>
    );
}
