import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSaveOutline, IoWarningOutline, IoImageOutline, IoMusicalNotesOutline, IoColorPaletteOutline } from "react-icons/io5";

import { useWeddingStore } from "../../../stores/useWeddingStore";
import { getActiveEventId } from "../../services/hostPlanningStorage";
import { FACEBOOK_TEMPLATE_CARDS, TEMPLATE_CATEGORIES } from "../../../features/templates/data/templatesData";
import { MUSIC_TRACKS } from "../../../shared/data/musicTracks";
import PhonePreview from "../../../features/wedding-builder/components/PhonePreview";

import "./TemplateEditorPage.css";

export default function TemplateEditorPage() {
    const navigate = useNavigate();
    const activeEventId = getActiveEventId();
    const { draft, loadDraft, update, publishDraft } = useWeddingStore();
    const [saving, setSaving] = useState(false);
    
    // We keep local state for the form so we don't spam the store/localstorage on every keystroke
    const [form, setForm] = useState({
        templateId: "garden-royal-khmer-wedding",
        musicId: "",
        primaryColor: "#f9af59",
        textColor: "#B08E4F",
        mainCoverImage: "",
        backgroundImage: ""
    });

    const coverInputRef = useRef(null);
    const bgInputRef = useRef(null);

    useEffect(() => {
        if (!activeEventId) {
            navigate("/events", { replace: true });
            return;
        }

        if (!draft || draft.id !== activeEventId) {
            loadDraft(activeEventId);
        }
    }, [activeEventId, draft, loadDraft, navigate]);

    useEffect(() => {
        if (draft) {
            setForm({
                templateId: draft.templateId || "garden-royal-khmer-wedding",
                musicId: draft.extras?.musicId || draft.music?.id || "",
                primaryColor: draft.extras?.primaryColor || "#f9af59",
                textColor: draft.extras?.textColor || "#B08E4F",
                mainCoverImage: draft.extras?.mainCoverImage || "",
                backgroundImage: draft.extras?.backgroundImage || ""
            });
        }
    }, [draft]);

    const handleSave = async () => {
        setSaving(true);
        // Save to store
        update({
            templateId: form.templateId,
            extras: {
                ...draft.extras,
                musicId: form.musicId,
                primaryColor: form.primaryColor,
                textColor: form.textColor,
                mainCoverImage: form.mainCoverImage,
                backgroundImage: form.backgroundImage
            }
        });
        
        // Also call publish to update the publishedAt date and slug if needed
        publishDraft();
        
        setTimeout(() => {
            setSaving(false);
        }, 500);
    };

    const handleImageUpload = (field, e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (form[field] && form[field].startsWith("blob:")) {
                URL.revokeObjectURL(form[field]);
            }
            const url = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, [field]: url }));
        }
    };

    useEffect(() => {
        return () => {
            if (form.mainCoverImage && form.mainCoverImage.startsWith("blob:")) {
                URL.revokeObjectURL(form.mainCoverImage);
            }
            if (form.backgroundImage && form.backgroundImage.startsWith("blob:")) {
                URL.revokeObjectURL(form.backgroundImage);
            }
        };
    }, [form.mainCoverImage, form.backgroundImage]);

    if (!draft) {
        return <div style={{ padding: 40, textAlign: "center", color: "#7d6443" }}>កំពុងផ្ទុក...</div>;
    }

    const selectedMusic = MUSIC_TRACKS.find(m => m.id === form.musicId) || MUSIC_TRACKS[0];
    const selectedTemplate = FACEBOOK_TEMPLATE_CARDS.find(t => t.id === form.templateId) || FACEBOOK_TEMPLATE_CARDS[0];

    return (
        <div className="te-page">
            <div className="te-content">
                {/* Left Sidebar: Editor */}
                <aside className="te-sidebar">
                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 18, color: "#333", margin: "0 0 4px 0", fontWeight: 800 }}>Editor</h2>
                        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>កែប្រែគំរូសន្លឹកការរបស់អ្នក</p>
                    </div>

                    {/* Section: Template */}
                    <div className="te-section">
                        <div className="te-section-title">
                            <span className="dot" style={{ background: "#3b82f6" }}></span>
                            Template
                        </div>
                        <div className="te-field">
                            <label>ជ្រើសរើសគំរូ / Choose Template</label>
                            <select 
                                value={form.templateId} 
                                onChange={(e) => setForm({ ...form, templateId: e.target.value })}
                            >
                                {FACEBOOK_TEMPLATE_CARDS.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.style})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Section: Music */}
                    <div className="te-section">
                        <div className="te-section-title">
                            <span className="dot" style={{ background: "#8b5cf6" }}></span>
                            Music
                        </div>
                        <div className="te-field">
                            <label>តន្ត្រី / Music</label>
                            <select 
                                value={form.musicId} 
                                onChange={(e) => setForm({ ...form, musicId: e.target.value })}
                            >
                                <option value="">គ្មានតន្ត្រី (No Music)</option>
                                {MUSIC_TRACKS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            
                            {selectedMusic && selectedMusic.url && (
                                <audio 
                                    controls 
                                    className="te-audio-player" 
                                    src={selectedMusic.url}
                                    controlsList="nodownload"
                                />
                            )}
                        </div>
                    </div>

                    {/* Section: Design */}
                    <div className="te-section">
                        <div className="te-section-title">
                            <span className="dot" style={{ background: "#f59e0b" }}></span>
                            Design
                        </div>
                        
                        <div className="te-field">
                            <label>ពណ៌ចម្បង / Primary Color</label>
                            <div className="te-color-picker">
                                <input 
                                    type="color" 
                                    value={form.primaryColor} 
                                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} 
                                />
                                <input 
                                    type="text" 
                                    value={form.primaryColor} 
                                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="te-field">
                            <label>ពណ៌អក្សរ / Text Color</label>
                            <div className="te-color-picker">
                                <input 
                                    type="color" 
                                    value={form.textColor} 
                                    onChange={(e) => setForm({ ...form, textColor: e.target.value })} 
                                />
                                <input 
                                    type="text" 
                                    value={form.textColor} 
                                    onChange={(e) => setForm({ ...form, textColor: e.target.value })} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Images */}
                    <div className="te-section">
                        <div className="te-section-title">
                            <span className="dot" style={{ background: "#10b981" }}></span>
                            Images
                        </div>
                        
                        <div className="te-field">
                            <label>រូបភាពគម្រប / Main Cover Image</label>
                            {form.mainCoverImage && <img src={form.mainCoverImage} className="te-image-preview" alt="Cover" />}
                            <div className="te-image-upload" onClick={() => coverInputRef.current?.click()}>
                                <span>ចុចដើម្បីជ្រើសរើសរូបភាព (Click to upload)</span>
                            </div>
                            <input 
                                type="file" 
                                hidden 
                                ref={coverInputRef} 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload("mainCoverImage", e)} 
                            />
                        </div>

                        <div className="te-field">
                            <label>ផ្ទៃខាងក្រោយ / Background Image</label>
                            {form.backgroundImage && <img src={form.backgroundImage} className="te-image-preview" alt="Background" />}
                            <div className="te-image-upload" onClick={() => bgInputRef.current?.click()}>
                                <span>ចុចដើម្បីជ្រើសរើសរូបភាព (Click to upload)</span>
                            </div>
                            <input 
                                type="file" 
                                hidden 
                                ref={bgInputRef} 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload("backgroundImage", e)} 
                            />
                        </div>
                    </div>

                </aside>

                {/* Right Panel: Preview */}
                <main className="te-preview-container">
                    <header className="te-preview-header">
                        <h2>Preview Template</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <span style={{ fontSize: 13, color: "#666" }}>
                                គំរូដែលកំពុងកែប្រែ: <strong style={{ color: "#333" }}>{selectedTemplate?.name}</strong>
                            </span>
                            <button 
                                className="te-save-btn" 
                                onClick={handleSave} 
                                disabled={saving}
                            >
                                <IoSaveOutline size={18} />
                                {saving ? "កំពុងរក្សាទុក..." : "Save"}
                            </button>
                        </div>
                    </header>
                    <div className="te-preview-wrapper">
                        {/* 
                            We pass the updated draft by merging the current form state 
                            so the preview updates in real time before saving!
                        */}
                        <PhonePreview 
                            draft={{
                                ...draft, 
                                templateId: form.templateId,
                                extras: {
                                    ...draft.extras,
                                    musicId: form.musicId,
                                    primaryColor: form.primaryColor,
                                    textColor: form.textColor,
                                    mainCoverImage: form.mainCoverImage,
                                    backgroundImage: form.backgroundImage
                                }
                            }} 
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
