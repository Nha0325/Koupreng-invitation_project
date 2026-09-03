export function DeliveryStatusBadge({ status }) {
  const normalized = (status || "PENDING").toUpperCase();

  const labels = {
    DELIVERED: "បានផ្ញើរួច",
    SENT: "កំពុងផ្ញើ",
    FAILED: "បរាជ័យ",
    PENDING: "មិនទាន់ផ្ញើ",
    OPENED: "បានបើកមើល",
  };

  const styleClasses = {
    DELIVERED: "is-delivered",
    SENT: "is-sent",
    FAILED: "is-failed",
    PENDING: "is-pending",
    OPENED: "is-delivered",
  };

  return (
    <span className={`delivery-badge ${styleClasses[normalized] || "is-pending"}`}>
      {labels[normalized] || normalized}
    </span>
  );
}

export default DeliveryStatusBadge;
