import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invitationService } from "../../shared/services/invitationService";
import "../../features/invitations/InvitationPages.css";

export default function ExpensesPage() {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        invitationService.listMine()
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
    }, []);

    return (
        <div className="inv-page">
            <header className="inv-page-header">
                <div>
                    <span className="inv-eyebrow">Budget</span>
                    <h1>គម្រោងថវិកា</h1>
                    <p>ជ្រើសរើសកម្មវិធីមួយ ដើម្បីបើកថវិកា និងចំណាយដែលរក្សាទុកក្នុង backend។</p>
                </div>
                <Link className="inv-primary-btn" to="/dashboard/invitations/new">បង្កើតកម្មវិធីថ្មី</Link>
            </header>

            {error && <div className="inv-error">{error}</div>}
            {loading && <div className="inv-loading">Loading invitations...</div>}
            {!loading && !invitations.length && (
                <div className="inv-empty">
                    <p>មិនទាន់មានកម្មវិធីសម្រាប់គ្រប់គ្រងថវិកាទេ។</p>
                    <Link className="inv-primary-btn" to="/dashboard/invitations/new">បង្កើតកម្មវិធីដំបូង</Link>
                </div>
            )}
            {!loading && invitations.length > 0 && (
                <div className="inv-card-grid">
                    {invitations.map((invitation) => (
                        <article className="inv-card" key={invitation.id}>
                            <div className="inv-card-topline">
                                <span>{invitation.eventType || "WEDDING"}</span>
                                <span className={`inv-status ${String(invitation.status || "DRAFT").toLowerCase()}`}>
                                    {invitation.status || "DRAFT"}
                                </span>
                            </div>
                            <div>
                                <h2>{invitation.title || invitation.slug || "Untitled invitation"}</h2>
                                <p>{invitation.eventDate || "No date yet"}</p>
                                <p>{invitation.venueName || "No venue yet"}</p>
                            </div>
                            <div className="inv-card-actions">
                                <Link className="inv-primary-btn" to={`/dashboard/invitations/${invitation.id}/budget`}>
                                    បើកថវិកា
                                </Link>
                                <Link className="inv-secondary-btn" to={`/dashboard/invitations/${invitation.id}`}>
                                    ផ្ទាំងគ្រប់គ្រង
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
