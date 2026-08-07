import TemplateReveal from "../TemplateReveal";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { templateIcons } from "../templateIcons";

export default function TemplateWish({ content, onRsvp, showRsvp = true }) {
    const message = content.wish?.message;
    const HeartIcon = templateIcons.thank;

    return (
        <section className="tx-section tx-wish" data-tx-section="wish" aria-labelledby="tx-wish-title">
            <div className="tx-shell tx-shell--narrow">
                <TemplateSectionHeader
                    id="tx-wish-title"
                    icon={templateIcons.wish}
                    kicker="ពាក្យជូនពរ"
                    title="ជូនពរ"
                    subtitle="WISHES & BLESSINGS"
                    lead="ពាក្យជូនពររបស់អ្នក គឺជាអនុស្សាវរីយ៍ដ៏មានតម្លៃសម្រាប់ថ្ងៃពិសេសនេះ"
                />

                <TemplateReveal className="tx-wish__card">
                    <span className="tx-wish__mark" aria-hidden="true">“</span>
                    <p>{message}</p>
                    <strong>{content.groom} <em>{content.amp}</em> {content.bride}</strong>
                    {showRsvp && onRsvp && (
                        <button type="button" className="tx-btn tx-btn--solid tx-wish__cta" onClick={onRsvp}>
                            <HeartIcon aria-hidden="true" />
                            ផ្ញើពាក្យជូនពរ
                        </button>
                    )}
                </TemplateReveal>
            </div>
        </section>
    );
}
