import { useParams } from "react-router-dom";
import { useCheckIn } from "./hooks/useCheckIn";
import { CheckInSummary } from "./components/CheckInSummary";
import { CheckInScanner } from "./components/CheckInScanner";
import { CheckInList } from "./components/CheckInList";
import { ErrorState, SkeletonCard } from "@/shared/ui";
import "./CheckInPage.css";

export default function CheckInPage({ invitationId: propInvitationId }) {
  const params = useParams();
  const invitationId = propInvitationId || params.invitationId || params.id;
  const {
    summary,
    checkIns,
    loading,
    scanning,
    error,
    lastScanned,
    loadData,
    scanQrCode,
    undoCheckIn,
  } = useCheckIn(invitationId);

  return (
    <main className="dash-main checkin-page">
      <header className="dash-page-header checkin-header">
        <div>
          <span className="dash-kicker">Attendance Tracking</span>
          <h1>ប្រព័ន្ធ Check-In ភ្ញៀវ</h1>
          <p>កត់ត្រា និងផ្ទៀងផ្ទាត់វត្តមានភ្ញៀវចូលរួមកម្មវិធីតាមរយៈ QR Token ឬដោយផ្ទាល់។</p>
        </div>
      </header>

      <CheckInSummary summary={summary} />

      <CheckInScanner
        scanning={scanning}
        onScan={scanQrCode}
        lastScanned={lastScanned}
      />

      {error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "16px" }}>
          <SkeletonCard height="60px" />
          <SkeletonCard height="60px" />
        </div>
      ) : (
        <div className="checkin-list-section">
          <h2>បញ្ជីវត្តមានភ្ញៀវ</h2>
          <CheckInList checkIns={checkIns} onUndo={undoCheckIn} />
        </div>
      )}
    </main>
  );
}
