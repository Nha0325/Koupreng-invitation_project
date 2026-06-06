import { NavLink } from "react-router-dom";

const links = [
    { to: "/admin/dashboard", label: "ផ្ទាំងគ្រប់គ្រង", icon: "📊" },
    { to: "/admin/users", label: "អ្នកប្រើប្រាស់", icon: "👥" },
    { to: "/admin/templates", label: "គំរូ", icon: "🎨" },
    { to: "/admin/invitations", label: "ធៀបការ", icon: "💌" },
    { to: "/admin/notifications", label: "ជូនដំណឹង", icon: "🔔" },
    { to: "/admin/reports", label: "របាយការណ៍", icon: "📈" },
    { to: "/admin/payments", label: "Payments", icon: "💳" },
    { to: "/admin/packages", label: "Packages", icon: "📦" },
    { to: "/admin/system-logs", label: "System logs", icon: "🧾" },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-crest">⚜️</div>
                <span className="sidebar-title">រដ្ឋបាលគូព្រេង</span>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-foot">Koupreng Admin v1.0</div>
        </aside>
    );
}
