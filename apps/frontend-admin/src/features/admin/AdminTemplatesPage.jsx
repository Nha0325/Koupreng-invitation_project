import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loading, ErrorState, Empty } from "../../components/States";
import { useResource } from "../../hooks/useResource";
import { formatDate } from "../../lib/format";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

export default function AdminTemplatesPage() {
  const { data, loading, error, reload } = useResource(adminManagementService.templates);
  const [query, setQuery] = useState("");

  const templates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || []).filter((template) => {
      if (!q) return true;
      return [template.name, template.category, template.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [data, query]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Templates</h2>
          <p className="page-subtitle">Only the Garden Royal Khmer Wedding template is available. Creation is disabled to keep the catalog single-template.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/templates">Single template mode</Link>
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
                        <Link className="btn btn-ghost btn-sm" to={`/admin/templates/${template.id}`}>Edit</Link>
                        <span className="badge badge-gray">Locked</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
