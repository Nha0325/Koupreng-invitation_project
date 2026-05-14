import { useState } from "react";
import "./WeddingGiftPage.css";

const allGifts = [
  { id: 1, name: "ចន្ទ្រា សុខ", amount: 150, method: "Bakong QR", date: "2026-01-10", note: "សូមអបអរ!" },
  { id: 2, name: "លក្ខណ៍ ធារា", amount: 200, method: "សាច់ប្រាក់", date: "2026-01-12", note: "" },
  { id: 3, name: "ស្រីពៅ ចាន់", amount: 80, method: "Bakong QR", date: "2026-01-15", note: "រីករាយ!" },
  { id: 4, name: "ស្រីណា ចាន់", amount: 120, method: "ABA", date: "2026-01-18", note: "" },
  { id: 5, name: "ភក្ត្រ ស្រីមុំ", amount: 60, method: "Bakong QR", date: "2026-01-20", note: "ជូនពរ!" },
  { id: 6, name: "វិចិត្រ ដារ៉ា", amount: 100, method: "ABA", date: "2026-01-22", note: "" },
];

const methods = ["ទាំងអស់", "Bakong QR", "ABA", "សាច់ប្រាក់"];

const WeddingGiftPage = () => {
  const [gifts, setGifts] = useState(allGifts);
  const [methodFilter, setMethod] = useState("ទាំងអស់");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGift, setNewGift] = useState({ name: "", amount: "", method: "Bakong QR", date: "", note: "" });

  const filtered = gifts.filter(
    (g) => methodFilter === "ទាំងអស់" || g.method === methodFilter
  );

  const total = gifts.reduce((s, g) => s + g.amount, 0);

  const handleAddGift = (e) => {
    e.preventDefault();
    if (!newGift.name.trim() || !newGift.amount) return;
    const gift = {
      id: Date.now(),
      name: newGift.name,
      amount: Number(newGift.amount),
      method: newGift.method,
      date: newGift.date || new Date().toISOString().split("T")[0],
      note: newGift.note,
    };
    setGifts((prev) => [...prev, gift]);
    setNewGift({ name: "", amount: "", method: "Bakong QR", date: "", note: "" });
    setShowAddModal(false);
  };

  return (
    <div className="wg-page">
      {/* Header */}
      <div className="wg-header">
        <div>
          <h1 className="wg-title">ចំណងដៃ</h1>
          <p className="wg-subtitle">តាមដានការផ្ញើចំណងដៃទាំងអស់</p>
        </div>
        <button className="wg-add-btn" onClick={() => setShowAddModal(true)}>+ បន្ថែមចំណងដៃ</button>
      </div>

      {/* Summary */}
      <div className="wg-summary">
        <div className="wg-sum-card wg-sum-total">
          <span className="wg-sum-label">ចំណងដៃសរុប</span>
          <span className="wg-sum-value">${total.toLocaleString()}</span>
        </div>
        <div className="wg-sum-card">
          <span className="wg-sum-label">ចំនួនអ្នកផ្ញើ</span>
          <span className="wg-sum-value">{gifts.length}</span>
        </div>
        <div className="wg-sum-card">
          <span className="wg-sum-label">មធ្យមភាគ</span>
          <span className="wg-sum-value">${gifts.length > 0 ? Math.round(total / gifts.length) : 0}</span>
        </div>
        <div className="wg-sum-card">
          <span className="wg-sum-label">ច្រើនបំផុត</span>
          <span className="wg-sum-value">${gifts.length > 0 ? Math.max(...gifts.map(g => g.amount)) : 0}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="wg-filters">
        {methods.map((m) => (
          <button
            key={m}
            className={`wg-filter-btn${methodFilter === m ? " active" : ""}`}
            onClick={() => setMethod(m)}
          >{m}</button>
        ))}
      </div>

      {/* Table */}
      <div className="wg-table-wrap">
        <table className="wg-table">
          <thead>
            <tr>
              <th>ឈ្មោះ</th>
              <th>ចំនួន</th>
              <th>វិធីទូទាត់</th>
              <th>ថ្ងៃទី</th>
              <th>កំណត់ចំណាំ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id}>
                <td>
                  <div className="wg-name-cell">
                    <div className="wg-avatar">{g.name.charAt(0)}</div>
                    <span>{g.name}</span>
                  </div>
                </td>
                <td className="wg-amount">${g.amount}</td>
                <td><span className="wg-method-badge">{g.method}</span></td>
                <td className="wg-muted">{g.date}</td>
                <td className="wg-muted">{g.note || "—"}</td>
                <td><button className="wg-action-btn">⋯</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Gift Modal */}
      {showAddModal && (
        <div className="wg-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="wg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wg-modal-header">
              <h2>បន្ថែមចំណងដៃថ្មី</h2>
              <button className="wg-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddGift} className="wg-modal-form">
              <div className="wg-modal-field">
                <label>ឈ្មោះ <span className="req">*</span></label>
                <input type="text" placeholder="បញ្ចូលឈ្មោះ" value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })} required />
              </div>
              <div className="wg-modal-field">
                <label>ចំនួន ($) <span className="req">*</span></label>
                <input type="number" placeholder="0" value={newGift.amount} onChange={(e) => setNewGift({ ...newGift, amount: e.target.value })} required />
              </div>
              <div className="wg-modal-field">
                <label>វិធីទូទាត់</label>
                <select value={newGift.method} onChange={(e) => setNewGift({ ...newGift, method: e.target.value })}>
                  <option>Bakong QR</option>
                  <option>ABA</option>
                  <option>សាច់ប្រាក់</option>
                </select>
              </div>
              <div className="wg-modal-field">
                <label>ថ្ងៃទី</label>
                <input type="date" value={newGift.date} onChange={(e) => setNewGift({ ...newGift, date: e.target.value })} />
              </div>
              <div className="wg-modal-field">
                <label>កំណត់ចំណាំ</label>
                <input type="text" placeholder="ជូនពរ..." value={newGift.note} onChange={(e) => setNewGift({ ...newGift, note: e.target.value })} />
              </div>
              <div className="wg-modal-actions">
                <button type="button" className="wg-modal-cancel" onClick={() => setShowAddModal(false)}>បោះបង់</button>
                <button type="submit" className="wg-modal-submit">បន្ថែម</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingGiftPage;
