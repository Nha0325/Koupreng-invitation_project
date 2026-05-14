import { useState } from "react";
import "./AddGuestModal.css";

const AddGuestModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    group: "គ្រួសារ",
    status: "រង់ចាំ",
    amount: "",
    seat: "",
  });

  const groupOptions = ["គ្រួសារ", "មិត្តភក្ដិ", "ការងារ"];
  const statusOptions = ["បញ្ជាក់", "រង់ចាំ", "បដិសេធ"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      phone: "",
      group: "គ្រួសារ",
      status: "រង់ចាំ",
      amount: "",
      seat: "",
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
          <h2 className="modal-title">បន្ថែមភ្ញៀវថ្មី</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ឈ្មោះ</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="បញ្ចូលឈ្មោះភ្ញៀវ"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ទូរស័ព្ទ</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="012 345 678"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ក្រុម</label>
              <select
                name="group"
                className="form-select"
                value={formData.group}
                onChange={handleChange}
              >
                {groupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ស្ថានភាព</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ចំណងដៃ ($)</label>
              <input
                type="number"
                name="amount"
                className="form-input"
                placeholder="0"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">កៅអី</label>
            <input
              type="text"
              name="seat"
              className="form-input"
              placeholder="A-01"
              value={formData.seat}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              បោះបង់
            </button>
            <button type="submit" className="btn btn-primary">
              បន្ថែមភ្ញៀវ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuestModal;
