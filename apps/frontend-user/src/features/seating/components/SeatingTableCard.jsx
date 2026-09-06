import { IoRestaurantOutline, IoPersonOutline } from "react-icons/io5";

export function SeatingTableCard({ table, assignments = [], unassign, deleteTable, saving }) {
    const isFull = table.remainingSeats <= 0;
    const fillPercent = table.capacity > 0
        ? Math.min(100, Math.round((table.assignedSeats / table.capacity) * 100))
        : 0;

    return (
        <section className="seating-table-card">
            {/* Header */}
            <div className="seating-table-head">
                <div className="seating-table-title-wrap">
                    <h3>
                        <IoRestaurantOutline style={{ color: "var(--brand-primary, #b98b42)" }} />
                        <span>{table.tableName}</span>
                    </h3>
                    {table.tableLabel && (
                        <span className="seating-table-label-badge">{table.tableLabel}</span>
                    )}
                </div>

                <span className={`seating-capacity-pill ${isFull ? "full" : "available"}`}>
                    {table.assignedSeats} / {table.capacity} កៅអី
                    {isFull ? " (ពេញ)" : ""}
                </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="seating-progress-bar-bg" title={`${fillPercent}% ពេញ`}>
                <div
                    className="seating-progress-bar-fill"
                    style={{
                        width: `${fillPercent}%`,
                        background: isFull ? "#e11d48" : "linear-gradient(90deg, #b98b42, #0f766e)"
                    }}
                />
            </div>

            {/* Guest List in Table */}
            {assignments.length > 0 ? (
                <ul className="seating-guest-list">
                    {assignments.map((assignment) => (
                        <li key={assignment.id} className="seating-guest-item">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                                <IoPersonOutline style={{ color: "#0f766e", flexShrink: 0 }} />
                                <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {assignment.guestName}
                                </strong>
                                {assignment.seatLabel && (
                                    <span style={{ fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>
                                        - {assignment.seatLabel}
                                    </span>
                                )}
                            </div>

                            <div className="seating-guest-meta">
                                <span>({assignment.seatCount} កៅអី)</span>
                                <button
                                    className="seating-unassign-btn"
                                    type="button"
                                    disabled={saving}
                                    onClick={() => unassign(assignment.id)}
                                    title="ដកចេញ (Unassign)"
                                    aria-label="Unassign"
                                >
                                    ✕
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="seating-empty-guests">
                    មិនទាន់មានភ្ញៀវអង្គុយតុនេះទេ (No assigned guests)
                </div>
            )}

            {/* Footer / Delete Table */}
            <button
                className="seating-del-table-btn"
                type="button"
                disabled={saving || table.assignedSeats > 0}
                onClick={() => deleteTable(table.id)}
                title={table.assignedSeats > 0 ? "ត្រូវដកភ្ញៀវចេញពីតុជាមុនសិន មុននឹងលុបតុ" : "លុបតុនេះ"}
            >
                🗑️ លុបតុនេះ (Delete table)
            </button>
        </section>
    );
}

export default SeatingTableCard;
