import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminPageHeader, StatCard, StatusBadge } from "../../components/AdminUI";
import { Loading, ErrorState } from "../../components/States";
import { useResource } from "../../hooks/useResource";
import { formatMoney, formatDateTime } from "../../lib/format";
import dashboardService from "./dashboardService";
import "../admin/AdminFeature.css";

export default function AdminDashboardPage() {
  const { data, loading, error, reload } = useResource(dashboardService.summary);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      dashboardService.analyticsOverview(),
      dashboardService.analyticsRevenue(),
      dashboardService.analyticsTemplates(),
      dashboardService.analyticsDelivery(),
      dashboardService.analyticsRsvp(),
      dashboardService.analyticsCheckIn(),
      dashboardService.systemHealth(),
      dashboardService.alerts(),
    ]).then((results) => {
      if (!active) return;
      setAnalytics({
        overview: results[0].status === "fulfilled" ? results[0].value : null,
        revenue: results[1].status === "fulfilled" ? results[1].value : null,
        templates: results[2].status === "fulfilled" ? results[2].value : null,
        delivery: results[3].status === "fulfilled" ? results[3].value : null,
        rsvp: results[4].status === "fulfilled" ? results[4].value : null,
        checkIn: results[5].status === "fulfilled" ? results[5].value : null,
        health: results[6].status === "fulfilled" ? results[6].value : null,
        alerts: results[7].status === "fulfilled" ? results[7].value : null,
      });
    });
    return () => {
      active = false;
    };
  }, []);

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
      <AdminPageHeader
        title="ផ្ទាំងគ្រប់គ្រង Admin"
        subtitle="System analytics, recent activity, and operational health"
        actions={<button type="button" className="btn btn-ghost" onClick={reload}>Refresh</button>}
      />

      <section className="admin-feature-grid">
        {stats.map(([label, value, note]) => (
          <StatCard key={label} label={label} value={value} note={note} />
        ))}
      </section>

      <section className="admin-feature-grid">
        <StatCard label="RSVP conversion" value={percent(analytics.overview?.summary?.rsvpConversion)} note="Responses divided by guests" />
        <StatCard label="RSVP attending" value={analytics.rsvp?.summary?.attending ?? "—"} note={`${percent(analytics.rsvp?.summary?.attendingRate)} attending rate`} />
        <StatCard label="Check-in rate" value={percent(analytics.checkIn?.summary?.checkInRate)} note={`${analytics.checkIn?.summary?.checkedIn || 0} checked in`} />
        <StatCard label="Delivery opened" value={analytics.delivery?.summary?.opened ?? "—"} note={`${analytics.delivery?.summary?.failed || 0} failed deliveries`} />
        <StatCard label="Premium templates" value={analytics.templates?.summary?.premiumTemplates ?? "—"} note={`${analytics.templates?.summary?.activeTemplates || 0} active templates`} />
        <StatCard label="Paid revenue" value={formatMoney(analytics.revenue?.summary?.totalRevenue || 0)} note={`${analytics.revenue?.summary?.failedPayments || 0} failed payments`} />
        <StatCard label="System health" value={analytics.health?.summary?.status || "—"} note={`${analytics.health?.summary?.failedNotifications || 0} failed notifications`} />
      </section>

      <div className="stat-grid">
        <section className="card">
          <div className="page-head">
            <h3 className="page-title" style={{ fontSize: 16 }}>Operational alerts</h3>
            <Link className="btn btn-ghost btn-sm" to="/admin/system-logs">Logs</Link>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Severity</th><th>Title</th><th>Count</th><th>Description</th></tr>
              </thead>
              <tbody>
                {(analytics.alerts?.rows || []).map((alert) => (
                  <tr key={`${alert.severity}-${alert.title}`}>
                    <td><StatusBadge status={alert.severity} /></td>
                    <td>{alert.title}</td>
                    <td>{alert.count}</td>
                    <td>{alert.description}</td>
                  </tr>
                ))}
                {!analytics.alerts?.rows?.length && <tr><td colSpan="4">No alerts loaded.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

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
                    <td><StatusBadge status={payment.status} /></td>
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

function percent(value) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value * 100)}%`;
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
