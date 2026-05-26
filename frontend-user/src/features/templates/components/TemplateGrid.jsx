import { Link } from "react-router-dom";
import "../templates.css";
import { TEMPLATES } from "../data/templatesData";
import { useAuth } from "../../../pages/auth/context/useAuth";
import heroBg from "../../../assets/icons/background.png";

const FEATURED_TEMPLATE_IDS = [
    "royal",
    "classic",
    "garden",
    "boho-chic",
    "terracotta",
];

function sourceMedia(sourceFolder, count) {
    const sourceNumber = sourceFolder.slice(0, 2);

    return Array.from({ length: count }, (_, index) => (
        `/facebook/all/${sourceFolder}/${sourceNumber}-${String(index + 1).padStart(2, "0")}.jpg`
    ));
}

function sourceGroup(...sources) {
    return sources.flatMap(([sourceFolder, count]) => sourceMedia(sourceFolder, count));
}

const TEMPLATE_CARD_MEDIA = {
    royal: sourceGroup(["01-card-01-story", 9]),
    classic: sourceGroup(
        ["02-card-02-curtain-post", 3],
        ["03-card-02-video", 11],
        ["04-card-02-reel-01", 12],
        ["05-card-02-reel-02", 11],
        ["06-card-02-reel-03", 11],
    ),
    garden: sourceGroup(
        ["07-story-image-01", 5],
        ["08-story-image-02", 6],
        ["09-story-image-03", 5],
        ["10-story-image-04", 5],
    ),
    "boho-chic": sourceGroup(
        ["11-story-image-05", 5],
        ["12-story-image-06", 6],
        ["13-story-image-07", 5],
        ["14-story-image-08", 5],
    ),
    terracotta: sourceGroup(
        ["15-story-image-09", 7],
        ["16-pichpisey-post-01", 5],
        ["17-story-image-10", 5],
        ["18-pichpisey-post-02", 6],
        ["19-story-image-11", 6],
    ),
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
    const visibleTemplates = FEATURED_TEMPLATE_IDS
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
                        const createPath = getUseTemplatePath(t.id, isAuthenticated);
                        const cardMedia = TEMPLATE_CARD_MEDIA[t.id] || [t.image];
                        const visibleMedia = cardMedia.slice(0, 4);
                        const extraMediaCount = cardMedia.length - visibleMedia.length;

                        return (
                            <div key={t.id} className="tp-card">
                                {t.popular && <div className="tp-popular-tag">✨ ពេញនិយម</div>}

                                {/* Category badge */}
                                <div className={`tp-category-badge tp-category-badge--${t.category}`}>
                                    {categoryLabels[t.category]}
                                </div>

                                <Link to={`/templates/${t.id}`} className={`tp-image-box${cardMedia.length > 1 ? " tp-image-box-collage" : ""}`}>
                                    {visibleMedia.map((imageUrl, index) => (
                                        <span key={imageUrl} className="tp-media-frame">
                                            <img
                                                src={imageUrl}
                                                alt={`${t.name} ${index + 1}`}
                                                className="tp-main-img"
                                            />
                                            {index === visibleMedia.length - 1 && extraMediaCount > 0 && (
                                                <span className="tp-media-count">+{extraMediaCount}</span>
                                            )}
                                        </span>
                                    ))}
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
                                        <Link to={createPath} className="tp-action-btn">
                                            ប្រើគំរូនេះ
                                        </Link>
                                        <Link to={`/templates/${t.id}`} className="tp-detail-btn">
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
