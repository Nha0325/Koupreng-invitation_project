function money(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function BudgetSummaryCards({ budget }) {
  const cards = [
    { label: "Total budget", value: money(budget?.totalBudget), note: "ថវិកាសរុប" },
    { label: "Estimated", value: money(budget?.totalEstimated), note: "ការប៉ាន់ប្រមាណ" },
    { label: "Actual", value: money(budget?.totalActual), note: "ចំណាយពិតប្រាកដ" },
    {
      label: budget?.overBudget ? "Over budget" : "Remaining",
      value: money(budget?.remainingBudget),
      note: budget?.overBudget ? "លើសថវិកា" : "នៅសល់",
      danger: budget?.overBudget,
    },
  ];

  return (
    <section className="budget-summary-grid">
      {cards.map((card) => (
        <article key={card.label} className={`budget-summary-card${card.danger ? " is-danger" : ""}`}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.note}</small>
        </article>
      ))}
    </section>
  );
}
