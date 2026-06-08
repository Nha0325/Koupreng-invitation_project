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
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";
import "./WeddingGiftPage.css";

const GIFTS_FALLBACK = {
    km: {
        heroTag: "Wedding Gifts",
        title: "ចងដៃមង្គល",
        subtitle: "តាមដាន និងគ្រប់គ្រងចងដៃមង្គលរបស់អ្នកមួយកន្លែង",
        addBtn: "បន្ថែមចងដៃថ្មី",
        closeBtn: "បិទ",
        selectPlaceholder: "មិនមានសន្លឹកការនៅ Database",
        noInvitationsTitle: "មិនទាន់មានសន្លឹកការពី Database",
        noInvitationsText: "បង្កើតសន្លឹកការជាមុន ដើម្បីរក្សាទុកចងដៃមង្គលទៅ Database។",
        createInvitation: "បង្កើតសន្លឹកការ",
        sumTotal: "ចងដៃសរុប",
        sumCount: "អ្នកផ្ញើ",
        sumAverage: "មធ្យមភាគ",
        sumMax: "ច្រើនបំផុត",
        countPersons: "{count} នាក់",
        formTitleAdd: "បន្ថែមចងដៃថ្មី",
        formTitleEdit: "កែប្រែចងដៃ",
        fieldName: "ឈ្មោះអ្នកផ្ញើ",
        fieldAmount: "ចំនួន ($)",
        fieldMethod: "វិធីទូទាត់",
        fieldDate: "ថ្ងៃទទួល",
        fieldNote: "កំណត់ចំណាំ",
        placeholderName: "បញ្ចូលឈ្មោះ",
        placeholderNote: "សារ ឬចំណាំសម្រាប់អ្នកផ្ញើ",
        fieldDatePlaceholder: "ជ្រើសកាលបរិច្ឆេទ",
        cancelBtn: "បោះបង់",
        saveBtn: "រក្សាទុក",
        addItemBtn: "បន្ថែម",
        searchPlaceholder: "ស្វែងរកតាមឈ្មោះ...",
        colName: "ឈ្មោះអ្នកផ្ញើ",
        colAmount: "ចំនួន",
        colMethod: "វិធីទូទាត់",
        colDate: "ថ្ងៃទទួល",
        colNote: "កំណត់ចំណាំ",
        colActions: "សកម្មភាព",
        editBtn: "កែ",
        deleteBtn: "លុប",
        emptyTitle: "មិនមានចងដៃ",
        emptyText: "មិនទាន់មានទិន្នន័យនៅក្នុង Database សម្រាប់សន្លឹកការនេះទេ។",
        loadingText: "កំពុងទាញទិន្នន័យពី Database...",
        savingText: "កំពុងរក្សាទុក...",
        methodAll: "ទាំងអស់",
        deleteConfirm: "តើអ្នកពិតជាចង់លុបចងដៃនេះមែនទេ?",
    },
    en: {
        heroTag: "Wedding Gifts",
        title: "Wedding Gifts",
        subtitle: "Track and manage all your wedding gifts in one place",
        addBtn: "Add Gift",
        closeBtn: "Close",
        selectPlaceholder: "No invitations in Database",
        noInvitationsTitle: "No invitations in Database",
        noInvitationsText: "Create an invitation first to save wedding gifts to the Database.",
        createInvitation: "Create Invitation",
        sumTotal: "Total Gifts",
        sumCount: "Senders",
        sumAverage: "Average",
        sumMax: "Highest",
        countPersons: "{count} persons",
        formTitleAdd: "Add New Gift",
        formTitleEdit: "Edit Gift",
        fieldName: "Sender Name",
        fieldAmount: "Amount ($)",
        fieldMethod: "Payment Method",
        fieldDate: "Date Received",
        fieldNote: "Note",
        placeholderName: "Enter name",
        placeholderNote: "Message or note for the sender",
        fieldDatePlaceholder: "Select date",
        cancelBtn: "Cancel",
        saveBtn: "Save",
        addItemBtn: "Add",
        searchPlaceholder: "Search by name...",
        colName: "Sender Name",
        colAmount: "Amount",
        colMethod: "Payment Method",
        colDate: "Date Received",
        colNote: "Note",
        colActions: "Actions",
        editBtn: "Edit",
        deleteBtn: "Delete",
        emptyTitle: "No gifts",
        emptyText: "No data in the Database for this invitation.",
        loadingText: "Loading data from Database...",
        savingText: "Saving...",
        methodAll: "All",
        deleteConfirm: "Are you sure you want to delete this gift?",
    },
};

const METHOD_STYLES = {
    "Bakong QR": { bg: "#e0f2fe", color: "#0369a1", Icon: IoPhonePortraitOutline },
    "ABA": { bg: "#fef3c7", color: "#b45309", Icon: IoCardOutline },
    "សាច់ប្រាក់": { bg: "#dcfce7", color: "#15803d", Icon: IoCashOutline },
    "Cash": { bg: "#dcfce7", color: "#15803d", Icon: IoCashOutline },
};

const PAYMENT_METHODS = ["Bakong QR", "ABA", "សាច់ប្រាក់"];

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
    const { text: t } = useBackendMessages("gifts", GIFTS_FALLBACK);

    const [methodFilter, setMethod] = useState("ទាំងអស់");
    const [searchQuery, setSearchQuery] = useState("");
    const [invitations, setInvitations] = useState([]);
    const [selectedInvitationId, setSelectedInvitationId] = useState("");
    const [gifts, setGifts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: "", amount: "", method: "Bakong QR", date: "", note: "" });
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
            .catch((err) => { if (active) setError(err.message || "Could not load invitations"); })
            .finally(() => { if (active) setLoadingInvitations(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!selectedInvitationId) { setGifts([]); return undefined; }
        let active = true;
        setLoadingGifts(true);
        planningService.listGifts(selectedInvitationId)
            .then((items) => { if (active) { setGifts((items || []).map(normalizeGift)); setError(""); } })
            .catch((err) => { if (active) setError(err.message || "Could not load wedding gifts"); })
            .finally(() => { if (active) setLoadingGifts(false); });
        return () => { active = false; };
    }, [selectedInvitationId]);

    const allMethods = [t("methodAll"), ...PAYMENT_METHODS];

    const filtered = gifts.filter((gift) => {
        const matchesMethod = methodFilter === t("methodAll") || gift.method === methodFilter;
        const matchesSearch = !searchQuery || gift.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMethod && matchesSearch;
    });

    const total = gifts.reduce((sum, gift) => sum + (Number(gift.amount) || 0), 0);
    const average = gifts.length ? Math.round(total / gifts.length) : 0;
    const maxGift = gifts.length ? Math.max(...gifts.map((gift) => Number(gift.amount) || 0)) : 0;

    const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const resetForm = () => { setEditingId(null); setForm({ name: "", amount: "", method: "Bakong QR", date: "", note: "" }); setShowForm(false); };

    const submitGift = async (event) => {
        event.preventDefault();
        if (!form.name.trim() || !selectedInvitationId) return;
        setSaving(true); setError("");
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
        setForm({ name: gift.name, amount: String(gift.amount), method: gift.method, date: gift.date, note: gift.note || "" });
        setShowForm(true);
    };

    const deleteGift = async (giftId) => {
        if (!window.confirm(t("deleteConfirm"))) return;
        if (!selectedInvitationId) return;
        setSaving(true); setError("");
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
            {/* Hero */}
            <div className="wg-hero">
                <div className="wg-hero-content">
                    <span className="wg-hero-tag">{t("heroTag")}</span>
                    <h1 className="wg-title">
                        <IoGiftOutline aria-hidden="true" />
                        {t("title")}
                    </h1>
                    <p className="wg-subtitle">{t("subtitle")}</p>
                </div>
                <button
                    type="button"
                    className="wg-add-btn"
                    disabled={!selectedInvitationId || saving}
                    onClick={() => { setShowForm((v) => !v); setEditingId(null); setForm({ name: "", amount: "", method: "Bakong QR", date: "", note: "" }); }}
                >
                    {showForm ? (<><IoCloseOutline aria-hidden="true" />{t("closeBtn")}</>) : (<><IoAddOutline aria-hidden="true" />{t("addBtn")}</>)}
                </button>
            </div>

            {/* Invitation selector */}
            <div className="wg-toolbar">
                <div className="wg-search">
                    <span className="wg-search-icon"><IoMapOutline aria-hidden="true" /></span>
                    <select
                        value={selectedInvitationId}
                        onChange={(event) => { setSelectedInvitationId(event.target.value); resetForm(); }}
                        disabled={loadingInvitations || invitations.length === 0}
                    >
                        {invitations.length === 0 ? (
                            <option value="">{t("selectPlaceholder")}</option>
                        ) : (
                            invitations.map((inv) => (
                                <option key={inv.id} value={inv.id}>{inv.title || `Invitation #${inv.id}`}</option>
                            ))
                        )}
                    </select>
                </div>
            </div>

            {error && <div className="wg-empty">{error}</div>}

            {!loadingInvitations && invitations.length === 0 && (
                <div className="wg-empty">
                    <div className="wg-empty-icon"><IoGiftOutline aria-hidden="true" /></div>
                    <h3>{t("noInvitationsTitle")}</h3>
                    <p>{t("noInvitationsText")}</p>
                    <Link to="/dashboard/invitations/new" className="wg-add-btn">{t("createInvitation")}</Link>
                </div>
            )}

            {/* Stats */}
            {selectedInvitationId && (
                <div className="wg-summary">
                    <div className="wg-sum-card wg-sum-total">
                        <div className="wg-sum-icon"><IoWalletOutline aria-hidden="true" /></div>
                        <div>
                            <span className="wg-sum-label">{t("sumTotal")}</span>
                            <span className="wg-sum-value">${total.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="wg-sum-card">
                        <div className="wg-sum-icon"><IoPeopleOutline aria-hidden="true" /></div>
                        <div>
                            <span className="wg-sum-label">{t("sumCount")}</span>
                            <span className="wg-sum-value">{t("countPersons", { count: gifts.length })}</span>
                        </div>
                    </div>
                    <div className="wg-sum-card">
                        <div className="wg-sum-icon"><IoStatsChartOutline aria-hidden="true" /></div>
                        <div>
                            <span className="wg-sum-label">{t("sumAverage")}</span>
                            <span className="wg-sum-value">${average}</span>
                        </div>
                    </div>
                    <div className="wg-sum-card">
                        <div className="wg-sum-icon"><IoStarOutline aria-hidden="true" /></div>
                        <div>
                            <span className="wg-sum-label">{t("sumMax")}</span>
                            <span className="wg-sum-value">${maxGift}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            {showForm && selectedInvitationId && (
                <form className="wg-form" onSubmit={submitGift}>
                    <h3 className="wg-form-title">
                        {editingId ? (<><IoCreateOutline aria-hidden="true" />{t("formTitleEdit")}</>) : (<><IoAddOutline aria-hidden="true" />{t("formTitleAdd")}</>)}
                    </h3>
                    <div className="wg-form-grid">
                        <label>
                            <span>{t("fieldName")} <em>*</em></span>
                            <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder={t("placeholderName")} required />
                        </label>
                        <label>
                            <span>{t("fieldAmount")}</span>
                            <input type="number" min="0" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} placeholder="0" />
                        </label>
                        <label>
                            <span>{t("fieldMethod")}</span>
                            <select value={form.method} onChange={(e) => updateForm("method", e.target.value)}>
                                {PAYMENT_METHODS.map((method) => (<option key={method} value={method}>{method}</option>))}
                            </select>
                        </label>
                        <label>
                            <span>{t("fieldDate")}</span>
                            <DatePicker value={form.date} onChange={(v) => updateForm("date", v)} placeholder={t("fieldDatePlaceholder")} />
                        </label>
                        <label className="wg-form-wide">
                            <span>{t("fieldNote")}</span>
                            <input type="text" value={form.note} onChange={(e) => updateForm("note", e.target.value)} placeholder={t("placeholderNote")} />
                        </label>
                    </div>
                    <div className="wg-form-actions">
                        <button type="button" className="wg-secondary-btn" onClick={resetForm}>{t("cancelBtn")}</button>
                        <button type="submit" className="wg-add-btn" disabled={saving}>
                            {saving ? t("savingText") : editingId
                                ? (<><IoSaveOutline aria-hidden="true" />{t("saveBtn")}</>)
                                : (<><IoAddOutline aria-hidden="true" />{t("addItemBtn")}</>)}
                        </button>
                    </div>
                </form>
            )}

            {/* Search + filter */}
            {selectedInvitationId && (
                <div className="wg-toolbar">
                    <div className="wg-search">
                        <span className="wg-search-icon"><IoSearchOutline aria-hidden="true" /></span>
                        <input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="wg-filters">
                        {allMethods.map((method) => (
                            <button
                                key={method}
                                type="button"
                                className={`wg-filter-btn${methodFilter === method ? " active" : ""}`}
                                onClick={() => setMethod(method)}
                            >
                                {method}
                                <span className="wg-filter-count">
                                    {method === t("methodAll") ? gifts.length : gifts.filter((g) => g.method === method).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            {loadingGifts ? (
                <div className="wg-empty">{t("loadingText")}</div>
            ) : selectedInvitationId && filtered.length === 0 ? (
                <div className="wg-empty">
                    <div className="wg-empty-icon"><IoGiftOutline aria-hidden="true" /></div>
                    <h3>{t("emptyTitle")}</h3>
                    <p>{t("emptyText")}</p>
                </div>
            ) : selectedInvitationId ? (
                <div className="wg-table-wrap">
                    <table className="wg-table">
                        <thead>
                            <tr>
                                <th>{t("colName")}</th>
                                <th>{t("colAmount")}</th>
                                <th>{t("colMethod")}</th>
                                <th>{t("colDate")}</th>
                                <th>{t("colNote")}</th>
                                <th className="wg-th-actions">{t("colActions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((gift) => {
                                const methodStyle = METHOD_STYLES[gift.method] || METHOD_STYLES["Bakong QR"];
                                const MethodIcon = methodStyle.Icon;
                                return (
                                    <tr key={gift.id}>
                                        <td data-label={t("colName")}>
                                            <span className="wg-name-text">{gift.name}</span>
                                        </td>
                                        <td data-label={t("colAmount")}>
                                            <span className="wg-amount">${gift.amount.toLocaleString()}</span>
                                        </td>
                                        <td data-label={t("colMethod")}>
                                            <span className="wg-method-badge" style={{ background: methodStyle.bg, color: methodStyle.color }}>
                                                <MethodIcon aria-hidden="true" />
                                                {gift.method}
                                            </span>
                                        </td>
                                        <td data-label={t("colDate")} className="wg-muted">
                                            <IoCalendarClearOutline aria-hidden="true" />
                                            {formatDate(gift.date)}
                                        </td>
                                        <td data-label={t("colNote")} className="wg-muted wg-note-cell">
                                            {gift.note || <span className="wg-dash">—</span>}
                                        </td>
                                        <td data-label={t("colActions")}>
                                            <div className="wg-row-actions">
                                                <button type="button" className="wg-action-btn" onClick={() => editGift(gift)}>
                                                    <IoCreateOutline aria-hidden="true" />
                                                    {t("editBtn")}
                                                </button>
                                                <button type="button" className="wg-action-btn wg-danger-btn" disabled={saving} onClick={() => deleteGift(gift.id)}>
                                                    <IoTrashOutline aria-hidden="true" />
                                                    {t("deleteBtn")}
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

