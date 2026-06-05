import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notificationService from "./notificationService";
import "./NotificationPages.css";

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    notificationService
      .summary()
      .then((summary) => {
        if (active) setUnread(summary?.unread || 0);
      })
      .catch(() => {
        if (active) setUnread(0);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Link to="/dashboard/notifications" className="notif-bell" aria-label="Notifications">
      <span aria-hidden="true">🔔</span>
      {unread > 0 && <strong>{unread > 99 ? "99+" : unread}</strong>}
    </Link>
  );
}
