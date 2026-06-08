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
import { invitationService } from "../../shared/services/invitationService";
import { planningService } from "../../shared/services/planningService";
import { DatePicker } from "../../shared/ui/DatePicker";
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";
import "./ExpensesPage.css";



function toExpensePayload(form) {
    return {
        name: form.name.trim(),
        category: form.category,
        budget: Math.max(0, Number(form.budget) || 0),
        amount: Math.max(0, Number(form.amount) || 0),
        date: form.date || new Date().toISOString().slice(0, 10),
        status: form.status,
    };
}

function normalizeExpense(expense) {
    return {
        id: expense.id,
        name: expense.name || "",
        category: expense.category || "",
        budget: Number(expense.budget) || 0,
        amount: Number(expense.amount) || 0,
        date: expense.date || "",
        status: expense.status || "pending",
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
        date: "",
        status: "pending",
    };

    const [catFilter, setCat] = useState(t("catAll"));
    const [searchQuery, setSearchQuery] = useState("");
    const [invitations, setInvitations] = useState([]);
    const [selectedInvitationId, setSelectedInvitationId] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyExpenseForm);
    const [loadingInvitations, setLoadingInvitations] = useState(true);
    const [loadingExpenses, setLoadingExpenses] = useState(false);
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
            setExpenses([]);
            return undefined;
        }

        let active = true;
        setLoadingExpenses(true);
        planningService.listBudgetItems(selectedInvitationId)
            .then((items) => {
                if (active) {
                    setExpenses((items || []).map(normalizeExpense));
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load budget items");
                }
            })
            .finally(() => {
                if (active) {
                    setLoadingExpenses(false);
                }
            });
        return () => {
            active = false;
        };
    }, [selectedInvitationId]);

    const filtered = expenses.filter((expense) => {
        const matchesCat = catFilter === t("catAll") || expense.category === catFilter;
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

    const submitExpense = async (event) => {
        event.preventDefault();
        if (!form.name.trim() || !selectedInvitationId) return;

        setSaving(true);
        setError("");
        try {
            const payload = toExpensePayload(form);
            const saved = editingId
                ? await planningService.updateBudgetItem(selectedInvitationId, editingId, payload)
                : await planningService.createBudgetItem(selectedInvitationId, payload);
            const nextExpense = normalizeExpense(saved);
            setExpenses((current) => editingId
                ? current.map((expense) => (expense.id === editingId ? nextExpense : expense))
                : [nextExpense, ...current]);
            resetForm();
        } catch (err) {
            setError(err.message || "Could not save budget item");
        } finally {
            setSaving(false);
        }
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
        });
        setShowForm(true);
    };

    const deleteExpense = async (expenseId) => {
        if (!window.confirm(t("deleteConfirm"))) return;
        if (!selectedInvitationId) return;
        setSaving(true);
        setError("");
        try {
            await planningService.removeBudgetItem(selectedInvitationId, expenseId);
            setExpenses((current) => current.filter((expense) => expense.id !== expenseId));
        } catch (err) {
            setError(err.message || "Could not delete budget item");
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
                    disabled={!selectedInvitationId || saving}
                    onClick={() => {
                        setShowForm((value) => !value);
                        setEditingId(null);
                        setForm(emptyExpenseForm);
                    }}
                >
                    {showForm ? (
                        <>
                            <IoCloseOutline aria-hidden="true" />
                            {t("closeBtn")}
                        </>
                    ) : (
                        <>
                            <IoAddOutline aria-hidden="true" />
                            {t("addBtn")}
                        </>
                    )}
                </button>
            </div>

            <div className="ep-toolbar">
                <div className="ep-search">
                    <span className="ep-search-icon"><IoMapOutline aria-hidden="true" /></span>
                    <select
                        value={selectedInvitationId}
                        onChange={(event) => {
                            setSelectedInvitationId(event.target.value);
                            resetForm();
                        }}
                        disabled={loadingInvitations || invitations.length === 0}
                    >
                        {invitations.length === 0 ? (
                            <option value="">{t("selectPlaceholder")}</option>
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

            {error && <div className="ep-empty">{error}</div>}

            {!loadingInvitations && invitations.length === 0 && (
                <div className="ep-empty">
                    <div className="ep-empty-icon"><IoCashOutline aria-hidden="true" /></div>
                    <h3>{t("noInvitationsTitle")}</h3>
                    <p>{t("noInvitationsText")}</p>
                    <Link to="/dashboard/invitations/new" className="ep-add-btn">
                        {t("createInvitation")}
                    </Link>
                </div>
            )}

            {/* Stats summary */}
            {selectedInvitationId && <div className="ep-summary">
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
            {selectedInvitationId && <div className="ep-progress-card">
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

            {/* Form */}
            {showForm && selectedInvitationId && (
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
                    <div className="ep-form-grid">
                        <label>
                            <span>{t("fieldName")} <em>*</em></span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) => updateForm("name", event.target.value)}
                                placeholder={t("fieldNamePlaceholder")}
                                required
                            />
                        </label>
                        <label>
                            <span>{t("fieldCategory")}</span>
                            <select value={form.category} onChange={(event) => updateForm("category", event.target.value)}>
                                {categories.filter((category) => category !== t("catAll")).map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span>{t("fieldBudget")}</span>
                            <input
                                type="number"
                                min="0"
                                value={form.budget}
                                onChange={(event) => updateForm("budget", event.target.value)}
                                placeholder="0"
                            />
                        </label>
                        <label>
                            <span>{t("fieldAmount")}</span>
                            <input
                                type="number"
                                min="0"
                                value={form.amount}
                                onChange={(event) => updateForm("amount", event.target.value)}
                                placeholder="0"
                            />
                        </label>
                        <label>
                            <span>{t("fieldDate")}</span>
                            <DatePicker
                                value={form.date}
                                onChange={(val) => updateForm("date", val)}
                                placeholder={t("fieldDate")}
                            />
                        </label>
                        <label>
                            <span>{t("fieldStatus")}</span>
                            <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                                <option value="pending">{t("statusPending")}</option>
                                <option value="paid">{t("statusPaid")}</option>
                            </select>
                        </label>
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
            )}

            {/* Toolbar (search + filters) */}
            {selectedInvitationId && <div className="ep-toolbar">
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
                            className={`ep-filter-btn${catFilter === category ? " active" : ""}`}
                            onClick={() => setCat(category)}
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
            {loadingExpenses ? (
                <div className="ep-empty">{t("loadingText")}</div>
            ) : selectedInvitationId && filtered.length === 0 ? (
                <div className="ep-empty">
                    <div className="ep-empty-icon"><IoCashOutline aria-hidden="true" /></div>
                    <h3>{t("emptyTitle")}</h3>
                    <p>{t("emptyText")}</p>
                </div>
            ) : selectedInvitationId ? (
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
                                                    onClick={() => deleteExpense(expense.id)}
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
