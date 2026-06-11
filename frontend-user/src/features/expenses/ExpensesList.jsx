import { useEffect, useState } from "react";
import {
    IoAddOutline,
    IoCalendarClearOutline,
    IoCarOutline,
    IoCashOutline,
    IoCheckmarkCircleOutline,
    IoCloseOutline,
    IoColorPaletteOutline,
    IoCreateOutline,
    IoCubeOutline,
    IoFastFoodOutline,
    IoMapOutline,
    IoSaveOutline,
    IoSearchOutline,
    IoShirtOutline,
    IoStatsChartOutline,
    IoTimeOutline,
    IoTrashOutline,
    IoWalletOutline,
    IoWarningOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import {
    createHostRecordId,
    getActiveEventId,
    listBudgetExpenses,
    saveBudgetExpenses,
} from "../../services/hostPlanningStorage";
import { listDrafts } from "../../services/weddingStorage";
import { DatePicker } from "../../shared/ui/DatePicker";
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";
import "./ExpensesPage.css";



function toExpensePayload(form) {
    const totalPayments = (form.payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return {
        name: form.name.trim(),
        category: form.category || "Other",
        budget: Math.max(0, Number(form.budget) || 0),
        amount: totalPayments,
        date: form.date || new Date().toISOString().slice(0, 10),
        status: totalPayments >= Number(form.budget) ? "paid" : "pending",
        notes: JSON.stringify({
            text: form.notesText || "",
            payments: form.payments || []
        })
    };
}

function normalizeExpense(expense) {
    let parsedNotes = { text: "", payments: [] };
    try {
        if (expense.notes) {
            const parsed = JSON.parse(expense.notes);
            if (parsed && typeof parsed === "object") {
                parsedNotes = {
                    text: parsed.text || "",
                    payments: Array.isArray(parsed.payments) ? parsed.payments : []
                };
            } else {
                parsedNotes.text = expense.notes;
            }
        }
    } catch {
        parsedNotes.text = expense.notes || "";
    }

    return {
        id: expense.id || createHostRecordId("expense"),
        name: expense.name || "",
        category: expense.category || "Other",
        budget: Number(expense.budget) || 0,
        amount: Number(expense.amount) || 0,
        date: expense.date || "",
        status: expense.status || "pending",
        notesText: parsedNotes.text,
        payments: parsedNotes.payments,
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

function ExpensesList() {
    const { text: t } = useBackendMessages("expenses");

    const categories = [
        t("catAll"),
        t("catFood"),
        t("catDecor"),
        t("catClothing"),
        t("catTransport"),
        t("catOther"),
    ];

    const CATEGORY_STYLES = {
        [t("catFood")]: { bg: "#fff7ed", color: "#c2410c", Icon: IoFastFoodOutline },
        [t("catDecor")]: { bg: "#fdf4ff", color: "#a21caf", Icon: IoColorPaletteOutline },
        [t("catClothing")]: { bg: "#eff6ff", color: "#1d4ed8", Icon: IoShirtOutline },
        [t("catTransport")]: { bg: "#ecfeff", color: "#0e7490", Icon: IoCarOutline },
        [t("catOther")]: { bg: "#f5f3ff", color: "#6d28d9", Icon: IoCubeOutline },
    };

    const emptyExpenseForm = {
        name: "",
        category: t("catFood"),
        budget: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        status: "pending",
        notesText: "",
        payments: [],
    };

    const [catFilter, setCat] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const activeEventId = getActiveEventId();
    const drafts = listDrafts();
    const currentDraft = drafts.find((draft) => draft.id === activeEventId) || drafts[0] || null;
    const eventId = currentDraft?.id || activeEventId || "";

    const [expenses, setExpenses] = useState(() => listBudgetExpenses([], eventId).map(normalizeExpense));
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyExpenseForm);
    const [saving, setSaving] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [overBudgetConfirm, setOverBudgetConfirm] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setExpenses(listBudgetExpenses([], eventId).map(normalizeExpense));
    }, [eventId]);

    const filtered = expenses.filter((expense) => {
        const matchesCat = catFilter === "ALL" || expense.category === catFilter;
        const matchesSearch = !searchQuery || expense.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const totalBudget = expenses.reduce((sum, expense) => sum + (Number(expense.budget) || 0), 0);
    const remaining = totalBudget - totalSpent;
    const pct = totalBudget ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
    const RemainingIcon = remaining >= 0 ? IoWalletOutline : IoWarningOutline;

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyExpenseForm);
        setShowForm(false);
    };

    const executeSaveExpense = (formData) => {
        setSaving(true);
        setError("");
        try {
            const nextExpense = normalizeExpense(toExpensePayload(formData));
            if (editingId) nextExpense.id = editingId;
            
            const nextExpenses = editingId
                ? expenses.map((expense) => (expense.id === editingId ? nextExpense : expense))
                : [nextExpense, ...expenses];
                
            setExpenses(nextExpenses);
            saveBudgetExpenses(nextExpenses, eventId);
            resetForm();
            setOverBudgetConfirm(null);
        } catch (err) {
            setError(err.message || "Could not save budget item");
        } finally {
            setSaving(false);
        }
    };

    const submitExpense = async (event) => {
        event.preventDefault();
        if (!form.name.trim() || !eventId) return;

        const budgetNum = Number(form.budget) || 0;
        const sumPayments = form.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
        const finalAmount = sumPayments > 0 ? sumPayments : (Number(form.amount) || 0);

        if (finalAmount > budgetNum) {
            setOverBudgetConfirm({
                ...form,
                _budgetNum: budgetNum,
                _finalAmount: finalAmount
            });
            return;
        }

        executeSaveExpense(form);
    };

    const editExpense = (expense) => {
        setEditingId(expense.id);
        setForm({
            name: expense.name,
            category: expense.category,
            budget: String(expense.budget),
            amount: String(expense.amount),
            date: expense.date,
            status: expense.status,
            notesText: expense.notesText || "",
            payments: expense.payments || [],
        });
        setShowForm(true);
    };

    const handleConfirmDelete = () => {
        if (!expenseToDelete || !eventId) {
            alert("Cannot delete: Missing expense ID or event ID. Please refresh the page.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const nextExpenses = expenses.filter((expense) => expense.id !== expenseToDelete.id);
            setExpenses(nextExpenses);
            saveBudgetExpenses(nextExpenses, eventId);
            setExpenseToDelete(null);
        } catch (err) {
            console.error("Delete error:", err);
            setError(err.message || "Could not delete budget item");
            alert("Error deleting: " + (err.message || "Please try again."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ep-page">
            {/* Hero header */}
            <div className="ep-hero">
                <div className="ep-hero-content">
                    <span className="ep-hero-tag">{t("heroTag")}</span>
                    <h1 className="ep-title">
                        <IoCashOutline aria-hidden="true" />
                        {t("title")}
                    </h1>
                    <p className="ep-subtitle">{t("subtitle")}</p>
                </div>
                <button
                    type="button"
                    className="ep-add-btn"
                    disabled={!eventId || saving}
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setForm(emptyExpenseForm);
                    }}
                >
                    <IoAddOutline aria-hidden="true" />
                    {t("addBtn")}
                </button>
            </div>

            {error && <div className="ep-empty">{error}</div>}

            {!drafts.length && (
                <div className="ep-empty">
                    <div className="ep-empty-icon"><IoCashOutline aria-hidden="true" /></div>
                    <h3>{t("noInvitationsTitle")}</h3>
                    <p>{t("noInvitationsText")}</p>
                </div>
            )}

            {/* Stats summary */}
            {eventId && <div className="ep-summary">
                <div className="ep-sum-card ep-sum-total">
                    <div className="ep-sum-icon"><IoWalletOutline aria-hidden="true" /></div>
                    <div>
                        <span className="ep-sum-label">{t("sumTotal")}</span>
                        <span className="ep-sum-value">${totalBudget.toLocaleString()}</span>
                    </div>
                </div>
                <div className="ep-sum-card">
                    <div className="ep-sum-icon"><IoCashOutline aria-hidden="true" /></div>
                    <div>
                        <span className="ep-sum-label">{t("sumSpent")}</span>
                        <span className="ep-sum-value">${totalSpent.toLocaleString()}</span>
                    </div>
                </div>
                <div className="ep-sum-card">
                    <div className="ep-sum-icon"><RemainingIcon aria-hidden="true" /></div>
                    <div>
                        <span className="ep-sum-label">{t("sumRemaining")}</span>
                        <span className={`ep-sum-value ${remaining < 0 ? "ep-over" : ""}`}>
                            ${remaining.toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="ep-sum-card">
                    <div className="ep-sum-icon"><IoStatsChartOutline aria-hidden="true" /></div>
                    <div>
                        <span className="ep-sum-label">{t("sumPercent")}</span>
                        <span className="ep-sum-value">{pct}%</span>
                    </div>
                </div>
            </div>}

            {/* Progress bar */}
            {eventId && <div className="ep-progress-card">
                <div className="ep-progress-header">
                    <span>{t("progressLabel", { pct })}</span>
                    <span>${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</span>
                </div>
                <div className="ep-progress-track">
                    <div
                        className={`ep-progress-fill${pct >= 100 ? " ep-progress-over" : ""}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                    />
                </div>
            </div>}

            {/* Form Modal */}
            {showForm && eventId && (
                <div className="ep-modal-layer">
                    <div className="ep-modal">
                        <button type="button" className="ep-modal-x" onClick={resetForm}>
                            <IoCloseOutline aria-hidden="true" />
                        </button>
                        <div className="ep-modal-content">
                            <form className="ep-form" onSubmit={submitExpense}>
                                <h3 className="ep-form-title">
                                    {editingId ? (
                                        <>
                                            <IoCreateOutline aria-hidden="true" />
                                            {t("formTitleEdit")}
                                        </>
                                    ) : (
                                        <>
                                            <IoAddOutline aria-hidden="true" />
                                            {t("formTitleAdd")}
                                        </>
                                    )}
                                </h3>
                                <div className="ep-form-body">
                                    {error && <div className="ep-error" style={{ color: '#e11d48', backgroundColor: '#ffe4e6', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
                                    <label className="ep-field-full">
                                        <span>{t("fieldName")} <em>*</em></span>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(event) => updateForm("name", event.target.value)}
                                            placeholder={t("fieldNamePlaceholder")}
                                            required
                                        />
                                    </label>
                                    <label className="ep-field-full">
                                        <span>{t("fieldCategory")} <em>*</em></span>
                                        <select
                                            value={form.category || t("catOther")}
                                            onChange={(event) => updateForm("category", event.target.value)}
                                            required
                                        >
                                            {categories.filter(c => c !== t("catAll")).map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="ep-field-full">
                                        <span>{t("fieldBudget")} <em>*</em></span>
                                        <div className="ep-input-with-icon">
                                            <span className="ep-input-prefix">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={form.budget}
                                                onChange={(event) => updateForm("budget", event.target.value)}
                                                placeholder={t("placeholderAmount")}
                                                required
                                            />
                                        </div>
                                    </label>
                                    <label className="ep-field-full">
                                        <span>{t("fieldNotes")}</span>
                                        <textarea
                                            value={form.notesText}
                                            onChange={(event) => updateForm("notesText", event.target.value)}
                                            placeholder={t("placeholderNotes")}
                                            rows="2"
                                        />
                                    </label>

                                    <div className="ep-payments-section">
                                        <div className="ep-payments-header">
                                            <h4>{t("payments")}</h4>
                                            <button
                                                type="button"
                                                className="ep-secondary-btn ep-sm-btn"
                                                onClick={() => updateForm("payments", [...form.payments, { id: Date.now(), for: "", amount: "", date: new Date().toISOString().slice(0, 10), notes: "" }])}
                                            >
                                                <IoAddOutline aria-hidden="true" /> {t("addPaymentBtn")}
                                            </button>
                                        </div>

                                        {form.payments.length === 0 ? (
                                            <div className="ep-payments-empty">
                                                {t("paymentsEmpty")}
                                            </div>
                                        ) : (
                                            <div className="ep-payments-list">
                                                {form.payments.map((payment, index) => (
                                                    <div key={payment.id} className="ep-payment-item">
                                                        <div className="ep-payment-item-header">
                                                            <h5>{payment.for || `${t("paymentFor")} ${index + 1}`}</h5>
                                                            <button
                                                                type="button"
                                                                className="ep-action-btn ep-danger-btn"
                                                                onClick={() => updateForm("payments", form.payments.filter(p => p.id !== payment.id))}
                                                            >
                                                                <IoTrashOutline aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                        <div className="ep-form-grid">
                                                            <label>
                                                                <span>{t("paymentFor")} <em>*</em></span>
                                                                <input
                                                                    type="text"
                                                                    value={payment.for}
                                                                    onChange={(e) => {
                                                                        const newP = [...form.payments];
                                                                        newP[index].for = e.target.value;
                                                                        updateForm("payments", newP);
                                                                    }}
                                                                    required
                                                                />
                                                            </label>
                                                            <label>
                                                                <span>{t("paymentAmount")} <em>*</em></span>
                                                                <div className="ep-input-with-icon">
                                                                    <span className="ep-input-prefix">$</span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step="any"
                                                                        value={payment.amount}
                                                                        onChange={(e) => {
                                                                            const newP = [...form.payments];
                                                                            newP[index].amount = e.target.value;
                                                                            updateForm("payments", newP);
                                                                        }}
                                                                        placeholder={t("placeholderAmount")}
                                                                        required
                                                                    />
                                                                </div>
                                                            </label>
                                                            <label className="span-2">
                                                                <span>{t("paymentDate")}</span>
                                                                <input
                                                                    type="date"
                                                                    value={payment.date}
                                                                    onChange={(e) => {
                                                                        const newP = [...form.payments];
                                                                        newP[index].date = e.target.value;
                                                                        updateForm("payments", newP);
                                                                    }}
                                                                />
                                                            </label>
                                                            <label className="span-2">
                                                                <span>{t("fieldNotes")}</span>
                                                                <textarea
                                                                    rows="2"
                                                                    value={payment.notes}
                                                                    onChange={(e) => {
                                                                        const newP = [...form.payments];
                                                                        newP[index].notes = e.target.value;
                                                                        updateForm("payments", newP);
                                                                    }}
                                                                    placeholder={t("placeholderNotes")}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="ep-form-actions">
                                    <button type="button" className="ep-secondary-btn" onClick={resetForm}>
                                        {t("cancelBtn")}
                                    </button>
                                    <button type="submit" className="ep-add-btn" disabled={saving}>
                                        {saving ? t("savingText") : editingId ? (
                                            <>
                                                <IoSaveOutline aria-hidden="true" />
                                                {t("saveBtn")}
                                            </>
                                        ) : (
                                            <>
                                                <IoAddOutline aria-hidden="true" />
                                                {t("addItemBtn")}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {expenseToDelete && (
                <div className="ep-modal-layer">
                    <div className="ep-modal" style={{ maxWidth: '400px' }}>
                        <button type="button" className="ep-modal-x" onClick={() => setExpenseToDelete(null)}>
                            <IoCloseOutline aria-hidden="true" />
                        </button>

                        <div className="ep-modal-content" style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '32px' }}>
                            <IoWarningOutline style={{ fontSize: '56px', color: '#f43f5e', marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#2a1f10' }}>
                                {t("deleteConfirm")}
                            </h3>
                            <p style={{ margin: '0 0 24px', color: '#777', fontSize: '15px' }}>
                                {expenseToDelete.name}
                            </p>

                            {error && (
                                <div className="ep-error" style={{ marginBottom: '20px', textAlign: 'left' }}>
                                    {error}
                                </div>
                            )}

                            <div className="ep-form-actions" style={{ justifyContent: 'center', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="ep-secondary-btn"
                                    onClick={() => setExpenseToDelete(null)}
                                    style={{ padding: '10px 24px', minWidth: '100px', fontWeight: '600' }}
                                >
                                    {t("cancelBtn")}
                                </button>
                                <button
                                    type="button"
                                    className="ep-action-btn ep-danger-btn"
                                    disabled={saving}
                                    onClick={handleConfirmDelete}
                                    style={{ background: '#f43f5e', color: '#fff', border: 'none', padding: '10px 24px', minWidth: '100px', fontWeight: '600' }}
                                >
                                    <IoTrashOutline aria-hidden="true" /> {saving ? t("savingText") : t("deleteBtn")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Over Budget Confirmation Modal */}
            {overBudgetConfirm && (
                <div className="ep-modal-layer" style={{ zIndex: 1001 }}>
                    <div className="ep-modal">
                        <button type="button" className="ep-modal-x" onClick={() => setOverBudgetConfirm(null)}>
                            <IoCloseOutline aria-hidden="true" />
                        </button>

                        <div className="ep-modal-content" style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '32px' }}>
                            <IoWarningOutline style={{ fontSize: '56px', color: '#f59e0b', marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#2a1f10' }}>
                                ការព្រមាន៖ លើសថវិកា
                            </h3>
                            <p style={{ color: '#7d6443', marginBottom: '24px', lineHeight: '1.6' }}>
                                ចំនួនប្រាក់ចំណាយសរុប <strong>(${overBudgetConfirm._finalAmount})</strong> លើសពីថវិកាដែលអ្នកបានកំណត់ <strong>(${overBudgetConfirm._budgetNum})</strong>។<br/>
                                តើអ្នកពិតជាចង់រក្សាទុកមែនទេ?
                            </p>

                            <div className="ep-form-actions" style={{ justifyContent: 'center', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="ep-secondary-btn"
                                    onClick={() => setOverBudgetConfirm(null)}
                                    style={{ padding: '10px 24px', minWidth: '100px', fontWeight: '600' }}
                                >
                                    {t("cancelBtn")}
                                </button>
                                <button
                                    type="button"
                                    className="ep-action-btn"
                                    disabled={saving}
                                    onClick={() => executeSaveExpense(overBudgetConfirm)}
                                    style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '10px 24px', minWidth: '100px', fontWeight: '600' }}
                                >
                                    {saving ? t("savingText") : t("saveBtn")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar (search + filters) */}
            {eventId && <div className="ep-toolbar">
                <div className="ep-search">
                    <span className="ep-search-icon"><IoSearchOutline aria-hidden="true" /></span>
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="ep-filters">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`ep-filter-btn${(catFilter === "ALL" && category === t("catAll")) || catFilter === category ? " active" : ""}`}
                            onClick={() => setCat(category === t("catAll") ? "ALL" : category)}
                        >
                            {category}
                            <span className="ep-filter-count">
                                {category === t("catAll")
                                    ? expenses.length
                                    : expenses.filter((e) => e.category === category).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>}

            {/* Table */}
            {eventId && filtered.length === 0 ? (
                <div className="ep-empty">
                    <div className="ep-empty-icon"><IoCashOutline aria-hidden="true" /></div>
                    <h3>{t("emptyTitle")}</h3>
                    <p>{t("emptyText")}</p>
                </div>
            ) : eventId ? (
                <div className="ep-table-wrap">
                    <table className="ep-table">
                        <thead>
                            <tr>
                                <th>{t("colExpense")}</th>
                                <th>{t("colCategory")}</th>
                                <th>{t("colDate")}</th>
                                <th>{t("colBudget")}</th>
                                <th>{t("colAmount")}</th>
                                <th>{t("colStatus")}</th>
                                <th className="ep-th-actions">{t("colActions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((expense) => {
                                const catStyle = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES[t("catOther")];
                                const CategoryIcon = catStyle.Icon;
                                const overBudget = Number(expense.amount) > Number(expense.budget);
                                return (
                                    <tr key={expense.id}>
                                        <td data-label={t("colExpense")} className="ep-name">{expense.name}</td>
                                        <td data-label={t("colCategory")}>
                                            <span
                                                className="ep-cat-badge"
                                                style={{ background: catStyle.bg, color: catStyle.color }}
                                            >
                                                <CategoryIcon aria-hidden="true" />
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td data-label={t("colDate")} className="ep-muted">
                                            <IoCalendarClearOutline aria-hidden="true" />
                                            {formatDate(expense.date)}
                                        </td>
                                        <td data-label={t("colBudget")} className="ep-muted">${expense.budget.toLocaleString()}</td>
                                        <td data-label={t("colAmount")}>
                                            <span className={`ep-amount${overBudget ? " ep-amount-over" : ""}`}>
                                                ${expense.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td data-label={t("colStatus")}>
                                            <span className={`ep-status ${expense.status === "paid" ? "ep-paid" : "ep-pending"}`}>
                                                {expense.status === "paid" ? (
                                                    <>
                                                        <IoCheckmarkCircleOutline aria-hidden="true" />
                                                        {t("statusPaid")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <IoTimeOutline aria-hidden="true" />
                                                        {t("statusPending")}
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td data-label={t("colActions")}>
                                            <div className="ep-row-actions">
                                                <button
                                                    type="button"
                                                    className="ep-action-btn"
                                                    onClick={() => editExpense(expense)}
                                                >
                                                    <IoCreateOutline aria-hidden="true" />
                                                    {t("editBtn")}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="ep-action-btn ep-danger-btn"
                                                    disabled={saving}
                                                    onClick={() => setExpenseToDelete(expense)}
                                                >
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

export default ExpensesList;
