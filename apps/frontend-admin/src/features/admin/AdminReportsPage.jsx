import { useEffect, useState } from "react";
import { Loading, ErrorState } from "../../components/States";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

const REPORTS = [
  { key: "users", label: "Users" },
  { key: "invitations", label: "Invitations" },
  { key: "payments", label: "Payments" },
  { key: "rsvp", label: "RSVP" },
  { key: "system", label: "System" },
];

export default function AdminReportsPage() {
  const [active, setActive] = useState("users");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminManagementService.report(active);
        if (!mounted) return;
        setReport(data);
        setError("");
      } catch (err) {
        if (mounted) setError(err?.message || "Could not load report");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [active]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Reports</h2>
          <p className="page-subtitle">Users, invitations, payments, RSVP, and system reports.</p>
        </div>
      </div>

      <div className="admin-tabs">
        {REPORTS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`btn ${active === item.key ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <>
          <section className="admin-feature-grid">
            {Object.entries(report?.summary || {}).map(([key, value]) => (
              <article key={key} className="admin-feature-card">
                <span>{key}</span>
                <strong>{String(value)}</strong>
              </article>
            ))}
          </section>
          <section className="card">
            <GenericRows rows={report?.rows || []} />
          </section>
        </>
      )}
    </div>
  );
}

function GenericRows({ rows }) {
  const columns = Array.from(rows.reduce((set, row) => {
    Object.keys(row || {}).slice(0, 8).forEach((key) => set.add(key));
    return set;
  }, new Set()));

  if (!rows.length || !columns.length) {
    return <div className="state">No row data for this report.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>
          {rows.slice(0, 100).map((row, index) => (
            <tr key={row.id || row.orderCode || index}>
              {columns.map((column) => <td key={column}><Value value={row[column]} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Value({ value }) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return <span className="admin-json">{JSON.stringify(value)}</span>;
  return String(value);
}
