import { DeliveryStatusBadge } from "./DeliveryStatusBadge";

export function DeliveryList({ deliveries, onSend, sendingId }) {
  if (!deliveries?.length) {
    return (
      <div className="delivery-empty">
        <p>មិនទាន់មានភ្ញៀវក្នុងបញ្ជីដឹកជញ្ជូន/ផ្ញើសារនៅឡើយទេ។</p>
      </div>
    );
  }

  return (
    <div className="delivery-list-wrapper">
      <table className="delivery-table">
        <thead>
          <tr>
            <th>ឈ្មោះភ្ញៀវ</th>
            <th>ទំនាក់ទំនង</th>
            <th>Channel</th>
            <th>ស្ថានភាព</th>
            <th>កាលបរិច្ឆេទ</th>
            <th>សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((item) => (
            <tr key={item.id || item.guestId}>
              <td className="delivery-guest-name">
                <strong>{item.guestName || "ភ្ញៀវ"}</strong>
              </td>
              <td>{item.phone || item.email || item.telegramUsername || "—"}</td>
              <td>
                <span className="delivery-channel-badge">{item.channel || "TELEGRAM"}</span>
              </td>
              <td>
                <DeliveryStatusBadge status={item.status} />
              </td>
              <td>
                {item.sentAt
                  ? new Date(item.sentAt).toLocaleDateString("km-KH", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </td>
              <td>
                {onSend && (
                  <button
                    type="button"
                    className="dash-btn dash-btn-outline delivery-send-btn"
                    disabled={sendingId === (item.guestId || item.id)}
                    onClick={() => onSend(item.guestId || item.id, item.channel || "TELEGRAM")}
                  >
                    {sendingId === (item.guestId || item.id) ? "កំពុងផ្ញើ..." : "ផ្ញើម្ដងទៀត"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeliveryList;
