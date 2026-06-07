import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  IoCalendarClearOutline,
  IoCashOutline,
  IoCheckmarkOutline,
  IoChevronDownOutline,
  IoColorPaletteOutline,
  IoGiftOutline,
  IoGlobeOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useAuth } from "../../pages/auth/context/useAuth";
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";
import { useLanguageStore } from "../../stores/useLanguageStore";
import logo from "../../assets/logo.png";

const NAV_ITEMS = [
  { labelKey: "events", path: "/events", Icon: IoCalendarClearOutline },
  { labelKey: "dashboard", path: "/dashboard", Icon: IoGridOutline },
  { labelKey: "guests", path: "/guests", Icon: IoPeopleOutline },
  { labelKey: "expenses", path: "/expenses", Icon: IoCashOutline },
  { labelKey: "gifts", path: "/gifts", Icon: IoGiftOutline },
  { labelKey: "templates", path: "/templates/browse", Icon: IoColorPaletteOutline },
];

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", buttonLabel: "English", flag: "us", htmlLang: "en" },
  { code: "km", label: "ភាសាខ្មែរ", buttonLabel: "ភាសាខ្មែរ", flag: "kh", htmlLang: "km" },
];

const HOST_NAV_FALLBACK = {
  km: {
    events: "កម្មវិធី",
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    guests: "បញ្ជីភ្ញៀវ",
    expenses: "គម្រោងថវិកា",
    gifts: "ចងដៃមង្គល",
    templates: "បន្ថែមគម្រូ",
    logout: "ចាកចេញ",
    editProfile: "កែប្រែប្រវត្តិរូប",
    createProfile: "បង្កើតប្រវត្តិរូប",
  },
  en: {
    events: "Events",
    dashboard: "Dashboard",
    guests: "Guests",
    expenses: "Budget",
    gifts: "Wedding Gifts",
    templates: "Add Template",
    logout: "Sign Out",
    editProfile: "Edit profile",
    createProfile: "Create profile",
  },
};

export default function HostNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const language = useLanguageStore((state) => state.lang);
  const setLanguage = useLanguageStore((state) => state.setLang);
  const languageRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { text: navText } = useBackendMessages("hostNav", HOST_NAV_FALLBACK);
  const selectedLanguage = LANGUAGE_OPTIONS.find((option) => option.code === language) || LANGUAGE_OPTIONS[1];
  const displayName = user?.fullName?.trim()
    || user?.full_name?.trim()
    || user?.name?.trim()
    || user?.email?.split("@")[0]
    || "គណនី";
  const profileImage = user?.profileImage || user?.profile_image || user?.avatarUrl || user?.avatar_url || "";
  const profileInitial = displayName.charAt(0)?.toUpperCase() || "K";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = selectedLanguage.htmlLang;
  }, [selectedLanguage.htmlLang]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!languageRef.current?.contains(event.target)) {
        setLanguageOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate("/", { replace: true });
  };

  const handleSelectLanguage = (option) => {
    setLanguage(option.code);
    setLanguageOpen(false);
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
          flex: 1;
          gap: 8px;
          align-items: center;
          justify-content: center;
          min-width: 0;
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
          flex-shrink: 0;
        }
        .host-language-selector {
          position: relative;
          z-index: 20;
        }
        .host-language-btn {
          height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          border: 1px solid rgba(176, 146, 106, 0.24);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          color: #1f1f1f;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(93, 67, 32, 0.08);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .host-language-btn:hover,
        .host-language-btn.open {
          background: #fff;
          border-color: rgba(176, 146, 106, 0.48);
          box-shadow: 0 10px 28px rgba(93, 67, 32, 0.12);
        }
        .host-language-btn svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        .host-language-chevron {
          width: 14px !important;
          height: 14px !important;
          color: #7D6443;
        }
        .host-language-menu {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          min-width: 164px;
          padding: 10px;
          border: 1px solid rgba(176, 146, 106, 0.16);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 18px 42px rgba(42, 31, 16, 0.16);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .host-language-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: #222;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease;
        }
        .host-language-option:hover,
        .host-language-option.active {
          background: rgba(176, 146, 106, 0.1);
          color: #7D6443;
        }
        .host-language-option-label {
          flex: 1;
        }
        .host-language-check {
          width: 16px !important;
          height: 16px !important;
          color: #e11d48;
        }
        .host-language-flag {
          width: 26px;
          height: 18px;
          border-radius: 3px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }
        .host-language-flag.us {
          background:
            linear-gradient(#3c3b6e 0 54%, transparent 54%),
            repeating-linear-gradient(
              to bottom,
              #b22234 0 7.69%,
              #fff 7.69% 15.38%
            );
          background-size: 42% 54%, 100% 100%;
          background-repeat: no-repeat, repeat;
          background-position: left top, center;
        }
        .host-language-flag.kh {
          background: linear-gradient(
            to bottom,
            #032ea1 0 25%,
            #e00025 25% 75%,
            #032ea1 75% 100%
          );
        }
        .host-language-flag.kh::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 9px;
          height: 5px;
          border: 1px solid rgba(255, 255, 255, 0.95);
          border-top-width: 2px;
          transform: translate(-50%, -50%);
        }
        .host-profile-pill {
          min-width: 0;
          height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          border-radius: 999px;
          color: #1f1f1f;
          text-decoration: none;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 14px;
          font-weight: 800;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .host-profile-pill:hover {
          background: rgba(255, 255, 255, 0.72);
          box-shadow: 0 8px 24px rgba(93, 67, 32, 0.08);
        }
        .host-profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #B0926A;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 14px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 6px 16px rgba(93, 67, 32, 0.14);
        }
        .host-profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .host-profile-name {
          max-width: 96px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        .host-mobile-menu-item .menu-icon svg,
        .host-mobile-logout-btn .menu-icon svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
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
          .host-language-label,
          .host-profile-name {
            display: none;
          }
          .host-language-btn {
            width: 44px;
            justify-content: center;
            padding: 0;
          }
          .host-language-chevron {
            display: none;
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
          .host-profile-pill {
            padding: 0;
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
        @media (max-width: 420px) {
          .host-user-actions {
            gap: 8px;
          }
          .host-language-btn,
          .host-profile-avatar {
            width: 38px;
            height: 38px;
          }
          .host-language-menu {
            left: auto;
            right: 0;
          }
        }
      `}</style>

      <div className="host-header-wrapper">
        <header className="host-header-container">
          <Link to="/" className="host-logo-box" aria-label="Koupreng — Back to dashboard">
            <img src={logo} alt="Koupreng" />
            <span className="host-logo-tip" role="tooltip">Back to dashboard</span>
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
                  {navText(item.labelKey)}
                </Link>
              </span>
            ))}
          </nav>

          <div className="host-user-actions">
            <div className="host-language-selector" ref={languageRef}>
              <button
                type="button"
                className={`host-language-btn${languageOpen ? " open" : ""}`}
                aria-haspopup="listbox"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((value) => !value)}
              >
                <IoGlobeOutline aria-hidden="true" />
                <span className="host-language-label">{selectedLanguage.buttonLabel}</span>
                <IoChevronDownOutline className="host-language-chevron" aria-hidden="true" />
              </button>
              {languageOpen && (
                <div className="host-language-menu" role="listbox" aria-label="Language">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      role="option"
                      aria-selected={option.code === selectedLanguage.code}
                      className={`host-language-option${option.code === selectedLanguage.code ? " active" : ""}`}
                      onClick={() => handleSelectLanguage(option)}
                    >
                      <span className={`host-language-flag ${option.flag}`} aria-hidden="true" />
                      <span className="host-language-option-label">{option.label}</span>
                      {option.code === selectedLanguage.code && (
                        <IoCheckmarkOutline className="host-language-check" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="host-logout-nav-btn"
              onClick={handleLogout}
            >
              {navText("logout")}
            </button>
            <Link to="/profile" className="host-profile-pill" aria-label="Profile">
              <span className="host-profile-avatar">
                {profileImage ? <img src={profileImage} alt="" /> : profileInitial}
              </span>
              <span className="host-profile-name">{displayName}</span>
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
          onClick={closeMobileMenu}
        >
          <span className="menu-icon"><IoPersonOutline aria-hidden="true" /></span>
          {user?.fullName?.trim() || user?.full_name?.trim()
            ? navText("editProfile")
            : navText("createProfile")}
        </Link>

        <div className="host-mobile-menu-divider" />

        {NAV_ITEMS.map((item) => {
          const ItemIcon = item.Icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`host-mobile-menu-item${isActive(item.path) ? " active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span className="menu-icon"><ItemIcon aria-hidden="true" /></span>
              {navText(item.labelKey)}
            </Link>
          );
        })}
        <div className="host-mobile-menu-divider" />
        <button
          type="button"
          className="host-mobile-logout-btn"
          onClick={handleLogout}
        >
          <span className="menu-icon"><IoLogOutOutline aria-hidden="true" /></span>
          {navText("logout")}
        </button>
      </nav>
    </>
  );
}
