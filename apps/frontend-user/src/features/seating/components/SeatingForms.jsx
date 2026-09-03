export function SeatingForms({
    tableForm,
    setTableForm,
    assignmentForm,
    setAssignmentForm,
    createTable,
    assignGuest,
    plan,
    saving,
}) {
    return (
        <div className="enterprise-panel">
            <h2>Create table</h2>
            <form className="enterprise-form" onSubmit={createTable}>
                <label>
                    Table name
                    <input
                        value={tableForm.tableName}
                        onChange={(event) => setTableForm({ ...tableForm, tableName: event.target.value })}
                        required
                    />
                </label>
                <label>
                    Label
                    <input
                        value={tableForm.tableLabel}
                        onChange={(event) => setTableForm({ ...tableForm, tableLabel: event.target.value })}
                        placeholder="VIP, family, friends"
                    />
                </label>
                <label>
                    Capacity
                    <input
                        type="number"
                        min="1"
                        value={tableForm.capacity}
                        onChange={(event) => setTableForm({ ...tableForm, capacity: event.target.value })}
                    />
                </label>
                <label>
                    Sort order
                    <input
                        type="number"
                        value={tableForm.sortOrder}
                        onChange={(event) => setTableForm({ ...tableForm, sortOrder: event.target.value })}
                    />
                </label>
                <button className="enterprise-btn" type="submit" disabled={saving}>
                    Create table
                </button>
            </form>

            <h2 style={{ marginTop: 24 }}>Assign guest</h2>
            <form className="enterprise-form" onSubmit={assignGuest}>
                <label>
                    Guest
                    <select
                        value={assignmentForm.guestId}
                        onChange={(event) => setAssignmentForm({ ...assignmentForm, guestId: event.target.value })}
                        required
                    >
                        <option value="">Select guest</option>
                        {(plan?.unassignedGuests || []).map((guest) => (
                            <option key={guest.id} value={guest.id}>
                                {guest.guestName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Table
                    <select
                        value={assignmentForm.tableId}
                        onChange={(event) => setAssignmentForm({ ...assignmentForm, tableId: event.target.value })}
                        required
                    >
                        <option value="">Select table</option>
                        {(plan?.tables || []).map((table) => (
                            <option key={table.id} value={table.id}>
                                {table.tableName} ({table.remainingSeats} left)
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Seat label
                    <input
                        value={assignmentForm.seatLabel}
                        onChange={(event) => setAssignmentForm({ ...assignmentForm, seatLabel: event.target.value })}
                        placeholder="A1, seat 4"
                    />
                </label>
                <label>
                    Seat count
                    <input
                        type="number"
                        min="1"
                        value={assignmentForm.seatCount}
                        onChange={(event) => setAssignmentForm({ ...assignmentForm, seatCount: event.target.value })}
                    />
                </label>
                <button
                    className="enterprise-btn"
                    type="submit"
                    disabled={saving || !plan?.tables?.length || !plan?.unassignedGuests?.length}
                >
                    Assign guest
                </button>
            </form>
        </div>
    );
}

export default SeatingForms;
