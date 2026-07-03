import TemplateReveal from "../TemplateReveal";
import TemplateImage from "../TemplateImage";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { templateIcons } from "../templateIcons";

/**
 * TemplateParty — wedding party cards (demo content for the template page).
 */
export default function TemplateParty({ content }) {
    const members = content.party || [];
    if (!members.length) return null;

    return (
        <section className="tx-section tx-party" data-tx-section="party" aria-labelledby="tx-party-title">
            <div className="tx-shell">
                <TemplateSectionHeader
                    id="tx-party-title"
                    icon={templateIcons.party}
                    kicker="ក្រុមគ្រួសារ"
                    title="គ្រួសារ និង ក្រុមអម"
                    subtitle="FAMILY & WEDDING PARTY"
                />

                <div className="tx-party__grid">
                    {members.map((member, index) => (
                        <TemplateReveal as="article" key={member.id} className="tx-party__card" delay={index * 0.05}>
                            <div className="tx-party__media">
                                <TemplateImage src={member.image} alt={member.name} />
                            </div>
                            <p className="tx-party__role">{member.role}</p>
                            <h3 className="tx-party__name">{member.name}</h3>
                            {member.roleEn && <p className="tx-party__en">{member.roleEn}</p>}
                        </TemplateReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
