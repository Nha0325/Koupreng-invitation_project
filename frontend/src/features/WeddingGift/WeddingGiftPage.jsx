import { useState } from "react";
import "./WeddingGiftPage.css";

const allGifts = [
    { id: 1, name: "ចន្ទ្រា សុខ", amount: 150, method: "Bakong QR", date: "2026-01-10", note: "សូមអបអរ!" },
    { id: 2, name: "លក្ខណ៍ ធារា", amount: 200, method: "សាច់ប្រាក់", date: "2026-01-12", note: "" },
    { id: 3, name: "ស្រីពៅ ចាន់", amount: 80, method: "Bakong QR", date: "2026-01-15", note: "រីករាយ!" },
    { id: 4, name: "ស្រីណា ចាន់", amount: 120, method: "ABA", date: "2026-01-18", note: "" },
    { id: 5, name: "ភក្ត្រ ស្រីមុំ", amount: 60, method: "Bakong QR", date: "2026-01-20", note: "ជូនពរ!" },
    { id: 6, name: "វិចិត្រ ដារ៉ា", amount: 100, method: "ABA", date: "2026-01-22", note: "" },
];

const methods = ["ទាំងអស់", "Bakong QR", "ABA", "សាច់ប្រាក់"];

function WeddingGiftPage() {
    const [methodFilter, setMethod] = useState("ទាំងអស់");

    const filtered = allGifts.filter(
        (g) => methodFilter === "ទាំងអស់" || g.method === methodFilter
    );

    const total = allGifts.reduce((s, g) => s + g.amount, 0);

    return (
        <div className="wg-page">
            {/* Header */}
            <div className="wg-header">
                <div>
                    <h1 className="wg-title">ចំណងដៃ</h1>
                    <p className="wg-subtitle">តាមដានការផ្ញើចំណងដៃទាំងអស់</p>
                </div>
                <button className="wg-add-btn">+ បន្ថែមចំណងដៃ</button>
            </div>

            {/* Summary */}
            <div className="wg-summary">
                <div className="wg-sum-card wg-sum-total">
                    <span className="wg-sum-label">ចំណងដៃសរុប</span>
                    <span className="wg-sum-value">${total.toLocaleString()}</span>
                </div>
                <div className="wg-sum-card">
                    <span className="wg-sum-label">ចំនួនអ្នកផ្ញើ</span>
                    <span className="wg-sum-value">{allGifts.length}</span>
                </div>
                <div className="wg-sum-card">
                    <span className="wg-sum-label">មធ្យមភាគ</span>
                    <span className="wg-sum-value">${Math.round(total / allGifts.length)}</span>
                </div>
                <div className="wg-sum-card">
                    <span className="wg-sum-label">ច្រើនបំផុត</span>
                    <span className="wg-sum-value">${Math.max(...allGifts.map(g => g.amount))}</span>
                </div>
            </div>

            {/* Filter */}
            <div className="wg-filters">
                {methods.map((m) => (
                    <button
                        key={m}
                        className={`wg-filter-btn${methodFilter === m ? " active" : ""}`}
                        onClick={() => setMethod(m)}
                    >{m}</button>
                ))}
            </div>

            {/* Table */}
            <div className="wg-table-wrap">
                <table className="wg-table">
                    <thead>
                        <tr>
                            <th>ឈ្មោះ</th>
                            <th>ចំនួន</th>
                            <th>វិធីទូទាត់</th>
                            <th>ថ្ងៃទី</th>
                            <th>កំណត់ចំណាំ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((g) => (
                            <tr key={g.id}>
                                <td>
                                    <div className="wg-name-cell">
                                        <div className="wg-avatar">{g.name.charAt(0)}</div>
                                        <span>{g.name}</span>
                                    </div>
                                </td>
                                <td className="wg-amount">${g.amount}</td>
                                <td><span className="wg-method-badge">{g.method}</span></td>
                                <td className="wg-muted">{g.date}</td>
                                <td className="wg-muted">{g.note || "—"}</td>
                                <td><button className="wg-action-btn">⋯</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WeddingGiftPage;
