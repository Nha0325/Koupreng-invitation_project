import { useState } from "react";
import "./AddGuestModal.css";

const AddLinkModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "កាតអញ្ជើញ",
    status: "active",
  });

  const categoryOptions = ["កាតអញ្ជើញ", "ការបង់ប្រាក់", "RSVP", "មេឌៀ", "ព័ត៌មាន", "អនុសាសន៍"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      url: "",
      category: "កាតអញ្ជើញ",
      status: "active",
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
          <h2 className="modal-title">បន្ថែមតំណភ្ជាប់ថ្មី</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ឈ្មោះតំណភ្ជាប់</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="ឧទាហរណ៍: វេបសាយកាតក្រុមគ្រួសារ"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL</label>
            <input
              type="url"
              name="url"
              className="form-input"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>

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
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                />
                <span className="radio-text">សកម្ម</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={handleChange}
                />
                <span className="radio-text">មិនសកម្ម</span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              បោះបង់
            </button>
            <button type="submit" className="btn btn-primary">
              បន្ថែមតំណភ្ជាប់
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;
