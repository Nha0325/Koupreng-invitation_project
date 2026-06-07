import { useEffect, useState } from "react";
import {
    IoAddOutline,
    IoCheckmarkCircleOutline,
    IoDiamondOutline,
    IoEyeOutline,
    IoImageOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { templateCatalogService } from "../../../shared/services/templateCatalogService";
import "./AddTemplateStep.css";

/**
 * Database template category styles.
 */
const CATEGORY_STYLES = {
    MODERN: {
        label: "Modern",
        color: "#0f766e",
        bg: "rgba(15, 118, 110, 0.08)",
        border: "rgba(15, 118, 110, 0.28)",
    },
    TRADITIONAL: {
        label: "Traditional",
        color: "#b45309",
        bg: "rgba(180, 83, 9, 0.08)",
        border: "rgba(180, 83, 9, 0.28)",
    },
    MINIMALIST: {
        label: "Minimalist",
        color: "#475569",
        bg: "rgba(71, 85, 105, 0.08)",
        border: "rgba(71, 85, 105, 0.28)",
    },
    FLORAL: {
        label: "Floral",
        color: "#be185d",
        bg: "rgba(190, 24, 93, 0.08)",
        border: "rgba(190, 24, 93, 0.28)",
    },
    LUXURY: {
        label: "Luxury",
        color: "#7c3aed",
        bg: "rgba(124, 58, 237, 0.08)",
        border: "rgba(124, 58, 237, 0.28)",
    },
    OTHER: {
        label: "Other",
        color: "#334155",
        bg: "rgba(51, 65, 85, 0.08)",
        border: "rgba(51, 65, 85, 0.28)",
    },
};

function getCategoryInfo(category) {
    return CATEGORY_STYLES[category] || CATEGORY_STYLES.OTHER;
}

function getCardImage(template) {
    return template.thumbnailUrl || null;
}

function TemplateCard({ template, onSelect, onView }) {
    const category = getCategoryInfo(template.category);
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
                        <IoImageOutline aria-hidden="true" />
                        <span>មិនមានរូបភាព</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="at-card-body">
                <h4 className="at-card-name">{template.name}</h4>
                {template.premium ? (
                    <span className="at-card-price at-card-price--paid">ត្រូវការចំណាយ</span>
                ) : (
                    <span className="at-card-price">ឥតគិតថ្លៃ</span>
                )}
            </div>

            {/* Actions */}
            <div className="at-card-actions">
                {template.added ? (
                    <span className="at-btn at-btn--added">
                        <IoCheckmarkCircleOutline className="at-btn-check" aria-hidden="true" />
                        បានបន្ថែមរួចហើយ
                    </span>
                ) : (
                    <button className="at-btn at-btn--select" onClick={() => onSelect(template)}>
                        <IoAddOutline aria-hidden="true" />
                        ជ្រើសរើស
                    </button>
                )}
                <button className="at-btn at-btn--view" onClick={() => onView(template)}>
                    <IoEyeOutline aria-hidden="true" />
                    មើល
                </button>
            </div>
        </div>
    );
}

export default function AddTemplateStep() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setLoading(true);
        templateCatalogService.list()
            .then((items) => {
                if (active) {
                    setTemplates(items || []);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load templates");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    const handleSelect = (template) => {
        const templateId = String(template.id);
        setSelectedTemplates((current) =>
            current.includes(templateId) ? current : [...current, templateId]
        );
        navigate(`/dashboard/invitations/new?templateId=${template.id}`);
    };

    const handleView = (template) => {
        if (template.previewUrl) {
            if (template.previewUrl.startsWith("/")) {
                navigate(template.previewUrl);
            } else {
                window.open(template.previewUrl, "_blank", "noopener,noreferrer");
            }
            return;
        }
        navigate(`/dashboard/invitations/new?templateId=${template.id}`);
    };

    const freeTemplates = templates.filter((template) => !template.premium).map((t) => ({
        ...t,
        added: selectedTemplates.includes(String(t.id)),
    }));

    const paidTemplates = templates.filter((template) => template.premium).map((t) => ({
        ...t,
        added: selectedTemplates.includes(String(t.id)),
    }));

    return (
        <div className="at-root">
            <h2>បន្ថែមគម្រូ</h2>
            <p className="at-subtitle">
                គម្រូទាំងនេះទាញពី Database សម្រាប់ប្រើជាមួយសន្លឹកការរបស់អ្នក។
            </p>

            {error && <div className="at-empty-state">{error}</div>}
            {loading && <div className="at-empty-state">កំពុងទាញគម្រូពី Database...</div>}
            {!loading && templates.length === 0 && (
                <div className="at-empty-state">មិនទាន់មានគម្រូនៅក្នុង Database</div>
            )}

            {/* Free Templates Section */}
            {!loading && freeTemplates.length > 0 && <section className="at-section">
                <div className="at-section-header">
                    <span className="at-section-icon"><IoCheckmarkCircleOutline aria-hidden="true" /></span>
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
            </section>}

            {/* Paid Templates Section */}
            {!loading && paidTemplates.length > 0 && <section className="at-section at-section--paid">
                <div className="at-section-header">
                    <span className="at-section-icon at-section-icon--paid"><IoDiamondOutline aria-hidden="true" /></span>
                    <h3 className="at-section-title">ត្រូវការចំណាយ</h3>
                    <span className="at-section-count">{paidTemplates.length}</span>
                </div>

                <div className="at-scroll-container">
                    <div className="at-cards-row">
                        {paidTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onSelect={handleSelect}
                                onView={handleView}
                            />
                        ))}
                    </div>
                </div>
            </section>}
        </div>
    );
}
