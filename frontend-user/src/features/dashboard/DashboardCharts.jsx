export default function DashboardCharts({ title, items }) {
  const max = Math.max(1, ...items.map((item) => Number(item.value) || 0));

  return (
    <section className="report-chart">
      <h2>{title}</h2>
      <div className="report-bars">
        {items.map((item) => {
          const value = Number(item.value) || 0;
          return (
            <div key={item.label} className="report-bar-row">
              <span>{item.label}</span>
              <div className="report-bar-track">
                <i style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
              </div>
              <strong>{value}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
