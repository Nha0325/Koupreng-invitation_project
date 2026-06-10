import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTemplateById } from "../templates/data/templatesData";
import { listDrafts, deleteDraft } from "../../services/weddingStorage";
import { invitationService } from "../../shared/services/invitationService";
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";
import "./EventsPage.css";

function EventCard({ draft, onManage, onDelete, t }) {
    const template = getTemplateById(draft.templateId);
    // Show the same cover image the user picked in the builder's card grid
    // (phoneCoverImage / mainImage), not the generic thumbnail.
    const coverImage = template.phoneCoverImage || template.mainImage || template.image;

    return (
        <article className="event-card" onClick={() => onManage(draft)}>
            <div className="event-card-img-wrap">
                <img src={coverImage} alt={template.name} className="event-card-img" />
                <span className="event-card-badge">{draft.publishedAt ? t("badgePublished") : t("badgeDraft")}</span>
            </div>
            <div className="event-card-body">
                <div className="event-card-desc">{template.name} / {template.style}</div>
                <div className="event-card-date">
                    {draft.event?.date || t("noDate")} {draft.event?.receptionTime || ""}
                </div>
                <div className="event-card-footer">
                    <button
                        className="event-card-manage-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onManage(draft);
                        }}
                    >
                        {t("editBtn")}
                    </button>
                    <Link
                        className="event-card-preview-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete(draft);
                        }}
                    >
                        {t("deleteBtn")}
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
    const { text: t } = useBackendMessages("events");
    const { text: tDash } = useBackendMessages("dashboard");

    const handleManage = (draft) => {
        navigate(`/event/${draft.id}/manage`, { state: { backTo: "/events" } });
    };

    const handleDeleteClick = (draft) => {
        setDraftToDelete(draft);
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = async () => {
        if (!draftToDelete) return;
        setIsDeleting(true);

        try {
            // 1. Delete from backend API if it exists (cascades Guests, Budget, Gifts)
            const backendId = draftToDelete.backendInvitationId;
            if (backendId) {
                await invitationService.remove(backendId).catch((err) => {
                    console.warn("Failed to delete from API", err);
                });
            }
        } catch (e) {
            console.warn("Ignored local draft deletion error", e);
        }

        // 2. Delete local data
        deleteDraft(draftToDelete.id);
        localStorage.removeItem(`koupreng.host.manualGuests.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.guestGroups.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.guestCategories.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.expenses.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.gifts.${draftToDelete.id}`);

        setDrafts(listDrafts());
        setDraftToDelete(null);
        setIsDeleting(false);
    };

    return (
        <main className="events-page">
            <header className="events-page-header">
                <div>
                    <span>{tDash("brand")} invitations</span>
                    <h1>{t("title")}</h1>
                    <p>{t("subtitle")}</p>
                </div>
                <Link to="/create/wedding" className="events-create-btn">
                    {t("createBtn")}
                </Link>
            </header>

            {drafts.length === 0 ? (
                <section className="events-empty">
                    <div className="events-empty-icon">{tDash("brand")}</div>
                    <h2>{t("emptyTitle")}</h2>
                    <p>{t("emptySubtitle")}</p>
                    <Link to="/create/wedding" className="events-create-btn">
                        {t("createBtn")}
                    </Link>
                </section>
            ) : (
                <section className="events-grid">
                    {drafts.map((draft) => (
                        <EventCard
                            key={draft.id}
                            draft={draft}
                            onManage={handleManage}
                            onDelete={handleDeleteClick}
                            t={t}
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
                            <h3>Delete this event?</h3>
                            <p style={{ marginTop: "10px", marginBottom: "16px", color: "#666" }}>
                                This will permanently delete this event and all linked data (Guests, Budget, Wedding Gifts). You cannot undo this action.
                            </p>
                            <div className="events-modal-actions">
                                <button type="button" className="events-modal-cancel" onClick={() => setDraftToDelete(null)} disabled={isDeleting}>
                                    Cancel
                                </button>
                                <button type="button" className="events-modal-confirm" onClick={confirmDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete Event"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
