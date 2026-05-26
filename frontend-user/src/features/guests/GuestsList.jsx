import { useMemo, useState } from "react";
import { listRsvps } from "../../services/rsvpService";
import { listDrafts } from "../../services/weddingStorage";
import "./GuestsPage.css";

const statusOptions = ["ទាំងអស់", "បញ្ជាក់", "បដិសេធ"];

const statusColor = {
    "បញ្ជាក់": "status-confirmed",
    "បដិសេធ": "status-rejected",
};

function getResponsesForDraft(draft) {
    if (!draft?.id) return [];

    const responses = new Map();
    listRsvps(draft.id).forEach((entry) => responses.set(entry.id, entry));
    if (draft.slug) {
        listRsvps(draft.slug).forEach((entry) => responses.set(entry.id, entry));
    }
    return Array.from(responses.values());
}

export default function GuestsList() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState("ទាំងអស់");
    const currentDraft = listDrafts()[0];
    const allGuests = useMemo(() => getResponsesForDraft(currentDraft).map((entry) => ({
        id: entry.id,
        name: entry.name,
        phone: entry.phone || "-",
        group: "RSVP",
        status: entry.attending === "no" ? "បដិសេធ" : "បញ្ជាក់",
        amount: "-",
        seat: "-",
        count: Number(entry.count) || 1,
    })), [currentDraft]);

    const filtered = allGuests.filter((guest) => {
        const matchSearch = guest.name.includes(search) || guest.phone.includes(search);
        const matchStatus = statusFilter === "ទាំងអស់" || guest.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const counts = {
        total: allGuests.reduce((total, guest) => total + guest.count, 0),
        confirmed: allGuests.filter((guest) => guest.status === "បញ្ជាក់").length,
        rejected: allGuests.filter((guest) => guest.status === "បដិសេធ").length,
    };

    return (
        <div className="gp-page">
            <div className="gp-header">
                <div>
                    <h1 className="gp-title">បញ្ជីភ្ញៀវ</h1>
                    <p className="gp-subtitle">
                        {currentDraft ? "ភ្ញៀវដែលបានឆ្លើយតប RSVP ពីសន្លឹកការបច្ចុប្បន្ន" : "មិនទាន់មានសន្លឹកការសម្រាប់បង្ហាញភ្ញៀវ"}
                    </p>
                </div>
            </div>

            <div className="gp-stats">
                {[
                    { label: "ភ្ញៀវសរុប", value: counts.total, cls: "stat-total" },
                    { label: "បានបញ្ជាក់", value: counts.confirmed, cls: "stat-confirmed" },
                    { label: "បានបដិសេធ", value: counts.rejected, cls: "stat-rejected" },
                ].map((stat) => (
                    <div key={stat.label} className={`gp-stat-card ${stat.cls}`}>
                        <span className="gp-stat-value">{stat.value}</span>
                        <span className="gp-stat-label">{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="gp-filters">
                <input
                    type="text"
                    className="gp-search"
                    placeholder="ស្វែងរកភ្ញៀវ..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                <div className="gp-filter-group">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            className={`gp-filter-btn${statusFilter === status ? " active" : ""}`}
                            onClick={() => setStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="gp-table-wrap">
                <table className="gp-table">
                    <thead>
                        <tr>
                            <th>ឈ្មោះ</th>
                            <th>ទំនាក់ទំនង</th>
                            <th>ក្រុម</th>
                            <th>ស្ថានភាព</th>
                            <th>ចំនួនភ្ញៀវ</th>
                            <th>កៅអី</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((guest) => (
                            <tr key={guest.id}>
                                <td>
                                    <div className="gp-name-cell">
                                        <div className="gp-avatar">{guest.name.charAt(0)}</div>
                                        <span>{guest.name}</span>
                                    </div>
                                </td>
                                <td className="gp-muted">{guest.phone}</td>
                                <td>{guest.group}</td>
                                <td>
                                    <span className={`gp-status ${statusColor[guest.status]}`}>{guest.status}</span>
                                </td>
                                <td>{guest.count}</td>
                                <td className="gp-muted">{guest.seat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="gp-empty">មិនមាន RSVP សម្រាប់បង្ហាញ</div>
                )}
            </div>
        </div>
    );
}
