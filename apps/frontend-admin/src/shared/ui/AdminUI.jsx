export function AdminPageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <p className="admin-muted">{eyebrow}</p>}
        <h2 className="page-title">{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="row-actions">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, note }) {
  return (
    <article className="admin-feature-card">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
      {note && <p className="admin-muted">{note}</p>}
    </article>
  );
}

export function StatusBadge({ status, tone }) {
  const value = status || "—";
  const normalized = String(value).toUpperCase();
  const variant =
    tone ||
    (["ACTIVE", "PAID", "DELIVERED", "OK", "PUBLISHED"].includes(normalized)
      ? "green"
      : ["FAILED", "REJECTED", "CANCELLED", "SUSPENDED", "ERROR"].includes(normalized)
        ? "red"
        : ["PENDING", "WARNING", "DRAFT", "REPORTED"].includes(normalized)
          ? "amber"
          : normalized === "PREMIUM"
            ? "gold"
            : "gray");

  return <span className={`badge badge-${variant}`}>{value}</span>;
}

export function ActionButton({ variant = "ghost", size, className = "", ...props }) {
  const sizeClass = size === "sm" ? " btn-sm" : "";
  return <button className={`btn btn-${variant}${sizeClass} ${className}`.trim()} {...props} />;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      className="text-input"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}

export function FilterTabs({ items, active, onChange }) {
  return (
    <div className="admin-tabs" role="tablist">
      {items.map((item) => {
        const key = item.key ?? item.value ?? item;
        const label = item.label ?? item;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={`btn ${active === key ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onChange(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function DataTable({ columns, rows, getRowKey, emptyLabel = "No data" }) {
  if (!rows?.length) return <EmptyState label={emptyLabel} />;

  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={getRowKey ? getRowKey(row, index) : row.id ?? index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FormField({ label, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor}>
      {label}
      {children}
    </label>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div>
        <div className="spinner" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function ErrorStateView({ message = "Could not load data", onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <div>
        <p>{message}</p>
        {onRetry && (
          <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ label = "No data" }) {
  return (
    <div className="state">
      <span>{label}</span>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="drawer">
        <div className="drawer-head">
          <h2 id="confirm-title" className="page-title">{title}</h2>
          <button type="button" className="drawer-close" aria-label="Close dialog" onClick={onCancel}>
            ×
          </button>
        </div>
        <p className="page-subtitle">{message}</p>
        <div className="row-actions mt-5">
          <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="drawer">
        <div className="drawer-head">
          <h2 id="modal-title" className="page-title">{title}</h2>
          <button type="button" className="drawer-close" aria-label="Close modal" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
