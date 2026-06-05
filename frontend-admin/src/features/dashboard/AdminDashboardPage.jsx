import { Link } from "react-router-dom";
import { Loading, ErrorState } from "../../components/States";
import { useResource } from "../../hooks/useResource";
import { formatMoney, formatDateTime } from "../../lib/format";
import dashboardService from "./dashboardService";
import "../admin/AdminFeature.css";

export default function AdminDashboardPage() {
  const { data, loading, error, reload } = useResource(dashboardService.summary);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorState onRetry={reload} />;

  const stats = [
    ["Users", data.totalUsers, `${data.activeUsers} active`],
    ["Templates", data.totalTemplates, `${data.premiumTemplates} premium`],
    ["Invitations", data.totalInvitations, `${data.publishedInvitations} published`],
    ["Guests", data.totalGuests, "Across all invitations"],
    ["Payments", data.totalPayments, `${data.failedPayments} failed`],
    ["Revenue", formatMoney(data.totalRevenue), data.systemHealthSummary],
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">ផ្ទាំងគ្រប់គ្រង Admin</h2>
          <p className="page-subtitle">System analytics, recent activity, and operational health</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={reload}>Refresh</button>
      </div>

      <section className="admin-feature-grid">
        {stats.map(([label, value, note]) => (
          <article key={label} className="admin-feature-card">
            <span>{label}</span>
            <strong>{value}</strong>
            <p className="admin-muted">{note}</p>
          </article>
        ))}
      </section>

      <div className="stat-grid">
        <section className="card">
          <div className="page-head">
            <h3 className="page-title" style={{ fontSize: 16 }}>Recent users</h3>
            <Link className="btn btn-ghost btn-sm" to="/admin/users">Users</Link>
          </div>
          <MiniTable rows={data.recentUsers || []} columns={["fullName", "email", "role", "status"]} />
        </section>

        <section className="card">
          <div className="page-head">
            <h3 className="page-title" style={{ fontSize: 16 }}>Recent payments</h3>
            <Link className="btn btn-ghost btn-sm" to="/admin/reports">Reports</Link>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Order</th><th>Status</th><th>Amount</th><th>Paid</th></tr>
              </thead>
              <tbody>
                {(data.recentPayments || []).map((payment) => (
                  <tr key={payment.orderCode}>
                    <td>{payment.orderCode}</td>
                    <td><span className={`badge ${payment.status === "PAID" ? "badge-green" : "badge-amber"}`}>{payment.status}</span></td>
                    <td>{formatMoney(payment.paidAmount ?? payment.amount, payment.currency)}</td>
                    <td>{formatDateTime(payment.paidAt)}</td>
                  </tr>
                ))}
                {!data.recentPayments?.length && <tr><td colSpan="4">No payments yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniTable({ rows, columns }) {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id || row.orderCode}>
              {columns.map((column) => <td key={column}>{row[column] || "—"}</td>)}
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={columns.length}>No records yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
