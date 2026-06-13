import { useMemo, useState } from "react";
import { eventService } from "../services/eventService";
import { Loading, ErrorState, Empty } from "../components/States";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { useResource } from "../hooks/useResource";
import { formatDate, formatDateTime } from "../lib/format";

function statusBadge(status) {
    const s = String(status || "DRAFT").toUpperCase();
    const map = {
        PUBLISHED: "badge-green",
        DRAFT: "badge-gray",
        UNPUBLISHED: "badge-amber",
    };
    return <span className={`badge ${map[s] || "badge-gray"}`}>{status || "—"}</span>;
}

export default function EventsPage() {
    const { data, setData, loading, error, reload } = useResource(eventService.listAll);
    const items = useMemo(() => data || [], [data]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [busyId, setBusyId] = useState(null);
    const [detail, setDetail] = useState(null);
    const { toast, show, clear } = useToast();

    const runAction = async (event, action) => {
        setBusyId(event.id);
        try {
            if (action === "publish") {
                const updated = await eventService.publish(event.id);
                setData((prev) => (prev || []).map((e) => (e.id === event.id ? { ...e, ...updated } : e)));
                show("បានផ្សាយព្រឹត្តិការណ៍ ✓");
            } else if (action === "unpublish") {
                const updated = await eventService.unpublish(event.id);
                setData((prev) => (prev || []).map((e) => (e.id === event.id ? { ...e, ...updated } : e)));
                show("បានដកការផ្សាយ ✓");
            } else if (action === "delete") {
                if (!window.confirm(`លុបព្រឹត្តិការណ៍ "${event.eventName || event.id}" ឬ?`)) {
                    setBusyId(null);
                    return;
                }
                await eventService.remove(event.id);
                setData((prev) => (prev || []).filter((e) => e.id !== event.id));
                show("បានលុបព្រឹត្តិការណ៍ ✓");
            }
        } catch (err) {
            show(err?.message || "ប្រតិបត្តិការបរាជ័យ", "error");
        } finally {
            setBusyId(null);
        }
    };

    const openDetail = async (event) => {
        setDetail({ loading: true, data: event });
        try {
            const full = await eventService.get(event.id);
            setDetail({ loading: false, data: full || event });
        } catch {
            setDetail({ loading: false, data: event });
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((e) => {
            const status = String(e.status || "DRAFT").toUpperCase();
            if (filter !== "ALL" && status !== filter) return false;
            if (!q) return true;
            return [e.eventName, e.groom, e.bride, e.location, e.templateType]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });
    }, [items, query, filter]);

    return (
        <div>
            <div className="page-head">
                <div>
                    <h2 className="page-title">🎉 គ្រប់គ្រងព្រឹត្តិការណ៍</h2>
                    <p className="page-subtitle">ព្រឹត្តិការណ៍មង្គលការទាំងអស់ក្នុងប្រព័ន្ធ</p>
                </div>
            </div>

            <div className="card">
                <div className="toolbar">
                    <input
                        className="text-input"
                        placeholder="ស្វែងរកតាមឈ្មោះ កូនកំលោះ/នាង ឬ ទីកន្លែង..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="ALL">ស្ថានភាពទាំងអស់</option>
                        <option value="PUBLISHED">បានផ្សាយ</option>
                        <option value="DRAFT">ព្រាង</option>
                        <option value="UNPUBLISHED">ដកការផ្សាយ</option>
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
                    <Empty label="រកមិនឃើញព្រឹត្តិការណ៍" />
                ) : (
                    <div className="table-wrap">
                        <table className="data">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ឈ្មោះព្រឹត្តិការណ៍</th>
                                    <th>កូនកំលោះ / នាង</th>
                                    <th>គំរូ</th>
                                    <th>ថ្ងៃកម្មវិធី</th>
                                    <th>ទីកន្លែង</th>
                                    <th>ស្ថានភាព</th>
                                    <th>សកម្មភាព</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((ev) => {
                                    const status = String(ev.status || "DRAFT").toUpperCase();
                                    const isPublished = status === "PUBLISHED";
                                    return (
                                        <tr key={ev.id}>
                                            <td>{ev.id}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => openDetail(ev)}
                                                >
                                                    {ev.eventName || "(គ្មានឈ្មោះ)"}
                                                </button>
                                            </td>
                                            <td>
                                                {[ev.groom, ev.bride].filter(Boolean).join(" & ") || "—"}
                                            </td>
                                            <td>{ev.templateType || "—"}</td>
                                            <td>{formatDate(ev.eventDate)}</td>
                                            <td>{ev.location || "—"}</td>
                                            <td>{statusBadge(ev.status)}</td>
                                            <td>
                                                <div className="row-actions">
                                                    {isPublished ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            disabled={busyId === ev.id}
                                                            onClick={() => runAction(ev, "unpublish")}
                                                        >
                                                            ដកការផ្សាយ
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            disabled={busyId === ev.id}
                                                            onClick={() => runAction(ev, "publish")}
                                                        >
                                                            ផ្សាយ
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        disabled={busyId === ev.id}
                                                        onClick={() => runAction(ev, "delete")}
                                                    >
                                                        លុប
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {detail && <EventDrawer detail={detail} onClose={() => setDetail(null)} />}

            <Toast toast={toast} onClose={clear} />
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="detail-row">
            <span className="label">{label}</span>
            <span className="value">{value || "—"}</span>
        </div>
    );
}

function EventDrawer({ detail, onClose }) {
    const ev = detail.data || {};
    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-head">
                    <h3 className="page-title" style={{ fontSize: 17 }}>
                        {ev.eventName || "ព្រឹត្តិការណ៍"}
                    </h3>
                    <button type="button" className="drawer-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                {detail.loading && <p className="page-subtitle">កំពុងផ្ទុកព័ត៌មានលម្អិត...</p>}
                <Row label="ID" value={String(ev.id ?? "")} />
                <Row label="ឈ្មោះព្រឹត្តិការណ៍" value={ev.eventName} />
                <Row label="ប្រភេទគំរូ" value={ev.templateType} />
                <Row label="កូនកំលោះ" value={ev.groom} />
                <Row label="កូនក្រមុំ" value={ev.bride} />
                <Row label="ថ្ងៃកម្មវិធី" value={formatDate(ev.eventDate)} />
                <Row label="ម៉ោងពិសាភោជន៍" value={ev.eatingTime} />
                <Row label="ទីកន្លែង" value={ev.location} />
                <Row label="ការពិពណ៌នា" value={ev.description} />
                <Row label="ស្ថានភាព" value={ev.status} />
                <Row label="បង្កើតនៅ" value={formatDateTime(ev.createdAt)} />
                <Row label="ផ្សាយនៅ" value={formatDateTime(ev.publishedAt)} />
            </div>
        </div>
    );
}
