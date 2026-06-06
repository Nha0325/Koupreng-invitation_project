import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../templates.css";
import { TEMPLATES, isTemplatePremium } from "../data/templatesData";
import { useAuth } from "../../../pages/auth/context/useAuth";
import heroBg from "../../../assets/icons/background.png";
import templateService from "../templateService";
import { getTemplateRouteId, isBackendPremium, mergeBackendTemplate } from "../templateCatalogAdapter";

const FEATURED_TEMPLATE_IDS = [
    "royal",
    "classic",
    "garden",
    "boho-chic",
    "terracotta",
];

const TEMPLATE_CARD_COVER = {
    royal: "/facebook/all/01-card/cover-card.jpg",
    classic: "/facebook/all/02-card/cover-card.jpg",
    garden: "/facebook/all/03-card/cover-card.jpg",
    "boho-chic": "/facebook/all/04-card/cover-card.jpg",
    terracotta: "/facebook/all/05-card/cover-card.jpg",
};

const categoryLabels = {
    ancient: "បុរាណ",
    modern: "ទំនើប",
    contemporary: "សហសម័យ",
};

function getCreatePath(path, isAuthenticated) {
    if (isAuthenticated) {
        return path;
    }

    return `/login?next=${encodeURIComponent(path)}`;
}

function getUseTemplatePath(templateId, isAuthenticated) {
    return getCreatePath(`/create/wedding?template=${templateId}`, isAuthenticated);
}

function getTemplateBenefit(template) {
    return template.description?.split("។")[0] || "គំរូសន្លឹកការដែលរួចរាល់សម្រាប់បង្ហាញ និង RSVP";
}

/**
 * TemplateGrid — public wedding templates gallery.
 * Click a card to view template details (phone preview).
 * "ប្រើប្រាស់គំរូនេះ" button requires login to create wedding.
 */
export default function TemplateGrid() {
    const { isAuthenticated } = useAuth();
    const [remoteTemplates, setRemoteTemplates] = useState([]);

    useEffect(() => {
        let mounted = true;
        templateService.listPublic()
            .then((templates) => {
                if (mounted) {
                    setRemoteTemplates(Array.isArray(templates) ? templates : []);
                }
            })
            .catch(() => {
                if (mounted) {
                    setRemoteTemplates([]);
                }
            });
        return () => {
            mounted = false;
        };
    }, []);

    const visibleTemplates = remoteTemplates.length
        ? remoteTemplates.map((template) => mergeBackendTemplate(template)).filter(Boolean)
        : FEATURED_TEMPLATE_IDS
            .map((templateId) => TEMPLATES.find((template) => template.id === templateId))
            .filter(Boolean);

    return (
        <div className="tp-page">
            <div className="tp-bg-overlay" aria-hidden="true">
                <div
                    className="tp-bg-image"
                    style={{ backgroundImage: `url(${heroBg})` }}
                ></div>
                <div className="tp-bg-gradient"></div>
            </div>

            <div className="tp-container">
                <header className="tp-header-section">
                    <span className="tp-label">Koupreng Premium Templates</span>
                    <h1 className="tp-title">
                        ជ្រើសរើស<span>គ្រោងសន្លឹកការណ៍</span>
                    </h1>
                    <div className="tp-divider">
                        <div className="tp-line"></div>
                        <div className="tp-diamond"></div>
                        <div className="tp-line"></div>
                    </div>
                </header>

                <div className="tp-grid">
                    {visibleTemplates.map((t) => {
                        const routeId = t.backendId ? getTemplateRouteId(t) : t.id;
                        const createPath = getUseTemplatePath(routeId, isAuthenticated);
                        const coverImage = TEMPLATE_CARD_COVER[t.id] || t.image;

                        const premium = t.backendId ? isBackendPremium(t) : isTemplatePremium(t.id);
                        const actionPath = premium
                            ? (isAuthenticated ? `/templates/${routeId}/checkout` : `/login?next=${encodeURIComponent(`/templates/${routeId}/checkout`)}`)
                            : createPath;

                        return (
                            <div key={t.id} className={`tp-card${premium ? " tp-card--premium" : ""}`}>
                                {t.popular && <div className="tp-popular-tag">✨ ពេញនិយម</div>}
                                {premium && <div className="tp-premium-tag">💎 Premium</div>}

                                {/* Category badge */}
                                <div className={`tp-category-badge tp-category-badge--${t.category}`}>
                                    {categoryLabels[t.category]}
                                </div>

                                <Link to={`/templates/${routeId}`} className="tp-image-box">
                                    <img
                                        src={coverImage}
                                        alt={t.name}
                                        className="tp-main-img"
                                    />
                                    <div className="tp-overlay">
                                        <span className="tp-view-btn">មើលលម្អិត</span>
                                    </div>
                                </Link>

                                <div className="tp-card-content">
                                    <h3 className="tp-card-name">{t.name}</h3>
                                    <span className="tp-style-name">
                                        {categoryLabels[t.category]} / {t.style}
                                    </span>
                                    <p className="tp-card-benefit">{getTemplateBenefit(t)}</p>
                                    <div className="tp-card-actions">
                                        <Link to={actionPath} className={`tp-action-btn${premium ? " tp-action-btn--buy" : ""}`}>
                                            {premium ? "ទិញគំរូ" : "ប្រើគំរូនេះ"}
                                        </Link>
                                        <Link to={`/templates/${routeId}`} className="tp-detail-btn">
                                            មើលលម្អិត
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="tp-card tp-custom-card">
                        <Link to={getCreatePath("/create/wedding", isAuthenticated)} className="tp-image-box tp-custom-box">
                            <div className="tp-custom-mark" aria-hidden="true">
                                <span></span>
                                <span></span>
                            </div>
                            <div className="tp-custom-preview" aria-hidden="true">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div className="tp-overlay">
                                <span className="tp-view-btn">ចាប់ផ្តើមបង្កើត</span>
                            </div>
                        </Link>

                        <div className="tp-card-content">
                            <h3 className="tp-card-name">បង្កើតផ្ទាល់ខ្លួន</h3>
                            <span className="tp-style-name">Custom Wedding Card</span>
                            <p className="tp-card-benefit">ចាប់ផ្តើមពីសន្លឹកទទេ ហើយកែតម្រូវព័ត៌មានតាមតម្រូវការ</p>
                            <Link to={getCreatePath("/create/wedding", isAuthenticated)} className="tp-action-btn tp-custom-action">
                                ប្រើការរចនាផ្ទាល់ខ្លួន
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
