import { useMemo, useState } from "react";
import { paymentService } from "../services/paymentService";
import { Loading, ErrorState, Empty } from "../components/States";
import { useResource } from "../hooks/useResource";
import { formatMoney, formatDateTime } from "../lib/format";

const PAID_STATUSES = new Set(["PAID", "COMPLETED", "SUCCESS", "APPROVED"]);

function statusBadge(status) {
    const s = String(status || "").toUpperCase();
    if (PAID_STATUSES.has(s)) return <span className="badge badge-green">{status}</span>;
    if (["PENDING", "PROCESSING", "CREATED"].includes(s))
        return <span className="badge badge-amber">{status}</span>;
    if (["FAILED", "CANCELLED", "CANCELED", "EXPIRED"].includes(s))
        return <span className="badge badge-red">{status}</span>;
    return <span className="badge badge-gray">{status || "—"}</span>;
}

export default function PaymentsPage() {
    const { data, loading, error, reload } = useResource(paymentService.listOrders);
    const orders = useMemo(() => data || [], [data]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("ALL");

    const { filtered, totalPaid } = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = orders.filter((o) => {
            const s = String(o.status || "").toUpperCase();
            if (filter === "PAID" && !PAID_STATUSES.has(s)) return false;
            if (filter === "PENDING" && !["PENDING", "PROCESSING", "CREATED"].includes(s)) return false;
            if (filter === "FAILED" && !["FAILED", "CANCELLED", "CANCELED", "EXPIRED"].includes(s))
                return false;
            if (!q) return true;
            return [o.orderCode, o.transactionId, o.templateName, o.packageName]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });
        const paid = orders
            .filter((o) => PAID_STATUSES.has(String(o.status || "").toUpperCase()))
            .reduce((sum, o) => sum + (Number(o.paidAmount ?? o.amount) || 0), 0);
        return { filtered: list, totalPaid: paid };
    }, [orders, query, filter]);

    return (
        <div>
            <div className="page-head">
                <div>
                    <h2 className="page-title">💳 របាយការណ៍ការទូទាត់</h2>
                    <p className="page-subtitle">ការទិញគំរូធៀបការ (PayWay / ABA KHQR)</p>
                </div>
            </div>

            <div className="stat-grid">
                <div className="stat-card" style={{ borderLeftColor: "#b8860b" }}>
                    <span className="stat-label">ការទូទាត់សរុប</span>
                    <span className="stat-value" style={{ color: "#b8860b" }}>{orders.length}</span>
                </div>
                <div className="stat-card" style={{ borderLeftColor: "#1e7d4f" }}>
                    <span className="stat-label">ចំណូលសរុប (បានបង់)</span>
                    <span className="stat-value" style={{ color: "#1e7d4f" }}>{formatMoney(totalPaid)}</span>
                </div>
            </div>

            <div className="card">
                <div className="toolbar">
                    <input
                        className="text-input"
                        placeholder="ស្វែងរកតាមលេខកូដ ប្រតិបត្តិការ ឬ គំរូ..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="ALL">ស្ថានភាពទាំងអស់</option>
                        <option value="PAID">បានបង់</option>
                        <option value="PENDING">កំពុងរង់ចាំ</option>
                        <option value="FAILED">បរាជ័យ/បោះបង់</option>
                    </select>
                    <button type="button" className="btn btn-ghost" onClick={reload}>
                        ↻ ផ្ទុកឡើងវិញ
                    </button>
                </div>

                {loading ? (
                    <Loading />
                ) : error ? (
                    <ErrorState onRetry={reload} />
                ) : filtered.length === 0 ? (
                    <Empty label="រកមិនឃើញការទូទាត់" />
                ) : (
                    <div className="table-wrap">
                        <table className="data">
                            <thead>
                                <tr>
                                    <th>លេខកូដ Order</th>
                                    <th>Transaction ID</th>
                                    <th>គំរូ / កញ្ចប់</th>
                                    <th>ចំនួនទឹកប្រាក់</th>
                                    <th>បានបង់</th>
                                    <th>ស្ថានភាព</th>
                                    <th>បង់នៅ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((o) => (
                                    <tr key={o.orderCode}>
                                        <td>{o.orderCode}</td>
                                        <td>{o.transactionId || "—"}</td>
                                        <td>{o.templateName || o.packageName || "—"}</td>
                                        <td>{formatMoney(o.amount, o.currency)}</td>
                                        <td>{formatMoney(o.paidAmount, o.currency)}</td>
                                        <td>{statusBadge(o.status)}</td>
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
