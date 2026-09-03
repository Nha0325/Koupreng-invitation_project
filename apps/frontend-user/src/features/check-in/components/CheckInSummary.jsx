export function CheckInSummary({ summary }) {
  const total = summary?.totalGuests ?? 0;
  const checkedIn = summary?.checkedInCount ?? 0;
  const remaining = Math.max(0, total - checkedIn);
  const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="checkin-summary-grid">
      <div className="checkin-stat-card">
        <span>ភ្ញៀវសរុប</span>
        <strong>{total}</strong>
      </div>
      <div className="checkin-stat-card is-success">
        <span>បាន Check-In</span>
        <strong>{checkedIn}</strong>
        <small>{percentage}% នៃចំនួនសរុប</small>
      </div>
      <div className="checkin-stat-card is-pending">
        <span>មិនទាន់មកដល់</span>
        <strong>{remaining}</strong>
      </div>
    </div>
  );
}

export default CheckInSummary;
