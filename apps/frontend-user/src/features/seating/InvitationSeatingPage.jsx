import { useNavigate, useParams } from "react-router-dom";
import { useSeating } from "./hooks/useSeating";
import { SeatingForms } from "./components/SeatingForms";
import { SeatingTableCard } from "./components/SeatingTableCard";
import "../enterprise/EnterprisePages.css";

export default function InvitationSeatingPage() {
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const {
        invitation,
        plan,
        tableForm,
        setTableForm,
        assignmentForm,
        setAssignmentForm,
        assignmentsByTable,
        loading,
        saving,
        error,
        createTable,
        assignGuest,
        unassign,
        deleteTable,
        exportCsv,
    } = useSeating(invitationId);

    if (loading) {
        return (
            <main className="enterprise-page">
                <div className="enterprise-empty">Loading seating plan...</div>
            </main>
        );
    }

    return (
        <main className="enterprise-page">
            <header className="enterprise-head">
                <div>
                    <span className="enterprise-eyebrow">Table and seat management</span>
                    <h1>{invitation?.title || "Seating plan"}</h1>
                    <p>Assign guests to tables and keep public guest invitations in sync.</p>
                </div>
                <div className="enterprise-actions">
                    <button
                        className="enterprise-btn secondary"
                        type="button"
                        onClick={() => navigate(`/dashboard/invitations/${invitationId}/guests`)}
                    >
                        Guests
                    </button>
                    <button
                        className="enterprise-btn secondary"
                        type="button"
                        onClick={exportCsv}
                    >
                        Export CSV
                    </button>
                </div>
            </header>

            {error && <div className="enterprise-error">{error}</div>}

            <section className="enterprise-layout">
                <SeatingForms
                    tableForm={tableForm}
                    setTableForm={setTableForm}
                    assignmentForm={assignmentForm}
                    setAssignmentForm={setAssignmentForm}
                    createTable={createTable}
                    assignGuest={assignGuest}
                    plan={plan}
                    saving={saving}
                />

                <div className="enterprise-grid">
                    {(plan?.tables || []).map((table) => (
                        <SeatingTableCard
                            key={table.id}
                            table={table}
                            assignments={assignmentsByTable.get(table.id) || []}
                            unassign={unassign}
                            deleteTable={deleteTable}
                            saving={saving}
                        />
                    ))}
                    {!plan?.tables?.length && (
                        <div className="enterprise-empty">Create the first table to start assigning guests.</div>
                    )}
                </div>
            </section>
        </main>
    );
}
