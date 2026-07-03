import TemplateReveal from "../TemplateReveal";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { templateIcons } from "../templateIcons";

/**
 * TemplateMessage — centered editorial invitation message with themed divider.
 */
export default function TemplateMessage({ content }) {
    return (
        <section className="tx-section tx-message" data-tx-section="message" aria-labelledby="tx-message-title">
            <div className="tx-shell tx-shell--narrow tx-message__inner">
                <TemplateSectionHeader
                    id="tx-message-title"
                    icon={templateIcons.invitation}
                    kicker="ការអញ្ជើញ"
                    title="សូមគោរពអញ្ជើញ"
                    subtitle="A JOYFUL INVITATION"
                />

                <TemplateReveal delay={0.1}>
                    <p className="tx-message__text">
                        {content.message}
                    </p>
                </TemplateReveal>

                <TemplateReveal delay={0.16}>
                    <p className="tx-message__couple">
                        {content.groom} <em>{content.amp}</em> {content.bride}
                    </p>
                    {content.dateText && <p className="tx-message__date">{content.dateText}</p>}
                </TemplateReveal>
            </div>
        </section>
    );
}
