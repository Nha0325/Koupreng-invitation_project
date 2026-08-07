import Modal from "./Modal";
import LoadingButton from "./LoadingButton";
import "./ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  isDestructive = false,
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdropClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="k-confirm-body">
        <p className="k-confirm-message">{message}</p>
        <div className="k-confirm-actions">
          <button
            type="button"
            className="k-btn k-btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <LoadingButton
            type="button"
            className={`k-btn ${isDestructive ? "k-btn-danger" : "k-btn-primary"}`}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </LoadingButton>
        </div>
      </div>
    </Modal>
  );
}
