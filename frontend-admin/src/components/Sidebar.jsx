import { NavLink } from "react-router-dom";

const links = [
    { to: "/admin/dashboard", label: "ផ្ទាំងគ្រប់គ្រង", icon: "D" },
    { to: "/admin/users", label: "អ្នកប្រើប្រាស់", icon: "U" },
    { to: "/admin/templates", label: "គំរូ", icon: "T" },
    { to: "/admin/invitations", label: "ធៀបការ", icon: "I" },
    { to: "/admin/notifications", label: "ជូនដំណឹង", icon: "N" },
    { to: "/admin/reports", label: "របាយការណ៍", icon: "R" },
    { to: "/admin/payments", label: "Payments", icon: "P" },
    { to: "/admin/packages", label: "Packages", icon: "PK" },
    { to: "/admin/system-logs", label: "System logs", icon: "L" },
];

export default function Sidebar({ open = false, onClose }) {
    return (
        <>
            <button
                type="button"
                aria-label="Close admin navigation"
                className={`sidebar-scrim${open ? " is-visible" : ""}`}
                onClick={onClose}
            />
            <aside className={`sidebar${open ? " is-open" : ""}`} aria-label="Admin navigation">
                <div className="sidebar-brand">
                    <div className="sidebar-crest">K</div>
                    <span className="sidebar-title">រដ្ឋបាលគូព្រេង</span>
                </div>

                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                            onClick={onClose}
                        >
                            <span className="nav-icon" aria-hidden="true">{link.icon}</span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-foot">Koupreng Admin v1.0</div>
            </aside>
        </>
    );
}
