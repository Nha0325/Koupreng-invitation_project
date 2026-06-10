import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dashboardService from "./dashboardService";
import DashboardStatsCard from "./DashboardStatsCard";
import "./DashboardPages.css";

function dateTime(value) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

export default function GuestReportPage() {
  const { invitationId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;
    dashboardService
      .guestReport(invitationId)
      .then((data) => active && setReport(data))
      .catch((err) => active && setError(err?.message || "Could not load guest report"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [invitationId]);

  const exportCsv = async () => {
    setExporting(true);
    setError("");
    try {
      await dashboardService.exportGuestReport(invitationId);
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
          <span className="dash-kicker">Guest report</span>
          <h1>របាយការណ៍ភ្ញៀវ</h1>
          <p>Invitation #{invitationId}</p>
        </div>
        <button type="button" className="dash-btn dash-btn-primary" disabled={exporting} onClick={exportCsv}>
          Export CSV
        </button>
      </header>

      {error && <div className="report-state is-error">{error}</div>}

      <section className="report-stat-grid">
        <DashboardStatsCard label="Guests" value={report?.totalGuests} />
        <DashboardStatsCard label="Ready" value={report?.ready} />
        <DashboardStatsCard label="Sent/Delivered" value={`${report?.sent || 0}/${report?.delivered || 0}`} />
        <DashboardStatsCard label="Opened/Responded" value={`${report?.opened || 0}/${report?.responded || 0}`} />
      </section>

      <section className="report-panel">
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Contact</th>
                <th>Group</th>
                <th>Table</th>
                <th>Send status</th>
                <th>Opened</th>
              </tr>
            </thead>
            <tbody>
              {(report?.guests || []).map((guest) => (
                <tr key={guest.id}>
                  <td>{guest.guestName || "—"}</td>
                  <td>{guest.email || guest.phone || "—"}</td>
                  <td>{guest.guestGroup || "—"}</td>
                  <td>{guest.tableNumber || "—"}</td>
                  <td>{guest.sendStatus || "PENDING"}</td>
                  <td>{dateTime(guest.invitationViewedAt)}</td>
                </tr>
              ))}
              {!report?.guests?.length && <tr><td colSpan="6">No guests yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
