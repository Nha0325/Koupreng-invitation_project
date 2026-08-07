import TemplateReveal from "../TemplateReveal";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { scheduleIcon, templateIcons } from "../templateIcons";

/**
 * TemplateSchedule — wedding day timeline cards.
 * Each card: time, title, description, optional location.
 */
export default function TemplateSchedule({ content }) {
    const items = content.schedule || [];
    if (!items.length) return null;

    return (
        <section className="tx-section tx-schedule" data-tx-section="schedule" aria-labelledby="tx-schedule-title">
            <div className="tx-shell">
                <TemplateSectionHeader
                    id="tx-schedule-title"
                    icon={templateIcons.schedule}
                    kicker="កម្មវិធី"
                    title="កម្មវិធីពិធីមង្គលការ"
                    subtitle="WEDDING PROGRAM"
                />

                <div className="tx-schedule__grid">
                    {items.map((item, index) => {
                        const ScheduleIcon = scheduleIcon(index);
                        return (
                            <TemplateReveal as="article" key={item.id} className="tx-schedule__card" delay={index * 0.05}>
                                <span className="tx-schedule__icon" aria-hidden="true"><ScheduleIcon /></span>
                                <span className="tx-schedule__time">{item.time}</span>
                                <h3 className="tx-schedule__title">{item.title}</h3>
                                {item.titleEn && <p className="tx-schedule__en">{item.titleEn}</p>}
                                <p className="tx-schedule__desc">{item.description}</p>
                                {item.location && <p className="tx-schedule__loc">{item.location}</p>}
                            </TemplateReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
