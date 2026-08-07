import "./StatusBadge.css";

const STATUS_MAP = {
  PUBLISHED: { label: "Published", variant: "success" },
  DRAFT: { label: "Draft", variant: "neutral" },
  PAID: { label: "Paid", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  FAILED: { label: "Failed", variant: "danger" },
  ACTIVE: { label: "Active", variant: "success" },
  INVITED: { label: "Invited", variant: "info" },
  CHECKED_IN: { label: "Checked In", variant: "success" },
  ATTENDING: { label: "Attending", variant: "success" },
  DECLINED: { label: "Declined", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
  EXPIRED: { label: "Expired", variant: "neutral" },
  SENT: { label: "Sent", variant: "info" },
  OPENED: { label: "Opened", variant: "info" },
};

export default function StatusBadge({ status, label, variant, className = "" }) {
  const normalizedKey = typeof status === "string" ? status.toUpperCase() : "";
  const config = STATUS_MAP[normalizedKey] || {
    label: label || status || "Unknown",
    variant: variant || "neutral",
  };

  const badgeVariant = variant || config.variant;
  const badgeText = label || config.label;

  return (
    <span className={`k-status-badge k-badge-${badgeVariant} ${className}`}>
      <span className="k-badge-dot" aria-hidden="true" />
      <span>{badgeText}</span>
    </span>
  );
}
