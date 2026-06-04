import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dashboardService from "./dashboardService";
import DashboardStatsCard from "./DashboardStatsCard";
import "./DashboardPages.css";

function dateTime(value) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

export default function RsvpReportPage() {
  const { invitationId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;
    dashboardService
      .rsvpReport(invitationId)
      .then((data) => active && setReport(data))
      .catch((err) => active && setError(err?.message || "Could not load RSVP report"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [invitationId]);

  const exportCsv = async () => {
    setExporting(true);
    setError("");
    try {
      await dashboardService.exportRsvpReport(invitationId);
    } catch (err) {
      setError(err?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <main className="dash-main report-page"><div className="report-state">កំពុងផ្ទុក...</div></main>;

  return (
    <main className="dash-main report-page">
      <header className="dash-page-header report-header">
        <div>
          <span className="dash-kicker">RSVP report</span>
          <h1>របាយការណ៍ RSVP</h1>
          <p>Invitation #{invitationId}</p>
        </div>
        <button type="button" className="dash-btn dash-btn-primary" disabled={exporting} onClick={exportCsv}>
          Export CSV
        </button>
      </header>

      {error && <div className="report-state is-error">{error}</div>}

      <section className="report-stat-grid">
        <DashboardStatsCard label="Guests" value={report?.totalGuests} />
        <DashboardStatsCard label="Yes" value={report?.yesCount} />
        <DashboardStatsCard label="No" value={report?.noCount} />
        <DashboardStatsCard label="Maybe/Pending" value={`${report?.maybeCount || 0}/${report?.pendingCount || 0}`} />
      </section>

      <ReportTable rows={report?.responses || []} />
    </main>
  );
}

function ReportTable({ rows }) {
  return (
    <section className="report-panel">
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Status</th>
              <th>Attendees</th>
              <th>Message</th>
              <th>Responded</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.guestName || "—"}</td>
                <td>{row.responseStatus || "—"}</td>
                <td>{row.attendeeCount ?? 0}</td>
                <td>{row.message || "—"}</td>
                <td>{dateTime(row.respondedAt)}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="5">No RSVP responses yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
