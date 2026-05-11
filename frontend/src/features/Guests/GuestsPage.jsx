import { useState } from "react";
import "./GuestsPage.css";

const statusOptions = ["ទាំងអស់", "បញ្ជាក់", "រង់ចាំ", "បដិសេធ"];
const groupOptions = ["ទាំងអស់", "គ្រួសារ", "មិត្តភក្ដិ", "ការងារ"];

const allGuests = [
    { id: 1, name: "ចន្ទ្រា សុខ", phone: "012 345 678", group: "គ្រួសារ", status: "បញ្ជាក់", amount: "$150", seat: "A-01" },
    { id: 2, name: "សុខ វណ្ណដា", phone: "095 678 901", group: "មិត្តភក្ដិ", status: "រង់ចាំ", amount: "—", seat: "—" },
    { id: 3, name: "លក្ខណ៍ ធារា", phone: "077 234 567", group: "ការងារ", status: "បញ្ជាក់", amount: "$200", seat: "B-03" },
    { id: 4, name: "ពេជ្រ រតនា", phone: "068 901 234", group: "គ្រួសារ", status: "បដិសេធ", amount: "—", seat: "—" },
    { id: 5, name: "ស្រីពៅ ចាន់", phone: "085 432 109", group: "មិត្តភក្ដិ", status: "បញ្ជាក់", amount: "$80", seat: "C-02" },
    { id: 6, name: "វិចិត្រ ដារ៉ា", phone: "011 222 333", group: "ការងារ", status: "រង់ចាំ", amount: "—", seat: "—" },
    { id: 7, name: "ស្រីណា ចាន់", phone: "099 111 222", group: "គ្រួសារ", status: "បញ្ជាក់", amount: "$120", seat: "A-05" },
    { id: 8, name: "ភក្ត្រ ស្រីមុំ", phone: "077 888 999", group: "មិត្តភក្ដិ", status: "បញ្ជាក់", amount: "$60", seat: "D-01" },
];

const statusColor = {
    "បញ្ជាក់": "status-confirmed",
    "រង់ចាំ": "status-pending",
    "បដិសេធ": "status-rejected",
};

function GuestsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState("ទាំងអស់");
    const [groupFilter, setGroup] = useState("ទាំងអស់");

    const filtered = allGuests.filter((g) => {
        const matchSearch = g.name.includes(search) || g.phone.includes(search);
        const matchStatus = statusFilter === "ទាំងអស់" || g.status === statusFilter;
        const matchGroup = groupFilter === "ទាំងអស់" || g.group === groupFilter;
        return matchSearch && matchStatus && matchGroup;
    });

    const counts = {
        total: allGuests.length,
        confirmed: allGuests.filter(g => g.status === "បញ្ជាក់").length,
        pending: allGuests.filter(g => g.status === "រង់ចាំ").length,
        rejected: allGuests.filter(g => g.status === "បដិសេធ").length,
    };

    return (
        <div className="gp-page">
            {/* Header */}
            <div className="gp-header">
                <div>
                    <h1 className="gp-title">បញ្ជីភ្ញៀវ</h1>
                    <p className="gp-subtitle">គ្រប់គ្រងភ្ញៀវទាំងអស់របស់ព្រឹត្តិការណ៍</p>
                </div>
                <button className="gp-add-btn">+ បន្ថែមភ្ញៀវ</button>
            </div>

            {/* Stats */}
            <div className="gp-stats">
                {[
                    { label: "ភ្ញៀវសរុប", value: counts.total, cls: "stat-total" },
                    { label: "បានបញ្ជាក់", value: counts.confirmed, cls: "stat-confirmed" },
                    { label: "កំពុងរង់ចាំ", value: counts.pending, cls: "stat-pending" },
                    { label: "បានបដិសេធ", value: counts.rejected, cls: "stat-rejected" },
                ].map((s) => (
                    <div key={s.label} className={`gp-stat-card ${s.cls}`}>
                        <span className="gp-stat-value">{s.value}</span>
                        <span className="gp-stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="gp-filters">
                <input
                    type="text"
                    className="gp-search"
                    placeholder="🔍 ស្វែងរកភ្ញៀវ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="gp-filter-group">
                    {statusOptions.map((s) => (
                        <button
                            key={s}
                            className={`gp-filter-btn${statusFilter === s ? " active" : ""}`}
                            onClick={() => setStatus(s)}
                        >{s}</button>
                    ))}
                </div>
                <select className="gp-select" value={groupFilter} onChange={(e) => setGroup(e.target.value)}>
                    {groupOptions.map((g) => <option key={g}>{g}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="gp-table-wrap">
                <table className="gp-table">
                    <thead>
                        <tr>
                            <th>ឈ្មោះ</th>
                            <th>ទំនាក់ទំនង</th>
                            <th>ក្រុម</th>
                            <th>ស្ថានភាព</th>
                            <th>ចំណងដៃ</th>
                            <th>កៅអី</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((g) => (
                            <tr key={g.id}>
                                <td>
                                    <div className="gp-name-cell">
                                        <div className="gp-avatar">{g.name.charAt(0)}</div>
                                        <span>{g.name}</span>
                                    </div>
                                </td>
                                <td className="gp-muted">{g.phone}</td>
                                <td>{g.group}</td>
                                <td>
                                    <span className={`gp-status ${statusColor[g.status]}`}>{g.status}</span>
                                </td>
                                <td className={g.amount === "—" ? "gp-muted" : "gp-amount"}>{g.amount}</td>
                                <td className="gp-muted">{g.seat}</td>
                                <td>
                                    <button className="gp-action-btn">⋯</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="gp-empty">មិនមានភ្ញៀវត្រូវនឹងការស្វែងរក</div>
                )}
            </div>
        </div>
    );
}

export default GuestsPage;
