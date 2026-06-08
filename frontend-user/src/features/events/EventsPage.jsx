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

function EventCard({ draft, onSee, onManage, onDelete }) {
    const template = getTemplateById(draft.templateId);
    // Show the same cover image the user picked in the builder's card grid
    // (phoneCoverImage / mainImage), not the generic thumbnail.
    const coverImage = template.phoneCoverImage || template.mainImage || template.image;
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
                <img src={coverImage} alt={template.name} className="event-card-img" />
                <span className="event-card-badge">{draft.publishedAt ? "Published" : "Draft"}</span>
            </div>
            <div className="event-card-body">
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
                        Edit
                    </button>
                    <Link
                        className="event-card-preview-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete(draft);
                        }}
                    >
                        Delete  
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function EventsPage() {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState(listDrafts());
    const [draftToDelete, setDraftToDelete] = useState(null);

    const handleSee = (draft) => {
        navigate(`/event/${draft.id}`);
    };

    const handleManage = (draft) => {
        navigate(`/event/${draft.id}/manage`, { state: { backTo: "/events" } });
    };

    const handleDeleteClick = (draft) => {
        setDraftToDelete(draft);
    };

    const confirmDelete = () => {
        if (!draftToDelete) return;
        deleteDraft(draftToDelete.id);
        setDrafts(listDrafts());
        setDraftToDelete(null);
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
                        <EventCard
                            key={draft.id}
                            draft={draft}
                            onSee={handleSee}
                            onManage={handleManage}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </section>
            )}

            {/* Custom Delete Confirmation Modal */}
            {draftToDelete && (
                <div className="events-modal-layer">
                    <div className="events-modal">
                        <button type="button" className="events-modal-close" onClick={() => setDraftToDelete(null)}>
                            ✕
                        </button>
                        <div className="events-modal-content">
                            <h3>លុបកម្មវិធីនេះ?</h3>
                            <p>កម្មវិធីនេះនឹងត្រូវបានលុបចោល!</p>
                            <div className="events-modal-actions">
                                <button type="button" className="events-modal-cancel" onClick={() => setDraftToDelete(null)}>
                                    ✕ បោះបង់
                                </button>
                                <button type="button" className="events-modal-confirm" onClick={confirmDelete}>
                                    ✓ យល់ព្រម
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
