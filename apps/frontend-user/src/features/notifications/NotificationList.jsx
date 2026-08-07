import NotificationItem from "./NotificationItem";
import { EmptyState } from "@/shared/ui";
import { IoNotificationsOutline } from "react-icons/io5";

export default function NotificationList({ notifications, onRead, busyId }) {
  if (!notifications?.length) {
    return (
      <EmptyState
        icon={IoNotificationsOutline}
        title="មិនទាន់មានការជូនដំណឹងទេ"
        description="ការជូនដំណឹងថ្មីៗអំពី RSVP, ភ្ញៀវ និងប្រព័ន្ធ នឹងបង្ហាញនៅទីនេះ។"
      />
    );
  }

  return (
    <div className="notif-list">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
          busy={busyId === notification.id}
        />
      ))}
    </div>
  );
}
