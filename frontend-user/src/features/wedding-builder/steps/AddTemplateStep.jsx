import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTemplateStep.css";
import { getTemplateById } from "../../templates/data/templatesData";
import { VARIANT_ROUTE_ALIASES } from "../../templates/template-experience/templateExperienceThemes";

/**
 * Event type template categories with free/paid templates
 */
const EVENT_CATEGORIES = [
    {
        id: "wedding",
        label: "Wedding",
        labelKh: "គម្រូអាពាហ៍ពិពាហ៍",
        color: "#dc2626",
        bg: "rgba(220, 38, 38, 0.08)",
        border: "rgba(220, 38, 38, 0.3)",
    },
    {
        id: "engagement",
        label: "Engagement",
        labelKh: "គម្រូភ្ជាប់ពាក្យ",
        color: "#d97706",
        bg: "rgba(217, 119, 6, 0.08)",
        border: "rgba(217, 119, 6, 0.3)",
    },
    {
        id: "birthday",
        label: "Birthday",
        labelKh: "គម្រូខួបកំណើត",
        color: "#7c3aed",
        bg: "rgba(124, 58, 237, 0.08)",
        border: "rgba(124, 58, 237, 0.3)",
    },
    {
        id: "housewarming",
        label: "Housewarming",
        labelKh: "គម្រូពិធីឡើងផ្ទះ",
        color: "#059669",
        bg: "rgba(5, 150, 105, 0.08)",
        border: "rgba(5, 150, 105, 0.3)",
    },
    {
        id: "anniversary",
        label: "Anniversary",
        labelKh: "គម្រូខួបអាពាហ៍ពិពាហ៍",
        color: "#b45309",
        bg: "rgba(180, 83, 9, 0.08)",
        border: "rgba(180, 83, 9, 0.3)",
    },
];

/**
 * Template cards data — free and paid
 */
const FREE_TEMPLATES = [
    {
        id: "W01",
        eventType: "wedding",
        name: "គម្រូអាពាហ៍ពិពាហ៍ (ឥតគិតថ្លៃ)",
        code: "W01",
        image: "/image/a1.png",
        added: true,
    },
    {
        id: "E01",
        eventType: "engagement",
        name: "គម្រូភ្ជាប់ពាក្យ​ (ឥតគិតថ្លៃ)",
        code: "E01",
        image: "/image/a2.png",
        added: false,
    },
    {
        id: "B01",
        eventType: "birthday",
        name: "គម្រូខួបកំណើត ឥតគិតថ្លៃ",
        code: "B01",
        image: "/image/a3.png",
        added: false,
    },
    {
        id: "H01",
        eventType: "housewarming",
        name: "គម្រូពិធីឡើងផ្ទះ ឥតគិតថ្លៃ",
        code: "H01",
        image: "/image/a4.png",
        added: false,
    },
    {
        id: "A01",
        eventType: "anniversary",
        name: "គម្រូខួបអាពាហ៍ពិពាហ៍ ឥតគិតថ្លៃ",
        code: "A01",
        image: "/image/a5.png",
        added: false,
    },
];

const PAID_TEMPLATES = [
    {
        id: "W02",
        eventType: "wedding",
        name: "សំបុត្រអាពាហ៍ពិពាហ៍ ប្រណិត (ពហុភាសា)",
        code: "W02",
        image: null,
        added: false,
    },
];

function getCategoryInfo(eventType) {
    return EVENT_CATEGORIES.find((cat) => cat.id === eventType) || EVENT_CATEGORIES[0];
}

/**
 * Map each demo template code to a real template id so the "View" button opens
 * the full immersive TemplateExperience page (/templates/:id) — the same UI as
 * /templates/classic — instead of the old phone-frame preview.
 */
const VIEW_TEMPLATE_ID = {
    W01: "royal",
    W02: "luxury",
    E01: "garden",
    B01: "modern-khmer",
    H01: "classic",
    A01: "vintage-gold",
};

function getViewTemplateId(template) {
    return VIEW_TEMPLATE_ID[template.id] || "classic";
}

/**
 * Resolve the REAL cover image of the template each card opens, so the browse
 * card thumbnail matches the actual template experience instead of generic art.
 * Falls back to the card's own placeholder image when no real cover exists.
 */
function getCardImage(template) {
    const viewId = getViewTemplateId(template);
    const realId = VARIANT_ROUTE_ALIASES[viewId] || viewId;
    const tpl = getTemplateById(realId);
    return tpl?.mainImage || tpl?.phoneCoverImage || template.image;
}

function TemplateCard({ template, onSelect, onView }) {
    const category = getCategoryInfo(template.eventType);
    const cardImage = getCardImage(template);

    return (
        <div className="at-card">
            {/* Category badge */}
            <span
                className="at-card-badge"
                style={{
                    background: category.bg,
                    color: category.color,
                    borderColor: category.border,
                }}
            >
                {category.label}
            </span>

            {/* Image */}
            <div className="at-card-image">
                {cardImage ? (
                    <img src={cardImage} alt={template.name} />
                ) : (
                    <div className="at-card-no-image">
                        <span>មិនមានរូបភាព</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="at-card-body">
                <h4 className="at-card-name">{template.name}</h4>
                {template.image === null ? (
                    <span className="at-card-price at-card-price--paid">ត្រូវការចំណាយ</span>
                ) : (
                    <span className="at-card-price">ឥតគិតថ្លៃ</span>
                )}
            </div>

            {/* Actions */}
            <div className="at-card-actions">
                {template.added ? (
                    <span className="at-btn at-btn--added">
                        <span className="at-btn-check">✓</span> បានបន្ថែមរួចហើយ
                    </span>
                ) : (
                    <button className="at-btn at-btn--select" onClick={() => onSelect(template)}>
                        + ជ្រើសរើស
                    </button>
                )}
                <button className="at-btn at-btn--view" onClick={() => onView(template)}>
                    <EyeIcon /> មើល
                </button>
            </div>
        </div>
    );
}

function EyeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function AddTemplateStep() {
    const navigate = useNavigate();
    const [selectedTemplates, setSelectedTemplates] = useState(["W01"]);

    const handleSelect = (template) => {
        setSelectedTemplates((current) =>
            current.includes(template.id) ? current : [...current, template.id]
        );
        // Start the wedding builder with the chosen template.
        navigate(`/create/wedding?template=${getViewTemplateId(template)}`);
    };

    const handleView = (template) => {
        // Open the full immersive TemplateExperience inside the dashboard shell
        // (keeps the host navigation), instead of the public marketing layout.
        navigate(`/templates/browse/${getViewTemplateId(template)}`);
    };

    const freeTemplates = FREE_TEMPLATES.map((t) => ({
        ...t,
        added: selectedTemplates.includes(t.id),
    }));

    const paidTemplates = PAID_TEMPLATES.map((t) => ({
        ...t,
        added: selectedTemplates.includes(t.id),
    }));

    return (
        <div className="at-root">
            <h2>បន្ថែមគម្រូ</h2>
            <p className="at-subtitle">
                បន្ថែមគម្រូសន្លឹកការណ៍សម្រាប់កម្មវិធីរបស់អ្នក។ រំកិលដើម្បីមើលគម្រូទាំងអស់។
            </p>

            {/* Free Templates Section */}
            <section className="at-section">
                <div className="at-section-header">
                    <span className="at-section-icon">✓</span>
                    <h3 className="at-section-title">ឥតគិតថ្លៃ</h3>
                    <span className="at-section-count">{freeTemplates.length}</span>
                </div>

                <div className="at-scroll-container">
                    <div className="at-cards-row">
                        {freeTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onSelect={handleSelect}
                                onView={handleView}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Paid Templates Section */}
            <section className="at-section at-section--paid">
                <div className="at-section-header">
                    <span className="at-section-icon at-section-icon--paid">💎</span>
                    <h3 className="at-section-title">ត្រូវការចំណាយ</h3>
                    <span className="at-section-count">{paidTemplates.length}</span>
                </div>

                <div className="at-scroll-container">
                    <div className="at-cards-row">
                        {paidTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={{
                                    ...template,
                                    added: selectedTemplates.includes(template.id),
                                }}
                                onSelect={handleSelect}
                                onView={handleView}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
