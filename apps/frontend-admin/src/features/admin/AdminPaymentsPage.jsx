import { useMemo, useState } from "react";
import { Loading, ErrorState, Empty } from "../../components/States";
import { useResource } from "../../hooks/useResource";
import { formatDate } from "../../lib/format";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

function money(amount, currency = "USD") {
  if (amount === null || amount === undefined || amount === "") return "—";
  return `${currency || "USD"} ${amount}`;
}

export default function AdminPaymentsPage() {
  const { data, loading, error, reload } = useResource(adminManagementService.payments);
  const [query, setQuery] = useState("");

  const payments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || []).filter((payment) => {
      if (!q) return true;
      return [
        payment.orderCode,
        payment.templateName,
        payment.packageName,
        payment.status,
        payment.provider,
        payment.itemType,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
    });
  }, [data, query]);

  const totals = useMemo(() => {
    const rows = data || [];
    return {
      total: rows.length,
      pending: rows.filter((row) => String(row.status || "").includes("PENDING")).length,
      paid: rows.filter((row) => String(row.status || "") === "PAID").length,
      failed: rows.filter((row) => ["FAILED", "REJECTED", "CANCELLED"].includes(String(row.status || ""))).length,
    };
  }, [data]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Payments</h2>
          <p className="page-subtitle">Template and subscription payment orders from the active admin API.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={reload}>Refresh</button>
      </div>

      <section className="admin-feature-grid">
        <article className="admin-feature-card"><span>Total</span><strong>{totals.total}</strong></article>
        <article className="admin-feature-card"><span>Pending</span><strong>{totals.pending}</strong></article>
        <article className="admin-feature-card"><span>Paid</span><strong>{totals.paid}</strong></article>
        <article className="admin-feature-card"><span>Failed</span><strong>{totals.failed}</strong></article>
      </section>

      <section className="card">
        <div className="toolbar">
          <input className="text-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search payments..." />
        </div>

        {loading ? <Loading /> : error ? <ErrorState onRetry={reload} /> : payments.length === 0 ? <Empty /> : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Provider</th>
                  <th>Created</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.orderCode}>
                    <td>{payment.orderCode || "—"}</td>
                    <td>{payment.templateName || payment.packageName || "—"}</td>
                    <td>{payment.itemType || "TEMPLATE"}</td>
                    <td>{money(payment.amount, payment.currency)}</td>
                    <td><span className={`badge ${payment.status === "PAID" ? "badge-green" : "badge-gray"}`}>{payment.status || "—"}</span></td>
                    <td>{payment.provider || "—"}</td>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td>{formatDate(payment.paidAt)}</td>
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
