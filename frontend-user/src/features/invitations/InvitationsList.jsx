import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invitationService } from "../../shared/services/invitationService";
import { toast } from "../../shared/ui/toast";
import { EVENT_TYPE_LABELS, formatDate } from "./invitationUtils";
import "./InvitationPages.css";

const FILTERS = [
    { label: "All", value: "" },
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Unpublished", value: "UNPUBLISHED" },
];

function StatusBadge({ status }) {
    return <span className={`inv-status ${status?.toLowerCase() || "draft"}`}>{status || "DRAFT"}</span>;
}

export default function InvitationsList() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("");
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        let active = true;
        invitationService.listMine(status)
            .then((items) => {
                if (active) {
                    setInvitations(items || []);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load invitations");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, [status]);

    const changeStatus = (nextStatus) => {
        setLoading(true);
        setStatus(nextStatus);
    };

    const publish = async (invitation) => {
        setBusyId(invitation.id);
        try {
            const response = await invitationService.publish(invitation.id);
            setInvitations((current) => current.map((item) => (
                item.id === invitation.id ? { ...item, status: response.status, slug: response.slug } : item
            )));
            toast("Invitation published");
        } catch (err) {
            setError(err.message || "Could not publish invitation");
        } finally {
            setBusyId(null);
        }
    };

    const unpublish = async (invitation) => {
        setBusyId(invitation.id);
        try {
            const response = await invitationService.unpublish(invitation.id);
            setInvitations((current) => current.map((item) => (
                item.id === invitation.id ? { ...item, status: response.status } : item
            )));
            toast("Invitation unpublished");
        } catch (err) {
            setError(err.message || "Could not unpublish invitation");
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (invitation) => {
        if (!window.confirm(`Delete "${invitation.title}"?`)) return;
        setBusyId(invitation.id);
        try {
            await invitationService.remove(invitation.id);
            setInvitations((current) => current.filter((item) => item.id !== invitation.id));
            toast("Invitation deleted");
        } catch (err) {
            setError(err.message || "Could not delete invitation");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="inv-page">
            <header className="inv-page-header">
                <div>
                    <span className="inv-eyebrow">Invitation management</span>
                    <h1>My Invitations</h1>
                    <p>Create, preview, publish, and manage guest responses for every invitation.</p>
                </div>
                <button className="inv-primary-btn" type="button" onClick={() => navigate("/dashboard/invitations/new")}>
                    New Invitation
                </button>
            </header>

            <div className="inv-filter-row">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value || "all"}
                        type="button"
                        className={status === filter.value ? "active" : ""}
                        onClick={() => changeStatus(filter.value)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {error && <div className="inv-error">{error}</div>}
            {loading && <div className="inv-loading">Loading invitations...</div>}

            {!loading && invitations.length === 0 && (
                <div className="inv-empty">
                    <h2>No invitations yet</h2>
                    <p>Start with a draft. You can publish after the event details are complete.</p>
                    <button className="inv-primary-btn" type="button" onClick={() => navigate("/dashboard/invitations/new")}>
                        Create Invitation
                    </button>
                </div>
            )}

            <div className="inv-card-grid">
                {invitations.map((invitation) => (
                    <article className="inv-card" key={invitation.id}>
                        <div>
                            <div className="inv-card-topline">
                                <span>{EVENT_TYPE_LABELS[invitation.eventType] || "Invitation"}</span>
                                <StatusBadge status={invitation.status} />
                            </div>
                            <h2>{invitation.title}</h2>
                            <p>{formatDate(invitation.eventDate)}</p>
                            <p>{invitation.venueName || "Venue not set"}</p>
                        </div>
                        <div className="inv-card-actions">
                            <button type="button" onClick={() => navigate(`/dashboard/invitations/${invitation.id}/edit`)}>
                                Edit
                            </button>
                            <button type="button" onClick={() => navigate(`/dashboard/invitations/${invitation.id}/preview`)}>
                                Preview
                            </button>
                            <button type="button" onClick={() => navigate("/guests")}>
                                Guests
                            </button>
                            <button type="button" onClick={() => navigate(`/dashboard/invitations/${invitation.id}/delivery`)}>
                                Delivery
                            </button>
                            <button type="button" onClick={() => navigate(`/dashboard/invitations/${invitation.id}/media`)}>
                                Media
                            </button>
                            {invitation.status === "PUBLISHED" ? (
                                <button type="button" disabled={busyId === invitation.id} onClick={() => unpublish(invitation)}>
                                    Unpublish
                                </button>
                            ) : (
                                <button type="button" disabled={busyId === invitation.id} onClick={() => publish(invitation)}>
                                    Publish
                                </button>
                            )}
                            <button type="button" className="danger" disabled={busyId === invitation.id} onClick={() => remove(invitation)}>
                                Delete
                            </button>
                        </div>
                        {invitation.slug && invitation.status === "PUBLISHED" && (
                            <a className="inv-public-link" href={`/i/${invitation.slug}`} target="_blank" rel="noreferrer">
                                Public link
                            </a>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}
