export function ReportSummaryCards({ summary }) {
  if (!summary) return null;

  const metrics = [
    { label: "ទិន្នន័យសរុប", value: summary.total ?? 0 },
    { label: "បានសម្រេច / ជោគជ័យ", value: summary.successCount ?? summary.completed ?? 0, className: "is-success" },
    { label: "កំពុងរង់ចាំ", value: summary.pendingCount ?? summary.pending ?? 0, className: "is-pending" },
    { label: "បដិសេធ / បរាជ័យ", value: summary.failedCount ?? summary.declined ?? 0, className: "is-failed" },
  ];

  return (
    <div className="report-summary-grid">
      {metrics.map((m, idx) => (
        <div key={idx} className={`report-summary-card ${m.className || ""}`}>
          <span>{m.label}</span>
          <strong>{m.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default ReportSummaryCards;
