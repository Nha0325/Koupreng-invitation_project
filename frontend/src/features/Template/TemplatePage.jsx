import "./TemplatePage.css";

const templates = [
    { id: 1, name: "ប្រពៃណីខ្មែរ", style: "ប្រពៃណី", color: "#c8a96e", preview: "💒", popular: true },
    { id: 2, name: "ទំនើបអន្តរជាតិ", style: "ទំនើប", color: "#7033ff", preview: "💍", popular: true },
    { id: 3, name: "ធម្មជាតិ & ផ្កា", style: "ធម្មជាតិ", color: "#16a34a", preview: "🌸", popular: false },
    { id: 4, name: "អ៊ីឡេហ្គង់ & ស", style: "ប្រណីត", color: "#1e69dc", preview: "✨", popular: false },
    { id: 5, name: "មិនីម៉ាលីស", style: "ទំនើប", color: "#525252", preview: "🤍", popular: false },
    { id: 6, name: "ប្រពៃណីចិន", style: "ប្រពៃណី", color: "#dc2626", preview: "🏮", popular: false },
];

function TemplatePage() {
    return (
        <div className="tp-page">
            <div className="tp-header">
                <div>
                    <h1 className="tp-title">គម្រូការ៉ូ</h1>
                    <p className="tp-subtitle">ជ្រើសរើសគម្រូសម្រាប់ការអញ្ជើញរបស់អ្នក</p>
                </div>
            </div>

            <div className="tp-grid">
                {templates.map((t) => (
                    <div key={t.id} className="tp-card">
                        {t.popular && <span className="tp-popular-badge">⭐ ពេញនិយម</span>}
                        <div className="tp-preview" style={{ background: `${t.color}18` }}>
                            <span className="tp-preview-icon">{t.preview}</span>
                        </div>
                        <div className="tp-card-body">
                            <h3 className="tp-card-name">{t.name}</h3>
                            <span className="tp-style-badge" style={{ background: `${t.color}18`, color: t.color }}>
                                {t.style}
                            </span>
                            <div className="tp-card-actions">
                                <button className="tp-preview-btn">មើលគំរូ</button>
                                <button className="tp-use-btn" style={{ background: t.color }}>ប្រើ</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TemplatePage;
