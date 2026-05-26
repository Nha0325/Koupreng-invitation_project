import { summaryCards } from "../hooks/useDashboardData";

export default function SummaryCards() {
  return (
    <section className="dash-summary-row" aria-label="Summary cards">
      {summaryCards.map((card, index) => (
        <article
          key={index}
          className={`flex-1 min-w-0 h-[142px] flex flex-col justify-between items-start p-5 bg-white rounded-2xl border border-solid ${card.borderClass} ${card.shadowClass}`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs text-[#7a8799] font-normal m-0">
                {card.title}
              </h3>

              <p className="text-3xl font-bold text-slate-800 m-0 leading-9">
                {card.value}
              </p>
            </div>

            <div
              className={`flex w-12 h-12 items-center justify-center rounded-xl ${card.iconWrapperClass}`}
            >
              {card.icon}
            </div>
          </div>

          {card.footerType === "progress" ? (
            <div className="flex items-center gap-2 w-full">
              <div
                className={`flex-1 h-1.5 rounded-full ${card.progressTrackClass}`}
                role="progressbar"
                aria-valuenow={card.progressWidth}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-1.5 rounded-full ${card.progressBarClass}`}
                  style={{ width: `${card.progressWidth}%` }}
                />
              </div>

              <span className={`text-xs font-semibold ${card.progressLabelClass}`}>
                {card.progressLabel}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <span className={`text-xs font-semibold ${card.trendValueClass}`}>
                ↑ {card.trendValue}
              </span>

              <span className="text-xs text-[#7a8799]">
                {card.trendText}
              </span>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}