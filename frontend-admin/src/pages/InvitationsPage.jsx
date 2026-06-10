import { useMemo, useState } from "react";
import { adminManagementService } from "../features/admin/adminManagementService";
import { Loading, ErrorState, Empty } from "../components/States";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { useResource } from "../hooks/useResource";
import { formatDate } from "../lib/format";

function statusBadge(inv) {
    const status = inv.status || (inv.published ? "PUBLISHED" : "DRAFT");
    const map = {
        PUBLISHED: "badge-green",
        DRAFT: "badge-gray",
        ARCHIVED: "badge-amber",
    };
    return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
}

export default function InvitationsPage() {
    const { data, setData, loading, error, reload } = useResource(adminManagementService.invitations);
    const items = useMemo(() => data || [], [data]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [busyId, setBusyId] = useState(null);
    const [detail, setDetail] = useState(null);
    const { toast, show, clear } = useToast();

    const runAction = async (inv, action) => {
        setBusyId(inv.id);
        try {
            if (action === "publish") {
                const updated = await adminManagementService.activateInvitation(inv.id);
                setData((prev) => (prev || []).map((i) => (i.id === inv.id ? { ...i, ...updated } : i)));
                show("បានផ្សាយធៀបការ ✓");
            } else if (action === "unpublish") {
                const updated = await adminManagementService.deactivateInvitation(inv.id);
                setData((prev) => (prev || []).map((i) => (i.id === inv.id ? { ...i, ...updated } : i)));
                show("បានដកការផ្សាយ ✓");
            } else if (action === "delete") {
                if (!window.confirm(`លុបធៀបការ "${inv.title || inv.slug}" ឬ?`)) {
                    setBusyId(null);
                    return;
                }
                await adminManagementService.moderateInvitation(inv.id, { status: "DELETED", reason: "Admin deleted" });
                setData((prev) => (prev || []).filter((i) => i.id !== inv.id));
                show("បានលុបធៀបការ ✓");
            }
        } catch (err) {
            show(err?.message || "ប្រតិបត្តិការបរាជ័យ", "error");
        } finally {
            setBusyId(null);
        }
    };

    const openDetail = async (inv) => {
        setDetail({ loading: true, data: inv });
        try {
            const full = await adminManagementService.invitation(inv.id);
            setDetail({ loading: false, data: full || inv });
        } catch {
            setDetail({ loading: false, data: inv });
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((i) => {
            const status = i.status || (i.published ? "PUBLISHED" : "DRAFT");
            if (filter !== "ALL" && status !== filter) return false;
            if (!q) return true;
            return [i.title, i.slug, i.ownerName, i.brideName, i.groomName, i.venueName]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });
    }, [items, query, filter]);

    return (
        <div>
            <div className="page-head">
                <div>
                    <h2 className="page-title">💌 គ្រប់គ្រងធៀបការ</h2>
                    <p className="page-subtitle">ធៀបការទាំងអស់ពីអ្នកប្រើប្រាស់គ្រប់រូប</p>
                </div>
            </div>

            <div className="card">
                <div className="toolbar">
                    <input
                        className="text-input"
                        placeholder="ស្វែងរកតាមចំណងជើង ម្ចាស់ កូនកំលោះ/នាង..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="ALL">ស្ថានភាពទាំងអស់</option>
                        <option value="PUBLISHED">បានផ្សាយ</option>
                        <option value="DRAFT">ព្រាង</option>
                        <option value="ARCHIVED">បានទុក</option>
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
                    <Empty label="រកមិនឃើញធៀបការ" />
                ) : (
                    <div className="table-wrap">
                        <table className="data">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ចំណងជើង</th>
                                    <th>ម្ចាស់</th>
                                    <th>គំរូ</th>
                                    <th>ថ្ងៃកម្មវិធី</th>
                                    <th>ស្ថានភាព</th>
                                    <th>សកម្មភាព</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((inv) => {
                                    const status = inv.status || (inv.published ? "PUBLISHED" : "DRAFT");
                                    const isPublished = status === "PUBLISHED";
                                    return (
                                        <tr key={inv.id}>
                                            <td>{inv.id}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => openDetail(inv)}
                                                >
                                                    {inv.title || inv.slug || "(គ្មានចំណងជើង)"}
                                                </button>
                                            </td>
                                            <td>{inv.ownerName || "—"}</td>
                                            <td>{inv.templateName || "—"}</td>
                                            <td>{formatDate(inv.eventDate)}</td>
                                            <td>{statusBadge(inv)}</td>
                                            <td>
                                                <div className="row-actions">
                                                    {isPublished ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            disabled={busyId === inv.id}
                                                            onClick={() => runAction(inv, "unpublish")}
                                                        >
                                                            ដកការផ្សាយ
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            disabled={busyId === inv.id}
                                                            onClick={() => runAction(inv, "publish")}
                                                        >
                                                            ផ្សាយ
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        disabled={busyId === inv.id}
                                                        onClick={() => runAction(inv, "delete")}
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

            {detail && <InvitationDrawer detail={detail} onClose={() => setDetail(null)} />}

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

function InvitationDrawer({ detail, onClose }) {
    const inv = detail.data || {};
    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-head">
                    <h3 className="page-title" style={{ fontSize: 17 }}>
                        {inv.title || inv.slug || "ធៀបការ"}
                    </h3>
                    <button type="button" className="drawer-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                {detail.loading && <p className="page-subtitle">កំពុងផ្ទុកព័ត៌មានលម្អិត...</p>}
                <Row label="ID" value={String(inv.id ?? "")} />
                <Row label="Slug" value={inv.slug} />
                <Row label="ម្ចាស់" value={inv.ownerName} />
                <Row label="គំរូ" value={inv.templateName} />
                <Row label="ប្រភេទកម្មវិធី" value={inv.eventType} />
                <Row label="កូនកំលោះ" value={inv.groomName} />
                <Row label="កូនក្រមុំ" value={inv.brideName} />
                <Row label="ម្ចាស់ផ្ទះ" value={inv.hostName} />
                <Row label="ទីកន្លែង" value={inv.venueName} />
                <Row label="អាសយដ្ឋាន" value={inv.venueAddress} />
                <Row label="ថ្ងៃកម្មវិធី" value={formatDate(inv.eventDate)} />
                <Row label="ម៉ោង" value={inv.eventTime} />
                <Row label="ស្ថានភាព" value={inv.status} />
                <Row label="ភាសា" value={inv.languageMode} />
                <Row label="ការមើលឃើញ" value={inv.visibility} />
                <Row label="បង្កើតនៅ" value={formatDate(inv.createdAt)} />
            </div>
        </div>
    );
}
