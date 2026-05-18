import { useNavigate } from "react-router-dom";
import "./TemplatesPage.css";
import { TEMPLATES } from "./templatesData";

function TemplatesGallery() {
  const navigate = useNavigate();
  const open = (id) => navigate(`/templates/${id}`);
  const useTemplate = (id) => navigate(`/events/create?template=${id}`);

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

              <div className="tp-image-box">
                <img src={t.image} alt={t.name} className="tp-main-img" />
                <div className="tp-overlay">
                  <button
                    type="button"
                    className="tp-view-btn"
                    onClick={() => open(t.id)}
                  >
                    មើលលម្អិត
                  </button>
                </div>
              </div>

              <div className="tp-card-content">
                <h3 className="tp-card-name">{t.name}</h3>
                <span className="tp-style-name">{t.style}</span>
                <button
                  type="button"
                  className="tp-action-btn"
                  onClick={() => useTemplate(t.id)}
                >
                  ប្រើប្រាស់គំរូនេះ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplatesGallery;
