import {
    summaryCards,
    guestHeaders,
    guests,
    quickActions,
    upcomingTasks,
    donutSegments,
    months,
    expenseData,
    budgetData,
    useAnalyticsFilter,
} 
from "../../hooks/useDashboardData";

/* ═══════════════════════════════════════════
   HEADER SECTION
═══════════════════════════════════════════ */
function DashboardHeader() {
    return (
        <header className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
                <h1 className="text-[19px] font-bold text-slate-800 m-0 leading-8">
                    ផ្ទាំងព័ត៌មានទូទៅ
                </h1>
                <p className="text-sm text-[#7a8799] m-0">
                    ត្រួតពិនិត្យស្ថានភាពព្រឹត្តិការណ៍របស់អ្នក
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#f3e8f0] text-sm text-[#344256]"
                >
                    📅 ថ្ងៃទី ១ ធ្នូ ២០២៥
                </button>
                <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[12px] font-medium shadow-[0px_4px_16px_#8686d94c]"
                    style={{ background: "linear-gradient(166deg,#8686d9 0%,#6b6bc4 100%)" }}
                >
                    + បន្ថែមព្រឹត្តិការណ៍
                </button>
            </div>
        </header>
    );
}

/* ═══════════════════════════════════════════
   SUMMARY CARDS
═══════════════════════════════════════════ */
function SummaryCards() {
    return (
        <section className="dash-summary-row" aria-label="Summary cards">
            {summaryCards.map((card, i) => (
                <article
                    key={i}
                    className={`flex-1 min-w-0 h-[142px] flex flex-col justify-between items-start p-5 bg-white rounded-2xl border border-solid ${card.borderClass} ${card.shadowClass}`}
                >
                    {/* Top row */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xs text-[#7a8799] font-normal m-0">{card.title}</h3>
                            <p className="text-3xl font-bold text-slate-800 m-0 leading-9">{card.value}</p>
                        </div>
                        <div className={`flex w-12 h-12 items-center justify-center rounded-xl ${card.iconWrapperClass}`}>
                            {card.icon}
                        </div>
                    </div>

                    {/* Bottom row */}
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
                            <span className="text-xs text-[#7a8799]">{card.trendText}</span>
                        </div>
                    )}
                </article>
            ))}
        </section>
    );
}

/* ═══════════════════════════════════════════
   DONUT CHART (pure CSS/SVG)
═══════════════════════════════════════════ */
function DonutChart({ segments, total }) {
    const size = 200;
    const r = 70;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;

    let offset = 0;
    const colors = ["#16a34a", "#ca8a04", "#dc2626"];

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {segments.map((seg, i) => {
                        const dash = (seg.pct / 100) * circumference;
                        const gap = circumference - dash;
                        const rotation = (offset / 100) * 360 - 90;
                        offset += seg.pct;
                        return (
                            <circle
                                key={i}
                                cx={cx} cy={cy} r={r}
                                fill="none"
                                stroke={colors[i]}
                                strokeWidth={28}
                                strokeDasharray={`${dash} ${gap}`}
                                strokeDashoffset={0}
                                transform={`rotate(${rotation} ${cx} ${cy})`}
                            />
                        );
                    })}
                    {/* Inner hole */}
                    <circle cx={cx} cy={cy} r={r - 14} fill="white" />
                </svg>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{total}</span>
                    <span className="text-[11px] text-[#7a8799]">ភ្ញៀវ</span>
                </div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: colors[i] }} />
                        <span className="text-xs text-[#344256]">{seg.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   LINE CHART (pure SVG)
═══════════════════════════════════════════ */
function LineChart({ actual, budget, labels }) {
    const W = 500, H = 200, padL = 40, padB = 24, padT = 10, padR = 10;
    const chartW = W - padL - padR;
    const chartH = H - padB - padT;
    const maxVal = Math.max(...actual, ...budget);

    const toX = (i) => padL + (i / (labels.length - 1)) * chartW;
    const toY = (v) => padT + chartH - (v / maxVal) * chartH;

    const polyline = (data) =>
        data.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

    const areaPath = (data) => {
        const pts = data.map((v, i) => `${toX(i)},${toY(v)}`).join(" L ");
        return `M ${toX(0)},${toY(data[0])} L ${pts} L ${toX(data.length - 1)},${padT + chartH} L ${toX(0)},${padT + chartH} Z`;
    };

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6b6bc4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6b6bc4" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i}
                    x1={padL} y1={padT + chartH * (1 - t)}
                    x2={W - padR} y2={padT + chartH * (1 - t)}
                    stroke="#f0e8f5" strokeWidth="1"
                />
            ))}

            {/* Area fill */}
            <path d={areaPath(actual)} fill="url(#actualGrad)" />

            {/* Budget line (dashed) */}
            <polyline
                points={polyline(budget)}
                fill="none" stroke="#a78bfa" strokeWidth="1.5"
                strokeDasharray="4 3" opacity="0.6"
            />

            {/* Actual line */}
            <polyline
                points={polyline(actual)}
                fill="none" stroke="#6b6bc4" strokeWidth="2"
            />

            {/* X-axis labels */}
            {labels.map((l, i) => (
                <text key={i}
                    x={toX(i)} y={H - 4}
                    textAnchor="middle"
                    fontSize="9" fill="#7a8799"
                >{l.slice(0, 3)}</text>
            ))}

            {/* Y-axis labels */}
            {[0, 500, 1000, 1500, 2000].map((v, i) => (
                <text key={i}
                    x={padL - 4} y={toY(v) + 3}
                    textAnchor="end"
                    fontSize="9" fill="#7a8799"
                >${v}</text>
            ))}
        </svg>
    );
}

/* ═══════════════════════════════════════════
   ANALYTICS SECTION
═══════════════════════════════════════════ */
function AnalyticsSection() {
    const { activeFilter, setActiveFilter } = useAnalyticsFilter();

    return (
        <section className="dash-analytics-row">
            {/* Donut card */}
            <article className="dash-card flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[13px] font-semibold text-slate-800 m-0">ស្ថានភាពភ្ញៀវ</h2>
                        <p className="text-xs text-[#7a8799] m-0">ការបែងចែកតាមប្រភេទ</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {["all", "today"].map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveFilter(key)}
                                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${activeFilter === key
                                    ? "bg-[#eae9f8] text-[#6b6bc4] font-semibold"
                                    : "text-[#7a8799]"
                                    }`}
                            >
                                {key === "all" ? "ទាំងអស់" : "ថ្ងៃនេះ"}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center py-4">
                    <DonutChart segments={donutSegments} total="248" />
                </div>
            </article>

            {/* Line chart card */}
            <article className="dash-card flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800 m-0">ការចំណាយប្រចាំខែ</h2>
                        <p className="text-xs text-[#7a8799] m-0">ប្រៀបធៀបចំណាយ ២០២៥</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-[#eae9f8] rounded-lg text-xs text-[#6b6bc4]">
                            សរុប: $12,450
                        </span>
                        <span className="px-3 py-1.5 bg-green-50 rounded-lg text-xs text-green-600">
                            ថវិការ: $15,000
                        </span>
                    </div>
                </div>
                <div className="flex-1">
                    <LineChart actual={expenseData} budget={budgetData} labels={months} />
                </div>
                <div className="flex items-center gap-6 pt-3 border-t border-[#f3e8f0]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#6b6bc4]" />
                        <span className="text-xs text-[#7a8799]">ចំណាយពិត</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-violet-400 opacity-50" />
                        <span className="text-xs text-[#7a8799]">ថវិការ</span>
                    </div>
                    <span className="ml-auto text-xs text-green-600">↑ ចំណេញ $2,550 ពីថវិការ</span>
                </div>
            </article>
        </section>
    );
}

/* ═══════════════════════════════════════════
   USER MANAGEMENT SECTION
═══════════════════════════════════════════ */
function UserManagementSection() {
    return (
        <section className="dash-bottom-row" aria-label="User management">
            {/* Guest table */}
            <div className="dash-card flex flex-col w-full">
                <div className="flex items-center justify-between pb-4">
                    <div>
                        <h2 className="text-[13px] font-semibold text-slate-800 m-0">ភ្ញៀវថ្មីៗ</h2>
                        <p className="text-xs text-[#7a8799] m-0">បញ្ជីភ្ញៀវដែលបានចុះឈ្មោះថ្មីៗ</p>
                    </div>
                    <button
                        type="button"
                        className="px-4 py-2 bg-[#eae9f8] rounded-xl text-xs text-[#6b6bc4] font-medium"
                    >
                        មើលទាំងអស់
                    </button>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-[#f0d5d4] rounded-lg mb-1">
                    {guestHeaders.map((h, i) => (
                        <span key={i} className="text-xs text-[#344256] font-medium">{h}</span>
                    ))}
                </div>

                {/* Rows */}
                {guests.map((g, i) => (
                    <div
                        key={i}
                        className={`grid grid-cols-5 gap-4 px-4 py-3 rounded-xl ${i % 2 === 0 ? "border border-[#f8f4ff]" : "bg-neutral-50"
                            }`}
                    >
                        {/* Name */}
                        <div className="flex items-center gap-2 self-center">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                                {g.name.charAt(0)}
                            </div>
                            <span className="text-sm text-slate-800 truncate">{g.name}</span>
                        </div>
                        {/* Phone */}
                        <span className="text-xs text-[#7a8799] self-center">{g.phone}</span>
                        {/* Group */}
                        <span className="text-xs text-[#344256] self-center">{g.group}</span>
                        {/* Status */}
                        <div className="self-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${g.statusClass}`}>
                                {g.status}
                            </span>
                        </div>
                        {/* Amount */}
                        <span className={`text-xs font-semibold self-center ${g.amountClass}`}>
                            {g.amount}
                        </span>
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <aside className="dash-card flex flex-col gap-6 w-full">
                {/* Quick actions */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-[15px] font-semibold text-slate-800 m-0">សកម្មភាពរហ័ស</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((a, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-solid ${a.bg} ${a.border} transition-opacity hover:opacity-80`}
                            >
                                <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${a.iconBg}`}>
                                    {a.icon}
                                </div>
                                <span className="text-xs text-[#344256] font-medium">{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upcoming tasks */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold text-slate-800 m-0">កិច្ចការខាងមុខ</h3>
                        <span className="px-2.5 py-1 bg-[#eae9f8] rounded-full text-xs font-semibold text-[#6b6bc4]">
                            3 ថ្ងៃ
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {upcomingTasks.map((t, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 bg-[#f8f8fd] rounded-xl"
                            >
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dotClass}`} />
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm text-slate-800 truncate">{t.title}</span>
                                    <span className="text-xs text-[#7a8799]">{t.time}</span>
                                </div>
                                <svg width="7" height="12" fill="none" viewBox="0 0 7 12" stroke="currentColor" className="text-[#7a8799] flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l5 5-5 5" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </section>
    );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD (assembles all sections)
═══════════════════════════════════════════ */
function DashboardMain() {
    return (
        <div className="dash-main">
            <DashboardHeader />
            <SummaryCards />
            <AnalyticsSection />
            <UserManagementSection />
        </div>
    );
}

export default DashboardMain;
