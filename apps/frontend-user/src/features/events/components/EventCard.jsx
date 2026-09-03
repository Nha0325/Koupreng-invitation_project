import { getTemplateById } from "../../templates/data/templatesData";

export function EventCard({ draft, onManage, onDelete, t }) {
    const template = getTemplateById(draft.templateId);
    
    let coverImage = "/facebook/all/03-card/cover-card.jpg";
    try {
        if (draft.coverImage) coverImage = draft.coverImage;
        else if (draft.designJson) {
            const parsed = typeof draft.designJson === "string" ? JSON.parse(draft.designJson) : draft.designJson;
            if (parsed?.coverImage) coverImage = parsed.coverImage;
        } else if (template?.phoneCoverImage || template?.mainImage) {
            coverImage = template.phoneCoverImage || template.mainImage;
        }
    } catch {
        // fallback image
    }

    const title = draft.title || draft.event?.title || template?.name || "សិរីមង្គលអាពាហ៍ពិពាហ៍";
    const coupleText = (draft.couple?.groom && draft.couple?.bride)
        ? `${draft.couple.groom} & ${draft.couple.bride}`
        : (draft.groomName && draft.brideName)
            ? `${draft.groomName} & ${draft.brideName}`
            : "";
    const dateText = draft.event?.date || draft.eventDate || t("noDate") || "មិនទាន់កំណត់កាលបរិច្ឆេទ";
    const timeText = draft.event?.receptionTime || draft.eventTime || "";

    return (
        <article className="event-card" onClick={() => onManage(draft)}>
            <div className="event-card-img-wrap">
                <img src={coverImage} alt={title} className="event-card-img" />
                <span className="event-card-badge">{draft.publishedAt || draft.status === "PUBLISHED" ? t("badgePublished") : t("badgeDraft")}</span>
            </div>
            <div className="event-card-body">
                <div className="event-card-desc" style={{ fontWeight: 800, color: "var(--brand-text)", fontSize: "1rem" }}>{title}</div>
                {coupleText && <div style={{ fontSize: "0.8125rem", color: "var(--brand-primary)", fontWeight: 700, margin: "2px 0 6px" }}>{coupleText}</div>}
                <div className="event-card-date">
                    {dateText} {timeText}
                </div>
                <div className="event-card-footer">
                    <button
                        type="button"
                        className="event-card-manage-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onManage(draft);
                        }}
                    >
                        {t("editBtn") || "កែសម្រួល"}
                    </button>
                    <button
                        type="button"
                        className="event-card-preview-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete(draft);
                        }}
                    >
                        {t("deleteBtn") || "លុប"}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default EventCard;
