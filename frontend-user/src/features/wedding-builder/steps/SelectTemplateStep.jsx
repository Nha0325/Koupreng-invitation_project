import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FACEBOOK_TEMPLATE_CARDS, TEMPLATE_CATEGORIES } from "../../templates/data/templatesData";

const categoryLabels = {
    all: "All",
    ancient: "Ancient",
    modern: "Modern",
    contemporary: "Contemporary",
};

// Inline styles to avoid adding a new CSS file
const styles = {
    filterBar: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    filterBtn: (active) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 16px",
        borderRadius: 50,
        border: active ? "1.5px solid #1a1a1a" : "1.5px solid #d8cdb8",
        background: active ? "#1a1a1a" : "#fff",
        color: active ? "#fff" : "#666",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.5px",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s ease",
    }),
    countPill: (active) => ({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        padding: "0 5px",
        borderRadius: 50,
        background: active ? "rgba(255,255,255,0.2)" : "rgba(176,146,106,0.15)",
        color: "inherit",
        fontSize: 9,
        fontWeight: 900,
    }),
    badge: (category) => {
        const map = {
            ancient: { bg: "rgba(176,146,106,0.15)", color: "#8B6914" },
            modern: { bg: "rgba(139,92,246,0.12)", color: "#6d28d9" },
            contemporary: { bg: "rgba(16,185,129,0.12)", color: "#065f46" },
        };
        const c = map[category] || { bg: "#eee", color: "#333" };
        return {
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 50,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            background: c.bg,
            color: c.color,
            marginBottom: 4,
        };
    },
};

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
            <h2>1. ជ្រើសរើសគំរូ</h2>
            <p className="wb-help">ជ្រើសរើសគ្រោងសន្លឹកការណ៍ដែលចូលចិត្ត។</p>

            {/* Category filter */}
            <div style={styles.filterBar}>
                {TEMPLATE_CATEGORIES.map((cat) => {
                    const active = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            style={styles.filterBtn(active)}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span style={{ textTransform: "uppercase" }}>{cat.labelEn}</span>
                            <span style={styles.countPill(active)}>{countFor(cat.id)}</span>
                        </button>
                    );
                })}
            </div>

            {/* Template grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {filtered.map((t) => {
                    const isSelected = draft?.templateId === t.id;
                    const coverImage = t.phoneCoverImage || t.mainImage || t.image;
                    return (
                        <button
                            type="button"
                            key={t.id}
                            onClick={() => update({ templateId: t.id })}
                            style={{
                                border: isSelected
                                    ? "2px solid #7d6443"
                                    : "1px solid #d8cdb8",
                                borderRadius: 12,
                                padding: 8,
                                background: isSelected ? "#fffaf4" : "#fff",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                textAlign: "left",
                                boxShadow: isSelected
                                    ? "0 0 0 3px rgba(176,146,106,0.25)"
                                    : "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <img
                                src={coverImage}
                                alt={t.name}
                                style={{
                                    width: "100%",
                                    aspectRatio: "3/4",
                                    objectFit: "cover",
                                    borderRadius: 8,
                                }}
                            />
                            <div style={{ marginTop: 6 }}>
                                <span style={styles.badge(t.category)}>
                                    {categoryLabels[t.category]}
                                </span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                            <div style={{ fontSize: 12, color: "#7d6443" }}>{t.style}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
