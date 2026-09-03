import {
    IoAddOutline,
    IoCloseOutline,
    IoCreateOutline,
    IoSaveOutline,
    IoTrashOutline,
} from "react-icons/io5";
import { DatePicker } from "../../../shared/ui/DatePicker";

const CATEGORIES = ["Food & Catering", "Decor & Flowers", "Attire & Makeup", "Venue & Transport", "Other"];

export function ExpenseFormModal({
    show,
    editingId,
    form,
    updateForm,
    submitExpense,
    resetForm,
    addPaymentRow,
    updatePaymentRow,
    removePaymentRow,
    saving,
    t,
}) {
    if (!show) return null;

    const sumPayments = (form.payments || []).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

    return (
        <div className="exp-modal-layer" onClick={resetForm}>
            <div className="exp-modal" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="exp-modal-x" onClick={resetForm}>
                    <IoCloseOutline aria-hidden="true" />
                </button>
                <div className="exp-modal-content">
                    <form className="exp-form" onSubmit={submitExpense}>
                        <h3 className="exp-form-title">
                            {editingId ? (
                                <><IoCreateOutline aria-hidden="true" />{t ? t("formTitleEdit") : "Edit Expense"}</>
                            ) : (
                                <><IoAddOutline aria-hidden="true" />{t ? t("formTitleAdd") : "Add New Expense"}</>
                            )}
                        </h3>
                        <div className="exp-form-body">
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <label className="exp-field-full">
                                    <span>{t ? t("fieldName") : "Expense Item Name"} <em>*</em></span>
                                    <input
                                        type="text"
                                        required
                                        placeholder={t ? t("fieldNamePlaceholder") : "e.g. Venue Rental, Catering..."}
                                        value={form.name}
                                        onChange={(e) => updateForm("name", e.target.value)}
                                    />
                                </label>
                                <label className="exp-field-full">
                                    <span>{t ? t("fieldCategory") : "Category"}</span>
                                    <select
                                        value={form.category}
                                        onChange={(e) => updateForm("category", e.target.value)}
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <label className="exp-field-full">
                                        <span>{t ? t("fieldBudget") : "Estimated Budget ($)"}</span>
                                        <div className="exp-input-with-icon">
                                            <span className="exp-input-prefix">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                placeholder="0"
                                                value={form.budget}
                                                onChange={(e) => updateForm("budget", e.target.value)}
                                            />
                                        </div>
                                    </label>
                                    <label className="exp-field-full">
                                        <span>{t ? t("fieldAmount") : "Actual Amount ($)"}</span>
                                        <div className="exp-input-with-icon">
                                            <span className="exp-input-prefix">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                placeholder="0"
                                                value={sumPayments > 0 ? sumPayments : form.amount}
                                                disabled={sumPayments > 0}
                                                onChange={(e) => updateForm("amount", e.target.value)}
                                            />
                                        </div>
                                    </label>
                                </div>
                                <label className="exp-field-full">
                                    <span>{t ? t("fieldDate") : "Date"}</span>
                                    <DatePicker
                                        value={form.date}
                                        onChange={(v) => updateForm("date", v)}
                                        placeholder={t ? t("fieldDate") : "Date"}
                                    />
                                </label>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <label className="exp-field-full">
                                    <span>{t ? t("fieldVendor") : "Vendor Name"}</span>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sokha Hotel, Wedding Studio..."
                                        value={form.vendorName}
                                        onChange={(e) => updateForm("vendorName", e.target.value)}
                                    />
                                </label>
                                <label className="exp-field-full" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                    <span>{t ? t("fieldNotes") : "Additional Notes"}</span>
                                    <textarea
                                        placeholder={t ? t("placeholderNotes") : "Contract details or contact numbers..."}
                                        value={form.notesText}
                                        onChange={(e) => updateForm("notesText", e.target.value)}
                                        style={{ flexGrow: 1, resize: "none" }}
                                    />
                                </label>

                                {/* Payments / Deposits section */}
                                <div className="exp-payments-section">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "13px", fontWeight: 700 }}>
                                            {t ? t("paymentsTitle") : "Payments & Installments"} ({form.payments?.length || 0})
                                        </span>
                                        <button
                                            type="button"
                                            className="exp-add-payment-btn"
                                            onClick={addPaymentRow}
                                            style={{ fontSize: "12px", padding: "4px 8px" }}
                                        >
                                            <IoAddOutline aria-hidden="true" />
                                            {t ? t("addPaymentBtn") : "+ Add"}
                                        </button>
                                    </div>
                                    {(form.payments || []).map((p, idx) => (
                                        <div key={idx} style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
                                            <input
                                                type="text"
                                                placeholder="Description / Note"
                                                value={p.desc || ""}
                                                onChange={(e) => updatePaymentRow(idx, "desc", e.target.value)}
                                                style={{ flex: "2 1 0", fontSize: "12px", padding: "6px" }}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                placeholder="$"
                                                value={p.amount || ""}
                                                onChange={(e) => updatePaymentRow(idx, "amount", e.target.value)}
                                                style={{ flex: "1 1 0", fontSize: "12px", padding: "6px" }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePaymentRow(idx)}
                                                style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
                                            >
                                                <IoTrashOutline aria-hidden="true" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="exp-form-actions">
                            <button type="button" className="exp-secondary-btn" onClick={resetForm}>
                                {t ? t("cancelBtn") : "Cancel"}
                            </button>
                            <button type="submit" className="exp-add-btn" disabled={!form.name.trim() || saving}>
                                {saving ? (t ? t("saving") || "Saving..." : "Saving...") : editingId ? (
                                    <><IoSaveOutline aria-hidden="true" />{t ? t("saveBtn") : "Save Expense"}</>
                                ) : (
                                    <><IoAddOutline aria-hidden="true" />{t ? t("saveBtn") || "Save Expense" : "Save Expense"}</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ExpenseFormModal;
