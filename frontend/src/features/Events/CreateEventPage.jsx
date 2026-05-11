import { useState, useRef } from "react";
import TimePicker from "../../components/ui/TimePicker";
import "./CreateEventPage.css";

const eventTypes = [
    "អាពាហ៍ពិពាហ៍",
    "ខួបអនុស្សាវរីយ៍",
    "ពិធីខួបកំណើត",
    "ព្រឹត្តិការណ៍ក្រុមហ៊ុន",
    "ផ្សេងៗ",
];

/* ── Trash icon ── */
const TrashIcon = () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

/* ── Clock icon ── */
const ClockIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

/* ── Toggle ── */
function Toggle({ checked, onChange }) {
    return (
        <label className="ce-toggle">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span className="ce-toggle-track" />
        </label>
    );
}

/* ── Session card ── */
function SessionCard({ session, index, onChange, onDelete, canDelete }) {
    const addSubItem = () => {
        onChange({ ...session, subItems: [...session.subItems, { venue: "", time: "" }] });
    };

    const updateSubItem = (i, field, val) => {
        const updated = session.subItems.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
        onChange({ ...session, subItems: updated });
    };

    const deleteSubItem = (i) => {
        onChange({ ...session, subItems: session.subItems.filter((_, idx) => idx !== i) });
    };

    return (
        <div className="ce-session-card">
            <div className="ce-session-card-header">
                <div className="ce-session-card-title">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    អវ្យបរាះទី {index + 1}
                </div>
                {canDelete && (
                    <button type="button" className="ce-session-delete-btn" onClick={onDelete} aria-label="លុបអវ្យបរាះ">
                        <TrashIcon />
                    </button>
                )}
            </div>

            {/* Session name */}
            <div className="ce-field" style={{ marginBottom: "10px" }}>
                <label className="ce-label">លោះអវ្យបរាះ <span className="req">*</span></label>
                <input
                    type="text"
                    className="ce-input"
                    placeholder="ឧ. កម្មវិធីទី ១ : ថ្ងៃអភិសេក ទី២១ ខែកក្កដា ឆ្នាំ២០២៥"
                    value={session.name}
                    onChange={(e) => onChange({ ...session, name: e.target.value })}
                />
            </div>

            {/* Sub-items */}
            <div className="ce-sub-items">
                {session.subItems.map((sub, i) => (
                    <div key={i} className="ce-sub-item-row">
                        <div className="ce-field" style={{ gap: 0 }}>
                            <label className="ce-label" style={{ marginBottom: "4px" }}>
                                លោះកម្មវិធី <span className="req">*</span>
                            </label>
                            <input
                                type="text"
                                className="ce-input"
                                placeholder="ឧ. ចូបជ្រៀតរំដោះ បងប្អូន ដៃគូពិតីបែរណ៍ ជំនួបជំនួស"
                                value={sub.venue}
                                onChange={(e) => updateSubItem(i, "venue", e.target.value)}
                            />
                        </div>
                        <div className="ce-field" style={{ gap: 0 }}>
                            <label className="ce-label" style={{ marginBottom: "4px" }}>
                                ម៉ោង <span className="req">*</span>
                            </label>
                            <TimePicker
                                value={sub.time}
                                onChange={(val) => updateSubItem(i, "time", val)}
                            />
                        </div>
                        {session.subItems.length > 1 && (
                            <button type="button" className="ce-sub-delete-btn" onClick={() => deleteSubItem(i)} aria-label="លុបកម្មវិធី">
                                <TrashIcon />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" className="ce-add-sub-btn" onClick={addSubItem}>
                    + បន្ថែមកម្មវិធី
                </button>
            </div>
        </div>
    );
}

/* ── Main ── */
function CreateEventPage({ onBack, onCreated }) {
    const fileRef = useRef();
    const [imagePreview, setImagePreview] = useState(null);
    const [active, setActive] = useState(true);
    const [sessionsOpen, setSessionsOpen] = useState(true);

    const [form, setForm] = useState({
        title: "",
        type: "អាពាហ៍ពិពាហ៍",
        groom: "",
        bride: "",
        date: "",
        time: "",
        venue: "",
        contact: "",
    });

    const [sessions, setSessions] = useState([
        { name: "", subItems: [{ venue: "", time: "" }] },
    ]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const addSession = () => {
        setSessions((prev) => [...prev, { name: "", subItems: [{ venue: "", time: "" }] }]);
    };

    const updateSession = (i, updated) => {
        setSessions((prev) => prev.map((s, idx) => idx === i ? updated : s));
    };

    const deleteSession = (i) => {
        setSessions((prev) => prev.filter((_, idx) => idx !== i));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreated({
            title: form.title || "ព្រឹត្តិការណ៍ថ្មី",
            type: form.type,
            date: form.date,
            time: form.time,
            location: form.venue,
            description: form.groom && form.bride ? `${form.groom} & ${form.bride}` : "",
            image: imagePreview,
        });
    };

    return (
        <div className="ce-page">
            <div className="ce-body">
                {/* Title */}
                <h1 className="ce-section-title">បង្កើតកម្មវិធីថ្មី</h1>
                <p className="ce-section-sub">គ្រប់បំពេញភាពទៅតាមកម្មវិធី (Link Preview)</p>

                {/* Image upload */}
                <div
                    className="ce-img-box"
                    onClick={() => fileRef.current.click()}
                    style={{ cursor: "pointer" }}
                >
                    {imagePreview
                        ? <img src={imagePreview} alt="preview" />
                        : <>
                            <div className="ce-img-box-icon">🖼</div>
                            <span>គ្រប់រូបភាពទៅតាមកម្មវិធី (1920 x 1080)</span>
                        </>
                    }
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

                <div className="ce-img-actions">
                    <button type="button" className="ce-img-upload-btn" onClick={() => fileRef.current.click()}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        ដាក់រូបភាព
                    </button>
                    {imagePreview && (
                        <button type="button" className="ce-img-clear-btn" onClick={() => setImagePreview(null)}>✕</button>
                    )}
                </div>

                {/* Main fields */}
                <form id="ce-form" onSubmit={handleSubmit}>
                    <div className="ce-grid">
                        {/* Event name */}
                        <div className="ce-field">
                            <label className="ce-label">លោះកម្មវិធី <span className="req">*</span></label>
                            <input type="text" className="ce-input"
                                placeholder="ឧ. អាពាហ៍ពិពាហ៍ សីហា ទិន & លក្ខិណា"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>

                        {/* Type */}
                        <div className="ce-field">
                            <label className="ce-label">ប្រើប្រាស់ប្រភេទកម្មវិធី <span className="req">*</span></label>
                            <select className="ce-select" value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                {eventTypes.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>

                        {/* Groom */}
                        <div className="ce-field">
                            <label className="ce-label">ចូនប្រុសនាម <span className="req">*</span></label>
                            <input type="text" className="ce-input"
                                placeholder="ឧ. មាន វគ្គ:សីហា"
                                value={form.groom}
                                onChange={(e) => setForm({ ...form, groom: e.target.value })} />
                        </div>

                        {/* Bride */}
                        <div className="ce-field">
                            <label className="ce-label">ចូនស្រីនាម <span className="req">*</span></label>
                            <input type="text" className="ce-input"
                                placeholder="ឧ. សោភណ្ណ លក្ខិណា"
                                value={form.bride}
                                onChange={(e) => setForm({ ...form, bride: e.target.value })} />
                        </div>

                        {/* Date */}
                        <div className="ce-field">
                            <label className="ce-label">កាលបរិច្ឆេទចាប់ផ្តើមកម្មវិធី <span className="req">*</span></label>
                            <input type="date" className="ce-input"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        </div>

                        {/* Time */}
                        <div className="ce-field">
                            <label className="ce-label">ម៉ោងចាប់ផ្តើមនៃការចាប់ <span className="req">*</span></label>
                            <TimePicker
                                value={form.time}
                                onChange={(val) => setForm({ ...form, time: val })}
                            />
                        </div>

                        {/* Venue */}
                        <div className="ce-field">
                            <label className="ce-label">ទីតាំងប្រារព្ធពិធី (អាចបំពេញពេលក្រោយបាន)</label>
                            <textarea className="ce-textarea"
                                placeholder="ឧ. សាលអបអរស្រែកភ្នំ អាគារ A"
                                value={form.venue}
                                onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                        </div>

                        {/* Contact */}
                        <div className="ce-field">
                            <label className="ce-label">ទំនាក់ទំនង (មិនចាំបាច់)</label>
                            <textarea className="ce-textarea"
                                placeholder="សរសេរព័ត៌មានទំនាក់ទំនងរបស់អ្នក"
                                value={form.contact}
                                onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                        </div>
                    </div>

                    {/* Status toggle */}
                    <div className="ce-toggle-row">
                        <span className="ce-toggle-label">ស្ថានភាព</span>
                        <Toggle checked={active} onChange={setActive} />
                    </div>

                    {/* Sessions */}
                    <div className="ce-sessions">
                        <div className="ce-sessions-header" onClick={() => setSessionsOpen((o) => !o)}>
                            <div className="ce-sessions-header-left">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                អវ្យបរាះកម្មវិធី
                                <span className="ce-sessions-count">{sessions.length} អវ្យបរាះ</span>
                            </div>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                style={{ transform: sessionsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {sessionsOpen && (
                            <div className="ce-sessions-body">
                                {sessions.map((session, i) => (
                                    <SessionCard
                                        key={i}
                                        session={session}
                                        index={i}
                                        onChange={(updated) => updateSession(i, updated)}
                                        onDelete={() => deleteSession(i)}
                                        canDelete={sessions.length > 1}
                                    />
                                ))}
                                <button type="button" className="ce-add-session-btn" onClick={addSession}>
                                    + បន្ថែមអវ្យបរាះ
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Bottom bar — outside .ce-body so it sticks to bottom of .ce-page */}
            <div className="ce-bottom-bar-outer">
                <div className="ce-bottom-bar-inner">
                    <button type="button" className="ce-btn-back" onClick={onBack}>
                        ‹ ត្រឡប់ក្រោយ
                    </button>
                    <button type="submit" form="ce-form" className="ce-btn-submit">
                        ✓ បង្កើតថ្មី
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateEventPage;
