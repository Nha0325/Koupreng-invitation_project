import TemplateReveal from "../TemplateReveal";

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
                <header className="tx-section__head">
                    <TemplateReveal>
                        <p className="tx-kicker">រឿងរ៉ាវស្នេហា</p>
                        <h2 id="tx-story-title" className="tx-section__title">ដំណើរនៃក្ដីស្រឡាញ់</h2>
                    </TemplateReveal>
                </header>

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
                                        <img src={item.image} alt={item.title} loading="lazy" />
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
