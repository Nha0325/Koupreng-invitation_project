import { useNavigate, useLocation } from "react-router-dom";
import "./Aside.css";

/* ── SVG Icons ── */
const Icons = {
  dashboard: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  guests: (
    <svg
      width="16"
      height="16"
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
  expenses: (
    <svg
      width="16"
      height="16"
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
  gifts: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
      />
    </svg>
  ),
  templates: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  ),
  addTemplate: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  links: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  ),
  comparison: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  help: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  settings: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  logout: (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  wedding: (
    <svg
      width="15"
      height="15"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  chevronRight: (
    <svg
      width="7"
      height="12"
      fill="none"
      viewBox="0 0 7 12"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 1l5 5-5 5"
      />
    </svg>
  ),
};

const primaryNavItems = [
  {
    id: "dashboard",
    label: "ផ្ទាំងព័ត៌មាន",
    icon: Icons.dashboard,
    iconClass: "icon-purple",
    badge: null,
    path: "/dashboard",
  },
  {
    id: "guests",
    label: "បញ្ជីភ្ញៀវ",
    icon: Icons.guests,
    iconClass: "icon-purple",
    badge: "248",
    path: "/guests",
  },
  {
    id: "expenses",
    label: "ចំណាយ",
    icon: Icons.expenses,
    iconClass: "icon-green",
    badge: null,
    path: "/expenses",
  },
  {
    id: "gifts",
    label: "អំណោយ",
    icon: Icons.gifts,
    iconClass: "icon-orange",
    badge: null,
    path: "/gifts",
  },
  {
    id: "links",
    label: "ចំណងដៃ",
    icon: Icons.links,
    iconClass: "icon-blue",
    badge: "12",
    path: "/links",
  },
  {
    id: "templates",
    label: "គំរូ",
    icon: Icons.templates,
    iconClass: "icon-fuchsia",
    badge: null,
    path: "/templates",
  },
  {
    id: "comparison",
    label: "គម្រូធៀប",
    icon: Icons.comparison,
    iconClass: "icon-teal",
    badge: null,
    path: "/comparison",
  },
  {
    id: "add-template",
    label: "បន្ថែមគំរូ",
    icon: Icons.addTemplate,
    iconClass: "icon-rose",
    badge: null,
    path: "/add-template",
  },
];

const secondaryNavItems = [
  {
    id: "settings",
    label: "ការកំណត់",
    icon: Icons.settings,
    iconClass: "icon-slate",
    path: "/settings",
  },
  {
    id: "help",
    label: "ជំនួយ",
    icon: Icons.help,
    iconClass: "icon-slate",
    path: null,
  },
  {
    id: "logout",
    label: "ចាកចេញ",
    icon: Icons.logout,
    iconClass: "icon-slate",
    path: "/login",
  },
];

const NavItem = ({ item, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      aria-current={active ? "page" : undefined}
      className={`aside-nav-item${active ? " active" : ""}`}
    >
      <span className={`aside-nav-icon ${item.iconClass}`}>{item.icon}</span>
      <span className="aside-nav-label">{item.label}</span>
      {item.badge && <span className="aside-nav-badge">{item.badge}</span>}
      <span className="aside-nav-chevron">{Icons.chevronRight}</span>
    </button>
  );
};

const Aside = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item) => {
    if (item.path) navigate(item.path);
  };

  return (
    <aside className="aside">
      {/* Wedding progress card */}
      <div className="aside-progress-wrap">
        <div className="aside-progress-card">
          <div className="aside-progress-icon">{Icons.wedding}</div>
          <p className="aside-progress-label">ពិធីមង្គលការ</p>
          <h2 className="aside-progress-name">សុភា &amp; ដារា</h2>
          <p className="aside-progress-date">១៥ មករា ២០២៦</p>
          <div
            className="aside-progress-bar-track"
            role="progressbar"
            aria-valuenow={68}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="aside-progress-bar-fill" style={{ width: "68%" }} />
          </div>
          <p className="aside-progress-pct">68% រួចរាល់</p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="aside-nav" aria-label="Primary navigation">
        {primaryNavItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={location.pathname === item.path}
            onClick={handleNav}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="aside-divider" />

      {/* Secondary nav */}
      <nav className="aside-nav-secondary" aria-label="Secondary navigation">
        {secondaryNavItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={false}
            onClick={handleNav}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Aside;
