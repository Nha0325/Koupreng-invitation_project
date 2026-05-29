import { useState } from "react";
import {
    createHostRecordId,
    listWeddingGifts,
    saveWeddingGifts,
} from "../../services/hostPlanningStorage";
import { DatePicker } from "../../shared/ui/DatePicker";
import "./WeddingGiftPage.css";

const defaultGifts = [
    { id: 1, name: "ចន្ទ្រា សុខ", amount: 150, method: "Bakong QR", date: "2026-01-10", note: "សូមអបអរ!" },
    { id: 2, name: "លក្ខណ៍ ធារា", amount: 200, method: "សាច់ប្រាក់", date: "2026-01-12", note: "" },
    { id: 3, name: "ស្រីពៅ ចាន់", amount: 80, method: "Bakong QR", date: "2026-01-15", note: "រីករាយ!" },
    { id: 4, name: "ស្រីណា ចាន់", amount: 120, method: "ABA", date: "2026-01-18", note: "" },
    { id: 5, name: "ភក្ត្រ ស្រីមុំ", amount: 60, method: "Bakong QR", date: "2026-01-20", note: "ជូនពរ!" },
    { id: 6, name: "វិចិត្រ ដារ៉ា", amount: 100, method: "ABA", date: "2026-01-22", note: "" },
];

const methods = ["ទាំងអស់", "Bakong QR", "ABA", "សាច់ប្រាក់"];

const METHOD_STYLES = {
    "Bakong QR": { bg: "#e0f2fe", color: "#0369a1", icon: "📱" },
    "ABA": { bg: "#fef3c7", color: "#b45309", icon: "💳" },
    "សាច់ប្រាក់": { bg: "#dcfce7", color: "#15803d", icon: "💵" },
};

const emptyGiftForm = {
    name: "",
    amount: "",
    method: "Bakong QR",
    date: "",
    note: "",
};

function toGift(form, existingId) {
    return {
        id: existingId || createHostRecordId("gift"),
        name: form.name.trim(),
        amount: Math.max(0, Number(form.amount) || 0),
        method: form.method,
        date: form.date || new Date().toISOString().slice(0, 10),
        note: form.note.trim(),
        updatedAt: Date.now(),
    };
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("km-KH", { year: "numeric", month: "short", day: "numeric" });
    } catch {
        return dateStr;
    }
}

function WeddingGiftList() {
    const [methodFilter, setMethod] = useState("ទាំងអស់");
    const [searchQuery, setSearchQuery] = useState("");
    const [gifts, setGifts] = useState(() => listWeddingGifts(defaultGifts));
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyGiftForm);

    const filtered = gifts.filter((gift) => {
        const matchesMethod = methodFilter === "ទាំងអស់" || gift.method === methodFilter;
        const matchesSearch = !searchQuery || gift.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMethod && matchesSearch;
    });

    const total = gifts.reduce((sum, gift) => sum + (Number(gift.amount) || 0), 0);
    const average = gifts.length ? Math.round(total / gifts.length) : 0;
    const maxGift = gifts.length ? Math.max(...gifts.map((gift) => Number(gift.amount) || 0)) : 0;

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyGiftForm);
        setShowForm(false);
    };

    const submitGift = (event) => {
        event.preventDefault();
        if (!form.name.trim()) return;

        const nextGift = toGift(form, editingId);
        const nextGifts = editingId
            ? gifts.map((gift) => (gift.id === editingId ? nextGift : gift))
            : [nextGift, ...gifts];

        setGifts(nextGifts);
        saveWeddingGifts(nextGifts);
        resetForm();
    };

    const editGift = (gift) => {
        setEditingId(gift.id);
        setForm({
            name: gift.name,
            amount: String(gift.amount),
            method: gift.method,
            date: gift.date,
            note: gift.note || "",
        });
        setShowForm(true);
    };

    const deleteGift = (giftId) => {
        if (!window.confirm("តើអ្នកពិតជាចង់លុបចងដៃនេះមែនទេ?")) return;
        const nextGifts = gifts.filter((gift) => gift.id !== giftId);
        setGifts(nextGifts);
        saveWeddingGifts(nextGifts);
    };

    return (
        <div className="wg-page">
            {/* Hero header */}
            <div className="wg-hero">
                <div className="wg-hero-content">
                    <span className="wg-hero-tag">Wedding Gifts</span>
                    <h1 className="wg-title">🎁 ចងដៃមង្គល</h1>
                    <p className="wg-subtitle">តាមដាន និងគ្រប់គ្រងចងដៃមង្គលរបស់អ្នកមួយកន្លែង</p>
                </div>
                <button
                    type="button"
                    className="wg-add-btn"
                    onClick={() => {
                        setShowForm((value) => !value);
                        setEditingId(null);
                        setForm(emptyGiftForm);
                    }}
                >
                    {showForm ? "✕ បិទ" : "+ បន្ថែមចងដៃថ្មី"}
                </button>
            </div>

            {/* Stats summary */}
            <div className="wg-summary">
                <div className="wg-sum-card wg-sum-total">
                    <div className="wg-sum-icon">💰</div>
                    <div>
                        <span className="wg-sum-label">ចងដៃសរុប</span>
                        <span className="wg-sum-value">${total.toLocaleString()}</span>
                    </div>
                </div>
                <div className="wg-sum-card">
                    <div className="wg-sum-icon">👥</div>
                    <div>
                        <span className="wg-sum-label">អ្នកផ្ញើ</span>
                        <span className="wg-sum-value">{gifts.length} នាក់</span>
                    </div>
                </div>
                <div className="wg-sum-card">
                    <div className="wg-sum-icon">📊</div>
                    <div>
                        <span className="wg-sum-label">មធ្យមភាគ</span>
                        <span className="wg-sum-value">${average}</span>
                    </div>
                </div>
                <div className="wg-sum-card">
                    <div className="wg-sum-icon">⭐</div>
                    <div>
                        <span className="wg-sum-label">ច្រើនបំផុត</span>
                        <span className="wg-sum-value">${maxGift}</span>
                    </div>
                </div>
            </div>

            {/* Form (shown when adding/editing) */}
            {showForm && (
                <form className="wg-form" onSubmit={submitGift}>
                    <h3 className="wg-form-title">
                        {editingId ? "✏️ កែប្រែចងដៃ" : "➕ បន្ថែមចងដៃថ្មី"}
                    </h3>
                    <div className="wg-form-grid">
                        <label>
                            <span>ឈ្មោះអ្នកផ្ញើ <em>*</em></span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) => updateForm("name", event.target.value)}
                                placeholder="បញ្ចូលឈ្មោះ"
                                required
                            />
                        </label>
                        <label>
                            <span>ចំនួន ($)</span>
                            <input
                                type="number"
                                min="0"
                                value={form.amount}
                                onChange={(event) => updateForm("amount", event.target.value)}
                                placeholder="0"
                            />
                        </label>
                        <label>
                            <span>វិធីទូទាត់</span>
                            <select value={form.method} onChange={(event) => updateForm("method", event.target.value)}>
                                {methods.filter((method) => method !== "ទាំងអស់").map((method) => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span>ថ្ងៃទទួល</span>
                            <DatePicker
                                value={form.date}
                                onChange={(value) => updateForm("date", value)}
                                placeholder="ជ្រើសកាលបរិច្ឆេទ"
                            />
                        </label>
                        <label className="wg-form-wide">
                            <span>កំណត់ចំណាំ</span>
                            <input
                                type="text"
                                value={form.note}
                                onChange={(event) => updateForm("note", event.target.value)}
                                placeholder="សារ ឬចំណាំសម្រាប់អ្នកផ្ញើ"
                            />
                        </label>
                    </div>
                    <div className="wg-form-actions">
                        <button type="button" className="wg-secondary-btn" onClick={resetForm}>
                            បោះបង់
                        </button>
                        <button type="submit" className="wg-add-btn">
                            {editingId ? "💾 រក្សាទុក" : "➕ បន្ថែម"}
                        </button>
                    </div>
                </form>
            )}

            {/* Search + filter bar */}
            <div className="wg-toolbar">
                <div className="wg-search">
                    <span className="wg-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="ស្វែងរកតាមឈ្មោះ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="wg-filters">
                    {methods.map((method) => (
                        <button
                            key={method}
                            type="button"
                            className={`wg-filter-btn${methodFilter === method ? " active" : ""}`}
                            onClick={() => setMethod(method)}
                        >
                            {method}
                            <span className="wg-filter-count">
                                {method === "ទាំងអស់"
                                    ? gifts.length
                                    : gifts.filter((g) => g.method === method).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Gift table */}
            {filtered.length === 0 ? (
                <div className="wg-empty">
                    <div className="wg-empty-icon">🎁</div>
                    <h3>មិនមានចងដៃ</h3>
                    <p>មិនទាន់មានចងដៃណាមួយត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ</p>
                </div>
            ) : (
                <div className="wg-table-wrap">
                    <table className="wg-table">
                        <thead>
                            <tr>
                                <th>ឈ្មោះអ្នកផ្ញើ</th>
                                <th>ចំនួន</th>
                                <th>វិធីទូទាត់</th>
                                <th>ថ្ងៃទទួល</th>
                                <th>កំណត់ចំណាំ</th>
                                <th className="wg-th-actions">សកម្មភាព</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((gift) => {
                                const methodStyle = METHOD_STYLES[gift.method] || METHOD_STYLES["Bakong QR"];
                                return (
                                    <tr key={gift.id}>
                                        <td data-label="ឈ្មោះ">
                                            <div className="wg-name-cell">
                                                <span className="wg-name-text">{gift.name}</span>
                                            </div>
                                        </td>
                                        <td data-label="ចំនួន">
                                            <span className="wg-amount">${gift.amount.toLocaleString()}</span>
                                        </td>
                                        <td data-label="វិធីទូទាត់">
                                            <span
                                                className="wg-method-badge"
                                                style={{ background: methodStyle.bg, color: methodStyle.color }}
                                            >
                                                {methodStyle.icon} {gift.method}
                                            </span>
                                        </td>
                                        <td data-label="ថ្ងៃទទួល" className="wg-muted">📅 {formatDate(gift.date)}</td>
                                        <td data-label="កំណត់ចំណាំ" className="wg-muted wg-note-cell">
                                            {gift.note || <span className="wg-dash">—</span>}
                                        </td>
                                        <td data-label="សកម្មភាព">
                                            <div className="wg-row-actions">
                                                <button
                                                    type="button"
                                                    className="wg-action-btn"
                                                    onClick={() => editGift(gift)}
                                                >
                                                    ✏️ កែ
                                                </button>
                                                <button
                                                    type="button"
                                                    className="wg-action-btn wg-danger-btn"
                                                    onClick={() => deleteGift(gift.id)}
                                                >
                                                    🗑️ លុប
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
    );
}

export default WeddingGiftList;
