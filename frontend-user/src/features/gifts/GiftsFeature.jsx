import { useEffect, useState, useRef } from "react";
import {
    IoAddOutline,
    IoCalendarClearOutline,
    IoCardOutline,
    IoCashOutline,
    IoCloseOutline,
    IoCreateOutline,
    IoGiftOutline,
    IoPeopleOutline,
    IoPhonePortraitOutline,
    IoSaveOutline,
    IoSearchOutline,
    IoStarOutline,
    IoStatsChartOutline,
    IoTrashOutline,
    IoWalletOutline,
} from "react-icons/io5";
import {
    createHostRecordId,
    getActiveEventId,
    listManualGuests,
    listWeddingGifts,
    saveWeddingGifts,
} from "../../services/hostPlanningStorage";
import { listDrafts } from "../../services/weddingStorage";
import { DatePicker } from "../../shared/ui/DatePicker";
import { useClickOutside } from "../../shared/hooks/useClickOutside";
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";
import { invitationService } from "../../shared/services/invitationService";
import { planningService } from "../../shared/services/planningService";
import "./GiftsFeature.css";



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
        id: gift.id || createHostRecordId("gift"),
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
    } catch (e) {
        console.warn("Invalid date format:", e);
        return dateStr;
    }
}

function GuestSelectField({ value, onChange, options, placeholder, existingGifts = [], t }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef();
    useClickOutside(ref, () => {
        setOpen(false);
        setQuery("");
    });

    const filtered = options.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));
    const isCustom = query.trim() && !options.find(g => g.name.toLowerCase() === query.toLowerCase());

    const selectedOption = options.find(g => g.name === value) || (value ? { name: value } : null);
    const existingGiftForSelected = selectedOption ? existingGifts.find(gift => gift.name === selectedOption.name) : null;

    return (
        <div ref={ref} style={{ position: "relative", width: "100%" }}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    width: "100%", padding: "10px 14px", border: existingGiftForSelected ? "1.5px solid #FB7185" : "1.5px solid #eadfce",
                    borderRadius: "10px", background: "#fdfaf5", fontSize: "14px",
                    cursor: "pointer", color: value ? "#333" : "#999", textAlign: "left",
                    fontFamily: "inherit", minHeight: "48px"
                }}
            >
                {selectedOption ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ 
                            display: "inline-flex", alignItems: "center", justifyContent: "center", 
                            width: "28px", height: "28px", background: existingGiftForSelected ? "#FFE4E6" : "#f5efe5", 
                            color: existingGiftForSelected ? "#E11D48" : "#2a3b5c", 
                            borderRadius: "50%", fontSize: "12px", fontWeight: "bold", flexShrink: 0
                        }}>
                            {selectedOption.name.substring(0, 2).toUpperCase()}
                        </span>
                        <span style={{ fontWeight: 600, color: "#111" }}>{selectedOption.name}</span>
                    </div>
                ) : (
                    <span>{placeholder}</span>
                )}
                <span style={{ fontSize: "16px", color: "#888", display: "flex", flexDirection: "column", lineHeight: "8px" }}>
                    <span style={{ fontSize: "10px" }}>▲</span>
                    <span style={{ fontSize: "10px" }}>▼</span>
                </span>
            </button>

            {existingGiftForSelected && !open && (
                <div style={{ marginTop: "12px" }}>
                    <div style={{ color: "#E11D48", fontSize: "13px", marginBottom: "8px" }}>
                        {t ? t("gifts.alreadyGiven") || "This guest has already given a gift." : "This guest has already given a gift."}
                    </div>
                    <div style={{ 
                        display: "inline-block", background: "#DBEAFE", color: "#1D4ED8", 
                        padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500"
                    }}>
                        {existingGiftForSelected.method.toUpperCase()}: ${existingGiftForSelected.amount}
                    </div>
                </div>
            )}

            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                    background: "#fff", border: "1px solid #eadfce", borderRadius: "10px",
                    boxShadow: "0 10px 24px rgba(80,55,20,0.12)", zIndex: 10,
                    padding: "8px", display: "flex", flexDirection: "column", gap: "8px"
                }}>
                    <div style={{ position: "relative" }}>
                        <IoSearchOutline style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "18px" }} />
                        <input 
                            type="text" 
                            value={query} 
                            onChange={e => setQuery(e.target.value)} 
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (query.trim() && isCustom) {
                                        onChange(query.trim());
                                        setOpen(false);
                                        setQuery("");
                                    } else if (filtered.length > 0) {
                                        onChange(filtered[0].name);
                                        setOpen(false);
                                        setQuery("");
                                    }
                                }
                            }}
                            placeholder={placeholder} 
                            style={{ 
                                width: "100%", padding: "10px 10px 10px 36px", border: "none", borderBottom: "1px solid #f0f0f0", 
                                borderRadius: "0", fontSize: "15px", boxSizing: "border-box", outline: "none",
                                fontFamily: "inherit"
                            }} 
                            autoFocus
                        />
                    </div>
                    <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        {isCustom && (
                            <button
                                type="button"
                                onClick={() => { onChange(query.trim()); setOpen(false); setQuery(""); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px", width: "100%", 
                                    padding: "12px 14px", border: "none", background: "#fdfaf5",
                                    textAlign: "left", cursor: "pointer", fontSize: "14px", color: "#B0926A",
                                    borderRadius: "8px", fontWeight: "bold", marginBottom: "4px",
                                    fontFamily: "inherit"
                                }}
                            >
                                <IoAddOutline /> {t ? t("gifts.useNewName") || "ប្រើឈ្មោះថ្មី:" : "ប្រើឈ្មោះថ្មី:"} "{query.trim()}"
                            </button>
                        )}
                        {filtered.length === 0 && !isCustom && (
                            <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: "14px" }}>
                                {t ? t("gifts.noData") || "មិនមានទិន្នន័យ" : "មិនមានទិន្នន័យ"}
                            </div>
                        )}
                        {filtered.map(g => {
                            const pastGift = existingGifts.find(gift => gift.name === g.name);
                            return (
                                <button
                                    key={g.id || g.name}
                                    type="button"
                                    onClick={() => { onChange(g.name); setOpen(false); setQuery(""); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "12px", width: "100%", 
                                        padding: "12px 14px", border: "none", background: "transparent",
                                        textAlign: "left", cursor: "pointer", fontSize: "15px", color: "#111",
                                        borderBottom: "1px solid #f9f9f9", transition: "background 0.2s",
                                        fontFamily: "inherit"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = "#fdfaf5"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                >
                                    <span style={{ 
                                        display: "inline-flex", alignItems: "center", justifyContent: "center", 
                                        width: "32px", height: "32px", background: pastGift ? "#FFE4E6" : "#f5efe5", 
                                        color: pastGift ? "#E11D48" : "#2a3b5c", 
                                        borderRadius: "50%", fontSize: "13px", fontWeight: "bold", flexShrink: 0
                                    }}>
                                        {g.name.substring(0, 2).toUpperCase()}
                                    </span>
                                    <span style={{ flexGrow: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                                        {g.name}
                                        {pastGift && (
                                            <span style={{ 
                                                background: "#FB7185", color: "white", padding: "2px 8px", 
                                                borderRadius: "12px", fontSize: "11px", fontWeight: "500" 
                                            }}>
                                                {t ? t("gifts.givenGift") || "Given Gift" : "Given Gift"}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function GiftsFeature() {
    const { text: t } = useBackendMessages("gifts");
    const activeEventId = getActiveEventId();
    const drafts = listDrafts();
    const currentDraft = drafts.find((draft) => draft.id === activeEventId) || drafts[0] || null;
    const eventId = currentDraft?.id || activeEventId || "";

    const [gifts, setGifts] = useState(() => listWeddingGifts([], eventId).map(normalizeGift));
    const [guestOptions, setGuestOptions] = useState(() => listManualGuests(eventId));
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: "", amount: "", method: "Bakong QR", date: "", note: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [backendInvitation, setBackendInvitation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");

        invitationService.listMine()
            .then(async (items) => {
                if (!active) return;
                const selected = items?.find(inv => String(inv.id) === String(currentDraft?.backendInvitationId || currentDraft?.id))
                    || items?.find(inv => inv.status === "PUBLISHED")
                    || items?.[0]
                    || null;

                setBackendInvitation(selected);
                setGuestOptions(listManualGuests(eventId));

                if (selected?.id) {
                    const backendGifts = await planningService.listGifts(selected.id);
                    if (active) {
                        setGifts((backendGifts || []).map(normalizeGift));
                    }
                } else {
                    if (active) {
                        setGifts(listWeddingGifts([], eventId).map(normalizeGift));
                    }
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load gifts from backend");
                    setGifts(listWeddingGifts([], eventId).map(normalizeGift));
                    setGuestOptions(listManualGuests(eventId));
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [eventId, currentDraft]);

    const total = gifts.reduce((sum, gift) => sum + (Number(gift.amount) || 0), 0);
    const average = gifts.length ? Math.round(total / gifts.length) : 0;
    const maxGift = gifts.length ? Math.max(...gifts.map((gift) => Number(gift.amount) || 0)) : 0;

    const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const isDuplicateGift = gifts.some(g => g.name === form.name && g.id !== editingId);

    const resetForm = () => { setEditingId(null); setForm({ name: "", amount: "", method: "Bakong QR", date: "", note: "" }); setShowForm(false); };

    const submitGift = async (event) => {
        event.preventDefault();
        if (!form.name.trim() || !eventId || saving) return;
        setSaving(true); setError("");
        try {
            const payload = toGiftPayload(form);
            if (backendInvitation?.id) {
                if (editingId) {
                    const updated = await planningService.updateGift(backendInvitation.id, editingId, payload);
                    const normalized = normalizeGift(updated);
                    setGifts((current) => current.map((g) => g.id === editingId ? normalized : g));
                } else {
                    const created = await planningService.createGift(backendInvitation.id, payload);
                    const normalized = normalizeGift(created);
                    setGifts((current) => [normalized, ...current]);
                }
            } else {
                const nextGift = normalizeGift(payload);
                if (editingId) nextGift.id = editingId;
                const nextGifts = editingId
                    ? gifts.map((gift) => (gift.id === editingId ? nextGift : gift))
                    : [nextGift, ...gifts];
                setGifts(nextGifts);
                saveWeddingGifts(nextGifts, eventId);
            }
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
        if (!eventId || saving) return;
        setSaving(true); setError("");
        try {
            if (backendInvitation?.id) {
                await planningService.removeGift(backendInvitation.id, giftId);
                setGifts((current) => current.filter((g) => g.id !== giftId));
            } else {
                const nextGifts = gifts.filter((gift) => gift.id !== giftId);
                setGifts(nextGifts);
                saveWeddingGifts(nextGifts, eventId);
            }
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
                    disabled={!eventId || saving}
                    onClick={() => { setEditingId(null); setForm({ name: "", amount: "", method: "Bakong QR", date: "", note: "" }); setShowForm(true); }}
                >
                    <IoAddOutline aria-hidden="true" />{t("addBtn")}
                </button>
            </div>
            {error && <div className="wg-empty">{error}</div>}

            {!drafts.length && (
                <div className="wg-empty">
                    <div className="wg-empty-icon"><IoGiftOutline aria-hidden="true" /></div>
                    <h3>{t("noInvitationsTitle")}</h3>
                    <p>{t("noInvitationsText")}</p>
                </div>
            )}

            {/* Stats */}
            {eventId && (
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

            {/* Modal */}
            {showForm && eventId && (
                <div className="wg-modal-layer" onClick={resetForm}>
                    <div className="wg-modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="wg-modal-x" onClick={resetForm}>
                            <IoCloseOutline aria-hidden="true" />
                        </button>
                        <div className="wg-modal-content">
                            <form className="wg-form" onSubmit={submitGift}>
                                <h3 className="wg-form-title">
                                    {editingId ? (<><IoCreateOutline aria-hidden="true" />{t("formTitleEdit")}</>) : (<><IoAddOutline aria-hidden="true" />{t("formTitleAdd")}</>)}
                                </h3>
                                <div className="wg-form-body">
                                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        <label className="wg-field-full">
                                            <span>{t("fieldMethod")}</span>
                                            <select value={form.method} onChange={(e) => updateForm("method", e.target.value)}>
                                                {PAYMENT_METHODS.map((method) => (<option key={method} value={method}>{method}</option>))}
                                            </select>
                                        </label>
                                        <label className="wg-field-full">
                                            <span>{t("fieldAmount")}</span>
                                            <div className="wg-input-with-icon">
                                                <span className="wg-input-prefix">$</span>
                                                <input type="number" min="0" step="any" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} placeholder="0" />
                                            </div>
                                        </label>
                                        <label className="wg-field-full">
                                            <span>{t("fieldDate")}</span>
                                            <DatePicker value={form.date} onChange={(v) => updateForm("date", v)} placeholder={t("fieldDatePlaceholder")} />
                                        </label>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        <label className="wg-field-full">
                                            <span>{t("fieldName")} <em>*</em></span>
                                            <GuestSelectField 
                                                value={form.name} 
                                                onChange={(val) => updateForm("name", val)} 
                                                options={guestOptions}
                                                existingGifts={gifts}
                                                t={t}
                                                placeholder={t("placeholderName") || "Search guest..."} 
                                            />
                                        </label>
                                        <label className="wg-field-full" style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                            <span>{t("fieldNote")}</span>
                                            <textarea
                                                value={form.note}
                                                onChange={(e) => updateForm("note", e.target.value)}
                                                placeholder={t("placeholderNote")}
                                                style={{ flexGrow: 1, resize: "none" }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="wg-form-actions">
                                    <button type="button" className="wg-secondary-btn" onClick={resetForm}>{t("cancelBtn")}</button>
                                    <button type="submit" className="wg-add-btn" disabled={!form.name.trim() || saving || isDuplicateGift}>
                                        {saving ? t("savingText") : editingId
                                            ? (<><IoSaveOutline aria-hidden="true" />{t("saveBtn")}</>)
                                            : (<><IoAddOutline aria-hidden="true" />{t("addItemBtn")}</>)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            {eventId && gifts.length === 0 ? (
                <div className="wg-empty">
                    <div className="wg-empty-icon"><IoGiftOutline aria-hidden="true" /></div>
                    <h3>{t("emptyTitle")}</h3>
                    <p>{t("emptyText")}</p>
                </div>
            ) : eventId ? (
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
                            {gifts.map((gift) => {
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

export default GiftsFeature;

