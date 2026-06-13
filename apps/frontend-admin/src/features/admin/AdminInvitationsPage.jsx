import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loading, ErrorState, Empty } from "../../components/States";
import Toast from "../../components/Toast";
import { useResource } from "../../hooks/useResource";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../lib/format";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

export default function AdminInvitationsPage() {
  const { data, setData, loading, error, reload } = useResource(adminManagementService.invitations);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [busyId, setBusyId] = useState(null);
  const { toast, show, clear } = useToast();

  const invitations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || []).filter((invitation) => {
      if (status !== "ALL" && invitation.moderationStatus !== status && invitation.status !== status) return false;
      if (!q) return true;
      return [invitation.title, invitation.slug, invitation.ownerName, invitation.groomName, invitation.brideName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [data, query, status]);

  const replaceInvitation = (updated) => {
    setData((current) => (current || []).map((item) => (item.id === updated.id ? updated : item)));
  };

  const moderate = async (invitation, moderationStatus) => {
    if (!window.confirm(`Set invitation "${invitation.title || invitation.id}" to ${moderationStatus}?`)) return;
    setBusyId(invitation.id);
    try {
      const updated = await adminManagementService.moderateInvitation(invitation.id, { status: moderationStatus });
      replaceInvitation(updated);
      show("Invitation moderated successfully");
    } catch (err) {
      show(err?.message || "Moderation failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Invitations</h2>
          <p className="page-subtitle">Inspect and moderate invitations across all users.</p>
        </div>
      </div>

      <section className="card">
        <div className="toolbar">
          <input className="text-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invitations..." />
          <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active moderation</option>
            <option value="HIDDEN">Hidden</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REPORTED">Reported</option>
          </select>
          <button type="button" className="btn btn-ghost" onClick={reload}>Refresh</button>
        </div>

        {loading ? <Loading /> : error ? <ErrorState onRetry={reload} /> : invitations.length === 0 ? <Empty /> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>ID</th><th>Title</th><th>Owner</th><th>Event</th><th>Status</th><th>Moderation</th><th>Actions</th></tr></thead>
              <tbody>
                {invitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td>{invitation.id}</td>
                    <td><Link className="btn btn-ghost btn-sm" to={`/admin/invitations/${invitation.id}`}>{invitation.title || invitation.slug}</Link></td>
                    <td>{invitation.ownerName || "—"}</td>
                    <td>{formatDate(invitation.eventDate)}</td>
                    <td>{invitation.status}</td>
                    <td><span className={`badge ${invitation.moderationStatus === "ACTIVE" ? "badge-green" : "badge-amber"}`}>{invitation.moderationStatus || "ACTIVE"}</span></td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-primary btn-sm" disabled={busyId === invitation.id} onClick={() => moderate(invitation, "ACTIVE")}>Activate</button>
                        <button type="button" className="btn btn-ghost btn-sm" disabled={busyId === invitation.id} onClick={() => moderate(invitation, "HIDDEN")}>Hide</button>
                        <button type="button" className="btn btn-danger btn-sm" disabled={busyId === invitation.id} onClick={() => moderate(invitation, "SUSPENDED")}>Suspend</button>
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
