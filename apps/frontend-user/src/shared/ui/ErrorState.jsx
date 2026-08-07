import { IoAlertCircleOutline, IoRefreshOutline } from "react-icons/io5";
import "./ErrorState.css";

export default function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while fetching data. Please try again.",
  onRetry,
  retryLabel = "Retry",
  className = "",
}) {
  return (
    <div className={`k-error-state ${className}`} role="alert">
      <div className="k-error-icon-wrap">
        <IoAlertCircleOutline className="k-error-icon" aria-hidden="true" />
      </div>
      <h3 className="k-error-title">{title}</h3>
      {message && <p className="k-error-message">{message}</p>}
      {onRetry && (
        <button type="button" className="k-error-retry-btn" onClick={onRetry}>
          <IoRefreshOutline aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
