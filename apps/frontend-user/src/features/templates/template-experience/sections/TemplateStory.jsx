import TemplateReveal from "../TemplateReveal";
import TemplateImage from "../TemplateImage";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { templateIcons } from "../templateIcons";

/**
 * TemplateStory — love story timeline.
 * Desktop: vertical timeline with themed line + alternating sides.
 * Mobile: stacked cards.
 */
export default function TemplateStory({ content }) {
    const items = content.story || [];
    if (!items.length) return null;

    return (
        <section className="tx-section tx-story" data-tx-section="story" aria-labelledby="tx-story-title">
            <div className="tx-shell">
                <TemplateSectionHeader
                    id="tx-story-title"
                    icon={templateIcons.story}
                    kicker="រឿងរ៉ាវស្នេហា"
                    title="ដំណើរនៃក្ដីស្រឡាញ់"
                    subtitle="OUR LOVE STORY"
                />

                <ol className="tx-story__line">
                    {items.map((item, index) => (
                        <TemplateReveal
                            as="li"
                            key={item.id}
                            className={`tx-story__item${index % 2 ? " is-right" : ""}`}
                        >
                            <span className="tx-story__node" aria-hidden="true" />
                            <article className="tx-story__card">
                                {item.image && (
                                    <div className="tx-story__media">
                                        <TemplateImage src={item.image} alt={item.title} />
                                    </div>
                                )}
                                <div className="tx-story__content">
                                    <p className="tx-story__kicker">{item.kicker}</p>
                                    <h3 className="tx-story__title">{item.title}</h3>
                                    {item.date && <p className="tx-story__date">{item.date}</p>}
                                    <p className="tx-story__text">{item.text}</p>
                                </div>
                            </article>
                        </TemplateReveal>
                    ))}
                </ol>
            </div>
        </section>
    );
}
