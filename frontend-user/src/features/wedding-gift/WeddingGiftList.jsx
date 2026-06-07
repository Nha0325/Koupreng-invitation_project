import { useEffect, useState } from "react";
import {
    IoAddOutline,
    IoCalendarClearOutline,
    IoCardOutline,
    IoCashOutline,
    IoCloseOutline,
    IoCreateOutline,
    IoGiftOutline,
    IoMapOutline,
    IoPeopleOutline,
    IoPhonePortraitOutline,
    IoSaveOutline,
    IoSearchOutline,
    IoStarOutline,
    IoStatsChartOutline,
    IoTrashOutline,
    IoWalletOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { invitationService } from "../../shared/services/invitationService";
import { planningService } from "../../shared/services/planningService";
import { DatePicker } from "../../shared/ui/DatePicker";
import "./WeddingGiftPage.css";

const methods = ["ទាំងអស់", "Bakong QR", "ABA", "សាច់ប្រាក់"];

const METHOD_STYLES = {
    "Bakong QR": { bg: "#e0f2fe", color: "#0369a1", Icon: IoPhonePortraitOutline },
    "ABA": { bg: "#fef3c7", color: "#b45309", Icon: IoCardOutline },
    "សាច់ប្រាក់": { bg: "#dcfce7", color: "#15803d", Icon: IoCashOutline },
};

const emptyGiftForm = {
    name: "",
    amount: "",
    method: "Bakong QR",
    date: "",
    note: "",
};

function toGiftPayload(form) {
    return {
        name: form.name.trim(),
        amount: Math.max(0, Number(form.amount) || 0),
        method: form.method,
        date: form.date || new Date().toISOString().slice(0, 10),
        note: form.note.trim(),
    };
}

function normalizeGift(gift) {
    return {
        id: gift.id,
        name: gift.name || "",
        amount: Number(gift.amount) || 0,
        method: gift.method || "Bakong QR",
        date: gift.date || "",
        note: gift.note || "",
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
    const [invitations, setInvitations] = useState([]);
    const [selectedInvitationId, setSelectedInvitationId] = useState("");
    const [gifts, setGifts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyGiftForm);
    const [loadingInvitations, setLoadingInvitations] = useState(true);
    const [loadingGifts, setLoadingGifts] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setLoadingInvitations(true);
        invitationService.listMine()
            .then((items) => {
                if (!active) return;
                const nextInvitations = items || [];
                setInvitations(nextInvitations);
                setSelectedInvitationId((current) => current || (nextInvitations[0]?.id ? String(nextInvitations[0].id) : ""));
                setError("");
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load invitations");
                }
            })
            .finally(() => {
                if (active) {
                    setLoadingInvitations(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedInvitationId) {
            setGifts([]);
            return undefined;
        }

        let active = true;
        setLoadingGifts(true);
        planningService.listGifts(selectedInvitationId)
            .then((items) => {
                if (active) {
                    setGifts((items || []).map(normalizeGift));
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load wedding gifts");
                }
            })
            .finally(() => {
                if (active) {
                    setLoadingGifts(false);
                }
            });
        return () => {
            active = false;
        };
    }, [selectedInvitationId]);

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

    const submitGift = async (event) => {
        event.preventDefault();
        if (!form.name.trim() || !selectedInvitationId) return;

        setSaving(true);
        setError("");
        try {
            const payload = toGiftPayload(form);
            const saved = editingId
                ? await planningService.updateGift(selectedInvitationId, editingId, payload)
                : await planningService.createGift(selectedInvitationId, payload);
            const nextGift = normalizeGift(saved);
            setGifts((current) => editingId
                ? current.map((gift) => (gift.id === editingId ? nextGift : gift))
                : [nextGift, ...current]);
            resetForm();
        } catch (err) {
            setError(err.message || "Could not save wedding gift");
        } finally {
            setSaving(false);
        }
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

    const deleteGift = async (giftId) => {
        if (!window.confirm("តើអ្នកពិតជាចង់លុបចងដៃនេះមែនទេ?")) return;
        if (!selectedInvitationId) return;
        setSaving(true);
        setError("");
        try {
            await planningService.removeGift(selectedInvitationId, giftId);
            setGifts((current) => current.filter((gift) => gift.id !== giftId));
        } catch (err) {
            setError(err.message || "Could not delete wedding gift");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="wg-page">
            {/* Hero header */}
            <div className="wg-hero">
                <div className="wg-hero-content">
                    <span className="wg-hero-tag">Wedding Gifts</span>
                    <h1 className="wg-title">
                        <IoGiftOutline aria-hidden="true" />
                        ចងដៃមង្គល
                    </h1>
                    <p className="wg-subtitle">តាមដាន និងគ្រប់គ្រងចងដៃមង្គលរបស់អ្នកមួយកន្លែង</p>
                </div>
                <button
                    type="button"
                    className="wg-add-btn"
                    disabled={!selectedInvitationId || saving}
                    onClick={() => {
                        setShowForm((value) => !value);
                        setEditingId(null);
                        setForm(emptyGiftForm);
                    }}
                >
                    {showForm ? (
                        <>
                            <IoCloseOutline aria-hidden="true" />
                            បិទ
                        </>
                    ) : (
                        <>
                            <IoAddOutline aria-hidden="true" />
                            បន្ថែមចងដៃថ្មី
                        </>
                    )}
                </button>
            </div>

            <div className="wg-toolbar">
                <div className="wg-search">
                    <span className="wg-search-icon"><IoMapOutline aria-hidden="true" /></span>
                    <select
                        value={selectedInvitationId}
                        onChange={(event) => {
                            setSelectedInvitationId(event.target.value);
                            resetForm();
                        }}
                        disabled={loadingInvitations || invitations.length === 0}
                    >
                        {invitations.length === 0 ? (
                            <option value="">មិនមានសន្លឹកការនៅ Database</option>
                        ) : (
                            invitations.map((invitation) => (
                                <option key={invitation.id} value={invitation.id}>
                                    {invitation.title || `Invitation #${invitation.id}`}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>

            {error && <div className="wg-empty">{error}</div>}

            {!loadingInvitations && invitations.length === 0 && (
                <div className="wg-empty">
                    <div className="wg-empty-icon"><IoGiftOutline aria-hidden="true" /></div>
                    <h3>មិនទាន់មានសន្លឹកការពី Database</h3>
                    <p>បង្កើតសន្លឹកការជាមុន ដើម្បីរក្សាទុកចងដៃមង្គលទៅ Database។</p>
                    <Link to="/dashboard/invitations/new" className="wg-add-btn">
                        បង្កើតសន្លឹកការ
                    </Link>
                </div>
            )}

            {/* Stats summary */}
            {selectedInvitationId && <div className="wg-summary">
                <div className="wg-sum-card wg-sum-total">
                    <div className="wg-sum-icon"><IoWalletOutline aria-hidden="true" /></div>
                    <div>
                        <span className="wg-sum-label">ចងដៃសរុប</span>
                        <span className="wg-sum-value">${total.toLocaleString()}</span>
                    </div>
                </div>
                <div className="wg-sum-card">
                    <div className="wg-sum-icon"><IoPeopleOutline aria-hidden="true" /></div>
                    <div>
                        <span className="wg-sum-label">អ្នកផ្ញើ</span>
                        <span className="wg-sum-value">{gifts.length} នាក់</span>
                    </div>
                </div>
                <div className="wg-sum-card">
                    <div className="wg-sum-icon"><IoStatsChartOutline aria-hidden="true" /></div>
                    <div>
                        <span className="wg-sum-label">មធ្យមភាគ</span>
                        <span className="wg-sum-value">${average}</span>
                    </div>
                </div>
                <div className="wg-sum-card">
                    <div className="wg-sum-icon"><IoStarOutline aria-hidden="true" /></div>
                    <div>
                        <span className="wg-sum-label">ច្រើនបំផុត</span>
                        <span className="wg-sum-value">${maxGift}</span>
                    </div>
                </div>
            </div>}

            {/* Form (shown when adding/editing) */}
            {showForm && selectedInvitationId && (
                <form className="wg-form" onSubmit={submitGift}>
                    <h3 className="wg-form-title">
                        {editingId ? (
                            <>
                                <IoCreateOutline aria-hidden="true" />
                                កែប្រែចងដៃ
                            </>
                        ) : (
                            <>
                                <IoAddOutline aria-hidden="true" />
                                បន្ថែមចងដៃថ្មី
                            </>
                        )}
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
                        <button type="submit" className="wg-add-btn" disabled={saving}>
                            {saving ? "កំពុងរក្សាទុក..." : editingId ? (
                                <>
                                    <IoSaveOutline aria-hidden="true" />
                                    រក្សាទុក
                                </>
                            ) : (
                                <>
                                    <IoAddOutline aria-hidden="true" />
                                    បន្ថែម
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* Search + filter bar */}
            {selectedInvitationId && <div className="wg-toolbar">
                <div className="wg-search">
                    <span className="wg-search-icon"><IoSearchOutline aria-hidden="true" /></span>
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
            </div>}

            {/* Gift table */}
            {loadingGifts ? (
                <div className="wg-empty">កំពុងទាញទិន្នន័យពី Database...</div>
            ) : selectedInvitationId && filtered.length === 0 ? (
                <div className="wg-empty">
                    <div className="wg-empty-icon"><IoGiftOutline aria-hidden="true" /></div>
                    <h3>មិនមានចងដៃ</h3>
                    <p>មិនទាន់មានទិន្នន័យនៅក្នុង Database សម្រាប់សន្លឹកការនេះទេ។</p>
                </div>
            ) : selectedInvitationId ? (
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
                                const MethodIcon = methodStyle.Icon;
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
                                                <MethodIcon aria-hidden="true" />
                                                {gift.method}
                                            </span>
                                        </td>
                                        <td data-label="ថ្ងៃទទួល" className="wg-muted">
                                            <IoCalendarClearOutline aria-hidden="true" />
                                            {formatDate(gift.date)}
                                        </td>
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
                                                    <IoCreateOutline aria-hidden="true" />
                                                    កែ
                                                </button>
                                                <button
                                                    type="button"
                                                    className="wg-action-btn wg-danger-btn"
                                                    disabled={saving}
                                                    onClick={() => deleteGift(gift.id)}
                                                >
                                                    <IoTrashOutline aria-hidden="true" />
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
            ) : null}
        </div>
    );
}

export default WeddingGiftList;
