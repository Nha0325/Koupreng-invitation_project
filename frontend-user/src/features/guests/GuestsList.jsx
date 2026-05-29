import { useMemo, useState } from "react";
import { listRsvps } from "../../services/rsvpService";
import { listDrafts } from "../../services/weddingStorage";
import {
    createHostRecordId,
    listManualGuests,
    saveManualGuests,
} from "../../services/hostPlanningStorage";
import "./GuestsPage.css";

const statusOptions = ["ទាំងអស់", "បានអញ្ជើញ", "បញ្ជាក់", "បដិសេធ"];

const groupOptions = ["ខាងស្រី", "ខាងប្រុស", "គ្រួសារ", "មិត្តភក្តិ", "សហការី", "អ្នកជិតខាង", "ភ្ញៀវ", "ផ្សេងៗ"];

const STATUS_STYLES = {
    "បានអញ្ជើញ": { bg: "#fef3c7", color: "#b45309", icon: "⏳" },
    "បញ្ជាក់": { bg: "#dcfce7", color: "#15803d", icon: "✓" },
    "បដិសេធ": { bg: "#fee2e2", color: "#dc2626", icon: "✕" },
};

const emptyGuestForm = {
    name: "",
    phone: "",
    group: "ភ្ញៀវ",
    status: "បានអញ្ជើញ",
    count: "1",
    seat: "",
};

function getResponsesForDraft(draft) {
    if (!draft?.id) return [];

    const responses = new Map();
    listRsvps(draft.id).forEach((entry) => responses.set(entry.id, entry));
    if (draft.slug) {
        listRsvps(draft.slug).forEach((entry) => responses.set(entry.id, entry));
    }
    return Array.from(responses.values());
}

function toManualGuest(form, existingId) {
    return {
        id: existingId || createHostRecordId("guest"),
        name: form.name.trim(),
        phone: form.phone.trim() || "-",
        group: form.group.trim() || "ភ្ញៀវ",
        status: form.status,
        amount: "-",
        seat: form.seat.trim() || "-",
        count: Math.max(1, Number(form.count) || 1),
        source: "manual",
        updatedAt: Date.now(),
    };
}

export default function GuestsList() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState("ទាំងអស់");
    const [manualGuests, setManualGuests] = useState(() => listManualGuests());
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyGuestForm);
    const currentDraft = listDrafts()[0];

    const rsvpGuests = useMemo(() => getResponsesForDraft(currentDraft).map((entry) => ({
        id: entry.id,
        name: entry.name,
        phone: entry.phone || "-",
        group: "RSVP",
        status: entry.attending === "no" ? "បដិសេធ" : "បញ្ជាក់",
        amount: "-",
        seat: "-",
        count: Number(entry.count) || 1,
        source: "rsvp",
    })), [currentDraft]);

    const allGuests = useMemo(() => [...manualGuests, ...rsvpGuests], [manualGuests, rsvpGuests]);

    const filtered = allGuests.filter((guest) => {
        const keyword = search.trim();
        const matchSearch = !keyword
            || guest.name.includes(keyword)
            || guest.phone.includes(keyword)
            || guest.group.includes(keyword);
        const matchStatus = statusFilter === "ទាំងអស់" || guest.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const counts = {
        total: allGuests.reduce((total, guest) => total + guest.count, 0),
        invited: allGuests.filter((guest) => guest.status === "បានអញ្ជើញ").length,
        confirmed: allGuests.filter((guest) => guest.status === "បញ្ជាក់").length,
        rejected: allGuests.filter((guest) => guest.status === "បដិសេធ").length,
    };

    const statusCounts = {
        "ទាំងអស់": allGuests.length,
        "បានអញ្ជើញ": counts.invited,
        "បញ្ជាក់": counts.confirmed,
        "បដិសេធ": counts.rejected,
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyGuestForm);
        setShowForm(false);
    };

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submitGuest = (event) => {
        event.preventDefault();
        if (!form.name.trim()) return;

        const nextGuest = toManualGuest(form, editingId);
        const nextGuests = editingId
            ? manualGuests.map((guest) => (guest.id === editingId ? nextGuest : guest))
            : [nextGuest, ...manualGuests];

        setManualGuests(nextGuests);
        saveManualGuests(nextGuests);
        resetForm();
    };

    const editGuest = (guest) => {
        if (guest.source === "rsvp") return;

        setEditingId(guest.id);
        setForm({
            name: guest.name,
            phone: guest.phone === "-" ? "" : guest.phone,
            group: guest.group,
            status: guest.status,
            count: String(guest.count),
            seat: guest.seat === "-" ? "" : guest.seat,
        });
        setShowForm(true);
    };

    const deleteGuest = (guestId) => {
        if (!window.confirm("តើអ្នកពិតជាចង់លុបភ្ញៀវនេះមែនទេ?")) return;
        const nextGuests = manualGuests.filter((guest) => guest.id !== guestId);
        setManualGuests(nextGuests);
        saveManualGuests(nextGuests);
    };

    return (
        <div className="gp-page">
            {/* Hero header */}
            <div className="gp-hero">
                <div className="gp-hero-content">
                    <span className="gp-hero-tag">Guest Management</span>
                    <h1 className="gp-title">👥 បញ្ជីភ្ញៀវ</h1>
                    <p className="gp-subtitle">បន្ថែមភ្ញៀវដោយដៃ និងតាមដាន RSVP ទាំងអស់</p>
                </div>
                <button
                    type="button"
                    className="gp-add-btn"
                    onClick={() => {
                        setShowForm((value) => !value);
                        setEditingId(null);
                        setForm(emptyGuestForm);
                    }}
                >
                    {showForm ? "✕ បិទ" : "+ បន្ថែមភ្ញៀវ"}
                </button>
            </div>

            {/* Stats summary */}
            <div className="gp-summary">
                <div className="gp-sum-card gp-sum-total">
                    <div className="gp-sum-icon">👥</div>
                    <div>
                        <span className="gp-sum-label">ភ្ញៀវសរុប</span>
                        <span className="gp-sum-value">{counts.total}</span>
                    </div>
                </div>
                <div className="gp-sum-card">
                    <div className="gp-sum-icon">⏳</div>
                    <div>
                        <span className="gp-sum-label">បានអញ្ជើញ</span>
                        <span className="gp-sum-value">{counts.invited}</span>
                    </div>
                </div>
                <div className="gp-sum-card">
                    <div className="gp-sum-icon">✓</div>
                    <div>
                        <span className="gp-sum-label">បានបញ្ជាក់</span>
                        <span className="gp-sum-value">{counts.confirmed}</span>
                    </div>
                </div>
                <div className="gp-sum-card">
                    <div className="gp-sum-icon">✕</div>
                    <div>
                        <span className="gp-sum-label">បានបដិសេធ</span>
                        <span className="gp-sum-value">{counts.rejected}</span>
                    </div>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <form className="gp-form" onSubmit={submitGuest}>
                    <h3 className="gp-form-title">
                        {editingId ? "✏️ កែប្រែភ្ញៀវ" : "➕ បន្ថែមភ្ញៀវថ្មី"}
                    </h3>
                    <div className="gp-form-grid">
                        <label>
                            <span>ឈ្មោះ <em>*</em></span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) => updateForm("name", event.target.value)}
                                placeholder="បញ្ចូលឈ្មោះភ្ញៀវ"
                                required
                            />
                        </label>
                        <label>
                            <span>លេខទូរស័ព្ទ</span>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(event) => updateForm("phone", event.target.value)}
                                placeholder="012 345 678"
                            />
                        </label>
                        <div className="gp-choice-field">
                            <span>ក្រុម</span>
                            <div className="gp-choice-list gp-choice-list-group">
                                {groupOptions.map((group) => (
                                    <button
                                        key={group}
                                        type="button"
                                        className={`gp-choice-btn${form.group === group ? " active" : ""}`}
                                        onClick={() => updateForm("group", group)}
                                        aria-pressed={form.group === group}
                                    >
                                        {group}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="gp-choice-field">
                            <span>ស្ថានភាព</span>
                            <div className="gp-choice-list gp-choice-list-status">
                                {statusOptions.filter((status) => status !== "ទាំងអស់").map((status) => {
                                    const statusStyle = STATUS_STYLES[status];

                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            className={`gp-choice-btn gp-choice-status${form.status === status ? " active" : ""}`}
                                            onClick={() => updateForm("status", status)}
                                            aria-pressed={form.status === status}
                                            style={{
                                                "--choice-bg": statusStyle.bg,
                                                "--choice-color": statusStyle.color,
                                            }}
                                        >
                                            <span aria-hidden="true">{statusStyle.icon}</span>
                                            {status}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <label>
                            <span>ចំនួនភ្ញៀវ</span>
                            <input
                                type="number"
                                min="1"
                                value={form.count}
                                onChange={(event) => updateForm("count", event.target.value)}
                            />
                        </label>
                        <label>
                            <span>លេខកៅអី</span>
                            <input
                                type="text"
                                value={form.seat}
                                onChange={(event) => updateForm("seat", event.target.value)}
                                placeholder="ឧ. T1, A2"
                            />
                        </label>
                    </div>
                    <div className="gp-form-actions">
                        <button type="button" className="gp-secondary-btn" onClick={resetForm}>
                            បោះបង់
                        </button>
                        <button type="submit" className="gp-add-btn">
                            {editingId ? "💾 រក្សាទុក" : "➕ បន្ថែម"}
                        </button>
                    </div>
                </form>
            )}

            {/* Toolbar (search + filters) */}
            <div className="gp-toolbar">
                <div className="gp-search-wrap">
                    <span className="gp-search-icon">🔍</span>
                    <input
                        type="text"
                        className="gp-search"
                        placeholder="ស្វែងរកតាមឈ្មោះ ទូរស័ព្ទ..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <div className="gp-filter-group">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            type="button"
                            className={`gp-filter-btn${statusFilter === status ? " active" : ""}`}
                            onClick={() => setStatus(status)}
                        >
                            {status}
                            <span className="gp-filter-count">{statusCounts[status]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="gp-empty">
                    <div className="gp-empty-icon">👥</div>
                    <h3>មិនមានភ្ញៀវ</h3>
                    <p>មិនទាន់មានភ្ញៀវណាមួយត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ</p>
                </div>
            ) : (
                <div className="gp-table-wrap">
                    <table className="gp-table">
                        <thead>
                            <tr>
                                <th>ឈ្មោះ</th>
                                <th>ទំនាក់ទំនង</th>
                                <th>ក្រុម</th>
                                <th>ស្ថានភាព</th>
                                <th>ចំនួន</th>
                                <th>កៅអី</th>
                                <th className="gp-th-actions">សកម្មភាព</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((guest) => {
                                const statusStyle = STATUS_STYLES[guest.status] || STATUS_STYLES["បានអញ្ជើញ"];
                                return (
                                    <tr key={guest.id}>
                                        <td data-label="ឈ្មោះ">
                                            <div className="gp-name-cell">
                                                <div className="gp-avatar">{guest.name.charAt(0)}</div>
                                                <span className="gp-name-text">{guest.name}</span>
                                            </div>
                                        </td>
                                        <td data-label="ទំនាក់ទំនង" className="gp-muted">
                                            📞 {guest.phone}
                                        </td>
                                        <td data-label="ក្រុម">
                                            <span className="gp-group-badge">{guest.group}</span>
                                        </td>
                                        <td data-label="ស្ថានភាព">
                                            <span
                                                className="gp-status"
                                                style={{ background: statusStyle.bg, color: statusStyle.color }}
                                            >
                                                {statusStyle.icon} {guest.status}
                                            </span>
                                        </td>
                                        <td data-label="ចំនួន">
                                            <span className="gp-count">{guest.count}</span>
                                        </td>
                                        <td data-label="កៅអី" className="gp-muted">
                                            {guest.seat}
                                        </td>
                                        <td data-label="សកម្មភាព">
                                            {guest.source === "manual" ? (
                                                <div className="gp-row-actions">
                                                    <button
                                                        type="button"
                                                        className="gp-action-btn"
                                                        onClick={() => editGuest(guest)}
                                                    >
                                                        ✏️ កែ
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="gp-action-btn gp-danger-btn"
                                                        onClick={() => deleteGuest(guest.id)}
                                                    >
                                                        🗑️ លុប
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="gp-rsvp-badge">RSVP</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
