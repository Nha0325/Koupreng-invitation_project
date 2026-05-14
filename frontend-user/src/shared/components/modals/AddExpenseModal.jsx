import { useState } from "react";
import "./AddGuestModal.css";

const AddExpenseModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "អាហារ",
    amount: "",
    budget: "",
    date: "",
    status: "pending",
  });

  const categoryOptions = ["អាហារ", "តុបតែង", "ឈុតខ្លួន", "ការដឹកជញ្ជូន", "ផ្សេងៗ"];
  const statusOptions = [
    { value: "paid", label: "បានបង់" },
    { value: "pending", label: "រង់ចាំ" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      category: "អាហារ",
      amount: "",
      budget: "",
      date: "",
      status: "pending",
    });
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">បន្ថែមការចំណាយថ្មី</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ឈ្មោះការចំណាយ</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="ឧទាហរណ៍: ម្ហូបអាហារ"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ប្រភេទ</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ស្ថានភាព</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ចំណាយពិត ($)</label>
              <input
                type="number"
                name="amount"
                className="form-input"
                placeholder="0"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ថវិការ ($)</label>
              <input
                type="number"
                name="budget"
                className="form-input"
                placeholder="0"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ថ្ងៃទី</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              បោះបង់
            </button>
            <button type="submit" className="btn btn-primary">
              បន្ថែមការចំណាយ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
