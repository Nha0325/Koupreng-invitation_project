import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoAddOutline,
  IoCheckmarkCircleOutline,
  IoDiamondOutline,
  IoEyeOutline,
  IoImageOutline,
  IoSearchOutline,
  IoSparkles,
} from "react-icons/io5";

import { templateCatalogService } from "@/features/templates/api/templateCatalogApi";
import { useBackendMessages } from "@/shared/i18n/useBackendMessages";
import { SkeletonTable } from "@/shared/ui";
import "./BrowseTemplatesPage.css";

const CATEGORIES = [
  { id: "ALL", label: "ទាំងអស់" },
  { id: "FREE", label: "ឥតគិតថ្លៃ (Free)" },
  { id: "PREMIUM", label: "Premium" },
  { id: "MODERN", label: "សម័យទំនើប (Modern)" },
  { id: "TRADITIONAL", label: "ប្រពៃណីខ្មែរ (Traditional)" },
  { id: "FLORAL", label: "ផ្កាភ្ញី (Floral)" },
  { id: "LUXURY", label: "ប្រណិត (Luxury)" },
  { id: "MINIMALIST", label: "បែបសាមញ្ញ (Minimalist)" },
];

export default function BrowseTemplatesFeature() {
  const { text: t } = useBackendMessages("templates");
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    templateCatalogService
      .list()
      .then((items) => {
        if (active) {
          setTemplates(items || []);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "មិនអាចទាញយកគំរូធៀបការបានទេ");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const isPremium = (tpl) => Boolean(tpl?.premium || tpl?.isPremium || Number(tpl?.price) > 0);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const prem = isPremium(tpl);
      // Category filter
      if (activeCategory === "FREE" && prem) return false;
      if (activeCategory === "PREMIUM" && !prem) return false;
      if (
        !["ALL", "FREE", "PREMIUM"].includes(activeCategory) &&
        String(tpl.category || "").toUpperCase() !== activeCategory
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = String(tpl.name || "").toLowerCase().includes(query);
        const descMatch = String(tpl.description || "").toLowerCase().includes(query);
        const catMatch = String(tpl.category || "").toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [templates, activeCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = templates.length;
    const free = templates.filter((t) => !isPremium(t)).length;
    const premium = templates.filter((t) => isPremium(t)).length;
    return { total, free, premium };
  }, [templates]);

  const handleSelect = (template) => {
    navigate(`/create/wedding?templateId=${template.id || template.slug || ""}`);
  };

  const handlePreview = (template) => {
    if (template.previewUrl) {
      if (template.previewUrl.startsWith("/")) {
        navigate(template.previewUrl);
      } else {
        window.open(template.previewUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }
    navigate(`/create/wedding?templateId=${template.id || template.slug || ""}`);
  };

  return (
    <main className="dash-main pe-guests-page pe-templates-browse-page">
      {/* Header */}
      <header className="dash-page-header">
        <div>
          <span className="dash-kicker">
            <IoSparkles /> Wedding Template Catalog
          </span>
          <h1>ស្វែងរកគំរូធៀបការ (Templates)</h1>
          <p>ជ្រើសរើសគំរូធៀបការអាពាហ៍ពិពាហ៍បែបឌីជីថលដែលស្រស់ស្អាត ទាន់សម័យ និងត្រូវចិត្តរបស់អ្នក។</p>
        </div>
      </header>

      {/* Stats Summary matching GuestsPage */}
      <section className="pe-summary-grid">
        <article className="pe-summary-card">
          <span>គំរូសរុបទាំងអស់</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="pe-summary-card">
          <span style={{ color: "#0f766e" }}>គំរូឥតគិតថ្លៃ (Free)</span>
          <strong style={{ color: "#0f766e" }}>{stats.free}</strong>
        </article>
        <article className="pe-summary-card">
          <span style={{ color: "var(--brand-primary)" }}>គំរូ Premium</span>
          <strong style={{ color: "var(--brand-primary)" }}>{stats.premium}</strong>
        </article>
        <article className="pe-summary-card">
          <span>លទ្ធផលស្វែងរក</span>
          <strong>{filteredTemplates.length}</strong>
        </article>
      </section>

      {/* Toolbar & Filters */}
      <section className="tb-toolbar">
        <div className="tb-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`tb-category-chip ${activeCategory === cat.id ? "active" : ""}`}
            >
              {cat.id === "PREMIUM" && <IoDiamondOutline />}
              {cat.id === "FREE" && <IoCheckmarkCircleOutline />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="tb-search-wrap">
          <IoSearchOutline />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះគំរូ..."
            className="tb-search-input"
          />
        </div>
      </section>

      {/* Content Grid */}
      {loading ? (
        <SkeletonTable rows={4} columns={4} />
      ) : error ? (
        <div className="tb-empty">{error}</div>
      ) : filteredTemplates.length === 0 ? (
        <div className="tb-empty">
          <h3>មិនមានគំរូធៀបការដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ</h3>
          <p style={{ margin: "8px 0 0", fontSize: "0.875rem" }}>
            សូមសាកល្បងជ្រើសរើសប្រភេទផ្សេង ឬស្វែងរកដោយប្រើពាក្យគន្លឹះផ្សេង។
          </p>
        </div>
      ) : (
        <section className="tb-grid">
          {filteredTemplates.map((template) => (
            <article key={template.id} className="tb-card">
              {/* Media Preview */}
              <div className="tb-card-media">
                <div className="tb-card-badges">
                  <span className={`tb-badge ${isPremium(template) ? "tb-badge-paid" : "tb-badge-free"}`}>
                    {isPremium(template) ? "Premium" : "Free"}
                  </span>
                  {template.category && (
                    <span className="tb-badge tb-badge-cat">{template.category}</span>
                  )}
                </div>

                {template.thumbnailUrl ? (
                  <img src={template.thumbnailUrl} alt={template.name} loading="lazy" />
                ) : (
                  <div style={{ color: "var(--brand-text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <IoImageOutline style={{ fontSize: "2rem" }} />
                    <span style={{ fontSize: "0.75rem" }}>គំរូធៀបការ</span>
                  </div>
                )}
              </div>

              {/* Body Info */}
              <div className="tb-card-body">
                <h3 className="tb-card-title">{template.name}</h3>
                {template.description && (
                  <p className="tb-card-desc">{template.description}</p>
                )}

                {/* Actions */}
                <div className="tb-card-actions">
                  <button
                    type="button"
                    onClick={() => handleSelect(template)}
                    className="tb-btn-select"
                  >
                    <IoAddOutline style={{ fontSize: "1.1rem" }} />
                    <span>ជ្រើសរើសគំរូនេះ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreview(template)}
                    className="tb-btn-preview"
                    title="មើលគំរូផ្ទាល់"
                  >
                    <IoEyeOutline style={{ fontSize: "1.1rem" }} />
                    <span>មើល</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
