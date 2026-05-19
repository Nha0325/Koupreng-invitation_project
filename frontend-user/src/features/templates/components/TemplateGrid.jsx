import { Link } from "react-router-dom";
import "../templates.css";
import { TEMPLATES } from "../data/templatesData";

/**
 * TemplateGrid — public wedding templates gallery.
 * Click a card image to open the template demo page.
 * Click "ប្រើប្រាស់គំរូនេះ" to go to the template detail.
 */
export default function TemplateGrid() {
    return (
        <div className="tp-page">
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
                    {TEMPLATES.map((t) => (
                        <div key={t.id} className="tp-card">
                            {t.popular && <div className="tp-popular-tag">✨ ពេញនិយម</div>}

                            <Link to={`/templates/${t.id}`} className="tp-image-box">
                                <img src={t.image} alt={t.name} className="tp-main-img" />
                                <div className="tp-overlay">
                                    <span className="tp-view-btn">មើលលម្អិត</span>
                                </div>
                            </Link>

                            <div className="tp-card-content">
                                <h3 className="tp-card-name">{t.name}</h3>
                                <span className="tp-style-name">{t.style}</span>
                                <Link to={`/create/wedding?template=${t.id}`} className="tp-action-btn">
                                    ប្រើប្រាស់គំរូនេះ
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
