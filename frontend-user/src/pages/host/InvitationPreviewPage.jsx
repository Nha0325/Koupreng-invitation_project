import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InvitationDisplay from "../../features/invitations/InvitationDisplay";
import "../../features/invitations/InvitationPages.css";
import { invitationService } from "../../shared/services/invitationService";

export default function InvitationPreviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        invitationService.preview(id)
            .then((data) => {
                if (active) {
                    setInvitation(data);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load preview");
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
    }, [id]);

    if (loading) {
        return <div className="inv-page"><div className="inv-loading">Loading preview...</div></div>;
    }

    if (error) {
        return <div className="inv-page"><div className="inv-error">{error}</div></div>;
    }

    return (
        <div>
            <div className="preview-toolbar">
                <button type="button" className="inv-secondary-btn" onClick={() => navigate(`/dashboard/invitations/${id}/edit`)}>
                    Edit
                </button>
                <button type="button" className="inv-secondary-btn" onClick={() => navigate("/dashboard/invitations")}>
                    My Invitations
                </button>
            </div>
            <InvitationDisplay invitation={invitation} preview />
        </div>
    );
}
