import React, { useState } from "react";
import "./TemplatesPage.css";

const templates = [
    {
        id: 1,
        name: "រាជមង្គលអង្គរ (W01)",
        style: "Traditional Gold",
        color: "#B0926A",
        image: "/image/a1.png",
        popular: true
    },
    {
        id: 2,
        name: "បុប្ផាភ្នំពេញ (W02)",
        style: "Modern Khmer",
        color: "#7C3AED",
        image: "/image/a2.png",
        popular: true
    },
    {
        id: 3,
        name: "និស្ស័យមង្គល (W03)",
        style: "Luxury Wedding",
        color: "#16a34a",
        image: "/image/a7.png",
        popular: false
    },
    {
        id: 4,
        name: "មង្គលជ័យ (W04)",
        style: "Classic Style",
        color: "#dc2626",
        image: "/image/a4.png",
        popular: false
    },
    {
        id: 5,
        name: "ទេវីសួគ៌ា (W05)",
        style: "Royal Khmer",
        color: "#1e69dc",
        image: "/image/a5.png",
        popular: false
    },
    {
        id: 6,
        name: "សិរីមង្គល (W06)",
        style: "Vintage Gold",
        color: "#525252",
        image: "/image/a6.png",
        popular: false
    },
];

function TemplatesGallery() {
    return (
        <div className="tp-page">

            <div className="tp-container">
                <header className="tp-header-section">
                    <span className="tp-label">Koupreng Premium Templates</span>
                    <h1 className="tp-title">ជ្រើសរើស<span>គ្រោងសន្លឹកការណ៍</span></h1>
                    <div className="tp-divider">
                        <div className="tp-line"></div>
                        <div className="tp-diamond"></div>
                        <div className="tp-line"></div>
                    </div>
                </header>

                <div className="tp-grid">
                    {templates.map((t) => (
                        <div key={t.id} className="tp-card">
                            {t.popular && <div className="tp-popular-tag">✨ ពេញនិយម</div>}

                            <div className="tp-image-box">
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="tp-main-img"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x550?text=Koupreng+Wedding"; }}
                                />
                                <div className="tp-overlay">
                                    <button className="tp-view-btn">មើលលម្អិត</button>
                                </div>
                            </div>

                            <div className="tp-card-content">
                                <h3 className="tp-card-name">{t.name}</h3>
                                <span className="tp-style-name">{t.style}</span>
                                <button className="tp-action-btn">ប្រើប្រាស់គំរូនេះ</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="tp-footer">
                <p className="tp-footer-brand">គូព្រេង</p>
                <p className="tp-footer-text">© 2026 KOUPRENG WEDDING PLANNER PRO</p>
            </footer>
        </div>
    );
}

export default TemplatesGallery;