export function EventDeleteModal({ draftToDelete, onCancel, onConfirm, isDeleting, t }) {
    if (!draftToDelete) return null;

    return (
        <div className="event-delete-modal-backdrop" onClick={onCancel}>
            <div className="event-delete-modal" onClick={(e) => e.stopPropagation()}>
                <div className="event-delete-modal-icon">⚠️</div>
                <h3 className="event-delete-modal-title">{t("deleteModalTitle") || "តើអ្នកពិតជាចង់លុបកម្មវិធីនេះមែនទេ?"}</h3>
                <p className="event-delete-modal-desc">
                    {t("deleteModalDesc") || "ការលុបកម្មវិធីនេះនឹងលុបភ្ញៀវ គម្រោងថវិកា និងចងដៃដែលពាក់ព័ន្ធទាំងអស់។"}
                </p>
                <div className="event-delete-modal-actions">
                    <button
                        type="button"
                        className="event-delete-btn-cancel"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        {t("cancelBtn") || "បោះបង់"}
                    </button>
                    <button
                        type="button"
                        className="event-delete-btn-confirm"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (t("deleting") || "កំពុងលុប...") : (t("confirmDeleteBtn") || "លុបកម្មវិធី")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventDeleteModal;
