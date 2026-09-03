import { useParams } from "react-router-dom";
import { useDelivery } from "./hooks/useDelivery";
import { DeliveryList } from "./components/DeliveryList";
import { ErrorState, LoadingButton, SkeletonCard } from "@/shared/ui";
import "./DeliveryPage.css";

export default function DeliveryPage({ invitationId: propInvitationId }) {
  const params = useParams();
  const invitationId = propInvitationId || params.invitationId || params.id;
  const {
    deliveries,
    summary,
    loading,
    sendingId,
    batchSending,
    error,
    loadData,
    sendToGuest,
    sendBatch,
  } = useDelivery(invitationId);

  return (
    <main className="dash-main delivery-page">
      <header className="dash-page-header delivery-header">
        <div>
          <span className="dash-kicker">Delivery & Reminder</span>
          <h1>ស្ថានភាពផ្ញើលិខិតអញ្ជើញ</h1>
          <p>តាមដានការផ្ញើលិខិតអញ្ជើញ និងសាររំលឹក (Reminders) ទៅកាន់ភ្ញៀវតាម Telegram / SMS / Email។</p>
        </div>
        <LoadingButton
          type="button"
          className="dash-btn dash-btn-primary"
          isLoading={batchSending}
          onClick={() => sendBatch("TELEGRAM")}
        >
          ផ្ញើទាំងអស់ (Batch Send)
        </LoadingButton>
      </header>

      {summary && (
        <div className="delivery-summary-grid">
          <div className="delivery-stat-card">
            <span>សរុបទាំងអស់</span>
            <strong>{summary.total ?? deliveries.length}</strong>
          </div>
          <div className="delivery-stat-card is-success">
            <span>បានផ្ញើរួច</span>
            <strong>{summary.delivered ?? 0}</strong>
          </div>
          <div className="delivery-stat-card is-pending">
            <span>មិនទាន់ផ្ញើ</span>
            <strong>{summary.pending ?? 0}</strong>
          </div>
          <div className="delivery-stat-card is-failed">
            <span>បរាជ័យ</span>
            <strong>{summary.failed ?? 0}</strong>
          </div>
        </div>
      )}

      {error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "16px" }}>
          <SkeletonCard height="60px" />
          <SkeletonCard height="60px" />
        </div>
      ) : (
        <DeliveryList
          deliveries={deliveries}
          onSend={sendToGuest}
          sendingId={sendingId}
        />
      )}
    </main>
  );
}
