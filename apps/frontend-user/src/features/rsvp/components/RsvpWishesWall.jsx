import { StatusBadge } from "@/shared/ui";

export function RsvpWishesWall({ wishesList = [], setViewMode }) {
  return (
    <section className="dash-panel" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", margin: 0, fontWeight: 700 }}>ផ្ទាំងសារជូនពរមង្គលការ (Guest Wishes Wall)</h2>
          <small style={{ color: "#64748b" }}>សារជូនពរដែលបានផ្ញើតាមរយៈទំព័រធៀបឌីជីថល</small>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn-sm"
          onClick={() => setViewMode("TABLE")}
        >
          ត្រឡប់ទៅតារាង RSVP
        </button>
      </div>

      {wishesList.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
          មិនទាន់មានសារជូនពរនៅឡើយទេ
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {wishesList.map((item) => (
            <article
              key={item.id || item.guestId || Math.random()}
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                padding: "1rem",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#0f172a", fontSize: "0.9375rem" }}>
                  {item.guestName || item.name || "ភ្ញៀវកិត្តិយស"}
                </strong>
                <StatusBadge status={(item.status || "PENDING").toLowerCase()} />
              </div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#334155", fontStyle: "italic", lineHeight: 1.5 }}>
                “{item.wish || item.message}”
              </p>
              {item.createdAt && (
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "auto", paddingTop: "0.25rem" }}>
                  {new Intl.DateTimeFormat("km-KH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RsvpWishesWall;
