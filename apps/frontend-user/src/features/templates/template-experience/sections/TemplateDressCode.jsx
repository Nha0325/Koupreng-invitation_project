import TemplateReveal from "../TemplateReveal";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { templateIcons } from "../templateIcons";

/**
 * TemplateDressCode — guest guidance: color palette, style, note.
 */
export default function TemplateDressCode({ content }) {
    const dress = content.dressCode;
    if (!dress) return null;

    return (
        <section className="tx-section tx-dress" data-tx-section="dress" aria-labelledby="tx-dress-title">
            <div className="tx-shell tx-shell--narrow">
                <TemplateSectionHeader
                    id="tx-dress-title"
                    icon={templateIcons.dress}
                    kicker="សម្លៀកបំពាក់"
                    title={dress.name}
                    subtitle="DRESS CODE"
                />

                <TemplateReveal className="tx-dress__palette" aria-label="ក្ដារពណ៌">
                    {dress.colors.map((color) => (
                        <div className="tx-dress__swatch" key={color.hex + color.name}>
                            <span
                                className="tx-dress__chip"
                                style={{ background: color.hex }}
                                aria-hidden="true"
                            />
                            <span className="tx-dress__chip-name">{color.name}</span>
                        </div>
                    ))}
                </TemplateReveal>

                {dress.style && (
                    <TemplateReveal delay={0.08}>
                        <p className="tx-dress__style">រចនាបថ៖ {dress.style}</p>
                    </TemplateReveal>
                )}

                {dress.description && (
                    <TemplateReveal delay={0.12}>
                        <p className="tx-dress__note">{dress.description}</p>
                    </TemplateReveal>
                )}
            </div>
        </section>
    );
}
