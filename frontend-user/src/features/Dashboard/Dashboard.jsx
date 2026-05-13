import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  guests,
  quickActions,
  upcomingTasks,
  months,
  expenseData,
} from "../../shared/hooks/useDashboardData";
import useEvents from "../../shared/hooks/useEvents";
import "./Dashboard.css";

/* ─────────────────────────────────────────
   Stat Cards Row  (V0 pattern)
───────────────────────────────────────── */
const StatCards = ({ eventCount }) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "ភ្ញៀវសរុប",
      value: "248",
      sub: "មើលបញ្ជីភ្ញៀវ",
      href: "/guests",
      color: "db-stat--purple",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "ព្រឹត្តិការណ៍",
      value: eventCount != null ? String(eventCount) : "—",
      sub: "គ្រប់គ្រងព្រឹត្តិការណ៍",
      href: "/events",
      color: "db-stat--blue",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "ចំណាយ",
      value: "$12,450",
      sub: "ត្រួតពិនិត្យចំណាយ",
      href: "/expenses",
      color: "db-stat--amber",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "ថ្ងៃនៅសល់",
      value: "44",
      sub: "រហូតដល់ពិធី",
      href: "/dashboard",
      color: "db-stat--rose",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="db-stats-grid">
      {stats.map((s) => (
        <button
          key={s.label}
          type="button"
          className={`db-stat-card ${s.color}`}
          onClick={() => navigate(s.href)}
        >
          <div className="db-stat-card__top">
            <span className="db-stat-card__label">{s.label}</span>
            <div className="db-stat-card__icon-wrap">{s.icon}</div>
          </div>
          <div className="db-stat-card__value">{s.value}</div>
          <div className="db-stat-card__action">
            <span>{s.sub}</span>
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 12 12"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2 6h8M6 2l4 4-4 4"
              />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   Status badge helper
───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    បញ្ជាក់: "badge--green",
    រង់ចាំ: "badge--amber",
    បដិសេធ: "badge--red",
  };
  return (
    <span className={`db-badge ${map[status] || "badge--gray"}`}>{status}</span>
  );
};

/* ─────────────────────────────────────────
   Upcoming Tasks card  (V0 "Upcoming" panel)
───────────────────────────────────────── */

const UpcomingTasksCard = ({ events = [] }) => {
  // Merge upcoming events (next 3) with static tasks
  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)
    .map((e) => ({
      title: e.name || e.title || "ព្រឹត្តិការណ៍",
      time: e.date,
      dotClass: "bg-[#3276e4]",
    }));

  const allTasks = [...upcomingEvents, ...upcomingTasks].slice(0, 5);
  return (
    <div className="db-card">
      <div className="db-card__header">
        <div className="db-card__title">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="db-card__title-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          កិច្ចការខាងមុខ
        </div>
        <button type="button" className="db-card__view-all" onClick={() => {}}>
          មើលទាំងអស់
        </button>
      </div>

      <div className="db-list">
        {allTasks.length === 0 ? (
          <div className="db-empty">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              opacity=".35"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>គ្មានកិច្ចការ</p>
          </div>
        ) : (
          allTasks.map((t, i) => (
            <div key={i} className="db-list-item">
              <div
                className={`db-list-item__strip ${
                  t.dotClass?.includes("6b6bc4")
                    ? "db-strip--purple"
                    : t.dotClass?.includes("yellow")
                      ? "db-strip--amber"
                      : t.dotClass?.includes("green")
                        ? "db-strip--green"
                        : "db-strip--purple"
                }`}
              />
              <div className="db-list-item__avatar db-avatar--task">
                <div className={`db-dot ${t.dotClass}`} />
              </div>
              <div className="db-list-item__body">
                <p className="db-list-item__name">{t.title}</p>
                <p className="db-list-item__sub">{t.time}</p>
              </div>
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="db-list-item__chevron"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Recent Guests card  (V0 "Recent Patients" panel)
───────────────────────────────────────── */
const RecentGuestsCard = () => {
  const navigate = useNavigate();

  return (
    <div className="db-card">
      <div className="db-card__header">
        <div className="db-card__title">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="db-card__title-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          ភ្ញៀវថ្មីៗ
        </div>
        <button
          type="button"
          className="db-card__view-all"
          onClick={() => navigate("/guests")}
        >
          មើលទាំងអស់
        </button>
      </div>

      <div className="db-list">
        {guests.slice(0, 5).map((g, i) => (
          <div
            key={i}
            className="db-list-item db-list-item--hover"
            onClick={() => navigate("/guests")}
          >
            <div className="db-list-item__avatar">{g.name.charAt(0)}</div>
            <div className="db-list-item__body">
              <p className="db-list-item__name">{g.name}</p>
              <p className="db-list-item__sub">
                {g.group} · {g.phone}
              </p>
            </div>
            <StatusBadge status={g.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Quick Actions card
───────────────────────────────────────── */
const QuickActionsCard = () => {
  return (
    <div className="db-card">
      <div className="db-card__header">
        <div className="db-card__title">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="db-card__title-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          សកម្មភាពរហ័ស
        </div>
      </div>
      <div className="db-quick-grid">
        {quickActions.map((a, i) => (
          <button
            key={i}
            type="button"
            className={`db-quick-btn ${a.bg} ${a.border}`}
          >
            <div className={`db-quick-btn__icon ${a.iconBg}`}>{a.icon}</div>
            <span className="db-quick-btn__label">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Budget Progress card
───────────────────────────────────────── */
const BudgetCard = () => {
  const spent = 12450;
  const total = 15000;
  const pct = Math.round((spent / total) * 100);

  return (
    <div className="db-card">
      <div className="db-card__header">
        <div className="db-card__title">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="db-card__title-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          ថវិការ ២០២៥
        </div>
        <span className="db-badge badge--green">↑ ចំណេញ $2,550</span>
      </div>

      <div className="db-budget">
        <div className="db-budget__row">
          <span className="db-budget__label">បានចំណាយ</span>
          <span className="db-budget__value db-budget__value--spent">
            ${spent.toLocaleString()}
          </span>
        </div>
        <div
          className="db-budget__track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="db-budget__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="db-budget__row">
          <span className="db-budget__label">ថវិការសរុប</span>
          <span className="db-budget__value">${total.toLocaleString()}</span>
        </div>

        {/* Month breakdown */}
        <div className="db-budget__months">
          {months.slice(0, 6).map((m, i) => (
            <div key={i} className="db-budget__month">
              <div
                className="db-budget__bar"
                style={{
                  height: `${Math.round((expenseData[i] / Math.max(...expenseData)) * 48)}px`,
                }}
                title={`${m}: $${expenseData[i]}`}
              />
              <span className="db-budget__month-label">{m.slice(0, 1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Wedding Invitation System Analysis card
───────────────────────────────────────── */
const AnalysisCard = () => {
  const analysisData = {
    guestAttendance: {
      confirmed: 186,
      pending: 42,
      rejected: 20,
      total: 248,
      rate: 75,
    },
    rsvpStats: {
      sent: 248,
      opened: 198,
      clicked: 156,
      responded: 186,
    },
    budgetBreakdown: [
      { category: "អាហារ", spent: 3500, budget: 4000, pct: 87.5 },
      { category: "តុបតែង", spent: 1200, budget: 1500, pct: 80 },
      { category: "ឈុតខ្លួន", spent: 800, budget: 1000, pct: 80 },
      { category: "ដឹកជញ្ជូន", spent: 600, budget: 600, pct: 100 },
      { category: "ផ្សេងៗ", spent: 2400, budget: 3000, pct: 80 },
    ],
    timeline: {
      daysRemaining: 44,
      tasksCompleted: 34,
      totalTasks: 50,
      onTrack: true,
    },
  };

  return (
    <div className="db-card">
      <div className="db-card__header">
        <div className="db-card__title">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="db-card__title-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          ការវិភាគប្រព័ន្ធអញ្ជើញ
        </div>
        <span
          className={`db-badge ${analysisData.timeline.onTrack ? "badge--green" : "badge--amber"}`}
        >
          {analysisData.timeline.onTrack ? "✓ ល្អ" : "⚠ ប្រុង"}
        </span>
      </div>

      {/* Guest Attendance */}
      <div className="db-analysis-section">
        <h4 className="db-analysis-section-title">ការចូលរួមភ្ញៀវ</h4>
        <div className="db-analysis-stats">
          <div className="db-analysis-stat">
            <span className="db-analysis-stat-value">
              {analysisData.guestAttendance.confirmed}
            </span>
            <span className="db-analysis-stat-label">បានបញ្ជាក់</span>
          </div>
          <div className="db-analysis-stat">
            <span className="db-analysis-stat-value">
              {analysisData.guestAttendance.pending}
            </span>
            <span className="db-analysis-stat-label">កំពុងរង់ចាំ</span>
          </div>
          <div className="db-analysis-stat">
            <span className="db-analysis-stat-value">
              {analysisData.guestAttendance.rejected}
            </span>
            <span className="db-analysis-stat-label">បដិសេធ</span>
          </div>
          <div className="db-analysis-stat">
            <span className="db-analysis-stat-value">
              {analysisData.guestAttendance.rate}%
            </span>
            <span className="db-analysis-stat-label">អត្រាការចូលរួម</span>
          </div>
        </div>
      </div>

      {/* RSVP Stats */}
      <div className="db-analysis-section">
        <h4 className="db-analysis-section-title">ស្ថិតិ RSVP</h4>
        <div className="db-rsvp-progress">
          <div className="db-rsvp-item">
            <span className="db-rsvp-label">បានផ្ញើ</span>
            <div className="db-rsvp-bar">
              <div className="db-rsvp-fill" style={{ width: "100%" }} />
            </div>
            <span className="db-rsvp-value">{analysisData.rsvpStats.sent}</span>
          </div>
          <div className="db-rsvp-item">
            <span className="db-rsvp-label">បានបើក</span>
            <div className="db-rsvp-bar">
              <div
                className="db-rsvp-fill"
                style={{
                  width: `${(analysisData.rsvpStats.opened / analysisData.rsvpStats.sent) * 100}%`,
                }}
              />
            </div>
            <span className="db-rsvp-value">
              {analysisData.rsvpStats.opened}
            </span>
          </div>
          <div className="db-rsvp-item">
            <span className="db-rsvp-label">បានចុច</span>
            <div className="db-rsvp-bar">
              <div
                className="db-rsvp-fill"
                style={{
                  width: `${(analysisData.rsvpStats.clicked / analysisData.rsvpStats.sent) * 100}%`,
                }}
              />
            </div>
            <span className="db-rsvp-value">
              {analysisData.rsvpStats.clicked}
            </span>
          </div>
          <div className="db-rsvp-item">
            <span className="db-rsvp-label">បានឆ្លើយ</span>
            <div className="db-rsvp-bar">
              <div
                className="db-rsvp-fill"
                style={{
                  width: `${(analysisData.rsvpStats.responded / analysisData.rsvpStats.sent) * 100}%`,
                }}
              />
            </div>
            <span className="db-rsvp-value">
              {analysisData.rsvpStats.responded}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="db-analysis-section">
        <h4 className="db-analysis-section-title">ការបំបែកថវិការ</h4>
        <div className="db-budget-breakdown">
          {analysisData.budgetBreakdown.map((item, i) => (
            <div key={i} className="db-budget-item">
              <div className="db-budget-item-header">
                <span className="db-budget-item-category">{item.category}</span>
                <span className="db-budget-item-pct">{item.pct}%</span>
              </div>
              <div className="db-budget-item-bar">
                <div
                  className={`db-budget-item-fill ${item.pct >= 100 ? "over-budget" : item.pct >= 90 ? "near-budget" : ""}`}
                  style={{ width: `${Math.min(item.pct, 100)}%` }}
                />
              </div>
              <div className="db-budget-item-amounts">
                <span>${item.spent.toLocaleString()}</span>
                <span className="db-budget-item-total">
                  / ${item.budget.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="db-analysis-section">
        <h4 className="db-analysis-section-title">កាលបរិច្ឆេទ</h4>
        <div className="db-timeline-info">
          <div className="db-timeline-stat">
            <span className="db-timeline-value">
              {analysisData.timeline.daysRemaining}
            </span>
            <span className="db-timeline-label">ថ្ងៃនៅសល់</span>
          </div>
          <div className="db-timeline-stat">
            <span className="db-timeline-value">
              {analysisData.timeline.tasksCompleted}/
              {analysisData.timeline.totalTasks}
            </span>
            <span className="db-timeline-label">កិច្ចការបានបញ្ចប់</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Page header
───────────────────────────────────────── */
const DashboardHeader = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("km-KH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="db-page-header">
      <div>
        <h1 className="db-page-header__logo">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-3xl font-semibold text-slate-900 hover:text-blue-600 transition-colors duration-200 select-none relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => navigate("/events")}
            aria-label="Go to Events"
            title="Go to Events"
          >
            Koupreang
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" />
              <path d="M13 18l6-6-6-6" />
            </svg>
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
          </button>
        </h1>
        <br />
        <h2 className="db-page-header__title">ផ្ទាំងព័ត៌មានទូទៅ</h2>
        <p className="db-page-header__sub">
          ត្រួតពិនិត្យស្ថានភាពព្រឹត្តិការណ៍របស់អ្នក
        </p>
      </div>
      <div className="db-page-header__actions">
        <button type="button" className="db-btn db-btn--ghost">
          📅 {today}
        </button>
        <button
          type="button"
          className="db-btn db-btn--primary"
          onClick={() => navigate("/events/create")}
        >
          + បន្ថែមព្រឹត្តិការណ៍
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main export
───────────────────────────────────────── */
const DashboardMain = () => {
  const { events, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="db-page">
      <DashboardHeader />
      <StatCards eventCount={events.length} />

      {/* Two-column grid — V0 pattern */}
      <div className="db-two-col">
        <UpcomingTasksCard events={events} />
        <RecentGuestsCard />
      </div>

      {/* Two-column grid — budget + quick actions */}
      <div className="db-two-col">
        <BudgetCard />
        <QuickActionsCard />
      </div>

      {/* Full width — Analysis card */}
      <AnalysisCard />
    </div>
  );
};

export default DashboardMain;
