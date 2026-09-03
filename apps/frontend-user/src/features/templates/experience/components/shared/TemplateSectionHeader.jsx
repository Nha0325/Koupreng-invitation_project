import TemplateReveal from "./TemplateReveal";

export default function TemplateSectionHeader({ id, icon: Icon, kicker, title, subtitle, lead }) {
    return (
        <header className="tx-section__head">
            <TemplateReveal>
                {Icon && (
                    <span className="tx-section__icon" aria-hidden="true">
                        <Icon />
                    </span>
                )}
                {kicker && <p className="tx-kicker">{kicker}</p>}
                <h2 id={id} className="tx-section__title">{title}</h2>
                {subtitle && <p className="tx-section__subtitle">{subtitle}</p>}
                {lead && <p className="tx-section__lead">{lead}</p>}
                <span className="tx-ornament-divider" aria-hidden="true" />
            </TemplateReveal>
        </header>
    );
}
