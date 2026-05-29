import { useState } from "react";
import {
    createHostRecordId,
    listBudgetExpenses,
    saveBudgetExpenses,
} from "../../services/hostPlanningStorage";
import { DatePicker } from "../../shared/ui/DatePicker";
import "./ExpensesPage.css";

const categories = ["ទាំងអស់", "អាហារ", "តុបតែង", "ឈុតខ្លួន", "ការដឹកជញ្ជូន", "ផ្សេងៗ"];

const CATEGORY_STYLES = {
    "អាហារ": { bg: "#fff7ed", color: "#c2410c", icon: "🍽️" },
    "តុបតែង": { bg: "#fdf4ff", color: "#a21caf", icon: "🌸" },
    "ឈុតខ្លួន": { bg: "#eff6ff", color: "#1d4ed8", icon: "👗" },
    "ការដឹកជញ្ជូន": { bg: "#ecfeff", color: "#0e7490", icon: "🚗" },
    "ផ្សេងៗ": { bg: "#f5f3ff", color: "#6d28d9", icon: "📦" },
};

const defaultExpenses = [
    { id: 1, name: "ម្ហូបអាហារ", category: "អាហារ", amount: 3500, budget: 4000, date: "2026-01-10", status: "paid" },
    { id: 2, name: "តុបតែងផ្កា", category: "តុបតែង", amount: 1200, budget: 1500, date: "2026-01-12", status: "paid" },
    { id: 3, name: "ឈុតស្វាមីភរិយា", category: "ឈុតខ្លួន", amount: 800, budget: 1000, date: "2026-01-15", status: "pending" },
    { id: 4, name: "រថយន្តដឹកភ្ញៀវ", category: "ការដឹកជញ្ជូន", amount: 600, budget: 600, date: "2026-01-18", status: "paid" },
    { id: 5, name: "ថតរូប & វីដេអូ", category: "ផ្សេងៗ", amount: 1500, budget: 2000, date: "2026-01-20", status: "pending" },
    { id: 6, name: "តន្ត្រី & MC", category: "ផ្សេងៗ", amount: 900, budget: 1000, date: "2026-01-22", status: "paid" },
    { id: 7, name: "ការ៉ូ & ស្ករ", category: "អាហារ", amount: 450, budget: 500, date: "2026-01-25", status: "paid" },
];

const emptyExpenseForm = {
    name: "",
    category: "អាហារ",
    budget: "",
    amount: "",
    date: "",
    status: "pending",
};

function toExpense(form, existingId) {
    return {
        id: existingId || createHostRecordId("expense"),
        name: form.name.trim(),
        category: form.category,
        budget: Math.max(0, Number(form.budget) || 0),
        amount: Math.max(0, Number(form.amount) || 0),
        date: form.date || new Date().toISOString().slice(0, 10),
        status: form.status,
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

function ExpensesList() {
    const [catFilter, setCat] = useState("ទាំងអស់");
    const [searchQuery, setSearchQuery] = useState("");
    const [expenses, setExpenses] = useState(() => listBudgetExpenses(defaultExpenses));
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyExpenseForm);

    const filtered = expenses.filter((expense) => {
        const matchesCat = catFilter === "ទាំងអស់" || expense.category === catFilter;
        const matchesSearch = !searchQuery || expense.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const totalBudget = expenses.reduce((sum, expense) => sum + (Number(expense.budget) || 0), 0);
    const remaining = totalBudget - totalSpent;
    const pct = totalBudget ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyExpenseForm);
        setShowForm(false);
    };

    const submitExpense = (event) => {
        event.preventDefault();
        if (!form.name.trim()) return;

        const nextExpense = toExpense(form, editingId);
        const nextExpenses = editingId
            ? expenses.map((expense) => (expense.id === editingId ? nextExpense : expense))
            : [nextExpense, ...expenses];

        setExpenses(nextExpenses);
        saveBudgetExpenses(nextExpenses);
        resetForm();
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

    const deleteExpense = (expenseId) => {
        if (!window.confirm("តើអ្នកពិតជាចង់លុបការចំណាយនេះមែនទេ?")) return;
        const nextExpenses = expenses.filter((expense) => expense.id !== expenseId);
        setExpenses(nextExpenses);
        saveBudgetExpenses(nextExpenses);
    };

    return (
        <div className="ep-page">
            {/* Hero header */}
            <div className="ep-hero">
                <div className="ep-hero-content">
                    <span className="ep-hero-tag">Budget Planning</span>
                    <h1 className="ep-title">💰 គម្រោងថវិកា</h1>
                    <p className="ep-subtitle">បន្ថែម និងតាមដានការចំណាយរបស់ព្រឹត្តិការណ៍</p>
                </div>
                <button
                    type="button"
                    className="ep-add-btn"
                    onClick={() => {
                        setShowForm((value) => !value);
                        setEditingId(null);
                        setForm(emptyExpenseForm);
                    }}
                >
                    {showForm ? "✕ បិទ" : "+ បន្ថែមការចំណាយ"}
                </button>
            </div>

            {/* Stats summary */}
            <div className="ep-summary">
                <div className="ep-sum-card ep-sum-total">
                    <div className="ep-sum-icon">💵</div>
                    <div>
                        <span className="ep-sum-label">ថវិកាសរុប</span>
                        <span className="ep-sum-value">${totalBudget.toLocaleString()}</span>
                    </div>
                </div>
                <div className="ep-sum-card">
                    <div className="ep-sum-icon">💸</div>
                    <div>
                        <span className="ep-sum-label">បានចំណាយ</span>
                        <span className="ep-sum-value">${totalSpent.toLocaleString()}</span>
                    </div>
                </div>
                <div className="ep-sum-card">
                    <div className="ep-sum-icon">{remaining >= 0 ? "💰" : "⚠️"}</div>
                    <div>
                        <span className="ep-sum-label">នៅសល់</span>
                        <span className={`ep-sum-value ${remaining < 0 ? "ep-over" : ""}`}>
                            ${remaining.toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="ep-sum-card">
                    <div className="ep-sum-icon">📊</div>
                    <div>
                        <span className="ep-sum-label">ភាគរយ</span>
                        <span className="ep-sum-value">{pct}%</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="ep-progress-card">
                <div className="ep-progress-header">
                    <span>បានប្រើ {pct}% នៃថវិកាសរុប</span>
                    <span>${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</span>
                </div>
                <div className="ep-progress-track">
                    <div
                        className={`ep-progress-fill${pct >= 100 ? " ep-progress-over" : ""}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                    />
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <form className="ep-form" onSubmit={submitExpense}>
                    <h3 className="ep-form-title">
                        {editingId ? "✏️ កែប្រែការចំណាយ" : "➕ បន្ថែមការចំណាយថ្មី"}
                    </h3>
                    <div className="ep-form-grid">
                        <label>
                            <span>ឈ្មោះការចំណាយ <em>*</em></span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) => updateForm("name", event.target.value)}
                                placeholder="ឧ. ម្ហូបអាហារ"
                                required
                            />
                        </label>
                        <label>
                            <span>ប្រភេទ</span>
                            <select value={form.category} onChange={(event) => updateForm("category", event.target.value)}>
                                {categories.filter((category) => category !== "ទាំងអស់").map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span>ថវិកា ($)</span>
                            <input
                                type="number"
                                min="0"
                                value={form.budget}
                                onChange={(event) => updateForm("budget", event.target.value)}
                                placeholder="0"
                            />
                        </label>
                        <label>
                            <span>ចំណាយពិត ($)</span>
                            <input
                                type="number"
                                min="0"
                                value={form.amount}
                                onChange={(event) => updateForm("amount", event.target.value)}
                                placeholder="0"
                            />
                        </label>
                        <label>
                            <span>ថ្ងៃទី</span>
                            <DatePicker
                                value={form.date}
                                onChange={(val) => updateForm("date", val)}
                                placeholder="ជ្រើសកាលបរិច្ឆេទ"
                            />
                        </label>
                        <label>
                            <span>ស្ថានភាព</span>
                            <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                                <option value="pending">រង់ចាំ</option>
                                <option value="paid">បានបង់</option>
                            </select>
                        </label>
                    </div>
                    <div className="ep-form-actions">
                        <button type="button" className="ep-secondary-btn" onClick={resetForm}>
                            បោះបង់
                        </button>
                        <button type="submit" className="ep-add-btn">
                            {editingId ? "💾 រក្សាទុក" : "➕ បន្ថែម"}
                        </button>
                    </div>
                </form>
            )}

            {/* Toolbar (search + filters) */}
            <div className="ep-toolbar">
                <div className="ep-search">
                    <span className="ep-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="ស្វែងរកការចំណាយ..."
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
                                {category === "ទាំងអស់"
                                    ? expenses.length
                                    : expenses.filter((e) => e.category === category).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="ep-empty">
                    <div className="ep-empty-icon">💰</div>
                    <h3>មិនមានការចំណាយ</h3>
                    <p>មិនទាន់មានការចំណាយណាមួយត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ</p>
                </div>
            ) : (
                <div className="ep-table-wrap">
                    <table className="ep-table">
                        <thead>
                            <tr>
                                <th>ការចំណាយ</th>
                                <th>ប្រភេទ</th>
                                <th>ថ្ងៃទី</th>
                                <th>ថវិកា</th>
                                <th>ចំណាយពិត</th>
                                <th>ស្ថានភាព</th>
                                <th className="ep-th-actions">សកម្មភាព</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((expense) => {
                                const catStyle = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES["ផ្សេងៗ"];
                                const overBudget = Number(expense.amount) > Number(expense.budget);
                                return (
                                    <tr key={expense.id}>
                                        <td data-label="ការចំណាយ" className="ep-name">{expense.name}</td>
                                        <td data-label="ប្រភេទ">
                                            <span
                                                className="ep-cat-badge"
                                                style={{ background: catStyle.bg, color: catStyle.color }}
                                            >
                                                {catStyle.icon} {expense.category}
                                            </span>
                                        </td>
                                        <td data-label="ថ្ងៃទី" className="ep-muted">📅 {formatDate(expense.date)}</td>
                                        <td data-label="ថវិកា" className="ep-muted">${expense.budget.toLocaleString()}</td>
                                        <td data-label="ចំណាយពិត">
                                            <span className={`ep-amount${overBudget ? " ep-amount-over" : ""}`}>
                                                ${expense.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td data-label="ស្ថានភាព">
                                            <span className={`ep-status ${expense.status === "paid" ? "ep-paid" : "ep-pending"}`}>
                                                {expense.status === "paid" ? "✓ បានបង់" : "⏳ រង់ចាំ"}
                                            </span>
                                        </td>
                                        <td data-label="សកម្មភាព">
                                            <div className="ep-row-actions">
                                                <button
                                                    type="button"
                                                    className="ep-action-btn"
                                                    onClick={() => editExpense(expense)}
                                                >
                                                    ✏️ កែ
                                                </button>
                                                <button
                                                    type="button"
                                                    className="ep-action-btn ep-danger-btn"
                                                    onClick={() => deleteExpense(expense.id)}
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

export default ExpensesList;
