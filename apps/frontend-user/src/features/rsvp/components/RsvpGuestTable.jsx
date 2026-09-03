import { EmptyState, StatusBadge } from "@/shared/ui";

export function RsvpGuestTable({
  filteredRsvps,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  wishesListCount,
  setViewMode,
}) {
  return (
    <section className="dash-panel">
      <div className="dash-toolbar" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flex: "1 1 300px" }}>
          <input
            type="search"
            className="dash-input"
            placeholder="ស្វែងរកឈ្មោះភ្ញៀវ ឬពាក្យជូនពរ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <select
            className="dash-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">គ្រប់ស្ថានភាព / All Status</option>
            <option value="ATTENDING">ចូលរួម (Attending)</option>
            <option value="DECLINED">អវត្តមាន (Declined)</option>
            <option value="PENDING">រង់ចាំ (Pending)</option>
          </select>

          {wishesListCount > 0 && (
            <button
              type="button"
              className="dash-btn dash-btn-sm"
              onClick={() => setViewMode("WISHES")}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              💌 មើលផ្ទាំងជូនពរ / Wishes ({wishesListCount})
            </button>
          )}
        </div>
      </div>

      {filteredRsvps.length === 0 ? (
        <EmptyState
          title="មិនមានទិន្នន័យ RSVP ទេ"
          description="មិនទាន់មានការឆ្លើយតបដែលត្រូវគ្នានឹងការស្វែងរក ឬតម្រងនេះនៅឡើយទេ។"
        />
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>ឈ្មោះភ្ញៀវ / Guest</th>
                <th>ស្ថានភាព / Status</th>
                <th>ចំនួនមនុស្ស / Party</th>
                <th>កាលបរិច្ឆេទ / Date</th>
                <th>សារជូនពរ / Wishes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRsvps.map((rsvp) => {
                const wishText = rsvp.wish || rsvp.message;
                return (
                  <tr key={rsvp.id || rsvp.guestId || Math.random()}>
                    <td>
                      <strong>{rsvp.guestName || rsvp.name || "ភ្ញៀវកិត្តិយស"}</strong>
                      {rsvp.phone && <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{rsvp.phone}</div>}
                    </td>
                    <td>
                      <StatusBadge status={(rsvp.status || "PENDING").toLowerCase()} />
                    </td>
                    <td>
                      <span>{rsvp.attendeeCount || rsvp.partySize || 1} នាក់</span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                        {rsvp.updatedAt || rsvp.createdAt
                          ? new Intl.DateTimeFormat("km-KH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(rsvp.updatedAt || rsvp.createdAt))
                          : "—"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "260px" }}>
                      {wishText ? (
                        <span style={{ fontStyle: "italic", color: "#334155", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {wishText}
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RsvpGuestTable;
