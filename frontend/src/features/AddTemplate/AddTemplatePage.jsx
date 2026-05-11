import { useState } from "react";
import "./AddTemplatePage.css";

function AddTemplatePage() {
    const [form, setForm] = useState({ name: "", style: "ប្រពៃណី", description: "", color: "#7033ff" });
    const styles = ["ប្រពៃណី", "ទំនើប", "ធម្មជាតិ", "ប្រណីត", "មិនីម៉ាលីស"];

    const handleSubmit = (e) => { e.preventDefault(); };

    return (
        <div className="at-page">
            <div className="at-header">
                <div>
                    <h1 className="at-title">បន្ថែមគំរូថ្មី</h1>
                    <p className="at-subtitle">បង្កើតគំរូការ៉ូផ្ទាល់ខ្លួន</p>
                </div>
            </div>

            <div className="at-grid">
                {/* Form */}
                <form className="at-form-card" onSubmit={handleSubmit}>
                    <h2 className="at-section-title">ព័ត៌មានគំរូ</h2>

                    <div className="at-field">
                        <label className="at-label">ឈ្មោះគំរូ <span className="at-req">*</span></label>
                        <input type="text" className="at-input" placeholder="ឧ. ប្រពៃណីខ្មែរ ២០២៦"
                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>

                    <div className="at-field">
                        <label className="at-label">រចនាប័ទ្ម <span className="at-req">*</span></label>
                        <select className="at-select" value={form.style}
                            onChange={(e) => setForm({ ...form, style: e.target.value })}>
                            {styles.map((s) => <option key={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="at-field">
                        <label className="at-label">ពណ៌ចម្បង</label>
                        <div className="at-color-row">
                            <input type="color" className="at-color-input"
                                value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                            <span className="at-color-value">{form.color}</span>
                        </div>
                    </div>

                    <div className="at-field">
                        <label className="at-label">ការពិពណ៌នា</label>
                        <textarea className="at-textarea" placeholder="ពិពណ៌នាអំពីគំរូ..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>

                    <div className="at-actions">
                        <button type="button" className="at-btn-cancel">បោះបង់</button>
                        <button type="submit" className="at-btn-submit">+ បន្ថែមគំរូ</button>
                    </div>
                </form>

                {/* Preview */}
                <div className="at-preview-card">
                    <h2 className="at-section-title">មើលជាមុន</h2>
                    <div className="at-preview-box" style={{ background: `${form.color}15` }}>
                        <div className="at-preview-icon" style={{ background: form.color }}>💒</div>
                        <h3 className="at-preview-name" style={{ color: form.color }}>
                            {form.name || "ឈ្មោះគំរូ"}
                        </h3>
                        <span className="at-preview-style">{form.style}</span>
                        <p className="at-preview-desc">{form.description || "ការពិពណ៌នានឹងបង្ហាញនៅទីនេះ"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTemplatePage;
