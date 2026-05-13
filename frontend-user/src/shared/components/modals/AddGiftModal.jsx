import { useState } from "react";
import "./AddGuestModal.css";

const AddGiftModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    method: "Bakong QR",
    date: "",
    note: "",
  });

  const methodOptions = ["Bakong QR", "ABA", "សាច់ប្រាក់"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      amount: "",
      method: "Bakong QR",
      date: "",
      note: "",
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
          <h2 className="modal-title">បន្ថែមចំណងដៃថ្មី</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ឈ្មោះអ្នកផ្ញើ</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="បញ្ចូលឈ្មោះ"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ចំនួន ($)</label>
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
              <label className="form-label">វិធីទូទាត់</label>
              <select
                name="method"
                className="form-select"
                value={formData.method}
                onChange={handleChange}
              >
                {methodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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

          <div className="form-group">
            <label className="form-label">កំណត់ចំណាំ</label>
            <input
              type="text"
              name="note"
              className="form-input"
              placeholder="សូមអបអរ!"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              បោះបង់
            </button>
            <button type="submit" className="btn btn-primary">
              បន្ថែមចំណងដៃ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGiftModal;
