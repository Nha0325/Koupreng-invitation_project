import {
  donutSegments,
  months,
  expenseData,
  budgetData,
  useAnalyticsFilter,
} from "../hooks/useDashboardData";

function DonutChart({ segments, total }) {
  const size = 200;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const colors = ["#16a34a", "#ca8a04", "#dc2626"];
  const positionedSegments = segments.map((seg, index) => {
    const startPct = segments
      .slice(0, index)
      .reduce((sum, item) => sum + item.pct, 0);

    return {
      ...seg,
      dash: (seg.pct / 100) * circumference,
      gap: circumference - (seg.pct / 100) * circumference,
      rotation: (startPct / 100) * 360 - 90,
      color: seg.color || colors[index],
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {positionedSegments.map((seg) => (
            <circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={28}
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={0}
              transform={`rotate(${seg.rotation} ${cx} ${cy})`}
            />
          ))}

          <circle cx={cx} cy={cy} r={r - 14} fill="white" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800">{total}</span>
          <span className="text-[11px] text-[#7a8799]">ភ្ញៀវ</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        {positionedSegments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: seg.color }}
            />

            <span className="text-xs text-[#344256]">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ actual, budget, labels }) {
  const W = 500;
  const H = 200;
  const padL = 40;
  const padB = 24;
  const padT = 10;
  const padR = 10;

  const chartW = W - padL - padR;
  const chartH = H - padB - padT;
  const maxVal = Math.max(...actual, ...budget);

  const toX = (index) => padL + (index / (labels.length - 1)) * chartW;
  const toY = (value) => padT + chartH - (value / maxVal) * chartH;

  const polyline = (data) =>
    data.map((value, index) => `${toX(index)},${toY(value)}`).join(" ");

  const areaPath = (data) => {
    const points = data
      .map((value, index) => `${toX(index)},${toY(value)}`)
      .join(" L ");

    return `M ${toX(0)},${toY(data[0])} L ${points} L ${toX(
      data.length - 1
    )},${padT + chartH} L ${toX(0)},${padT + chartH} Z`;
  };

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b6bc4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6b6bc4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t, index) => (
        <line
          key={index}
          x1={padL}
          y1={padT + chartH * (1 - t)}
          x2={W - padR}
          y2={padT + chartH * (1 - t)}
          stroke="#f0e8f5"
          strokeWidth="1"
        />
      ))}

      <path d={areaPath(actual)} fill="url(#actualGrad)" />

      <polyline
        points={polyline(budget)}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.6"
      />

      <polyline
        points={polyline(actual)}
        fill="none"
        stroke="#6b6bc4"
        strokeWidth="2"
      />

      {labels.map((label, index) => (
        <text
          key={index}
          x={toX(index)}
          y={H - 4}
          textAnchor="middle"
          fontSize="9"
          fill="#7a8799"
        >
          {label.slice(0, 3)}
        </text>
      ))}

      {[0, 500, 1000, 1500, 2000].map((value, index) => (
        <text
          key={index}
          x={padL - 4}
          y={toY(value) + 3}
          textAnchor="end"
          fontSize="9"
          fill="#7a8799"
        >
          ${value}
        </text>
      ))}
    </svg>
  );
}

export default function AnalyticsSection() {
  const { activeFilter, setActiveFilter } = useAnalyticsFilter();

  return (
    <section className="dash-analytics-row">
      <article className="dash-card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold text-slate-800 m-0">
              ស្ថានភាពភ្ញៀវ
            </h2>

            <p className="text-xs text-[#7a8799] m-0">
              ការបែងចែកតាមប្រភេទ
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["all", "today"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeFilter === key
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

      <article className="dash-card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 m-0">
              ការចំណាយប្រចាំខែ
            </h2>

            <p className="text-xs text-[#7a8799] m-0">
              ប្រៀបធៀបចំណាយ ២០២៥
            </p>
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

          <span className="ml-auto text-xs text-green-600">
            ↑ ចំណេញ $2,550 ពីថវិការ
          </span>
        </div>
      </article>
    </section>
  );
}
