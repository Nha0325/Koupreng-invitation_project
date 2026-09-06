import { IoAddCircleOutline, IoPersonAddOutline, IoPeopleOutline } from "react-icons/io5";

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
    const unassigned = plan?.unassignedGuests || [];

    return (
        <aside className="seating-sidebar">
            {/* 1. Form Create Table */}
            <div className="seating-card-panel">
                <h2>
                    <IoAddCircleOutline style={{ color: "var(--brand-primary, #b98b42)", fontSize: "1.25rem" }} />
                    <span>បង្កើតតុថ្មី (Create Table)</span>
                </h2>
                <form className="seating-form" onSubmit={createTable}>
                    <label>
                        <span>ឈ្មោះតុ (Table Name) *</span>
                        <input
                            value={tableForm.tableName}
                            onChange={(event) => setTableForm({ ...tableForm, tableName: event.target.value })}
                            placeholder="ឧ. តុ VIP ១, តុសាច់ញាតិ, តុទី ១"
                            required
                        />
                    </label>

                    <label>
                        <span>ប្រភេទសម្គាល់ (Label)</span>
                        <input
                            value={tableForm.tableLabel}
                            onChange={(event) => setTableForm({ ...tableForm, tableLabel: event.target.value })}
                            placeholder="ឧ. VIP, សាច់ញាតិ, មិត្តភក្ដិ"
                        />
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <label>
                            <span>ចំនួនកៅអី (Capacity)</span>
                            <input
                                type="number"
                                min="1"
                                value={tableForm.capacity}
                                onChange={(event) => setTableForm({ ...tableForm, capacity: event.target.value })}
                                placeholder="10"
                            />
                        </label>
                        <label>
                            <span>លំដាប់ (Sort Order)</span>
                            <input
                                type="number"
                                value={tableForm.sortOrder}
                                onChange={(event) => setTableForm({ ...tableForm, sortOrder: event.target.value })}
                                placeholder="0"
                            />
                        </label>
                    </div>

                    <button className="seating-form-btn" type="submit" disabled={saving} aria-label="Create table">
                        {saving ? "កំពុងរក្សាទុក..." : "➕ បង្កើតតុ (Create table)"}
                    </button>
                </form>
            </div>

            {/* 2. Form Assign Guest */}
            <div className="seating-card-panel">
                <h2>
                    <IoPersonAddOutline style={{ color: "#0f766e", fontSize: "1.25rem" }} />
                    <span>ចាត់ភ្ញៀវចូលតុ (Assign Guest)</span>
                </h2>
                <form className="seating-form" onSubmit={assignGuest}>
                    <label>
                        <span>ជ្រើសរើសភ្ញៀវ (Select Guest) *</span>
                        <select
                            value={assignmentForm.guestId}
                            onChange={(event) => setAssignmentForm({ ...assignmentForm, guestId: event.target.value })}
                            required
                        >
                            <option value="">-- ជ្រើសរើសភ្ញៀវ --</option>
                            {unassigned.map((guest) => (
                                <option key={guest.id} value={guest.id}>
                                    {guest.guestName} ({guest.seatCount || 1} នាក់)
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>ជ្រើសរើសតុ (Select Table) *</span>
                        <select
                            value={assignmentForm.tableId}
                            onChange={(event) => setAssignmentForm({ ...assignmentForm, tableId: event.target.value })}
                            required
                        >
                            <option value="">-- ជ្រើសរើសតុ --</option>
                            {(plan?.tables || []).map((table) => (
                                <option key={table.id} value={table.id}>
                                    {table.tableName} (នៅសល់ {table.remainingSeats} កៅអី)
                                </option>
                            ))}
                        </select>
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <label>
                            <span>លេខកៅអី (Seat Label)</span>
                            <input
                                value={assignmentForm.seatLabel}
                                onChange={(event) => setAssignmentForm({ ...assignmentForm, seatLabel: event.target.value })}
                                placeholder="ឧ. កៅអីលេខ ១"
                            />
                        </label>
                        <label>
                            <span>ចំនួនកៅអី (Seats)</span>
                            <input
                                type="number"
                                min="1"
                                value={assignmentForm.seatCount}
                                onChange={(event) => setAssignmentForm({ ...assignmentForm, seatCount: event.target.value })}
                            />
                        </label>
                    </div>

                    <button
                        className="seating-form-btn"
                        type="submit"
                        disabled={saving || !plan?.tables?.length || !unassigned.length}
                        aria-label="Assign guest"
                        style={{ background: "#0f766e" }}
                    >
                        {saving ? "កំពុងចាត់ចែង..." : "👤 ដាក់ភ្ញៀវចូលតុ (Assign guest)"}
                    </button>
                </form>
            </div>

            {/* 3. Unassigned Guests Quick List */}
            {unassigned.length > 0 && (
                <div className="seating-card-panel">
                    <h2>
                        <IoPeopleOutline style={{ color: "#b98b42", fontSize: "1.25rem" }} />
                        <span>ភ្ញៀវមិនទាន់មានតុ ({unassigned.length})</span>
                    </h2>
                    <div className="seating-unassigned-list">
                        {unassigned.map((guest) => (
                            <div key={guest.id} className="seating-unassigned-item">
                                <span className="seating-unassigned-name">{guest.guestName}</span>
                                <span className="seating-unassigned-seats">{guest.seatCount || 1} កៅអី</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}

export default SeatingForms;
