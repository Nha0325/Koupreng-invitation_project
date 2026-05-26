import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/auth/context/useAuth";
import "./Aside.css";

function Icon({ children }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const MENU_ITEMS = [
  {
    label: "ផ្ទាំងគ្រប់គ្រង",
    path: "/dashboard",
    icon: (
      <Icon>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </Icon>
    ),
  },
  {
    label: "ធៀបការរបស់ខ្ញុំ",
    path: "/dashboard/invitations",
    icon: (
      <Icon>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </Icon>
    ),
  },
  {
    label: "បញ្ជីភ្ញៀវ",
    path: "/guests",
    icon: (
      <Icon>
        <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </Icon>
    ),
  },
  {
    label: "គម្រោងថវិកា",
    path: "/expenses",
    icon: (
      <Icon>
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </Icon>
    ),
  },
  {
    label: "គំរូដែលបានទិញ",
    path: "/dashboard/templates/paid",
    icon: (
      <Icon>
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M17 15l1 1 2-3" />
      </Icon>
    ),
  },
  {
    label: "ចងដៃមង្គល",
    path: "/gifts",
    icon: (
      <Icon>
        <rect x="3" y="8" width="18" height="4" />
        <path d="M12 8v13M5 12v9h14v-9M12 8H7.5a2.5 2.5 0 1 1 0-5C11 3 12 8 12 8ZM12 8h4.5a2.5 2.5 0 1 0 0-5C13 3 12 8 12 8Z" />
      </Icon>
    ),
  },
];

export default function Aside() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="aside">
      <div className="aside-brand">
        <span className="brand-logo-text">គូព្រេង</span>
      </div>

      <nav className="aside-nav" aria-label="Host navigation">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`aside-nav-item${isActive(item.path) ? " active" : ""}`}
          >
            <span className="aside-nav-icon">{item.icon}</span>
            <span className="aside-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="aside-divider" />

      <button type="button" className="aside-nav-item logout-btn" onClick={handleLogout}>
        <span className="aside-nav-icon">
          <Icon>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </Icon>
        </span>
        <span className="aside-nav-label">ចាកចេញ</span>
      </button>

      <div className="aside-user-card">
        <div className="aside-user-avatar">{user?.name?.charAt(0) || "K"}</div>
        <div>
          <p>{user?.name || "Koupreng Host"}</p>
          <span>Wedding invitation workspace</span>
        </div>
      </div>
    </aside>
  );
}