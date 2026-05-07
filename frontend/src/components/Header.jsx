import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const navLinks = [
  { label: "ទំព័រដើម", to: "/" },
  { label: "មុខងារ", to: "/" },
  { label: "តម្លៃ", to: "/" },
  { label: "សំណួរ", to: "/" },
  { label: "ទំនាក់ទំនង", to: "/" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Brand */}
      <div className="header-brand">
        <Link to="/">Koupreng</Link>
      </div>

      {/* Desktop center nav */}
      <nav className="center-nav" aria-label="Main navigation">
        {navLinks.map((l) => (
          <Link to={l.to} key={l.label}>
            {" "}
            {l.label}{" "}
          </Link>
        ))}
      </nav>

      {/* Desktop right nav */}
      <div className="header-nav">
        <Link to="/">ចូល</Link>
        <Link to="/" className="btn-start">
          ចាប់ផ្តើម
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className={`hamburger${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer" onClick={() => setMenuOpen(false)}>
          <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}>
                {" "}
                {l.label}{" "}
              </Link>
            ))}
            <div className="mobile-nav-actions">
              <Link
                to="/"
                className="mobile-login"
                onClick={() => setMenuOpen(false)}
              >
                ចូល
              </Link>
              <Link
                to="/"
                className="btn-start"
                onClick={() => setMenuOpen(false)}
              >
                ចាប់ផ្តើម
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
