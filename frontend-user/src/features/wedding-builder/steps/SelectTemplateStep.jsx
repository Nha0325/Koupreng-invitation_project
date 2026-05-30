import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FACEBOOK_TEMPLATE_CARDS, TEMPLATE_CATEGORIES } from "../../templates/data/templatesData";

const categoryLabels = {
    all: "All",
    ancient: "Ancient",
    modern: "Modern",
    contemporary: "Contemporary",
};

const FALLBACK_IMAGE = "/facebook/all/01-card/cover-card.jpg";

export default function SelectTemplateStep({ draft, update }) {
    // Read ?template from URL so we get the right category even before draft loads
    const [searchParams] = useSearchParams();
    const urlTemplateId = searchParams.get("template");
    const templateOptions = FACEBOOK_TEMPLATE_CARDS;

    const initialCategory = useMemo(() => {
        const id = urlTemplateId || draft?.templateId;
        const t = templateOptions.find((t) => t.id === id);
        return t?.category || "all";
    }, [draft?.templateId, templateOptions, urlTemplateId]);

    const [activeCategory, setActiveCategory] = useState(initialCategory);

    const filtered = useMemo(
        () =>
            activeCategory === "all"
                ? templateOptions
                : templateOptions.filter((t) => t.category === activeCategory),
        [activeCategory, templateOptions]
    );

    const countFor = (catId) =>
        catId === "all"
            ? templateOptions.length
            : templateOptions.filter((t) => t.category === catId).length;

    return (
        <div>
            <h2>Choose your wedding card</h2>
            <p className="wb-help">Customize the first impression of your invitation.</p>

            {/* Category pills */}
            <div className="wb-pill-bar" role="tablist" aria-label="ប្រភេទគំរូ">
                {TEMPLATE_CATEGORIES.map((cat) => {
                    const active = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            className={`wb-pill${active ? " is-active" : ""}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span>{cat.labelEn}</span>
                            <span className="wb-pill-count">{countFor(cat.id)}</span>
                        </button>
                    );
                })}
            </div>

            {/* Template card grid */}
            <div className="wb-tpl-grid">
                {filtered.map((t) => {
                    const isSelected = draft?.templateId === t.id;
                    const coverImage = t.phoneCoverImage || t.mainImage || t.image || FALLBACK_IMAGE;
                    return (
                        <button
                            type="button"
                            key={t.id}
                            className={`wb-tpl-card${isSelected ? " is-selected" : ""}`}
                            aria-pressed={isSelected}
                            onClick={() => update({ templateId: t.id })}
                        >
                            <span className="wb-tpl-card-media">
                                <img
                                    src={coverImage}
                                    alt={t.name}
                                    loading="lazy"
                                    onError={(e) => {
                                        if (e.currentTarget.src.indexOf(FALLBACK_IMAGE) === -1) {
                                            e.currentTarget.src = FALLBACK_IMAGE;
                                        }
                                    }}
                                />
                                {isSelected && <span className="wb-tpl-card-check" aria-hidden="true">✓</span>}
                            </span>
                            <span className={`wb-tpl-badge wb-tpl-badge--${t.category}`}>
                                {categoryLabels[t.category]}
                            </span>
                            <span className="wb-tpl-card-name">{t.name}</span>
                            <span className="wb-tpl-card-style">{t.style}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
