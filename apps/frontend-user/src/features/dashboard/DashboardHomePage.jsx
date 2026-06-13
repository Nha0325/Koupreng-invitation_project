import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dashboardService from "./dashboardService";
import DashboardStatsCard from "./DashboardStatsCard";
import DashboardCharts from "./DashboardCharts";
import "./DashboardPages.css";

function money(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function date(value) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "—";
}

export default function DashboardHomePage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setSummary(await dashboardService.summary());
    } catch (err) {
      setError(err?.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    dashboardService
      .summary()
      .then((data) => {
        if (active) {
          setSummary(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err?.message || "Could not load dashboard");
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
  }, []);

  if (loading) {
    return <main className="dash-main report-page"><div className="report-state">កំពុងផ្ទុក...</div></main>;
  }

  if (error) {
    return (
      <main className="dash-main report-page">
        <div className="report-state is-error">
          <p>{error}</p>
          <button type="button" className="dash-btn" onClick={load}>Retry</button>
        </div>
      </main>
    );
  }

  const rsvpItems = [
    { label: "Attending", value: summary?.totalAttending },
    { label: "Declined", value: summary?.totalDeclined },
    { label: "Maybe", value: summary?.totalMaybe },
    { label: "Pending", value: summary?.totalPendingRsvp },
  ];

  return (
    <main className="dash-main report-page">
      <header className="dash-page-header report-header">
        <div>
          <span className="dash-kicker">Dashboard</span>
          <h1>ផ្ទាំងគ្រប់គ្រង</h1>
          <p>សង្ខេបសន្លឹកការ ភ្ញៀវ RSVP ការទូទាត់ និងការជូនដំណឹងថ្មីៗ។</p>
        </div>
        <Link to="/dashboard/invitations" className="dash-btn dash-btn-primary">
          My invitations
        </Link>
      </header>

      <section className="report-stat-grid">
        <DashboardStatsCard label="Invitations" value={summary?.totalInvitations} note={`${summary?.publishedInvitations || 0} published`} />
        <DashboardStatsCard label="Guests" value={summary?.totalGuests} note={`${summary?.totalInvited || 0} invited`} />
        <DashboardStatsCard label="RSVP responded" value={summary?.totalResponded} note={`${summary?.totalPendingRsvp || 0} pending`} />
        <DashboardStatsCard label="Revenue" value={money(summary?.totalRevenue)} note={`${summary?.totalPayments || 0} payments`} />
      </section>

      <div className="report-grid-two">
        <DashboardCharts title="RSVP status" items={rsvpItems} />
        <section className="report-panel">
          <div className="report-panel-head">
            <h2>Recent invitations</h2>
            <Link to="/dashboard/invitations">View all</Link>
          </div>
          <div className="report-list">
            {(summary?.recentInvitations || []).map((invitation) => (
              <Link key={invitation.id} to={`/dashboard/invitations/${invitation.id}`} className="report-list-row">
                <strong>{invitation.title || invitation.slug || `Invitation #${invitation.id}`}</strong>
                <span>{invitation.status || "DRAFT"} · {date(invitation.eventDate)}</span>
              </Link>
            ))}
            {!summary?.recentInvitations?.length && <div className="report-empty">No invitations yet.</div>}
          </div>
        </section>
      </div>

      <section className="report-panel">
        <div className="report-panel-head">
          <h2>Recent RSVP</h2>
        </div>
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Status</th>
                <th>Attendees</th>
                <th>Responded</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.recentRsvps || []).map((rsvp) => (
                <tr key={rsvp.id}>
                  <td>{rsvp.guestName || "—"}</td>
                  <td>{rsvp.responseStatus || "—"}</td>
                  <td>{rsvp.attendeeCount ?? 0}</td>
                  <td>{date(rsvp.respondedAt)}</td>
                </tr>
              ))}
              {!summary?.recentRsvps?.length && (
                <tr><td colSpan="4">No RSVP responses yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
