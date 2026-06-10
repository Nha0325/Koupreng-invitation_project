import TemplateReveal from "../TemplateReveal";

/**
 * TemplateMessage — centered editorial invitation message with themed divider.
 */
export default function TemplateMessage({ content }) {
    return (
        <section className="tx-section tx-message" data-tx-section="message" aria-labelledby="tx-message-title">
            <div className="tx-shell tx-shell--narrow tx-message__inner">
                <TemplateReveal>
                    <p className="tx-kicker">ការអញ្ជើញ</p>
                </TemplateReveal>

                <TemplateReveal delay={0.05}>
                    <span className="tx-divider" aria-hidden="true">
                        <i /><span className="tx-divider__dot" /><i />
                    </span>
                </TemplateReveal>

                <TemplateReveal delay={0.1}>
                    <h2 id="tx-message-title" className="tx-message__text">
                        {content.message}
                    </h2>
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
