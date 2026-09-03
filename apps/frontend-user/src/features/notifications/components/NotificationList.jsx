import { NotificationItem } from "./NotificationItem";
import { EmptyState } from "@/shared/ui";

export function NotificationList({ notifications = [], onRead, busyId }) {
  if (!notifications.length) {
    return (
      <EmptyState
        title="No notifications"
        description="You are fully caught up with guest RSVPs, deliveries, and wedding activities."
      />
    );
  }

  return (
    <section className="notif-list" aria-label="Notifications list">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          busy={busyId === notification.id || busyId === "all"}
          onRead={onRead}
        />
      ))}
    </section>
  );
}

export default NotificationList;
