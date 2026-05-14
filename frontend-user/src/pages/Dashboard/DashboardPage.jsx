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

<<<<<<< HEAD
const DashboardPage = () => {
=======
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

>>>>>>> 60dfe88 (Debug all Frontend pages.)
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
   Upcoming Tasks card
───────────────────────────────────────── */
const UpcomingTasksCard = ({ events = [] }) => {
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
        <button type="button" className="db-card__view-all" onClick={() => { }}>
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
                className={`db-list-item__strip ${t.dotClass?.includes("6b6bc4")
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
   Recent Guests card
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

        <div className="db-budget__months">
          {months.slice(0, 6).map((m, i) => (
            <div key={i} className="db-budget__month">
              <div
                className="db-budget__bar"
                style={{
                  height: `${Math.round((expenseData[i] / Math.max(...expenseData)) * 48)}px`,
                }}
                title={`${m}: ${expenseData[i]}`}
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
          onClick={() => navigate("/events")}
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
const DashboardPage = () => {
  const { events, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="db-page">
      <DashboardHeader />
      <StatCards eventCount={events.length} />

      <div className="db-two-col">
        <UpcomingTasksCard events={events} />
        <RecentGuestsCard />
      </div>

      <div className="db-two-col">
        <BudgetCard />
        <QuickActionsCard />
      </div>
    </div>
  );
};

export default DashboardPage;
