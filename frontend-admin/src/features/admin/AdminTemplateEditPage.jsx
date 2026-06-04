import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../../components/Toast";
import { useToast } from "../../hooks/useToast";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

const EMPTY_TEMPLATE = {
  name: "",
  category: "OTHER",
  thumbnailUrl: "",
  previewUrl: "",
  premium: false,
  status: "ACTIVE",
};

export default function AdminTemplateEditPage() {
  const { templateId } = useParams();
  const isNew = templateId === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_TEMPLATE);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast, show, clear } = useToast();

  useEffect(() => {
    if (isNew) return;
    let active = true;
    adminManagementService.template(templateId)
      .then((template) => active && setForm({
        name: template.name || "",
        category: template.category || "OTHER",
        thumbnailUrl: template.thumbnailUrl || "",
        previewUrl: template.previewUrl || "",
        premium: Boolean(template.premium),
        status: template.status || "ACTIVE",
      }))
      .catch((err) => active && setError(err?.message || "Could not load template"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [isNew, templateId]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = isNew
        ? await adminManagementService.createTemplate(form)
        : await adminManagementService.updateTemplate(templateId, form);
      show("Template saved successfully");
      navigate(`/admin/templates/${saved.id}`, { replace: true });
    } catch (err) {
      setError(err?.message || "Template save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="state"><div className="spinner" />Loading template...</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">{isNew ? "New template" : "Edit template"}</h2>
          <p className="page-subtitle">Template catalog data used by invitation builders.</p>
        </div>
        <Link className="btn btn-ghost" to="/admin/templates">Back</Link>
      </div>

      <form className="card" onSubmit={submit}>
        {error && <div className="login-error">{error}</div>}
        <div className="admin-form-grid">
          <label>Name<input className="text-input" value={form.name} onChange={(event) => setField("name", event.target.value)} required /></label>
          <label>Category
            <select className="select" value={form.category} onChange={(event) => setField("category", event.target.value)}>
              {["MODERN", "TRADITIONAL", "MINIMALIST", "FLORAL", "LUXURY", "OTHER"].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label>Status
            <select className="select" value={form.status} onChange={(event) => setField("status", event.target.value)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
          <label>Premium
            <select className="select" value={form.premium ? "true" : "false"} onChange={(event) => setField("premium", event.target.value === "true")}>
              <option value="false">FREE</option>
              <option value="true">PREMIUM</option>
            </select>
          </label>
          <label>Thumbnail URL<input className="text-input" value={form.thumbnailUrl} onChange={(event) => setField("thumbnailUrl", event.target.value)} /></label>
          <label>Preview URL<input className="text-input" value={form.previewUrl} onChange={(event) => setField("previewUrl", event.target.value)} /></label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save template"}</button>
      </form>
      <Toast toast={toast} onClose={clear} />
    </div>
  );
}
