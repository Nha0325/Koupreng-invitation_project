import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loading, ErrorState, Empty } from "../../components/States";
import Toast from "../../components/Toast";
import { useResource } from "../../hooks/useResource";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../lib/format";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

export default function AdminTemplatesPage() {
  const { data, setData, loading, error, reload } = useResource(adminManagementService.templates);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const { toast, show, clear } = useToast();

  const templates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || []).filter((template) => {
      if (!q) return true;
      return [template.name, template.category, template.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [data, query]);

  const replaceTemplate = (updated) => {
    setData((current) => (current || []).map((item) => (item.id === updated.id ? updated : item)));
  };

  const runAction = async (template, action) => {
    if (!window.confirm(`${action} template "${template.name}"?`)) return;
    setBusyId(template.id);
    try {
      if (action === "delete") {
        await adminManagementService.deleteTemplate(template.id);
        setData((current) => (current || []).filter((item) => item.id !== template.id));
      } else {
        const updated = action === "activate"
          ? await adminManagementService.activateTemplate(template.id)
          : await adminManagementService.deactivateTemplate(template.id);
        replaceTemplate(updated);
      }
      show("Template updated successfully");
    } catch (err) {
      show(err?.message || "Template action failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  const togglePremium = async (template) => {
    setBusyId(template.id);
    try {
      replaceTemplate(await adminManagementService.updateTemplatePremium(template.id, !template.premium));
      show("Premium flag updated");
    } catch (err) {
      show(err?.message || "Premium update failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Templates</h2>
          <p className="page-subtitle">Create, update, activate, deactivate, and mark premium templates.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/templates/new">New template</Link>
      </div>

      <section className="card">
        <div className="toolbar">
          <input className="text-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates..." />
          <button type="button" className="btn btn-ghost" onClick={reload}>Refresh</button>
        </div>

        {loading ? <Loading /> : error ? <ErrorState onRetry={reload} /> : templates.length === 0 ? <Empty /> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Premium</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td>{template.id}</td>
                    <td><Link className="btn btn-ghost btn-sm" to={`/admin/templates/${template.id}`}>{template.name}</Link></td>
                    <td>{template.category || "OTHER"}</td>
                    <td><span className={`badge ${template.premium ? "badge-gold" : "badge-gray"}`}>{template.premium ? "PREMIUM" : "FREE"}</span></td>
                    <td><span className={`badge ${template.status === "ACTIVE" ? "badge-green" : "badge-gray"}`}>{template.status || "—"}</span></td>
                    <td>{formatDate(template.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-ghost btn-sm" disabled={busyId === template.id} onClick={() => togglePremium(template)}>
                          {template.premium ? "Free" : "Premium"}
                        </button>
                        {template.status === "ACTIVE" ? (
                          <button type="button" className="btn btn-danger btn-sm" disabled={busyId === template.id} onClick={() => runAction(template, "deactivate")}>Deactivate</button>
                        ) : (
                          <button type="button" className="btn btn-primary btn-sm" disabled={busyId === template.id} onClick={() => runAction(template, "activate")}>Activate</button>
                        )}
                        <button type="button" className="btn btn-danger btn-sm" disabled={busyId === template.id} onClick={() => runAction(template, "delete")}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <Toast toast={toast} onClose={clear} />
    </div>
  );
}
