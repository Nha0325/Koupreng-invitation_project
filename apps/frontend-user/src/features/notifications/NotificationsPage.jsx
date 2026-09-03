import { useNotifications } from "./hooks/useNotifications";
import { NotificationList } from "./components/NotificationList";
import { NotificationStatsGrid } from "./components/NotificationStatsGrid";
import { ErrorState, LoadingButton, SkeletonCard } from "@/shared/ui";
import "./NotificationPages.css";

export default function NotificationsPage() {
  const {
    notifications,
    summary,
    loading,
    error,
    busyId,
    loadData,
    markRead,
    markAllRead,
  } = useNotifications();

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

      <NotificationStatsGrid summary={summary} />

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
