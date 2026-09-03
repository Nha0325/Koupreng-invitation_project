export function CheckInList({ checkIns, onUndo }) {
  if (!checkIns?.length) {
    return (
      <div className="checkin-empty">
        <p>មិនទាន់មានភ្ញៀវណាម្នាក់បាន Check-In នៅឡើយទេ។</p>
      </div>
    );
  }

  return (
    <div className="checkin-list-wrapper">
      <table className="checkin-table">
        <thead>
          <tr>
            <th>ឈ្មោះភ្ញៀវ</th>
            <th>តុ / កៅអី</th>
            <th>ម៉ោង Check-In</th>
            <th>វិធីសាស្ត្រ</th>
            <th>សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          {checkIns.map((item) => (
            <tr key={item.id || item.guestId}>
              <td className="checkin-guest-name">
                <strong>{item.guestName || "ភ្ញៀវ"}</strong>
                {item.guestPhone && <small>{item.guestPhone}</small>}
              </td>
              <td>{item.tableName || item.seatNumber || "—"}</td>
              <td>
                {item.checkedInAt
                  ? new Date(item.checkedInAt).toLocaleTimeString("km-KH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </td>
              <td>
                <span className={`checkin-method-badge is-${item.method?.toLowerCase() || "qr"}`}>
                  {item.method || "QR"}
                </span>
              </td>
              <td>
                {onUndo && (
                  <button
                    type="button"
                    className="checkin-undo-btn"
                    onClick={() => onUndo(item.guestId || item.id)}
                    title="លុបការ Check-In វិញ"
                  >
                    Undo
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

export default CheckInList;
