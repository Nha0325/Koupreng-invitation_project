import { useState } from "react";
import "./ExpensesPage.css";

const categories = ["ទាំងអស់", "អាហារ", "តុបតែង", "ឈុតខ្លួន", "ការដឹកជញ្ជូន", "ផ្សេងៗ"];

const allExpenses = [
  { id: 1, name: "ម្ហូបអាហារ", category: "អាហារ", amount: 3500, budget: 4000, date: "2026-01-10", status: "paid" },
  { id: 2, name: "តុបតែងផ្កា", category: "តុបតែង", amount: 1200, budget: 1500, date: "2026-01-12", status: "paid" },
  { id: 3, name: "ឈុតស្វាមីភរិយា", category: "ឈុតខ្លួន", amount: 800, budget: 1000, date: "2026-01-15", status: "pending" },
  { id: 4, name: "រថយន្តដឹកភ្ញៀវ", category: "ការដឹកជញ្ជូន", amount: 600, budget: 600, date: "2026-01-18", status: "paid" },
  { id: 5, name: "ថតរូប & វីដេអូ", category: "ផ្សេងៗ", amount: 1500, budget: 2000, date: "2026-01-20", status: "pending" },
  { id: 6, name: "តន្ត្រី & MC", category: "ផ្សេងៗ", amount: 900, budget: 1000, date: "2026-01-22", status: "paid" },
  { id: 7, name: "ការ៉ូ & ស្ករ", category: "អាហារ", amount: 450, budget: 500, date: "2026-01-25", status: "paid" },
];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(allExpenses);
  const [catFilter, setCat] = useState("ទាំងអស់");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: "", category: "អាហារ", amount: "", budget: "", date: "", status: "pending" });

  const filtered = expenses.filter(
    (e) => catFilter === "ទាំងអស់" || e.category === catFilter
  );

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = expenses.reduce((s, e) => s + e.budget, 0);
  const remaining = totalBudget - totalSpent;
  const pct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name.trim() || !newExpense.amount) return;
    const expense = {
      id: Date.now(),
      name: newExpense.name,
      category: newExpense.category,
      amount: Number(newExpense.amount),
      budget: Number(newExpense.budget) || Number(newExpense.amount),
      date: newExpense.date || new Date().toISOString().split("T")[0],
      status: newExpense.status,
    };
    setExpenses((prev) => [...prev, expense]);
    setNewExpense({ name: "", category: "អាហារ", amount: "", budget: "", date: "", status: "pending" });
    setShowAddModal(false);
  };

  return (
    <div className="ep-page">
      {/* Header */}
      <div className="ep-header">
        <div>
          <h1 className="ep-title">ការចំណាយ</h1>
          <p className="ep-subtitle">តាមដានការចំណាយទាំងអស់របស់ព្រឹត្តិការណ៍</p>
        </div>
        <button className="ep-add-btn" onClick={() => setShowAddModal(true)}>+ បន្ថែមការចំណាយ</button>
      </div>

      {/* Budget overview */}
      <div className="ep-budget-card">
        <div className="ep-budget-row">
          <div className="ep-budget-item">
            <span className="ep-budget-label">ថវិការសរុប</span>
            <span className="ep-budget-value">${totalBudget.toLocaleString()}</span>
          </div>
          <div className="ep-budget-item">
            <span className="ep-budget-label">បានចំណាយ</span>
            <span className="ep-budget-value spent">${totalSpent.toLocaleString()}</span>
          </div>
          <div className="ep-budget-item">
            <span className="ep-budget-label">នៅសល់</span>
            <span className="ep-budget-value remaining">${remaining.toLocaleString()}</span>
          </div>
          <div className="ep-budget-item">
            <span className="ep-budget-label">ភាគរយ</span>
            <span className="ep-budget-value">{pct}%</span>
          </div>
        </div>
        <div className="ep-progress-track">
          <div className="ep-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="ep-progress-note">បានប្រើ {pct}% នៃថវិការសរុប</p>
      </div>

      {/* Category filter */}
      <div className="ep-filters">
        {categories.map((c) => (
          <button
            key={c}
            className={`ep-filter-btn${catFilter === c ? " active" : ""}`}
            onClick={() => setCat(c)}
          >{c}</button>
        ))}
      </div>

      {/* Expense list */}
      <div className="ep-table-wrap">
        <table className="ep-table">
          <thead>
            <tr>
              <th>ការចំណាយ</th>
              <th>ប្រភេទ</th>
              <th>ថ្ងៃទី</th>
              <th>ថវិការ</th>
              <th>ចំណាយពិត</th>
              <th>ស្ថានភាព</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td className="ep-name">{e.name}</td>
                <td><span className="ep-cat-badge">{e.category}</span></td>
                <td className="ep-muted">{e.date}</td>
                <td className="ep-muted">${e.budget.toLocaleString()}</td>
                <td className="ep-amount">${e.amount.toLocaleString()}</td>
                <td>
                  <span className={`ep-status ${e.status === "paid" ? "ep-paid" : "ep-pending"}`}>
                    {e.status === "paid" ? "បានបង់" : "រង់ចាំ"}
                  </span>
                </td>
                <td><button className="ep-action-btn">⋯</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="ep-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>បន្ថែមការចំណាយថ្មី</h2>
              <button className="ep-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddExpense} className="ep-modal-form">
              <div className="ep-modal-field">
                <label>ឈ្មោះការចំណាយ <span className="req">*</span></label>
                <input type="text" placeholder="ឧ. ម្ហូបអាហារ" value={newExpense.name} onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })} required />
              </div>
              <div className="ep-modal-field">
                <label>ប្រភេទ</label>
                <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
                  <option>អាហារ</option>
                  <option>តុបតែង</option>
                  <option>ឈុតខ្លួន</option>
                  <option>ការដឹកជញ្ជូន</option>
                  <option>ផ្សេងៗ</option>
                </select>
              </div>
              <div className="ep-modal-field">
                <label>ចំនួនចំណាយ ($) <span className="req">*</span></label>
                <input type="number" placeholder="0" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} required />
              </div>
              <div className="ep-modal-field">
                <label>ថវិការ ($)</label>
                <input type="number" placeholder="0" value={newExpense.budget} onChange={(e) => setNewExpense({ ...newExpense, budget: e.target.value })} />
              </div>
              <div className="ep-modal-field">
                <label>ថ្ងៃទី</label>
                <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
              </div>
              <div className="ep-modal-field">
                <label>ស្ថានភាព</label>
                <select value={newExpense.status} onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}>
                  <option value="pending">រង់ចាំ</option>
                  <option value="paid">បានបង់</option>
                </select>
              </div>
              <div className="ep-modal-actions">
                <button type="button" className="ep-modal-cancel" onClick={() => setShowAddModal(false)}>បោះបង់</button>
                <button type="submit" className="ep-modal-submit">បន្ថែម</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
