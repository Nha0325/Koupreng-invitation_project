import { useEffect, useMemo, useState } from "react";
import Toast from "../../components/Toast";
import { Loading, ErrorState, Empty } from "../../components/States";
import { useToast } from "../../hooks/useToast";
import { formatDateTime } from "../../lib/format";
import notificationService from "./notificationService";
import "../admin/AdminFeature.css";

const TYPES = [
  "INVITATION_SENT",
  "RSVP_CONFIRMATION",
  "RSVP_RECEIVED",
  "REMINDER",
  "PAYMENT_CONFIRMED",
  "TEMPLATE_UNLOCKED",
  "SYSTEM_ALERT",
  "ADMIN_NOTICE",
];

const CHANNELS = ["EMAIL", "TELEGRAM", "SYSTEM", "LINK", "SMS"];
const STATUSES = ["PENDING", "SENT", "DELIVERED", "FAILED", "READ", "CANCELLED"];

export default function AdminNotificationsPage() {
  const [filters, setFilters] = useState({ status: "", type: "", channel: "" });
  const { status: statusFilter, type: typeFilter, channel: channelFilter } = filters;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    invitationId: "",
    type: "ADMIN_NOTICE",
    channel: "SYSTEM",
    title: "",
    message: "",
  });
  const { toast, show, clear } = useToast();

  const load = async (nextFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      setItems(await notificationService.list(nextFilters));
    } catch (err) {
      setError(err?.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const nextFilters = {
      status: statusFilter,
      type: typeFilter,
      channel: channelFilter,
    };

    (async () => {
      try {
        const nextItems = await notificationService.list(nextFilters);
        if (!active) return;
        setItems(nextItems);
        setError("");
      } catch (err) {
        if (active) setError(err?.message || "Could not load notifications");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [statusFilter, typeFilter, channelFilter]);

  const failedCount = useMemo(() => items.filter((item) => item.status === "FAILED").length, [items]);

  const updateStatus = async (notification, status) => {
    setBusyId(notification.id);
    try {
      const updated = await notificationService.updateStatus(notification.id, {
        status,
        errorMessage: status === "FAILED" ? "Marked failed by admin" : "",
      });
      setItems((current) => current.map((item) => (item.id === notification.id ? updated : item)));
      show("Notification status updated");
    } catch (err) {
      show(err?.message || "Status update failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  const createNotice = async (event) => {
    event.preventDefault();
    try {
      const created = await notificationService.create({
        ...form,
        userId: form.userId ? Number(form.userId) : null,
        invitationId: form.invitationId ? Number(form.invitationId) : null,
      });
      setItems((current) => [created, ...current]);
      setForm((current) => ({ ...current, title: "", message: "" }));
      show("Notification created");
    } catch (err) {
      show(err?.message || "Notification create failed", "error");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">Filter notification delivery status and inspect failed messages.</p>
        </div>
      </div>

      <section className="admin-feature-grid">
        <article className="admin-feature-card"><span>Total loaded</span><strong>{items.length}</strong></article>
        <article className="admin-feature-card"><span>Failed loaded</span><strong>{failedCount}</strong></article>
      </section>

      <section className="card" style={{ marginBottom: 18 }}>
        <form onSubmit={createNotice}>
          <div className="admin-form-grid">
            <label>User ID<input className="text-input" value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} /></label>
            <label>Invitation ID<input className="text-input" value={form.invitationId} onChange={(event) => setForm({ ...form, invitationId: event.target.value })} /></label>
            <label>Type<Select value={form.type} values={TYPES} onChange={(type) => setForm({ ...form, type })} /></label>
            <label>Channel<Select value={form.channel} values={CHANNELS} onChange={(channel) => setForm({ ...form, channel })} /></label>
            <label>Title<input className="text-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
            <label>Message<textarea className="text-input" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
          </div>
          <button type="submit" className="btn btn-primary">Create notification</button>
        </form>
      </section>

      <section className="card">
        <div className="toolbar">
          <Select value={filters.status} values={["", ...STATUSES]} empty="All statuses" onChange={(status) => setFilters({ ...filters, status })} />
          <Select value={filters.type} values={["", ...TYPES]} empty="All types" onChange={(type) => setFilters({ ...filters, type })} />
          <Select value={filters.channel} values={["", ...CHANNELS]} empty="All channels" onChange={(channel) => setFilters({ ...filters, channel })} />
          <button type="button" className="btn btn-ghost" onClick={load}>Refresh</button>
        </div>

        {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={load} /> : items.length === 0 ? <Empty /> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Channel</th><th>Status</th><th>Recipient</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title || "—"}{item.errorMessage && <div className="admin-muted">{item.errorMessage}</div>}</td>
                    <td>{item.type}</td>
                    <td>{item.channel}</td>
                    <td><span className={`badge ${item.status === "FAILED" ? "badge-red" : item.status === "DELIVERED" ? "badge-green" : "badge-amber"}`}>{item.status}</span></td>
                    <td>{item.recipientName || item.recipientEmail || item.recipientPhone || item.userId || "—"}</td>
                    <td>{formatDateTime(item.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-ghost btn-sm" disabled={busyId === item.id} onClick={() => updateStatus(item, "DELIVERED")}>Delivered</button>
                        <button type="button" className="btn btn-danger btn-sm" disabled={busyId === item.id} onClick={() => updateStatus(item, "FAILED")}>Failed</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <Toast toast={toast} onClose={clear} />
    </div>
  );
}

function Select({ value, values, empty, onChange }) {
  return (
    <select className="select" value={value} onChange={(event) => onChange(event.target.value)}>
      {values.map((item) => (
        <option key={item || "empty"} value={item}>{item || empty}</option>
      ))}
    </select>
  );
}
