import { IoLogoFacebook, IoLocationSharp, IoMapOutline, IoNavigate } from "react-icons/io5";

import TemplateReveal from "../shared/TemplateReveal";
import TemplateImage from "../shared/TemplateImage";
import TemplateSectionHeader from "../shared/TemplateSectionHeader";
import { templateIcons } from "../../config/templateIcons";

/**
 * TemplateVenue — venue panel with name, address, decorative image.
 * Direction button appears only when a usable map link exists; otherwise a
 * clear disabled-state line is shown.
 */
export default function TemplateVenue({ content }) {
    const { venue } = content;
    const hasMap = Boolean(venue.mapLink);
    const hasFacebook = Boolean(content.contact?.facebook);

    return (
        <section className="tx-section tx-venue" data-tx-section="venue" aria-labelledby="tx-venue-title">
            <div className="tx-shell">
                <TemplateSectionHeader
                    id="tx-venue-title"
                    icon={templateIcons.venue}
                    kicker="ផែនទី និងទីតាំង"
                    title="ទីតាំងប្រារព្ធពិធី"
                    subtitle="LOCATION & DIRECTIONS"
                />

                <div className="tx-venue__grid">
                    <TemplateReveal className="tx-venue__media">
                        {venue.mapEmbedUrl ? (
                            <iframe
                                src={venue.mapEmbedUrl}
                                title={`ផែនទី ${venue.name || "ទីតាំងពិធី"}`}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        ) : (
                            <TemplateImage src={venue.image} alt={venue.name || "ទីតាំងពិធី"} />
                        )}
                        <span className="tx-venue__media-frame" aria-hidden="true" />
                    </TemplateReveal>

                    <TemplateReveal className="tx-venue__body" delay={0.08}>
                        <span className="tx-venue__pin" aria-hidden="true">
                            <IoMapOutline />
                        </span>
                        <h3 className="tx-section__title tx-venue__name">
                            {venue.name || "ទីតាំងពិធីមង្គលការ"}
                        </h3>

                        {venue.address && (
                            <p className="tx-venue__address">
                                <IoLocationSharp aria-hidden="true" />
                                <span>{venue.address}</span>
                            </p>
                        )}

                        <div className="tx-venue__actions">
                            {hasMap ? (
                                <a
                                    className="tx-btn tx-btn--solid tx-venue__cta"
                                    href={venue.mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <IoNavigate aria-hidden="true" />
                                    បើកផែនទី <span>/ Open Map</span>
                                </a>
                            ) : (
                                <p className="tx-venue__no-map">ព័ត៌មានទីតាំងលម្អិតនឹងបញ្ជាក់បន្ថែម</p>
                            )}
                            {hasFacebook && (
                                <a
                                    className="tx-btn tx-btn--ghost tx-venue__facebook"
                                    href={content.contact.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <IoLogoFacebook aria-hidden="true" />
                                    Facebook
                                </a>
                            )}
                        </div>
                    </TemplateReveal>
                </div>
                <span className="tx-venue__divider" aria-hidden="true" />
            </div>
        </section>
    );
}
