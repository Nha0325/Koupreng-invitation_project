import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTemplateById } from "../templates/data/templatesData";
import { invitationService } from "../../shared/services/invitationService";
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
                                        onSee(draft);
                                    }}
                                >
                                    See
                                </button>
                                <button
                                    className="event-card-dropdown-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(false);
                                        onManage(draft);
                                    }}
                                >
                                    Edit
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
                        Edit
                    </button>
                    <Link
                        to={draft.backendInvitationId ? `/dashboard/invitations/${draft.backendInvitationId}/preview` : `/event/${draft.id}`}
                        className="event-card-preview-btn"
                        onClick={(event) => event.stopPropagation()}
                    >
                        See
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function EventsPage() {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        invitationService.listMine()
            .then((items) => {
                if (active) {
                    setDrafts((items || []).map((invitation) => ({
                        id: `inv-${invitation.id}`,
                        backendInvitationId: invitation.id,
                        templateId: invitation.templateId || "royal",
                        title: invitation.title,
                        slug: invitation.slug,
                        status: invitation.status,
                        publishedAt: invitation.status === "PUBLISHED" ? invitation.publishedAt || Date.now() : null,
                        couple: {
                            groom: invitation.groomName,
                            bride: invitation.brideName,
                        },
                        event: {
                            date: invitation.eventDate,
                            receptionTime: invitation.eventTime,
                            venueName: invitation.venueName,
                            venueAddress: invitation.venueAddress,
                        },
                    })));
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load invitations");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    const handleSee = (draft) => {
        if (draft.backendInvitationId) {
            navigate(`/dashboard/invitations/${draft.backendInvitationId}/preview`);
            return;
        }
        navigate(`/event/${draft.id}`);
    };

    const handleManage = (draft) => {
        if (draft.backendInvitationId) {
            navigate(`/dashboard/invitations/${draft.backendInvitationId}`);
            return;
        }
        navigate(`/event/${draft.id}/manage`, { state: { backTo: "/events" } });
    };

    const handleDelete = async (draft) => {
        const confirmed = window.confirm(`តើអ្នកពិតជាចង់លុប "${getTitle(draft)}" មែនទេ?`);
        if (!confirmed) return;
        try {
            if (draft.backendInvitationId) {
                await invitationService.remove(draft.backendInvitationId);
            }
            setDrafts((current) => current.filter((item) => item.id !== draft.id));
        } catch (err) {
            setError(err.message || "Could not delete invitation");
        }
    };

    return (
        <main className="events-page">
            <header className="events-page-header">
                <div>
                    <span>Koupreng invitations</span>
                    <h1>កម្មវិធីសន្លឹកការរបស់អ្នក</h1>
                    <p>ទិន្នន័យនេះអានពី backend invitations ដូចគ្នានឹង dashboard និង guest/budget managers។</p>
                </div>
                <Link to="/create/wedding" className="events-create-btn">
                    + បង្កើតកម្មវិធី
                </Link>
            </header>

            {error && <section className="events-empty"><p>{error}</p></section>}
            {loading ? (
                <section className="events-empty">
                    <p>Loading invitations...</p>
                </section>
            ) : drafts.length === 0 ? (
                <section className="events-empty">
                    <div className="events-empty-icon">គូព្រេង</div>
                    <h2>មិនទាន់មានកម្មវិធី</h2>
                    <p>ចាប់ផ្តើមបង្កើតកម្មវិធីដំបូង ហើយរក្សាទុកក្នុង backend invitations។</p>
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
                            onDelete={handleDelete}
                        />
                    ))}
                </section>
            )}
        </main>
    );
}
