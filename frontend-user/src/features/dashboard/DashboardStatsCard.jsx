export default function DashboardStatsCard({ label, value, note }) {
  return (
    <article className="report-stat-card">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}
