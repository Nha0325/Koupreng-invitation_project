import { useMemo, useRef, useState } from "react";
import TimePicker from "../../shared/ui/TimePicker";
import "./CreateEventPage.css";

const eventTypes = [
    "អាពាហ៍ពិពាហ៍",
    "ខួបអនុស្សាវរីយ៍",
    "ពិធីខួបកំណើត",
    "ព្រឹត្តិការណ៍ក្រុមហ៊ុន",
    "ផ្សេងៗ",
];

const weddingThemes = [
    {
        id: "classic",
        name: "Classic Elegance",
        desc: "Warm tones, serif typography, and clean editorial layout",
        tone: "classic",
        colors: ["#1b120c", "#d5aa56", "#f8ead8"],
    },
    {
        id: "forest",
        name: "Dark Forest Luxury",
        desc: "Deep greens, champagne accents, and magazine-style spacing",
        tone: "forest",
        colors: ["#0d281d", "#d9b86c", "#f4eee2"],
    },
    {
        id: "artdeco",
        name: "Art Deco Luxe",
        desc: "Noir, gold geometry, and formal reception details",
        tone: "artdeco",
        colors: ["#120f0c", "#b88a2d", "#fff6d8"],
    },
];

const templateThemeMap = {
    royal: "classic",
    classic: "classic",
    vintage: "classic",
    forest: "forest",
    garden: "forest",
    sky: "artdeco",
};

function TrashIcon() {
    return (
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <label className="ce-toggle">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
            <span className="ce-toggle-track" />
        </label>
    );
}

function ThemePreview({ theme }) {
    return (
        <div className={`ce-theme-preview ${theme.tone}`}>
            <div className="ce-theme-corners" />
            <div className="ce-theme-monogram">S&J</div>
            <div className="ce-theme-copy">
                <span>WE ARE GETTING MARRIED</span>
                <strong>Sarah & James</strong>
                <i>Saturday, 29 August 2026</i>
            </div>
        </div>
    );
}

function ThemeCard({ theme, selected, onSelect }) {
    return (
        <button
            type="button"
            className={`ce-theme-card${selected ? " selected" : ""}`}
            onClick={onSelect}
        >
            <ThemePreview theme={theme} />
            <div className="ce-theme-card-body">
                <h3>{theme.name}</h3>
                <p>{theme.desc}</p>
                <div className="ce-theme-swatches">
                    {theme.colors.map((color) => (
                        <span key={color} style={{ background: color }} />
                    ))}
                </div>
            </div>
        </button>
    );
}

function SessionCard({ session, index, onChange, onDelete, canDelete }) {
    const addSubItem = () => {
        onChange({ ...session, subItems: [...session.subItems, { venue: "", time: "" }] });
    };

    const updateSubItem = (subIndex, field, value) => {
        const updated = session.subItems.map((sub, index) => (
            index === subIndex ? { ...sub, [field]: value } : sub
        ));
        onChange({ ...session, subItems: updated });
    };

    const deleteSubItem = (subIndex) => {
        onChange({ ...session, subItems: session.subItems.filter((_, index) => index !== subIndex) });
    };

    return (
        <div className="ce-session-card">
            <div className="ce-session-card-header">
                <div className="ce-session-card-title">
                    <CalendarIcon />
                    កម្មវិធីទី {index + 1}
                </div>
                {canDelete && (
                    <button type="button" className="ce-session-delete-btn" onClick={onDelete} aria-label="លុបកម្មវិធី">
                        <TrashIcon />
                    </button>
                )}
            </div>

            <div className="ce-field">
                <label className="ce-label">ចំណងជើងកម្មវិធី <span className="req">*</span></label>
                <input
                    type="text"
                    className="ce-input"
                    placeholder="ឧ. ពិធីសូត្រមន្ត និងទទួលភ្ញៀវ"
                    value={session.name}
                    onChange={(event) => onChange({ ...session, name: event.target.value })}
                />
            </div>

            <div className="ce-sub-items">
                {session.subItems.map((sub, subIndex) => (
                    <div key={subIndex} className="ce-sub-item-row">
                        <div className="ce-field">
                            <label className="ce-label">ទីតាំង / សកម្មភាព <span className="req">*</span></label>
                            <input
                                type="text"
                                className="ce-input"
                                placeholder="ឧ. សាលមង្គល អាគារ A"
                                value={sub.venue}
                                onChange={(event) => updateSubItem(subIndex, "venue", event.target.value)}
                            />
                        </div>
                        <div className="ce-field">
                            <label className="ce-label">ម៉ោង <span className="req">*</span></label>
                            <TimePicker value={sub.time} onChange={(value) => updateSubItem(subIndex, "time", value)} />
                        </div>
                        {session.subItems.length > 1 && (
                            <button type="button" className="ce-sub-delete-btn" onClick={() => deleteSubItem(subIndex)} aria-label="លុប">
                                <TrashIcon />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" className="ce-add-sub-btn" onClick={addSubItem}>
                    + បន្ថែមម៉ោង
                </button>
            </div>
        </div>
    );
}

function CreateEventForm({ onBack, onCreated, initialTemplateId }) {
    const fileRef = useRef(null);
    const initialTheme = templateThemeMap[initialTemplateId] || initialTemplateId || "classic";
    const safeInitialTheme = weddingThemes.some((theme) => theme.id === initialTheme) ? initialTheme : "classic";

    const [step, setStep] = useState("themes");
    const [selectedTheme, setSelectedTheme] = useState(safeInitialTheme);
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
        note: "",
    });
    const [sessions, setSessions] = useState([
        { name: "កម្មវិធីអាពាហ៍ពិពាហ៍", subItems: [{ venue: "", time: "" }] },
    ]);

    const theme = useMemo(
        () => weddingThemes.find((item) => item.id === selectedTheme) || weddingThemes[0],
        [selectedTheme]
    );

    const completion = useMemo(() => {
        const checks = [
            form.title,
            form.groom,
            form.bride,
            form.date,
            form.time,
            form.venue,
            sessions[0]?.name,
        ];
        return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }, [form, sessions]);

    const updateForm = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (loadEvent) => setImagePreview(loadEvent.target.result);
        reader.readAsDataURL(file);
    };

    const addSession = () => {
        setSessions((current) => [...current, { name: "", subItems: [{ venue: "", time: "" }] }]);
    };

    const updateSession = (index, updated) => {
        setSessions((current) => current.map((session, sessionIndex) => (
            sessionIndex === index ? updated : session
        )));
    };

    const deleteSession = (index) => {
        setSessions((current) => current.filter((_, sessionIndex) => sessionIndex !== index));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreated({
            title: form.title || "ព្រឹត្តិការណ៍ថ្មី",
            type: form.type,
            date: form.date,
            time: form.time,
            location: form.venue,
            description: form.groom && form.bride ? `${form.groom} & ${form.bride}` : theme.name,
            image: imagePreview,
            theme: theme.name,
            active,
            sessions,
        });
    };

    if (step === "themes") {
        return (
            <div className="ce-shell">
                <header className="ce-topnav">
                    <button type="button" className="ce-brand" onClick={onBack} aria-label="ត្រឡប់ក្រោយ">
                        <span className="ce-brand-mark">K</span>
                        <strong>Koupreng</strong>
                    </button>
                    <div className="ce-topnav-links">
                        <span>Weddings</span>
                        <span>Blog</span>
                    </div>
                    <button type="button" className="ce-signin" onClick={onBack}>ត្រឡប់</button>
                </header>

                <main className="ce-theme-stage">
                    <div className="ce-theme-heading">
                        <h1>Pick your theme</h1>
                        <p>You can always change this later</p>
                    </div>

                    <div className="ce-theme-grid">
                        {weddingThemes.map((item) => (
                            <ThemeCard
                                key={item.id}
                                theme={item}
                                selected={selectedTheme === item.id}
                                onSelect={() => setSelectedTheme(item.id)}
                            />
                        ))}
                    </div>

                    <div className="ce-theme-actions">
                        <button type="button" className="ce-btn-back" onClick={onBack}>
                            ត្រឡប់ក្រោយ
                        </button>
                        <button type="button" className="ce-btn-submit" onClick={() => setStep("details")}>
                            បន្តបង្កើត
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="ce-shell">
            <header className="ce-topnav">
                <button type="button" className="ce-brand" onClick={() => setStep("themes")} aria-label="ជ្រើសរើសគំរូ">
                    <span className="ce-brand-mark">K</span>
                    <strong>Koupreng</strong>
                </button>
                <div className="ce-topnav-links">
                    <span>{theme.name}</span>
                    <span>{completion}% Complete</span>
                </div>
                <button type="button" className="ce-signin" onClick={onBack}>ត្រឡប់</button>
            </header>

            <main className="ce-editor">
                <section className="ce-editor-form">
                    <div className="ce-editor-title">
                        <span>Wedding Website Editor</span>
                        <h1>បង្កើតកម្មវិធីថ្មី</h1>
                    </div>

                    <form id="ce-form" onSubmit={handleSubmit}>
                        <div className="ce-panel">
                            <div className="ce-panel-header">
                                <h2>ព័ត៌មានសំខាន់</h2>
                                <Toggle checked={active} onChange={setActive} />
                            </div>

                            <div className="ce-grid">
                                <div className="ce-field full">
                                    <label className="ce-label">ឈ្មោះកម្មវិធី <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        className="ce-input"
                                        placeholder="ឧ. អាពាហ៍ពិពាហ៍ សុវណ្ណ & សុដាណា"
                                        value={form.title}
                                        onChange={(event) => updateForm("title", event.target.value)}
                                    />
                                </div>

                                <div className="ce-field">
                                    <label className="ce-label">ប្រភេទកម្មវិធី <span className="req">*</span></label>
                                    <select className="ce-select" value={form.type} onChange={(event) => updateForm("type", event.target.value)}>
                                        {eventTypes.map((type) => <option key={type}>{type}</option>)}
                                    </select>
                                </div>

                                <div className="ce-field">
                                    <label className="ce-label">កាលបរិច្ឆេទ <span className="req">*</span></label>
                                    <input
                                        type="date"
                                        className="ce-input"
                                        value={form.date}
                                        onChange={(event) => updateForm("date", event.target.value)}
                                    />
                                </div>

                                <div className="ce-field">
                                    <label className="ce-label">នាមកូនកំលោះ <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        className="ce-input"
                                        placeholder="ឧ. សុវណ្ណ"
                                        value={form.groom}
                                        onChange={(event) => updateForm("groom", event.target.value)}
                                    />
                                </div>

                                <div className="ce-field">
                                    <label className="ce-label">នាមកូនក្រមុំ <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        className="ce-input"
                                        placeholder="ឧ. សុដាណា"
                                        value={form.bride}
                                        onChange={(event) => updateForm("bride", event.target.value)}
                                    />
                                </div>

                                <div className="ce-field">
                                    <label className="ce-label">ម៉ោងចាប់ផ្តើម <span className="req">*</span></label>
                                    <TimePicker value={form.time} onChange={(value) => updateForm("time", value)} />
                                </div>

                                <div className="ce-field">
                                    <label className="ce-label">ទំនាក់ទំនង</label>
                                    <input
                                        type="text"
                                        className="ce-input"
                                        placeholder="លេខទូរស័ព្ទ ឬ Telegram"
                                        value={form.contact}
                                        onChange={(event) => updateForm("contact", event.target.value)}
                                    />
                                </div>

                                <div className="ce-field full">
                                    <label className="ce-label">ទីតាំងប្រារព្ធពិធី <span className="req">*</span></label>
                                    <textarea
                                        className="ce-textarea"
                                        placeholder="សរសេរឈ្មោះសាល និងអាសយដ្ឋាន"
                                        value={form.venue}
                                        onChange={(event) => updateForm("venue", event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ce-panel">
                            <div className="ce-panel-header ce-clickable" onClick={() => setSessionsOpen((current) => !current)}>
                                <h2>កាលវិភាគកម្មវិធី</h2>
                                <span>{sessions.length} កម្មវិធី</span>
                            </div>

                            {sessionsOpen && (
                                <div className="ce-sessions-body">
                                    {sessions.map((session, index) => (
                                        <SessionCard
                                            key={index}
                                            session={session}
                                            index={index}
                                            onChange={(updated) => updateSession(index, updated)}
                                            onDelete={() => deleteSession(index)}
                                            canDelete={sessions.length > 1}
                                        />
                                    ))}
                                    <button type="button" className="ce-add-session-btn" onClick={addSession}>
                                        + បន្ថែមកម្មវិធី
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </section>

                <aside className="ce-editor-preview">
                    <div className="ce-preview-sticky">
                        <div className="ce-upload" onClick={() => fileRef.current?.click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="event preview" />
                            ) : (
                                <>
                                    <ThemePreview theme={theme} />
                                    <span>Click to upload cover image</span>
                                </>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />

                        <div className="ce-live-card">
                            <span>{theme.name}</span>
                            <h2>{form.title || "Sarah & James"}</h2>
                            <p>{form.date || "Saturday, 29 August 2026"} {form.time || "05:00 PM"}</p>
                            <p>{form.venue || "Classic wedding website preview"}</p>
                            <div className="ce-progress">
                                <span style={{ width: `${completion}%` }} />
                            </div>
                        </div>

                        <div className="ce-bottom-bar-inner">
                            <button type="button" className="ce-btn-back" onClick={() => setStep("themes")}>
                                ជ្រើសគំរូវិញ
                            </button>
                            <button type="submit" form="ce-form" className="ce-btn-submit">
                                បង្កើតថ្មី
                            </button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default CreateEventForm;
