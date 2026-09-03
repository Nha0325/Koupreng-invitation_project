import { Link, useParams } from "react-router-dom";
import { useRsvpDashboard } from "./hooks/useRsvpDashboard";
import { RsvpKpiCards } from "./components/RsvpKpiCards";
import { RsvpWishesWall } from "./components/RsvpWishesWall";
import { RsvpGuestTable } from "./components/RsvpGuestTable";
import { ErrorState, SkeletonCard } from "@/shared/ui";

export default function RsvpDashboardPage() {
  const { invitationId } = useParams();
  const {
    invitation,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    viewMode,
    setViewMode,
    loading,
    error,
    filteredRsvps,
    wishesList,
    attendingCount,
    declinedCount,
    pendingCount,
    load,
  } = useRsvpDashboard(invitationId);

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
      <RsvpKpiCards
        attendingCount={attendingCount}
        declinedCount={declinedCount}
        pendingCount={pendingCount}
        wishesCount={wishesList.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Conditional: Wishes Wall View or Standard Table */}
      {viewMode === "WISHES" ? (
        <RsvpWishesWall wishesList={wishesList} setViewMode={setViewMode} />
      ) : (
        <RsvpGuestTable
          filteredRsvps={filteredRsvps}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          wishesListCount={wishesList.length}
          setViewMode={setViewMode}
        />
      )}
    </main>
  );
}
