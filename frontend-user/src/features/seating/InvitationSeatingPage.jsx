import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invitationService } from "../../shared/services/invitationService";
import { toast } from "../../shared/ui/toast";
import "../enterprise/EnterprisePages.css";
import seatingService from "./seatingService";

const emptyTable = { tableName: "", tableLabel: "", capacity: 10, sortOrder: 0, notes: "" };
const emptyAssignment = { guestId: "", tableId: "", seatLabel: "", seatCount: 1, notes: "" };

export default function InvitationSeatingPage() {
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [plan, setPlan] = useState(null);
    const [tableForm, setTableForm] = useState(emptyTable);
    const [assignmentForm, setAssignmentForm] = useState(emptyAssignment);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [invitationData, planData] = await Promise.all([
                invitationService.get(invitationId),
                seatingService.plan(invitationId),
            ]);
            setInvitation(invitationData);
            setPlan(planData);
        } catch (err) {
            setError(err.message || "Could not load seating plan");
        } finally {
            setLoading(false);
        }
    }, [invitationId]);

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) {
                setLoading(true);
                setError("");
            }
        });

        Promise.all([
            invitationService.get(invitationId),
            seatingService.plan(invitationId),
        ])
            .then(([invitationData, planData]) => {
                if (!active) return;
                setInvitation(invitationData);
                setPlan(planData);
                setError("");
            })
            .catch((err) => {
                if (active) setError(err.message || "Could not load seating plan");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [invitationId]);

    const assignmentsByTable = useMemo(() => {
        const grouped = new Map();
        (plan?.assignments || []).forEach((assignment) => {
            const list = grouped.get(assignment.tableId) || [];
            list.push(assignment);
            grouped.set(assignment.tableId, list);
        });
        return grouped;
    }, [plan]);

    const createTable = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            await seatingService.createTable(invitationId, {
                ...tableForm,
                capacity: Number(tableForm.capacity || 10),
                sortOrder: Number(tableForm.sortOrder || 0),
            });
            setTableForm(emptyTable);
            toast("Table created");
            await load();
        } catch (err) {
            setError(err.message || "Could not create table");
        } finally {
            setSaving(false);
        }
    };

    const assignGuest = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            await seatingService.assign(invitationId, {
                ...assignmentForm,
                guestId: Number(assignmentForm.guestId),
                tableId: Number(assignmentForm.tableId),
                seatCount: Number(assignmentForm.seatCount || 1),
            });
            setAssignmentForm(emptyAssignment);
            toast("Guest assigned");
            await load();
        } catch (err) {
            setError(err.message || "Could not assign guest");
        } finally {
            setSaving(false);
        }
    };

    const unassign = async (assignmentId) => {
        setSaving(true);
        setError("");
        try {
            await seatingService.unassign(invitationId, assignmentId);
            toast("Guest unassigned");
            await load();
        } catch (err) {
            setError(err.message || "Could not unassign guest");
        } finally {
            setSaving(false);
        }
    };

    const deleteTable = async (tableId) => {
        setSaving(true);
        setError("");
        try {
            await seatingService.deleteTable(invitationId, tableId);
            toast("Table deleted");
            await load();
        } catch (err) {
            setError(err.message || "Could not delete table");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <main className="enterprise-page"><div className="enterprise-empty">Loading seating plan...</div></main>;
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
                    <button className="enterprise-btn secondary" type="button" onClick={() => navigate("/guests")}>
                        Guests
                    </button>
                    <button className="enterprise-btn secondary" type="button" onClick={() => seatingService.exportCsv(invitationId)}>
                        Export CSV
                    </button>
                </div>
            </header>

            {error && <div className="enterprise-error">{error}</div>}

            <section className="enterprise-layout">
                <div className="enterprise-panel">
                    <h2>Create table</h2>
                    <form className="enterprise-form" onSubmit={createTable}>
                        <label>
                            Table name
                            <input value={tableForm.tableName} onChange={(event) => setTableForm({ ...tableForm, tableName: event.target.value })} required />
                        </label>
                        <label>
                            Label
                            <input value={tableForm.tableLabel} onChange={(event) => setTableForm({ ...tableForm, tableLabel: event.target.value })} placeholder="VIP, family, friends" />
                        </label>
                        <label>
                            Capacity
                            <input type="number" min="1" value={tableForm.capacity} onChange={(event) => setTableForm({ ...tableForm, capacity: event.target.value })} />
                        </label>
                        <label>
                            Sort order
                            <input type="number" value={tableForm.sortOrder} onChange={(event) => setTableForm({ ...tableForm, sortOrder: event.target.value })} />
                        </label>
                        <button className="enterprise-btn" type="submit" disabled={saving}>Create table</button>
                    </form>

                    <h2 style={{ marginTop: 24 }}>Assign guest</h2>
                    <form className="enterprise-form" onSubmit={assignGuest}>
                        <label>
                            Guest
                            <select value={assignmentForm.guestId} onChange={(event) => setAssignmentForm({ ...assignmentForm, guestId: event.target.value })} required>
                                <option value="">Select guest</option>
                                {(plan?.unassignedGuests || []).map((guest) => (
                                    <option key={guest.id} value={guest.id}>{guest.guestName}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Table
                            <select value={assignmentForm.tableId} onChange={(event) => setAssignmentForm({ ...assignmentForm, tableId: event.target.value })} required>
                                <option value="">Select table</option>
                                {(plan?.tables || []).map((table) => (
                                    <option key={table.id} value={table.id}>{table.tableName} ({table.remainingSeats} left)</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Seat label
                            <input value={assignmentForm.seatLabel} onChange={(event) => setAssignmentForm({ ...assignmentForm, seatLabel: event.target.value })} placeholder="A1, seat 4" />
                        </label>
                        <label>
                            Seat count
                            <input type="number" min="1" value={assignmentForm.seatCount} onChange={(event) => setAssignmentForm({ ...assignmentForm, seatCount: event.target.value })} />
                        </label>
                        <button className="enterprise-btn" type="submit" disabled={saving || !plan?.tables?.length || !plan?.unassignedGuests?.length}>
                            Assign guest
                        </button>
                    </form>
                </div>

                <div className="enterprise-grid">
                    {(plan?.tables || []).map((table) => {
                        const assignments = assignmentsByTable.get(table.id) || [];
                        return (
                            <section key={table.id} className="enterprise-panel">
                                <div className="enterprise-toolbar" style={{ justifyContent: "space-between" }}>
                                    <div>
                                        <h3>{table.tableName}</h3>
                                        <p className="enterprise-muted">{table.tableLabel || "No label"}</p>
                                    </div>
                                    <span className={`enterprise-badge ${table.remainingSeats > 0 ? "good" : "warn"}`}>
                                        {table.assignedSeats}/{table.capacity}
                                    </span>
                                </div>
                                {assignments.length ? (
                                    <ul className="enterprise-list">
                                        {assignments.map((assignment) => (
                                            <li key={assignment.id}>
                                                <strong>{assignment.guestName}</strong>
                                                {" "}
                                                {assignment.seatLabel ? `- ${assignment.seatLabel}` : ""}
                                                {" "}
                                                <span className="enterprise-muted">({assignment.seatCount} seats)</span>
                                                <button className="enterprise-btn secondary" type="button" disabled={saving} onClick={() => unassign(assignment.id)} style={{ marginLeft: 8 }}>
                                                    Unassign
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="enterprise-empty">No assigned guests.</div>
                                )}
                                <button className="enterprise-btn danger" type="button" disabled={saving || table.assignedSeats > 0} onClick={() => deleteTable(table.id)}>
                                    Delete table
                                </button>
                            </section>
                        );
                    })}
                    {!plan?.tables?.length && <div className="enterprise-empty">Create the first table to start assigning guests.</div>}
                </div>
            </section>
        </main>
    );
}
