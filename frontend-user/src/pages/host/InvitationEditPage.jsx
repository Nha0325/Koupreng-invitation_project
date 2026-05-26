import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvitationForm from "../../features/invitations/InvitationForm";
import { invitationService } from "../../shared/services/invitationService";

export default function InvitationEditPage() {
    const { id } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        invitationService.get(id)
            .then((data) => {
                if (active) {
                    setInvitation(data);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load invitation");
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
        return <div className="inv-page"><div className="inv-loading">Loading invitation...</div></div>;
    }

    if (error) {
        return <div className="inv-page"><div className="inv-error">{error}</div></div>;
    }

    return <InvitationForm invitation={invitation} />;
}
