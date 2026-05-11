import React from "react";

export default function Header() {
  return (
    <header
      className="app-header"
      style={{ background: "#6b6bc4", padding: "18px 24px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>Koupreng</div>
        <nav style={{ display: "flex", gap: "18px", fontSize: "0.95rem" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </a>
          <a href="/events" style={{ color: "white", textDecoration: "none" }}>
            Events
          </a>
          <a
            href="/dashboard"
            style={{ color: "white", textDecoration: "none" }}
          >
            Dashboard
          </a>
        </nav>
      </div>
    </header>
  );
}
