const STATUS_CLASS = {
  PENDING: "notif-badge is-pending",
  SENT: "notif-badge is-sent",
  DELIVERED: "notif-badge is-delivered",
  FAILED: "notif-badge is-failed",
  READ: "notif-badge is-read",
  CANCELLED: "notif-badge is-cancelled",
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function NotificationItem({ notification, onRead, busy }) {
  const unread = !notification.readAt;

  return (
    <article className={`notif-item${unread ? " is-unread" : ""}`}>
      <div className="notif-item-main">
        <div className="notif-item-head">
          <strong>{notification.title || notification.type || "Notification"}</strong>
          <span className={STATUS_CLASS[notification.status] || "notif-badge"}>
            {notification.status || "PENDING"}
          </span>
        </div>
        <p>{notification.message || "No message provided."}</p>
        <div className="notif-meta">
          <span>{notification.type || "SYSTEM_ALERT"}</span>
          <span>{notification.channel || "SYSTEM"}</span>
          <span>{formatDate(notification.createdAt)}</span>
        </div>
        {notification.errorMessage && <div className="notif-error">{notification.errorMessage}</div>}
      </div>
      {unread && (
        <button
          type="button"
          className="notif-action"
          disabled={busy}
          onClick={() => onRead(notification.id)}
        >
          Mark read
        </button>
      )}
    </article>
  );
}
