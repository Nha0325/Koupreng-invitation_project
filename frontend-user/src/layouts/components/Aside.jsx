import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Aside.css";

/* ── ប្រើប្រាស់ Lucide-style Icons (SVG) ── */
const Icons = {
  dashboard: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  guests: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  expenses: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  gifts: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  ),
  profile: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  logout: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  menu: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  close: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
};

const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "ផ្ទាំងគ្រប់គ្រង",
    path: "/dashboard",
    Icon: Icons.dashboard,
  },
  {
    id: "guests",
    label: "បញ្ជីភ្ញៀវកិត្តិយស",
    path: "/guests",
    Icon: Icons.guests,
  },
  {
    id: "expenses",
    label: "គម្រោងថវិកា",
    path: "/expenses",
    Icon: Icons.expenses,
  },
  { id: "gifts", label: "ចងដៃមង្គល", path: "/gifts", Icon: Icons.gifts },
];

export default function SidebarContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="layout-wrapper">
      {/* ── Mobile Header ── */}
      <div className="mobile-header lg:hidden">
        <div className="logo-section">
          <div className="logo-icon-box">ក</div>
          <span className="logo-text">គូព្រេង</span>
        </div>
        <button className="icon-btn" onClick={() => setIsMobileOpen(true)}>
          <Icons.menu />
        </button>
      </div>

      {/* ── Sidebar Overlay ── */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Main Sidebar ── */}
      <aside className={`sidebar ${isMobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon-box">ក</div>
            <div>
              <h1 className="logo-text">គូព្រេង</h1>
              <p className="logo-subtext">Premium Wedding Planner</p>
            </div>
          </div>
          <button
            className="close-btn lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <Icons.close />
          </button>
        </div>

        <div className="sidebar-scroll">
          <div className="nav-group">
            <p className="group-title">ម៉ឺនុយចម្បង</p>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="link-icon">
                  <item.Icon />
                </div>
                <span className="link-text">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="active-dot" />
                )}
              </Link>
            ))}
          </div>

          <div className="nav-group mt-auto">
            <p className="group-title">ការកំណត់</p>
            <Link
              to="/profile"
              className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="link-icon">
                <Icons.profile />
              </div>
              <span className="link-text">គណនីរបស់ខ្ញុំ</span>
            </Link>

            <button
              className="nav-link logout"
              onClick={() => setShowLogoutModal(true)}
            >
              <div className="link-icon">
                <Icons.logout />
              </div>
              <span className="link-text">ចាកចេញពីប្រព័ន្ធ</span>
            </button>
          </div>
        </div>

        {/* ── User Profile Mini Card ── */}
        <div className="user-mini-card">
          <div className="avatar">AD</div>
          <div className="user-info">
            <p className="user-name">Admin User</p>
            <p className="user-status">Premium Plan</p>
          </div>
        </div>
      </aside>

      {/* ── Modal Logout Pop-up ── */}
      {showLogoutModal && (
        <div className="modal-wrapper">
          <div className="modal-card">
            <div className="modal-icon">
              <Icons.logout />
            </div>
            <h3>បញ្ជាក់ការចាកចេញ</h3>
            <p>តើអ្នកពិតជាចង់ចាកចេញពីគណនីនេះមែនទេ?</p>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                បោះបង់
              </button>
              <button className="btn-primary" onClick={() => navigate("/")}>
                ចាកចេញ
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&family=Moul&display=swap');

        :root {
          --sidebar-width: 280px;
          --primary-purple: #3D2461;
          --footer-bg: #f3f1ff;
          --text-main: #4b5563;
          --text-muted: #868e96;
          --accent-gold: #B0926A;
          --white: #ffffff;
          --transition: all 0.25s ease-in-out;
        }

        * { box-sizing: border-box; }

        .layout-wrapper { display: flex; min-height: 100vh; }

        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--footer-bg);
          border-right: 1px solid rgba(61, 36, 97, 0.06);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0; top: 0;
          z-index: 100;
          transition: var(--transition);
        }

        .sidebar-header {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-icon-box {
          width: 40px; height: 40px;
          background: var(--primary-purple);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-family: 'Moul'; font-size: 20px;
        }

        .logo-text { font-family: 'Moul'; font-size: 20px; color: var(--primary-purple); margin: 0; }
        .logo-subtext { font-size: 11px; color: var(--accent-gold); margin: 0; font-weight: 500; }

        .close-btn { background: none; border: none; color: var(--primary-purple); cursor: pointer; }

        .sidebar-scroll { flex: 1; overflow-y: auto; padding: 0 16px 24px; display: flex; flex-direction: column; }

        .nav-group { margin-bottom: 32px; }
        .group-title {
          font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;
          color: var(--text-muted); font-weight: 700; padding: 0 12px 12px;
        }

        .nav-link {
          display: flex; align-items: center; width: 100%; border: none; background: none;
          padding: 12px 14px; border-radius: 14px; cursor: pointer;
          color: var(--text-main);
          transition: var(--transition);
          margin-bottom: 4px; position: relative; font-family: 'Kantumruy Pro';
        }

        .link-icon { margin-right: 12px; display: flex; align-items: center; color: var(--text-main); }
        .link-text { font-weight: 500; font-size: 14.5px; }

        .nav-link:hover { 
          background: rgba(61, 36, 97, 0.05); 
          color: var(--primary-purple); 
        }
        .nav-link:hover .link-icon { color: var(--primary-purple); }

        .nav-link.active { 
          background: var(--white);
          color: var(--primary-purple); 
          box-shadow: 0 8px 16px rgba(61, 36, 97, 0.06);
          font-weight: 600;
        }
        .nav-link.active .link-icon { color: var(--primary-purple); }

        .active-dot {
          position: absolute; right: 12px; width: 6px; height: 6px;
          background: var(--accent-gold); border-radius: 50%;
        }

        .nav-link.logout:hover { background: #fff5f5; color: #e11d48; }
        .nav-link.logout:hover .link-icon { color: #e11d48; }

        .user-mini-card {
          margin: 0 16px 20px; padding: 14px;
          background: var(--white);
          border-radius: 16px;
          display: flex; align-items: center; gap: 12px;
          border: 1px solid rgba(61, 36, 97, 0.04);
        }
        .avatar {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--accent-gold); color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 12px;
        }
        .user-name { font-size: 14px; font-weight: 600; margin: 0; color: var(--primary-purple); }
        .user-status { font-size: 11px; color: var(--text-muted); margin: 0; }

        .mobile-header {
          position: fixed; top: 0; left: 0; right: 0; height: 72px;
          background: rgba(243, 241, 255, 0.85); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; z-index: 90; border-bottom: 1px solid rgba(61, 36, 97, 0.05);
        }

        .icon-btn { background: none; border: none; color: var(--primary-purple); cursor: pointer; }

        @media (max-width: 1023px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 20px 0 40px rgba(0,0,0,0.1); }
          .sidebar-overlay {
            position: fixed; inset: 0; background: rgba(61, 36, 97, 0.1);
            backdrop-filter: blur(4px); z-index: 95;
          }
        }

        .lg\\:hidden { @media (min-width: 1024px) { display: none !important; } }

        .modal-wrapper {
          position: fixed; inset: 0; background: rgba(61, 36, 97, 0.25);
          backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center;
          z-index: 200; animation: fadeIn 0.25s ease;
        }
        .modal-card {
          background: var(--white); padding: 32px; border-radius: 24px;
          max-width: 400px; width: 90%; text-align: center;
          box-shadow: 0 20px 40px rgba(61, 36, 97, 0.12);
          border: 1px solid rgba(61, 36, 97, 0.05);
        }
        .modal-icon {
          width: 60px; height: 60px; background: #fff5f5; color: #e11d48;
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .modal-card h3 { margin: 0 0 8px; font-size: 1.2rem; color: var(--primary-purple); }
        .modal-card p { margin: 0 0 24px; font-size: 0.95rem; color: var(--text-main); }

        .modal-footer { display: flex; gap: 12px; }
        .btn-primary, .btn-secondary {
          flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none;
          font-family: 'Kantumruy Pro'; transition: var(--transition);
        }
        .btn-primary { background: #e11d48; color: white; }
        .btn-primary:hover { background: #be123c; }
        .btn-secondary { background: var(--footer-bg); color: var(--text-main); }
        .btn-secondary:hover { background: #e5e1ff; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
