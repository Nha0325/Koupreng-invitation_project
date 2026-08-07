import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import rsvpService from "./api/rsvpApi";
import { invitationService } from "@/features/invitations/api/invitationApi";
import { EmptyState, ErrorState, SkeletonCard, StatusBadge } from "@/shared/ui";
import "../dashboard/DashboardPages.css";

export default function RsvpDashboardPage() {
  const { invitationId } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      invitationService.get(invitationId),
      rsvpService.listByInvitation(invitationId),
      rsvpService.summary(invitationId),
    ])
      .then(([invData, rsvpData, summaryData]) => {
        setInvitation(invData);
        setRsvps(rsvpData || []);
        setSummary(summaryData);
      })
      .catch((err) => {
        setError(err.message || "Could not load RSVP records");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [invitationId]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRsvps = useMemo(() => {
    return rsvps.filter((item) => {
      const statusMatch = statusFilter === "ALL" || (item.status || "").toUpperCase() === statusFilter;
      const searchKey = search.trim().toLowerCase();
      const nameMatch = !searchKey || (item.guestName || item.name || "").toLowerCase().includes(searchKey)
        || (item.wish || item.message || "").toLowerCase().includes(searchKey);
      return statusMatch && nameMatch;
    });
  }, [rsvps, statusFilter, search]);

  if (loading) {
    return (
      <main className="dash-main report-page" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <SkeletonCard height="160px" />
        <SkeletonCard height="240px" />
      </main>
    );
  }

  if (error && !invitation) {
    return (
      <main className="dash-main report-page">
        <ErrorState message={error} onRetry={load} />
      </main>
    );
  }

  const attendingCount = summary?.attending ?? summary?.accepted ?? rsvps.filter((r) => r.status === "ATTENDING" || r.status === "ACCEPTED").length;
  const declinedCount = summary?.declined ?? rsvps.filter((r) => r.status === "DECLINED").length;
  const pendingCount = summary?.pending ?? rsvps.filter((r) => r.status === "PENDING").length;
  const totalResponded = attendingCount + declinedCount;

  return (
    <main className="dash-main report-page" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <header className="dash-page-header report-header">
        <div>
          <span className="dash-kicker">Attendance & RSVP Management</span>
          <h1>គ្រប់គ្រងការឆ្លើយតប (RSVPs)</h1>
          <p>{invitation?.title || "ព័ត៌មានភ្ញៀវចូលរួម និងសារជូនពរ"}</p>
        </div>
        <div className="report-actions" style={{ display: "flex", gap: "0.75rem" }}>
          {invitationId && (
            <Link to={`/dashboard/invitations/${invitationId}`} className="dash-btn">
              ត្រឡប់ទៅធៀប / Back
            </Link>
          )}
        </div>
      </header>

      {error && <ErrorState message={error} />}

      {/* Summary KPI Cards */}
      <section className="dash-kpi-grid">
        <article className="dash-kpi-card highlight">
          <span>ចូលរួម / Attending</span>
          <strong>{attendingCount}</strong>
          <small>ភ្ញៀវបានបញ្ជាក់ / Confirmed guests</small>
        </article>
        <article className="dash-kpi-card">
          <span>មិនអាចចូលរួម / Declined</span>
          <strong>{declinedCount}</strong>
          <small>ភ្ញៀវអវត្តមាន / Declined responses</small>
        </article>
        <article className="dash-kpi-card">
          <span>កំពុងរង់ចាំ / Pending</span>
          <strong>{pendingCount}</strong>
          <small>មិនទាន់ឆ្លើយតប / Awaiting response</small>
        </article>
        <article className="dash-kpi-card">
          <span>ឆ្លើយតបសរុប / Total Responded</span>
          <strong>{totalResponded}</strong>
          <small>ការឆ្លើយតបទាំងអស់ / Total responses</small>
        </article>
      </section>

      {/* Filter Toolbar */}
      <section className="budget-panel">
        <div className="report-panel-head" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["ALL", "ATTENDING", "DECLINED", "PENDING"].map((st) => (
              <button
                key={st}
                type="button"
                className={`dash-btn ${statusFilter === st ? "dash-btn-primary" : ""}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === "ALL" ? "ទាំងអស់ / All" : st === "ATTENDING" ? "ចូលរួម / Attending" : st === "DECLINED" ? "មិនចូលរួម / Declined" : "កំពុងរង់ចាំ / Pending"}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកឈ្មោះ ឬសារ..."
            style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--brand-border)" }}
          />
        </div>

        {!filteredRsvps.length ? (
          <EmptyState
            title="មិនទាន់មានទិន្នន័យឆ្លើយតប"
            description="មិនមានការឆ្លើយតបដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកឡើយ។"
          />
        ) : (
          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--brand-border)", color: "var(--brand-text-muted)", fontSize: "0.875rem" }}>
                  <th style={{ padding: "0.75rem" }}>ឈ្មោះភ្ញៀវ / Guest Name</th>
                  <th style={{ padding: "0.75rem" }}>ស្ថានភាព / Status</th>
                  <th style={{ padding: "0.75rem" }}>ចំនួនអ្នកចូលរួម / Party Size</th>
                  <th style={{ padding: "0.75rem" }}>សារជូនពរ / Wish</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((item) => {
                  const status = (item.status || "PENDING").toUpperCase();
                  const badgeVariant = status === "ATTENDING" || status === "ACCEPTED" ? "success" : status === "DECLINED" ? "danger" : "warning";
                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--brand-border)", fontSize: "0.9375rem" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "600" }}>{item.guestName || item.name || "Guest"}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <StatusBadge variant={badgeVariant}>{status}</StatusBadge>
                      </td>
                      <td style={{ padding: "0.75rem" }}>{item.adultCount || item.partySize || item.guestCount || 1} នាក់</td>
                      <td style={{ padding: "0.75rem", color: "var(--brand-text-muted)" }}>{item.wish || item.message || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
