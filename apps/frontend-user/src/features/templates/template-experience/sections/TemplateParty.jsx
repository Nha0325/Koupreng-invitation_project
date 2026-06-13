import TemplateReveal from "../TemplateReveal";

/**
 * TemplateParty — wedding party cards (demo content for the template page).
 */
export default function TemplateParty({ content }) {
    const members = content.party || [];
    if (!members.length) return null;

    return (
        <section className="tx-section tx-party" data-tx-section="party" aria-labelledby="tx-party-title">
            <div className="tx-shell">
                <header className="tx-section__head">
                    <TemplateReveal>
                        <p className="tx-kicker">ក្រុមអម</p>
                        <h2 id="tx-party-title" className="tx-section__title">ក្រុមការងារពិធីមង្គល</h2>
                    </TemplateReveal>
                </header>

                <div className="tx-party__grid">
                    {members.map((member, index) => (
                        <TemplateReveal as="article" key={member.id} className="tx-party__card" delay={index * 0.05}>
                            <div className="tx-party__media">
                                <img src={member.image} alt={member.name} loading="lazy" />
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
