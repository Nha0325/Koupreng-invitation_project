import { userService } from "../services/userService";
import { adminManagementService } from "../features/admin/adminManagementService";
import { eventService } from "../services/eventService";
import { paymentService } from "../services/paymentService";
import { Loading, ErrorState } from "../components/States";
import { useResource } from "../hooks/useResource";
import { formatMoney, formatDateTime } from "../lib/format";

const PAID_STATUSES = new Set(["PAID", "COMPLETED", "SUCCESS", "APPROVED"]);

async function loadDashboard() {
    const [users, invitations, events, orders] = await Promise.all([
        userService.list().catch(() => []),
        adminManagementService.invitations().catch(() => []),
        eventService.listAll().catch(() => []),
        paymentService.listOrders().catch(() => []),
    ]);
    return {
        users: users || [],
        invitations: invitations || [],
        events: events || [],
        orders: orders || [],
    };
}

export default function DashboardPage() {
    const { data, loading, error, reload } = useResource(loadDashboard);

    if (loading) return <Loading />;
    if (error || !data) return <ErrorState onRetry={reload} />;

    const { users, invitations, events, orders } = data;
    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const publishedCount = invitations.filter(
        (i) => i.published || i.status === "PUBLISHED"
    ).length;
    const revenue = orders
        .filter((o) => PAID_STATUSES.has(String(o.status || "").toUpperCase()))
        .reduce((sum, o) => sum + (Number(o.paidAmount ?? o.amount) || 0), 0);

    const stats = [
        { label: "អ្នកប្រើប្រាស់សរុប", value: users.length, icon: "👥", color: "#2563eb" },
        { label: "Admin", value: adminCount, icon: "👑", color: "#b0926a" },
        { label: "ព្រឹត្តិការណ៍សរុប", value: events.length, icon: "🎉", color: "#0e7490" },
        { label: "ធៀបការសរុប", value: invitations.length, icon: "💌", color: "#1e7d4f" },
        { label: "បានផ្សាយ", value: publishedCount, icon: "🌐", color: "#3d2461" },
        { label: "ការទូទាត់សរុប", value: orders.length, icon: "💳", color: "#b8860b" },
        { label: "ចំណូលសរុប (បានបង់)", value: formatMoney(revenue), icon: "💰", color: "#c0392b" },
    ];

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.paidAt || 0) - new Date(a.paidAt || 0))
        .slice(0, 6);

    return (
        <div>
            <div className="page-head">
                <div>
                    <h2 className="page-title">📊 ផ្ទាំងគ្រប់គ្រងទូទៅ</h2>
                    <p className="page-subtitle">ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ Koupreng</p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={reload}>
                    ↻ ផ្ទុកឡើងវិញ
                </button>
            </div>

            <div className="stat-grid">
                {stats.map((s) => (
                    <div key={s.label} className="stat-card" style={{ borderLeftColor: s.color }}>
                        <span className="stat-label">
                            <span className="stat-icon">{s.icon}</span> {s.label}
                        </span>
                        <span className="stat-value" style={{ color: s.color }}>
                            {s.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3 className="page-title" style={{ fontSize: 16, marginBottom: 16 }}>
                    💳 ការទូទាត់ថ្មីៗ
                </h3>
                {recentOrders.length === 0 ? (
                    <p className="page-subtitle">មិនទាន់មានការទូទាត់ទេ</p>
                ) : (
                    <div className="table-wrap">
                        <table className="data">
                            <thead>
                                <tr>
                                    <th>លេខកូដ</th>
                                    <th>គំរូ</th>
                                    <th>ចំនួនទឹកប្រាក់</th>
                                    <th>ស្ថានភាព</th>
                                    <th>កាលបរិច្ឆេទ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((o) => (
                                    <tr key={o.orderCode}>
                                        <td>{o.orderCode}</td>
                                        <td>{o.templateName || o.packageName || "—"}</td>
                                        <td>{formatMoney(o.paidAmount ?? o.amount, o.currency)}</td>
                                        <td>
                                            <span
                                                className={`badge ${PAID_STATUSES.has(String(o.status || "").toUpperCase())
                                                    ? "badge-green"
                                                    : "badge-amber"
                                                    }`}
                                            >
                                                {o.status || "—"}
                                            </span>
                                        </td>
                                        <td>{formatDateTime(o.paidAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
