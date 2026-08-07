import TemplateReveal from "../TemplateReveal";
import TemplateImage from "../TemplateImage";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { templateIcons } from "../templateIcons";

/**
 * TemplateCouple — introduce groom & bride with alternating editorial layout.
 * Desktop: image / text alternating. Mobile: stacked.
 */
function CoupleRow({ name, intro, parents, image, flip, label }) {
    return (
        <TemplateReveal className={`tx-couple__row${flip ? " is-flip" : ""}`}>
            <div className="tx-couple__media">
                <TemplateImage src={image} alt={name} />
                <span className="tx-couple__frame" aria-hidden="true" />
            </div>
            <div className="tx-couple__body">
                <p className="tx-kicker">{label}</p>
                <h3 className="tx-couple__name">{name}</h3>
                <p className="tx-couple__intro">{intro}</p>
                {parents && <p className="tx-couple__parents">{parents}</p>}
            </div>
        </TemplateReveal>
    );
}

export default function TemplateCouple({ content }) {
    return (
        <section className="tx-section tx-couple" data-tx-section="couple" aria-labelledby="tx-couple-title">
            <div className="tx-shell">
                <TemplateSectionHeader
                    id="tx-couple-title"
                    icon={templateIcons.couple}
                    kicker="គូស្នេហ៍"
                    title="កូនកំលោះ និង កូនក្រមុំ"
                    subtitle="THE BRIDE & GROOM"
                />

                <div className="tx-couple__list">
                    <CoupleRow
                        label="កូនកំលោះ"
                        name={content.groom}
                        intro={content.couple.groomIntro}
                        parents={content.couple.groomParents}
                        image={content.coverImage}
                    />
                    <CoupleRow
                        label="កូនក្រមុំ"
                        name={content.bride}
                        intro={content.couple.brideIntro}
                        parents={content.couple.brideParents}
                        image={content.portraitImage}
                        flip
                    />
                </div>
            </div>
        </section>
    );
}
