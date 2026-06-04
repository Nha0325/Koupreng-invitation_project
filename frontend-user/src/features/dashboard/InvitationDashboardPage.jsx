import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dashboardService from "./dashboardService";
import DashboardStatsCard from "./DashboardStatsCard";
import DashboardCharts from "./DashboardCharts";
import "./DashboardPages.css";

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "—";
}

export default function InvitationDashboardPage() {
  const { invitationId } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    dashboardService
      .invitationDashboard(invitationId)
      .then((data) => active && setDashboard(data))
      .catch((err) => active && setError(err?.message || "Could not load invitation dashboard"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [invitationId]);

  if (loading) return <main className="dash-main report-page"><div className="report-state">កំពុងផ្ទុក...</div></main>;
  if (error) return <main className="dash-main report-page"><div className="report-state is-error">{error}</div></main>;

  return (
    <main className="dash-main report-page">
      <header className="dash-page-header report-header">
        <div>
          <span className="dash-kicker">Invitation report</span>
          <h1>{dashboard?.title || `Invitation #${invitationId}`}</h1>
          <p>{dashboard?.status || "DRAFT"} · {formatDate(dashboard?.eventDate)} · {dashboard?.slug || "No slug"}</p>
        </div>
        <div className="report-actions">
          <Link to={`/dashboard/invitations/${invitationId}/rsvp-report`} className="dash-btn">RSVP report</Link>
          <Link to={`/dashboard/invitations/${invitationId}/guest-report`} className="dash-btn dash-btn-primary">Guest report</Link>
        </div>
      </header>

      <section className="report-stat-grid">
        <DashboardStatsCard label="Guests" value={dashboard?.totalGuests} note={`${dashboard?.totalInvited || 0} invited`} />
        <DashboardStatsCard label="Responded" value={dashboard?.totalResponded} note={`${dashboard?.pending || 0} pending`} />
        <DashboardStatsCard label="Wishes" value={dashboard?.totalWishes} note="Messages from RSVP" />
        <DashboardStatsCard label="Contributions" value={`$${Number(dashboard?.totalContributions || 0).toLocaleString()}`} note="Guest contributions" />
      </section>

      <div className="report-grid-two">
        <DashboardCharts
          title="RSVP breakdown"
          items={[
            { label: "Attending", value: dashboard?.attending },
            { label: "Declined", value: dashboard?.declined },
            { label: "Maybe", value: dashboard?.maybe },
            { label: "Pending", value: dashboard?.pending },
          ]}
        />
        <DashboardCharts
          title="Delivery status"
          items={[
            { label: "Sent", value: dashboard?.deliverySent },
            { label: "Failed", value: dashboard?.deliveryFailed },
            { label: "Opened", value: dashboard?.openedCount },
          ]}
        />
      </div>
    </main>
  );
}
