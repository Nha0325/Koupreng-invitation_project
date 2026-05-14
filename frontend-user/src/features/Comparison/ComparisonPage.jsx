import { useState } from "react";
import "./ComparisonPage.css";

const templates = [
    { 
        id: 1, 
        name: "គំរូក្រុមគ្រួសារ", 
        price: "$50", 
        rating: 4.8, 
        reviews: 234,
        features: ["កាតអញ្ជើញ", "RSVP", "រូបថត", "វីដេអូ", "ផែនទី"],
        color: "#667eea",
        image: "🎨"
    },
    { 
        id: 2, 
        name: "គំរូមេឃខៀវ", 
        price: "$75", 
        rating: 4.9, 
        reviews: 189,
        features: ["កាតអញ្ជើញ", "RSVP", "រូបថត", "វីដេអូ", "ផែនទី", "ការបង់ប្រាក់"],
        color: "#3b82f6",
        image: "🌊"
    },
    { 
        id: 3, 
        name: "គំរូផ្កាក្រហម", 
        price: "$60", 
        rating: 4.7, 
        reviews: 156,
        features: ["កាតអញ្ជើញ", "RSVP", "រូបថត", "ផែនទី"],
        color: "#ef4444",
        image: "🌸"
    },
    { 
        id: 4, 
        name: "គំរូមាសស្រស់", 
        price: "$45", 
        rating: 4.6, 
        reviews: 98,
        features: ["កាតអញ្ជើញ", "RSVP", "រូបថត"],
        color: "#10b981",
        image: "🍃"
    },
    { 
        id: 5, 
        name: "គំរូមង្គលការ", 
        price: "$90", 
        rating: 5.0, 
        reviews: 312,
        features: ["កាតអញ្ជើញ", "RSVP", "រូបថត", "វីដេអូ", "ផែនទី", "ការបង់ប្រាក់", "អនុសាសន៍"],
        color: "#f59e0b",
        image: "✨"
    },
    { 
        id: 6, 
        name: "គំរូសាមញ្ញ", 
        price: "$30", 
        rating: 4.5, 
        reviews: 67,
        features: ["កាតអញ្ជើញ", "RSVP"],
        color: "#64748b",
        image: "📄"
    },
];

const ComparisonPage = () => {
    const [selected, setSelected] = useState([]);
    const [sortBy, setSortBy] = useState("rating");

    const toggleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else if (selected.length < 3) {
            setSelected([...selected, id]);
        }
    };

    const sortedTemplates = [...templates].sort((a, b) => {
        if (sortBy === "price") return a.price.replace('$', '') - b.price.replace('$', '');
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return 0;
    });

    const selectedTemplates = templates.filter(t => selected.includes(t.id));

    return (
        <div className="cp-page">
            {/* Header */}
            <div className="cp-header">
                <div>
                    <h1 className="cp-title">គម្រូធៀប</h1>
                    <p className="cp-subtitle">ប្រៀបធៀបគំរូអញ្ជើញរៀបការ</p>
                </div>
                <div className="cp-sort">
                    <span className="cp-sort-label">តម្រៀបតាម:</span>
                    <select 
                        className="cp-sort-select" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="rating">ការវាយតម្លៃ</option>
                        <option value="price">តម្លៃ</option>
                        <option value="reviews">មតិយោបល់</option>
                    </select>
                </div>
            </div>

            {/* Selection info */}
            {selected.length > 0 && (
                <div className="cp-selection-info">
                    <span>បានជ្រើសរើស {selected.length}/3 គំរូ</span>
                    <button 
                        className="cp-clear-btn"
                        onClick={() => setSelected([])}
                    >
                        សម្អាតជ្រើសរើស
                    </button>
                </div>
            )}

            {/* Comparison Table */}
            {selected.length >= 2 && (
                <div className="cp-comparison-table">
                    <h2 className="cp-comparison-title">តារាងប្រៀបធៀប</h2>
                    <table className="cp-table">
                        <thead>
                            <tr>
                                <th className="cp-feature-col">លក្ខណៈពិសេស</th>
                                {selectedTemplates.map(t => (
                                    <th key={t.id} className="cp-template-col">
                                        <div className="cp-template-header">
                                            <span className="cp-template-icon">{t.image}</span>
                                            <span className="cp-template-name">{t.name}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="cp-feature-label">តម្លៃ</td>
                                {selectedTemplates.map(t => (
                                    <td key={t.id} className="cp-value">{t.price}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="cp-feature-label">ការវាយតម្លៃ</td>
                                {selectedTemplates.map(t => (
                                    <td key={t.id} className="cp-value cp-rating">
                                        ⭐ {t.rating}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="cp-feature-label">មតិយោបល់</td>
                                {selectedTemplates.map(t => (
                                    <td key={t.id} className="cp-value">{t.reviews}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="cp-feature-label">លក្ខណៈពិសេស</td>
                                {selectedTemplates.map(t => (
                                    <td key={t.id} className="cp-value">
                                        <div className="cp-features-list">
                                            {t.features.map(f => (
                                                <span key={f} className="cp-feature-tag">{f}</span>
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Template Grid */}
            <div className="cp-grid">
                {sortedTemplates.map((template) => (
                    <div 
                        key={template.id} 
                        className={`cp-card ${selected.includes(template.id) ? 'selected' : ''}`}
                        onClick={() => toggleSelect(template.id)}
                    >
                        <div className="cp-card-header" style={{ background: template.color }}>
                            <span className="cp-card-icon">{template.image}</span>
                            <div className="cp-select-indicator">
                                {selected.includes(template.id) && (
                                    <span className="cp-check">✓</span>
                                )}
                            </div>
                        </div>
                        <div className="cp-card-body">
                            <h3 className="cp-card-name">{template.name}</h3>
                            <div className="cp-card-price">{template.price}</div>
                            <div className="cp-card-rating">
                                <span className="cp-stars">⭐</span>
                                <span>{template.rating}</span>
                                <span className="cp-reviews">({template.reviews} មតិ)</span>
                            </div>
                            <div className="cp-features">
                                {template.features.map(f => (
                                    <span key={f} className="cp-feature-badge">{f}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selected.length === 0 && (
                <div className="cp-hint">
                    <p>ជ្រើសរើស ២-៣ គំរូដើម្បីប្រៀបធៀប</p>
                </div>
            )}
        </div>
    );
};

export default ComparisonPage;
