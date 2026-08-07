import { useCallback, useEffect, useState } from "react";
import notificationService from "./notificationService";
import NotificationList from "./NotificationList";
import { ErrorState, LoadingButton, SkeletonCard } from "@/shared/ui";
import "./NotificationPages.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      notificationService.list(),
      notificationService.summary(),
    ])
      .then(([items, counts]) => {
        setNotifications(items || []);
        setSummary(counts || null);
        setError("");
      })
      .catch((err) => {
        setError(err?.message || "Could not load notifications");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markRead = async (notificationId) => {
    setBusyId(notificationId);
    try {
      const updated = await notificationService.markRead(notificationId);
      setNotifications((items) =>
        items.map((item) => (item.id === notificationId ? { ...item, ...updated } : item))
      );
      setSummary((current) => ({
        ...(current || {}),
        unread: Math.max(0, (current?.unread || 0) - 1),
      }));
    } catch (err) {
      setError(err?.message || "Could not mark notification as read");
    } finally {
      setBusyId(null);
    }
  };

  const markAllRead = async () => {
    setBusyId("all");
    try {
      const updated = await notificationService.markAllRead();
      setNotifications(updated || []);
      setSummary((current) => ({ ...(current || {}), unread: 0 }));
    } catch (err) {
      setError(err?.message || "Could not mark notifications as read");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="dash-main notif-page">
      <header className="dash-page-header notif-header">
        <div>
          <span className="dash-kicker">Notifications</span>
          <h1>ការជូនដំណឹង</h1>
          <p>មើលស្ថានភាពការផ្ញើ RSVP ការរំលឹក និងសារប្រព័ន្ធរបស់អ្នក។</p>
        </div>
        <LoadingButton
          type="button"
          className="dash-btn dash-btn-primary"
          disabled={!summary?.unread}
          isLoading={busyId === "all"}
          onClick={markAllRead}
        >
          Mark all read
        </LoadingButton>
      </header>

      <section className="notif-summary-grid">
        <Stat label="Unread" value={summary?.unread || 0} />
        <Stat label="Sent" value={summary?.sent || 0} />
        <Stat label="Delivered" value={summary?.delivered || 0} />
        <Stat label="Failed" value={summary?.failed || 0} />
      </section>

      {error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <SkeletonCard height="90px" />
          <SkeletonCard height="90px" />
        </div>
      ) : (
        <NotificationList notifications={notifications} onRead={markRead} busyId={busyId} />
      )}
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <article className="notif-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
