import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import InvitationDisplay from "../features/invitations/InvitationDisplay";
import PublicRsvpForm from "../features/invitations/PublicRsvpForm";
import "../features/invitations/InvitationPages.css";
import { invitationService } from "../shared/services/invitationService";

export default function PublicInvitationPage() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get("token");
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        invitationService.publicBySlug(slug)
            .then((data) => {
                if (active) {
                    setInvitation(data);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.status === 403 ? "This invitation requires a password." : "Invitation not available.");
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
    }, [slug]);

    if (loading) {
        return <div className="public-state">Loading invitation...</div>;
    }

    if (error || !invitation) {
        return (
            <main className="public-state">
                <h1>Invitation not available</h1>
                <p>{error || "This invitation may be unpublished or unavailable."}</p>
            </main>
        );
    }

    return (
        <InvitationDisplay invitation={invitation}>
            <PublicRsvpForm slug={slug} inviteToken={inviteToken} />
        </InvitationDisplay>
    );
}
