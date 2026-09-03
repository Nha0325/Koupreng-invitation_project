export function SeatingTableCard({ table, assignments = [], unassign, deleteTable, saving }) {
    return (
        <section className="enterprise-panel">
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
                            <button
                                className="enterprise-btn secondary"
                                type="button"
                                disabled={saving}
                                onClick={() => unassign(assignment.id)}
                                style={{ marginLeft: 8 }}
                            >
                                Unassign
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="enterprise-empty">No assigned guests.</div>
            )}
            <button
                className="enterprise-btn danger"
                type="button"
                disabled={saving || table.assignedSeats > 0}
                onClick={() => deleteTable(table.id)}
            >
                Delete table
            </button>
        </section>
    );
}

export default SeatingTableCard;
