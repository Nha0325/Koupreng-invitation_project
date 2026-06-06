import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications, onRead, busyId }) {
  if (!notifications?.length) {
    return <div className="notif-empty">មិនទាន់មានការជូនដំណឹងទេ</div>;
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
