import {
    IoPeopleOutline,
    IoStarOutline,
    IoStatsChartOutline,
    IoWalletOutline,
} from "react-icons/io5";

export function GiftStatsCards({ gifts = [], t }) {
    const total = gifts.reduce((sum, gift) => sum + (Number(gift.amount) || 0), 0);
    const average = gifts.length ? Math.round(total / gifts.length) : 0;
    const maxGift = gifts.length ? Math.max(...gifts.map((gift) => Number(gift.amount) || 0)) : 0;

    return (
        <div className="wg-summary">
            <div className="wg-sum-card wg-sum-total">
                <div className="wg-sum-icon"><IoWalletOutline aria-hidden="true" /></div>
                <div>
                    <span className="wg-sum-label">{t ? t("sumTotal") : "Total Gifts"}</span>
                    <span className="wg-sum-value">${total.toLocaleString()}</span>
                </div>
            </div>
            <div className="wg-sum-card">
                <div className="wg-sum-icon"><IoPeopleOutline aria-hidden="true" /></div>
                <div>
                    <span className="wg-sum-label">{t ? t("sumCount") : "Contributors"}</span>
                    <span className="wg-sum-value">{t ? t("countPersons", { count: gifts.length }) : `${gifts.length}`}</span>
                </div>
            </div>
            <div className="wg-sum-card">
                <div className="wg-sum-icon"><IoStatsChartOutline aria-hidden="true" /></div>
                <div>
                    <span className="wg-sum-label">{t ? t("sumAverage") : "Average"}</span>
                    <span className="wg-sum-value">${average}</span>
                </div>
            </div>
            <div className="wg-sum-card">
                <div className="wg-sum-icon"><IoStarOutline aria-hidden="true" /></div>
                <div>
                    <span className="wg-sum-label">{t ? t("sumMax") : "Highest"}</span>
                    <span className="wg-sum-value">${maxGift}</span>
                </div>
            </div>
        </div>
    );
}

export default GiftStatsCards;
