import { useEffect, useMemo, useState } from "react";
import {
    IoAddOutline,
    IoCheckmarkCircleOutline,
    IoDiamondOutline,
    IoEyeOutline,
    IoImageOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { templateCatalogService } from "../../../shared/services/templateCatalogService";
import { useBackendMessages } from "../../../shared/i18n/useBackendMessages";
import { getTemplateById, isTemplatePremium, TEMPLATES } from "../../templates/data/templatesData";
import { VARIANT_ROUTE_ALIASES } from "../../templates/template-experience/templateExperienceThemes";
import { getTemplateRouteId, isBackendPremium, mergeBackendTemplate } from "../../templates/templateCatalogAdapter";
import "./AddTemplateStep.css";

const TEMPLATES_FALLBACK = {
    km: {
        title: "បន្ថែមគម្រូ",
        subtitle: "ជ្រើសរើសគម្រូសម្រាប់ប្រើជាមួយសន្លឹកការរបស់អ្នក។",
        freeSection: "ឥតគិតថ្លៃ",
        paidSection: "ត្រូវការចំណាយ",
        noPriceTag: "ឥតគិតថ្លៃ",
        priceTag: "ត្រូវការចំណាយ",
        selectBtn: "ជ្រើសរើស",
        buyBtn: "ទិញគំរូ",
        viewBtn: "មើល",
        addedBtn: "បានបន្ថែមរួចហើយ",
        noImage: "មិនមានរូបភាព",
        loading: "កំពុងទាញគម្រូ...",
        error: "មិនអាចទាញគម្រូបាន",
    },
    en: {
        title: "Add Template",
        subtitle: "Choose a template for your invitation.",
        freeSection: "Free",
        paidSection: "Paid",
        noPriceTag: "Free",
        priceTag: "Paid",
        selectBtn: "Select",
        buyBtn: "Buy template",
        viewBtn: "View",
        addedBtn: "Already Added",
        noImage: "No image",
        loading: "Loading templates...",
        error: "Could not load templates",
    },
};

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
    ANCIENT: {
        label: "Ancient",
        color: "#b45309",
        bg: "rgba(180, 83, 9, 0.08)",
        border: "rgba(180, 83, 9, 0.28)",
    },
    CONTEMPORARY: {
        label: "Contemporary",
        color: "#be185d",
        bg: "rgba(190, 24, 93, 0.08)",
        border: "rgba(190, 24, 93, 0.28)",
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
    const key = String(category || "OTHER").trim().toUpperCase();
    return CATEGORY_STYLES[key] || CATEGORY_STYLES.OTHER;
}

function getViewTemplateId(template) {
    return template.viewId || template.localTemplateId || template.id || "classic";
}

function getCardImage(template) {
    if (template.thumbnailUrl || template.image) {
        return template.thumbnailUrl || template.image;
    }
    const viewId = getViewTemplateId(template);
    const realId = VARIANT_ROUTE_ALIASES[viewId] || viewId;
    const tpl = getTemplateById(realId);
    return tpl?.mainImage || tpl?.phoneCoverImage || null;
}

function normalizeRemoteTemplate(template) {
    const merged = mergeBackendTemplate(template);
    const routeId = getTemplateRouteId(merged) || String(template.id);
    const paid = isBackendPremium(merged);
    return {
        ...merged,
        id: routeId,
        backendId: merged.backendId || template.id,
        viewId: routeId,
        isPaid: paid,
        premium: paid,
    };
}

function normalizeLocalTemplate(template) {
    const paid = isTemplatePremium(template.id);
    return {
        ...template,
        viewId: template.id,
        localTemplateId: template.id,
        isPaid: paid,
        premium: paid,
        thumbnailUrl: template.phoneCoverImage || template.mainImage || template.image,
    };
}

function TemplateCard({ template, onSelect, onView, t }) {
    const category = getCategoryInfo(template.category);
    const cardImage = getCardImage(template);
    const isPaid = Boolean(template.isPaid || template.premium);

    return (
        <div className="at-card">
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

            <div className="at-card-image">
                {cardImage ? (
                    <img src={cardImage} alt={template.name} />
                ) : (
                    <div className="at-card-no-image">
                        <IoImageOutline aria-hidden="true" />
                        <span>{t("noImage")}</span>
                    </div>
                )}
            </div>

            <div className="at-card-body">
                <h4 className="at-card-name">{template.name}</h4>
                {isPaid ? (
                    <span className="at-card-price at-card-price--paid">{t("priceTag")}</span>
                ) : (
                    <span className="at-card-price">{t("noPriceTag")}</span>
                )}
            </div>

            <div className="at-card-actions">
                {template.added ? (
                    <span className="at-btn at-btn--added">
                        <IoCheckmarkCircleOutline className="at-btn-check" aria-hidden="true" />
                        {t("addedBtn")}
                    </span>
                ) : (
                    <button
                        className={`at-btn ${isPaid ? "at-btn--buy" : "at-btn--select"}`}
                        onClick={() => onSelect(template)}
                    >
                        {isPaid ? <IoDiamondOutline aria-hidden="true" /> : <IoAddOutline aria-hidden="true" />}
                        {isPaid ? t("buyBtn") : t("selectBtn")}
                    </button>
                )}
                <button className="at-btn at-btn--view" onClick={() => onView(template)}>
                    <IoEyeOutline aria-hidden="true" />
                    {t("viewBtn")}
                </button>
            </div>
        </div>
    );
}

export default function AddTemplateStep() {
    const { text: t } = useBackendMessages("templates", TEMPLATES_FALLBACK);
    const navigate = useNavigate();
    const [remoteTemplates, setRemoteTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setLoading(true);
        templateCatalogService.list()
            .then((items) => {
                if (active) {
                    setRemoteTemplates(Array.isArray(items) ? items : []);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setRemoteTemplates([]);
                    setError(err.message || t("error"));
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
    }, [t]);

    const templates = useMemo(() => {
        const source = remoteTemplates.length
            ? remoteTemplates.map(normalizeRemoteTemplate)
            : TEMPLATES.map(normalizeLocalTemplate);

        return source.map((template) => ({
            ...template,
            added: selectedTemplates.includes(String(template.id)),
        }));
    }, [remoteTemplates, selectedTemplates]);

    const handleSelect = (template) => {
        const viewId = getViewTemplateId(template);
        if (template.isPaid || template.premium || isTemplatePremium(viewId)) {
            navigate(`/templates/${viewId}/checkout`);
            return;
        }

        const templateId = String(template.id);
        setSelectedTemplates((current) =>
            current.includes(templateId) ? current : [...current, templateId]
        );

        const builderTemplateId = template.localTemplateId || viewId;
        navigate(`/create/wedding?template=${encodeURIComponent(builderTemplateId)}${template.backendId ? `&templateId=${encodeURIComponent(template.backendId)}` : ""}`);
    };

    const handleView = (template) => {
        const viewId = getViewTemplateId(template);
        if (template.previewUrl) {
            if (template.previewUrl.startsWith("/")) {
                navigate(template.previewUrl);
            } else {
                window.open(template.previewUrl, "_blank", "noopener,noreferrer");
            }
            return;
        }
        navigate(`/templates/browse/${viewId}`);
    };

    const freeTemplates = templates.filter((template) => !template.isPaid && !template.premium);
    const paidTemplates = templates.filter((template) => template.isPaid || template.premium);

    return (
        <div className="at-root">
            <h2>{t("title")}</h2>
            <p className="at-subtitle">{t("subtitle")}</p>

            {error && <div className="at-empty-state">{error}</div>}
            {loading && <div className="at-empty-state">{t("loading")}</div>}

            {!loading && freeTemplates.length > 0 && (
                <section className="at-section">
                    <div className="at-section-header">
                        <span className="at-section-icon"><IoCheckmarkCircleOutline aria-hidden="true" /></span>
                        <h3 className="at-section-title">{t("freeSection")}</h3>
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
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {!loading && paidTemplates.length > 0 && (
                <section className="at-section at-section--paid">
                    <div className="at-section-header">
                        <span className="at-section-icon at-section-icon--paid"><IoDiamondOutline aria-hidden="true" /></span>
                        <h3 className="at-section-title">{t("paidSection")}</h3>
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
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
