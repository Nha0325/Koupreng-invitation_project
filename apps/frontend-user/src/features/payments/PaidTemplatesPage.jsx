import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoDiamondOutline,
  IoSparkles,
  IoCheckmarkCircle,
  IoArrowForwardOutline,
  IoCalendarOutline,
  IoColorPaletteOutline,
  IoEyeOutline,
  IoAddCircleOutline,
  IoChevronForwardOutline,
  IoHomeOutline,
} from "react-icons/io5";

import { paymentService } from "./paymentService";
import { getTemplateById, KEEP_TEMPLATE_CODE } from "../templates/data/templatesData";
import "./PaymentPages.css";

export default function PaidTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    paymentService
      .paidTemplates()
      .then((data) => {
        if (active) {
          setTemplates(data || []);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load paid templates");
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

  return (
    <div className="dash-main paid-templates-page">
      <div className="paid-templates-container">
        {/* Breadcrumb Navigation */}
        <nav className="paid-breadcrumb">
          <Link to="/dashboard" className="paid-breadcrumb-link">
            <IoHomeOutline />
            <span>ផ្ទាំងគ្រប់គ្រង</span>
          </Link>
          <IoChevronForwardOutline className="paid-breadcrumb-sep" />
          <span className="paid-breadcrumb-active">គំរូដែលបានទិញ</span>
        </nav>

        {/* Page Header */}
        <header className="paid-header-banner">
          <div className="paid-header-info">
            <div className="paid-header-tag">
              <IoDiamondOutline />
              <span>PREMIUM LIFETIME ACCESS</span>
            </div>
            <h1 className="paid-header-title">
              គំរូធៀបការ <span className="gold-text">បានទិញរួច</span>
              {templates.length > 0 && (
                <span className="paid-count-badge">{templates.length} គំរូ</span>
              )}
            </h1>
            <p className="paid-header-desc">
              បញ្ជីគំរូ Premium ដែលអ្នកបានទូទាត់ប្រាក់ជោគជ័យ។ អ្នកអាចជ្រើសរើសដើម្បីចាប់ផ្តើមបង្កើតធៀបការមង្គលការបានគ្រប់ពេលវេលា។
            </p>
          </div>

          <div className="paid-header-actions">
            <Link to="/templates/browse" className="paid-btn-browse">
              <IoAddCircleOutline />
              <span>ស្វែងរកគំរូថ្មីៗ</span>
            </Link>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="paid-loading-card">
            <span className="checkout-spinner"></span>
            <p>កំពុងទាញយកបញ្ជីគំរូដែលបានទិញ...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="paid-alert-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <section className="paid-empty-state">
            <div className="paid-empty-icon">
              <IoColorPaletteOutline />
            </div>
            <h2 className="paid-empty-title">មិនទាន់មានគំរូដែលបានទិញនៅឡើយទេ</h2>
            <p className="paid-empty-desc">
              លោកអ្នកមិនទាន់បានទិញគំរូ Premium ណាមួយឡើយ។ សូមចូលទៅកាន់ទំព័រគំរូធៀបការ ដើម្បីជ្រើសរើស និងទិញគំរូប្រណិតៗបែបខ្មែរទំនើប។
            </p>
            <Link to="/templates/browse" className="paid-empty-btn">
              <IoSparkles /> ស្វែងរកគំរូធៀបការ (Browse Templates)
            </Link>
          </section>
        )}

        {/* Grid of Unlocked Templates */}
        {!loading && templates.length > 0 && (
          <div className="paid-grid">
            {templates.map((item) => {
              const targetCode =
                item.templateId || item.templateCode || item.templateSlug || KEEP_TEMPLATE_CODE;
              const meta = getTemplateById(targetCode);
              const displayName =
                item.templateName || meta?.name || meta?.style || "Garden Royal Khmer Wedding";
              const coverImg =
                meta?.mainImage || meta?.image || "/facebook/all/03-card/cover-card.jpg";
              const category = meta?.category === "ancient" ? "បុរាណ / Ancient" : "ទំនើប / Modern";

              return (
                <article className="paid-card-item" key={`${item.templateId}-${item.createdAt}`}>
                  {/* Thumbnail Banner */}
                  <div className="paid-card-media">
                    <img src={coverImg} alt={displayName} className="paid-card-img" />
                    <div className="paid-card-badge-row">
                      <span className="paid-badge-unlocked">
                        <IoCheckmarkCircle /> UNLOCKED
                      </span>
                      <span className="paid-badge-type">
                        {item.accessType || "LIFETIME"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="paid-card-body">
                    <span className="paid-card-cat">{category}</span>
                    <h3 className="paid-card-title">{displayName}</h3>

                    <div className="paid-card-meta">
                      {item.createdAt && (
                        <div className="paid-meta-row">
                          <IoCalendarOutline />
                          <span>ទិញនៅ៖ {new Date(item.createdAt).toLocaleDateString("km-KH")}</span>
                        </div>
                      )}
                      <div className="paid-meta-row">
                        <IoDiamondOutline />
                        <span>សិទ្ធិប្រើប្រាស់ពេញលេញ (Unlimited Guests)</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="paid-card-actions">
                      <Link
                        to={`/create/wedding?template=${targetCode}`}
                        className="paid-btn-use"
                      >
                        <IoSparkles />
                        <span>បង្កើតធៀបការ (Use Template)</span>
                        <IoArrowForwardOutline />
                      </Link>

                      <Link
                        to={`/templates/${targetCode}/demo`}
                        className="paid-btn-preview"
                        title="មើលគំរូផ្ទាល់"
                      >
                        <IoEyeOutline />
                        <span>មើលគំរូ</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
