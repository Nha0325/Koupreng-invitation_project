import {
    IoCashOutline,
    IoStatsChartOutline,
    IoTimeOutline,
    IoWalletOutline,
    IoWarningOutline,
} from "react-icons/io5";

export function ExpenseSummaryCards({ totalBudget, totalSpent, isOver, diff, percent, t }) {
    return (
        <div className="exp-summary">
            <div className="exp-sum-card exp-sum-total">
                <div className="exp-sum-icon"><IoWalletOutline aria-hidden="true" /></div>
                <div>
                    <span className="exp-sum-label">{t ? t("sumTotal") : "Total Budget Planned"}</span>
                    <span className="exp-sum-value">${totalBudget.toLocaleString()}</span>
                </div>
            </div>
            <div className="exp-sum-card">
                <div className="exp-sum-icon"><IoCashOutline aria-hidden="true" /></div>
                <div>
                    <span className="exp-sum-label">{t ? t("sumSpent") : "Total Actual Spent"}</span>
                    <span className="exp-sum-value">${totalSpent.toLocaleString()}</span>
                </div>
            </div>
            <div className={`exp-sum-card ${isOver ? "exp-sum-over" : ""}`}>
                <div className="exp-sum-icon">
                    {isOver ? <IoWarningOutline aria-hidden="true" /> : <IoTimeOutline aria-hidden="true" />}
                </div>
                <div>
                    <span className="exp-sum-label">
                        {isOver ? (t ? t("sumOverBudget") : "Over Budget") : (t ? t("sumRemaining") : "Remaining Budget")}
                    </span>
                    <span className="exp-sum-value" style={{ color: isOver ? "#ef4444" : "inherit" }}>
                        {isOver ? `+$${diff.toLocaleString()}` : `$${diff.toLocaleString()}`}
                    </span>
                </div>
            </div>
            <div className="exp-sum-card">
                <div className="exp-sum-icon"><IoStatsChartOutline aria-hidden="true" /></div>
                <div>
                    <span className="exp-sum-label">{t ? t("sumPercent") : "Budget Used %"}</span>
                    <span className="exp-sum-value">{percent}%</span>
                </div>
            </div>
        </div>
    );
}

export default ExpenseSummaryCards;
