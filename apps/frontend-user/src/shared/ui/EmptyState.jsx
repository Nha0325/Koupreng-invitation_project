import { IoFolderOpenOutline } from "react-icons/io5";
import "./EmptyState.css";

export default function EmptyState({
  icon: Icon = IoFolderOpenOutline,
  title = "No items found",
  description = "Get started by creating a new entry.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`k-empty-state ${className}`}>
      <div className="k-empty-icon-wrap">
        <Icon className="k-empty-icon" aria-hidden="true" />
      </div>
      <h3 className="k-empty-title">{title}</h3>
      {description && <p className="k-empty-description">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="k-empty-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
