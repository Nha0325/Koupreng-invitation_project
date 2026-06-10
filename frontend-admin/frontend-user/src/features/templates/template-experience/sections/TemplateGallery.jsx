import { useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

import TemplateReveal from "../TemplateReveal";

/**
 * TemplateGallery — adaptive masonry gallery with a simple, safe lightbox.
 * Hides itself when there are no images.
 */
export default function TemplateGallery({ content }) {
    const images = content.gallery || [];
    const [activeIndex, setActiveIndex] = useState(null);
    const isOpen = activeIndex !== null;

    const close = useCallback(() => setActiveIndex(null), []);

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (event) => {
            if (event.key === "Escape") close();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, close]);

    if (!images.length) return null;

    return (
        <section className="tx-section tx-gallery" data-tx-section="gallery" aria-labelledby="tx-gallery-title">
            <div className="tx-shell">
                <header className="tx-section__head">
                    <TemplateReveal>
                        <p className="tx-kicker">រូបភាព</p>
                        <h2 id="tx-gallery-title" className="tx-section__title">អនុស្សាវរីយ៍ស្នេហា</h2>
                    </TemplateReveal>
                </header>

                <TemplateReveal className="tx-gallery__grid">
                    {images.map((img, index) => (
                        <button
                            type="button"
                            key={img.src}
                            className={`tx-gallery__item is-${img.span || "small"}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`មើលរូបភាពទី ${index + 1}`}
                        >
                            <img src={img.src} alt={`អនុស្សាវរីយ៍ ${index + 1}`} loading="lazy" />
                        </button>
                    ))}
                </TemplateReveal>
            </div>

            {isOpen && (
                <div
                    className="tx-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="រូបភាព"
                    onClick={close}
                >
                    <button type="button" className="tx-lightbox__close" onClick={close} aria-label="បិទ">
                        <IoClose aria-hidden="true" />
                    </button>
                    <img
                        className="tx-lightbox__img"
                        src={images[activeIndex].src}
                        alt={`អនុស្សាវរីយ៍ ${activeIndex + 1}`}
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
