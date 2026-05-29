import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTemplateById } from "../templates/data/templatesData";
import { listDrafts, deleteDraft } from "../../services/weddingStorage";
import "./EventsPage.css";

function getTitle(draft) {
    const eventTitle = draft?.extras?.eventTitle || draft?.title;
    const groom = draft?.couple?.groom;
    const bride = draft?.couple?.bride;

    if (eventTitle) {
        return eventTitle;
    }

    if (groom || bride) {
        return `${groom || "កូនកំលោះ"} & ${bride || "កូនក្រមុំ"}`;
    }

    return "សន្លឹកការថ្មី";
}

function EventCard({ draft, onManage, onDelete }) {
    const template = getTemplateById(draft.templateId);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    return (
        <article className="event-card" onClick={() => onManage(draft)}>
            <div className="event-card-img-wrap">
                <img src={template.image} alt={template.name} className="event-card-img" />
                <span className="event-card-badge">{draft.publishedAt ? "Published" : "Draft"}</span>
            </div>
            <div className="event-card-body">
                <div className="event-card-title-row">
                    <div className="event-card-title">{getTitle(draft)}</div>
                    {/* Three-dot menu */}
                    <div className="event-card-menu-wrap" ref={menuRef}>
                        <button
                            className="event-card-dots-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            aria-label="ម៉ឺនុយ"
                        >
                            ⋯
                        </button>
                        {menuOpen && (
                            <div className="event-card-dropdown">
                                <button
                                    className="event-card-dropdown-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(false);
                                        onManage(draft);
                                    }}
                                >
                                    ✏️ កែប្រែ
                                </button>
                                <button
                                    className="event-card-dropdown-item event-card-dropdown-item--danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(false);
                                        onDelete(draft);
                                    }}
                                >
                                    🗑️ លុប
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="event-card-desc">{template.name} / {template.style}</div>
                <div className="event-card-date">
                    {draft.event?.date || "មិនទាន់បំពេញថ្ងៃ"} {draft.event?.receptionTime || ""}
                </div>
                <div className="event-card-footer">
                    <button
                        className="event-card-manage-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onManage(draft);
                        }}
                    >
                        ចូលគ្រប់គ្រង
                    </button>
                    <Link
                        to={`/preview/${draft.id}`}
                        className="event-card-preview-btn"
                        onClick={(event) => event.stopPropagation()}
                    >
                        Preview
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function EventsPage() {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState(listDrafts());

    const handleManage = (draft) => {
        navigate(`/create/wedding/${draft.id}`, { state: { backTo: "/events" } });
    };

    const handleDelete = (draft) => {
        const confirmed = window.confirm(`តើអ្នកពិតជាចង់លុប "${getTitle(draft)}" មែនទេ?`);
        if (!confirmed) return;
        deleteDraft(draft.id);
        setDrafts(listDrafts());
    };

    return (
        <main className="events-page">
            <header className="events-page-header">
                <div>
                    <span>Koupreng invitations</span>
                    <h1>កម្មវិធីសន្លឹកការរបស់អ្នក</h1>
                    <p>ទិន្នន័យនេះអានពី wedding draft storage ដូចគ្នានឹង dashboard និង builder។</p>
                </div>
                <Link to="/create/wedding" className="events-create-btn">
                    + បង្កើតកម្មវិធី
                </Link>
            </header>

            {drafts.length === 0 ? (
                <section className="events-empty">
                    <div className="events-empty-icon">គូព្រេង</div>
                    <h2>មិនទាន់មានកម្មវិធី</h2>
                    <p>ចាប់ផ្តើមបង្កើតកម្មវិធីដំបូង ហើយរក្សាទុកក្នុង wedding draft storage។</p>
                    <Link to="/create/wedding" className="events-create-btn">
                        + បង្កើតកម្មវិធី
                    </Link>
                </section>
            ) : (
                <section className="events-grid">
                    {drafts.map((draft) => (
                        <EventCard key={draft.id} draft={draft} onManage={handleManage} onDelete={handleDelete} />
                    ))}
                </section>
            )}
        </main>
    );
}
