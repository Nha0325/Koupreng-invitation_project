import TemplateSectionHeader from "../shared/TemplateSectionHeader";
import { templateIcons } from "../../config/templateIcons";

export default function TemplateFaq({ content }) {
    if (!content.faq?.length) return null;

    return (
        <section className="tx-section tx-faq" data-tx-section="faq" aria-labelledby="tx-faq-title">
            <div className="tx-shell tx-shell--narrow">
                <TemplateSectionHeader
                    id="tx-faq-title"
                    icon={templateIcons.invitation}
                    kicker="ព័ត៌មានបន្ថែម"
                    title="សំណួរញឹកញាប់"
                    subtitle="Frequently Asked Questions"
                />
                <div className="tx-faq__list">
                    {content.faq.map((item) => (
                        <details className="tx-faq__item" key={item.id || item.q}>
                            <summary>{item.q}</summary>
                            <p>{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
