import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../pages/auth/context/useAuth";
import logo from "../../assets/logo.png";

const NAV_ITEMS = [
  { label: "កម្មវិធី", path: "/events", icon: "📋" },
  { label: "ផ្ទាំងគ្រប់គ្រង", path: "/dashboard", icon: "📊" },
  { label: "បញ្ជីភ្ញៀវ", path: "/guests", icon: "👥" },
  { label: "គម្រោងថវិកា", path: "/expenses", icon: "💰" },
  { label: "ចងដៃមង្គល", path: "/gifts", icon: "🎁" },
  { label: "បន្ថែមគម្រូ", path: "/templates/browse", icon: "🎨" },
];

export default function HostNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <style>{`
        .host-header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 3000;
          padding: ${scrolled ? "10px 0" : "20px 0"};
          transition: 0.4s;
          pointer-events: none;
        }
        .host-header-container {
          pointer-events: auto;
          max-width: 1440px;
          margin: 0 auto;
          width: 92%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          height: 75px;
          background: ${scrolled ? "rgba(252, 248, 242, 0.95)" : "rgba(252, 248, 242, 0.4)"};
          backdrop-filter: blur(5px);
          border-radius: 50px;
          border: 1px solid rgba(176, 146, 106, 0.3);
          box-shadow: ${scrolled ? "0 10px 40px rgba(0,0,0,0.1)" : "none"};
        }
        .host-logo-box {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
          position: relative;
          transition: transform 0.25s ease;
        }
        .host-logo-box:hover {
          transform: scale(1.05);
        }
        .host-logo-box img {
          height: 90px;
          width: auto;
          object-fit: contain;
          transition: filter 0.25s ease;
        }
        .host-logo-box:hover img {
          filter: drop-shadow(0 4px 12px rgba(176, 146, 106, 0.45));
        }
        .host-logo-tip {
          position: absolute;
          left: 50%;
          top: 100%;
          transform: translate(-50%, 6px);
          white-space: nowrap;
          background: #7D6443;
          color: #fff;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
          box-shadow: 0 6px 18px rgba(0,0,0,0.18);
          z-index: 10;
        }
        .host-logo-tip::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 100%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-bottom-color: #7D6443;
        }
        .host-logo-box:hover .host-logo-tip,
        .host-logo-box:focus-visible .host-logo-tip {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 10px);
        }
        .host-nav-links {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .host-nav-item-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .host-nav-divider {
          color: #ccc;
          font-size: 14px;
          font-weight: 300;
          user-select: none;
        }
        .host-nav-link {
          font-family: 'Kantumruy Pro', sans-serif;
          text-decoration: none;
          color: #333;
          font-weight: 700;
          font-size: 14px;
          transition: 0.3s;
          background: none;
          border: 0;
          cursor: pointer;
          padding: 0;
        }
        .host-nav-link:hover,
        .host-nav-link.active {
          color: #B0926A;
        }
        .host-user-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .host-logout-nav-btn {
          font-family: 'Kantumruy Pro', sans-serif;
          text-decoration: none;
          color: #8a3434;
          font-weight: 700;
          font-size: 14px;
          transition: 0.3s;
          background: none;
          border: 0;
          cursor: pointer;
          padding: 0;
        }
        .host-logout-nav-btn:hover {
          color: #c24141;
        }
        .host-profile-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #B0926A;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          position: relative;
          z-index: 10;
        }

        /* Hamburger button - hidden on desktop */
        .host-hamburger-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 3100;
        }
        .host-hamburger-btn span {
          display: block;
          width: 24px;
          height: 3px;
          background: #333;
          border-radius: 3px;
          transition: 0.3s;
          margin: 5px 0;
        }
        .host-hamburger-btn.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 6px);
        }
        .host-hamburger-btn.open span:nth-child(2) {
          opacity: 0;
        }
        .host-hamburger-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -6px);
        }

        /* Mobile overlay */
        .host-mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          z-index: 2999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .host-mobile-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Mobile slide menu */
        .host-mobile-menu {
          display: none;
          position: fixed;
          top: 0;
          right: -280px;
          width: 210px;
          height: 100%;
          background: rgba(252, 248, 242, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 3100;
          padding: 100px 24px 40px;
          transition: right 0.3s ease;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          pointer-events: none;
        }
        .host-mobile-menu.open {
          right: 0;
          pointer-events: auto;
        }
        .host-mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 12px;
          text-decoration: none;
          color: #333;
          font-family: 'Kantumruy Pro', sans-serif;
          font-weight: 600;
          font-size: 16px;
          border-radius: 12px;
          transition: 0.2s;
        }
        .host-mobile-menu-item:hover,
        .host-mobile-menu-item.active {
          background: rgba(176, 146, 106, 0.12);
          color: #B0926A;
        }
        .host-mobile-menu-item .menu-icon {
          font-size: 22px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(176, 146, 106, 0.1);
          border-radius: 10px;
        }
        .host-mobile-menu-divider {
          height: 1px;
          background: rgba(176, 146, 106, 0.2);
          margin: 16px 0;
        }
        .host-mobile-logout-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 12px;
          font-family: 'Kantumruy Pro', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #8a3434;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 12px;
          width: 100%;
          transition: 0.2s;
        }
        .host-mobile-logout-btn:hover {
          background: rgba(138, 52, 52, 0.08);
        }
        .host-mobile-logout-btn .menu-icon {
          font-size: 22px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(138, 52, 52, 0.08);
          border-radius: 10px;
        }

        @media (max-width: 1024px) {
          .host-nav-links {
            gap: 14px;
          }
          .host-nav-link {
            font-size: 12.5px;
          }
        }
        @media (max-width: 768px) {
          .host-header-container {
            width: calc(100% - 24px);
            padding: 0 16px;
            height: 62px;
          }
          .host-logo-box img {
            height: 65px;
          }
          .host-nav-links {
            display: none;
          }
          .host-logout-nav-btn {
            display: none;
          }
          .host-hamburger-btn {
            display: block;
          }
          .host-mobile-overlay {
            display: block;
          }
          .host-mobile-menu {
            display: block;
          }
        }
      `}</style>

      <div className="host-header-wrapper">
        <header className="host-header-container">
          <Link to="/" className="host-logo-box" aria-label="គូព្រេង — ទៅផ្ទាំងគ្រប់គ្រង">
            <img src={logo} alt="គូព្រេង" />
            <span className="host-logo-tip" role="tooltip">ទៅផ្ទាំងគ្រប់គ្រង</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="host-nav-links">
            {NAV_ITEMS.map((item, index) => (
              <span key={item.path} className="host-nav-item-wrap">
                {index > 0 && <span className="host-nav-divider">|</span>}
                <Link
                  to={item.path}
                  className={`host-nav-link${isActive(item.path) ? " active" : ""}`}
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="host-user-actions">
            <button
              type="button"
              className="host-logout-nav-btn"
              onClick={handleLogout}
            >
              ចាកចេញ
            </button>
            <Link to="/profile" className="host-profile-circle">
              {user?.fullName?.charAt(0) || user?.full_name?.charAt(0) || user?.name?.charAt(0) || "K"}
            </Link>

            {/* Hamburger button - mobile only */}
            <button
              type="button"
              className={`host-hamburger-btn${mobileMenuOpen ? " open" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="បើកម៉ឺនុយ"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile overlay */}
      <div
        className={`host-mobile-overlay${mobileMenuOpen ? " visible" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile slide-out menu */}
      <nav className={`host-mobile-menu${mobileMenuOpen ? " open" : ""}`}>
        {/* Profile section */}
        <Link
          to="/profile"
          className={`host-mobile-menu-item${isActive("/profile") ? " active" : ""}`}
          style={{ marginBottom: 8 }}
        >
          <span className="menu-icon">👤</span>
          {user?.fullName?.trim() || user?.full_name?.trim()
            ? "កែប្រែប្រវត្តិរូប"
            : "បង្កើតប្រវត្តិរូប"}
        </Link>

        <div className="host-mobile-menu-divider" />

        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`host-mobile-menu-item${isActive(item.path) ? " active" : ""}`}
          >
            <span className="menu-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div className="host-mobile-menu-divider" />
        <button
          type="button"
          className="host-mobile-logout-btn"
          onClick={handleLogout}
        >
          <span className="menu-icon">🚪</span>
          ចាកចេញ
        </button>
      </nav>
    </>
  );
}
