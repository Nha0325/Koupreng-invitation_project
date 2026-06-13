import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Toast from "../../components/Toast";
import { Loading, ErrorState } from "../../components/States";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../lib/format";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

export default function AdminInvitationDetailPage() {
  const { invitationId } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast, show, clear } = useToast();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setInvitation(await adminManagementService.invitation(invitationId));
    } catch (err) {
      setError(err?.message || "Could not load invitation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await adminManagementService.invitation(invitationId);
        if (!active) return;
        setInvitation(data);
        setError("");
      } catch (err) {
        if (active) setError(err?.message || "Could not load invitation");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [invitationId]);

  const moderate = async (status) => {
    if (!window.confirm(`Set moderation status to ${status}?`)) return;
    setBusy(true);
    try {
      setInvitation(await adminManagementService.moderateInvitation(invitationId, { status }));
      show("Moderation updated");
    } catch (err) {
      show(err?.message || "Moderation failed", "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !invitation) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">{invitation.title || invitation.slug || `Invitation #${invitation.id}`}</h2>
          <p className="page-subtitle">Invitation detail, publication state, and moderation controls.</p>
        </div>
        <Link className="btn btn-ghost" to="/admin/invitations">Back</Link>
      </div>

      <section className="card" style={{ marginBottom: 18 }}>
        <div className="admin-detail-grid">
          <Cell label="Owner" value={invitation.ownerName} />
          <Cell label="Slug" value={invitation.slug} />
          <Cell label="Status" value={invitation.status} />
          <Cell label="Moderation" value={invitation.moderationStatus || "ACTIVE"} />
          <Cell label="Template" value={invitation.templateName} />
          <Cell label="Event date" value={formatDate(invitation.eventDate)} />
          <Cell label="Venue" value={invitation.venueName} />
          <Cell label="Visibility" value={invitation.visibility} />
        </div>
      </section>

      <section className="card">
        <h3 className="page-title" style={{ fontSize: 16, marginBottom: 14 }}>Moderation</h3>
        <div className="row-actions">
          {["ACTIVE", "HIDDEN", "REPORTED", "SUSPENDED"].map((status) => (
            <button key={status} type="button" className="btn btn-ghost" disabled={busy} onClick={() => moderate(status)}>
              {status}
            </button>
          ))}
        </div>
      </section>
      <Toast toast={toast} onClose={clear} />
    </div>
  );
}

function Cell({ label, value }) {
  return (
    <div className="admin-detail-cell">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}
