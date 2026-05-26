import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InvitationDisplay from "../../features/invitations/InvitationDisplay";
import "../../features/invitations/InvitationPages.css";
import { invitationService } from "../../shared/services/invitationService";
import { mediaService } from "../../shared/services/mediaService";

export default function InvitationPreviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        Promise.all([
            invitationService.preview(id),
            mediaService.list(id).catch(() => null),
        ])
            .then(([invitationData, mediaData]) => {
                if (active) {
                    setInvitation(invitationData);
                    setMedia(mediaData);
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
                <button type="button" className="inv-secondary-btn" onClick={() => navigate(`/dashboard/invitations/${id}/media`)}>
                    Media
                </button>
                <button type="button" className="inv-secondary-btn" onClick={() => navigate("/dashboard/invitations")}>
                    My Invitations
                </button>
            </div>
            <InvitationDisplay invitation={invitation} media={media} preview />
        </div>
    );
}
