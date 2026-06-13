import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dashboardService from "./dashboardService";
import rsvpService from "@/features/rsvp/api/rsvpApi";
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
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const load = async (active = true) => {
    setLoading(true);
    setError("");
    dashboardService
      .rsvpReport(invitationId)
      .then((data) => active && setReport(data))
      .catch((err) => active && setError(err?.message || "Could not load RSVP report"))
      .finally(() => active && setLoading(false));
  };

  useEffect(() => {
    let active = true;
    dashboardService
      .rsvpReport(invitationId)
      .then((data) => {
        if (active) {
          setReport(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err?.message || "Could not load RSVP report");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
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

  const updateStatus = async (row, responseStatus) => {
    setSaving(true);
    setError("");
    try {
      await rsvpService.update(invitationId, row.id, {
        responseStatus,
        attendeeCount: row.attendeeCount,
        message: row.message || "",
      });
      await load();
    } catch (err) {
      setError(err?.message || "Could not update RSVP");
    } finally {
      setSaving(false);
    }
  };

  const deleteRsvp = async (row) => {
    if (!window.confirm(`Delete RSVP for ${row.guestName || "this guest"}?`)) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      await rsvpService.delete(invitationId, row.id);
      await load();
    } catch (err) {
      setError(err?.message || "Could not delete RSVP");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="dash-main report-page"><div className="report-state">កំពុងផ្ទុក...</div></main>;

  const rows = (report?.responses || []).filter((row) => {
    const matchesStatus = !statusFilter || row.responseStatus === statusFilter;
    const keyword = search.trim().toLowerCase();
    const matchesSearch = !keyword
      || (row.guestName || "").toLowerCase().includes(keyword)
      || (row.message || "").toLowerCase().includes(keyword);
    return matchesStatus && matchesSearch;
  });

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

      <section className="report-panel">
        <div className="report-filter-row">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Guest or message" />
          </label>
          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">All</option>
              <option value="ATTENDING">Attending</option>
              <option value="NOT_ATTENDING">Not attending</option>
              <option value="MAYBE">Maybe</option>
            </select>
          </label>
        </div>
      </section>

      <section className="report-stat-grid">
        <DashboardStatsCard label="Guests" value={report?.totalGuests} />
        <DashboardStatsCard label="Yes" value={report?.yesCount} />
        <DashboardStatsCard label="No" value={report?.noCount} />
        <DashboardStatsCard label="Maybe/Pending" value={`${report?.maybeCount || 0}/${report?.pendingCount || 0}`} />
      </section>

      <ReportTable rows={rows} onStatusChange={updateStatus} onDelete={deleteRsvp} saving={saving} />
    </main>
  );
}

function ReportTable({ rows, onStatusChange, onDelete, saving }) {
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.guestName || "—"}</td>
                <td>
                  <select
                    value={row.responseStatus || ""}
                    onChange={(event) => onStatusChange(row, event.target.value)}
                    disabled={saving}
                  >
                    <option value="ATTENDING">Attending</option>
                    <option value="NOT_ATTENDING">Not attending</option>
                    <option value="MAYBE">Maybe</option>
                  </select>
                </td>
                <td>{row.attendeeCount ?? 0}</td>
                <td>{row.message || "—"}</td>
                <td>{dateTime(row.respondedAt)}</td>
                <td>
                  <button type="button" className="dash-btn" onClick={() => onDelete(row)} disabled={saving}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="6">No RSVP responses match this filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
