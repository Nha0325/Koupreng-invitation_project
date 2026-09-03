export function RsvpKpiCards({
  attendingCount,
  declinedCount,
  pendingCount,
  wishesCount,
  viewMode,
  setViewMode,
}) {
  return (
    <section className="dash-kpi-grid">
      <article className="dash-kpi-card highlight">
        <span>ចូលរួម / Attending</span>
        <strong>{attendingCount}</strong>
        <small>ភ្ញៀវបានបញ្ជាក់ / Confirmed guests</small>
      </article>

      <article className="dash-kpi-card">
        <span>អវត្តមាន / Declined</span>
        <strong>{declinedCount}</strong>
        <small>មិនបានចូលរួម / Not attending</small>
      </article>

      <article className="dash-kpi-card">
        <span>រង់ចាំ / Pending</span>
        <strong>{pendingCount}</strong>
        <small>មិនទាន់ឆ្លើយតប / Awaiting reply</small>
      </article>

      <article
        className={`dash-kpi-card ${viewMode === "WISHES" ? "active-filter" : ""}`}
        style={{ cursor: "pointer", border: viewMode === "WISHES" ? "2px solid #0284c7" : "1px solid #e2e8f0" }}
        onClick={() => setViewMode(viewMode === "WISHES" ? "TABLE" : "WISHES")}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>សារជូនពរ / Wishes Wall</span>
          <span style={{ fontSize: "0.75rem", background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
            {viewMode === "WISHES" ? "ចុចបិទ" : "ចុចមើល"}
          </span>
        </div>
        <strong>{wishesCount}</strong>
        <small>ពាក្យជូនពរពីភ្ញៀវ / Guest wishes</small>
      </article>
    </section>
  );
}

export default RsvpKpiCards;
