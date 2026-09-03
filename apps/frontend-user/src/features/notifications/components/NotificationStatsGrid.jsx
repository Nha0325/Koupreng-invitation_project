export function NotificationStatsGrid({ summary }) {
  return (
    <section className="notif-summary-grid">
      <Stat label="Unread" value={summary?.unread || 0} />
      <Stat label="Sent" value={summary?.sent || 0} />
      <Stat label="Delivered" value={summary?.delivered || 0} />
      <Stat label="Failed" value={summary?.failed || 0} />
    </section>
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

export default NotificationStatsGrid;
