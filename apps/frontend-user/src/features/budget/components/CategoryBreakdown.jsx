import { BUDGET_CATEGORIES } from "../budgetCategories";

function money(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function CategoryBreakdown({ items = [] }) {
  if (!items.length) return null;

  const categoryTotals = {};
  let totalSpending = 0;

  items.forEach((item) => {
    const cat = item.category || "OTHER";
    const amount = Number(item.actualCost || item.estimatedCost || 0);
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    totalSpending += amount;
  });

  const categories = BUDGET_CATEGORIES.map((cat) => {
    const amount = categoryTotals[cat.value] || 0;
    const percentage = totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0;
    return {
      ...cat,
      amount,
      percentage,
    };
  }).filter((c) => c.amount > 0);

  if (!categories.length) return null;

  return (
    <div style={{ background: "var(--brand-surface)", padding: "1.25rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--brand-border)" }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "700" }}>
        ចំណាយតាមប្រភព / Spending by Category
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {categories.map((c) => (
          <div key={c.value}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
              <span>{c.label}</span>
              <span>{money(c.amount)} ({c.percentage}%)</span>
            </div>
            <div style={{ background: "rgba(107, 107, 196, 0.1)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${c.percentage}%`,
                  background: "var(--brand-primary)",
                  height: "100%",
                  borderRadius: "999px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
