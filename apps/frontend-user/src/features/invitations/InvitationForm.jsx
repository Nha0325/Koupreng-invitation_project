import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    Music,
    Sparkles,
    Heart,
    Mail,
    Calendar,
    Clock,
    MapPin,
    Images,
    Image as ImageIcon,
    Gift,
    QrCode,
    Globe,
    UploadCloud,
    Trash2,
    Plus,
    Play,
    Pause,
    Maximize2,
    FileText,
    User,
    PenSquare,
    Map,
    CheckCircle2,
} from "lucide-react";


import { toast } from "../../shared/ui/toast";
import { invitationService } from "@/features/invitations/api/invitationApi";
import { getTemplateById } from "../templates/data/templatesData";
import { MUSIC_TRACKS } from "../../shared/data/musicTracks";
import { useBackendMessages } from "@/shared/i18n/useBackendMessages";
import LivePhoneSimulator from "./LivePhoneSimulator";
import { DatePicker } from "../../shared/ui/DatePicker";
import { TimePicker } from "../../shared/ui/TimePicker";
import "./InvitationPlanEssentialEditor.css";

function CleanImageUploadField({ label, icon: Icon, image, onUpload, onRemove, inputRef, hint = "PNG, JPG, WebP (ក្រោម 10MB)" }) {
    return (
        <div className="pe-form-group">
            <label className="pe-label">
                {Icon && <span className="pe-label-icon"><Icon size={16} /></span>}
                {label}
            </label>
            <div className="pe-clean-upload-card">
                {image ? (
                    <>
                        <div className="pe-clean-preview-box">
                            <img src={image} alt={label} />
                        </div>
                        <div className="pe-clean-actions-bar">
                            <button
                                type="button"
                                className="pe-btn-upload-action"
                                onClick={() => inputRef.current?.click()}
                            >
                                <UploadCloud size={14} /> ប្តូររូបភាព
                            </button>
                            <button
                                type="button"
                                className="pe-btn-delete-action"
                                onClick={onRemove}
                            >
                                <Trash2 size={14} /> លុប
                            </button>
                        </div>
                    </>
                ) : (
                    <div
                        className="pe-clean-dropzone"
                        onClick={() => inputRef.current?.click()}
                    >
                        <UploadCloud className="pe-clean-dropzone-icon" size={28} />
                        <span className="pe-clean-dropzone-title">ចុចទីនេះដើម្បីបញ្ចូលរូបភាព</span>
                        <span className="pe-clean-dropzone-hint">{hint}</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={onUpload}
                />
            </div>
        </div>
    );
}

function CleanGalleryItem({ idx, photo, onUpload, onRemove, inputRef }) {
    return (
        <div className="pe-gallery-item-card">
            <div className="pe-gallery-item-badge">
                <ImageIcon size={14} /> រូបភាពទី {idx + 1}
            </div>
            {photo?.url ? (
                <>
                    <div className="pe-gallery-thumb-box">
                        <img src={photo.url} alt={`Gallery ${idx + 1}`} />
                    </div>
                    <div className="pe-clean-actions-bar">
                        <button
                            type="button"
                            className="pe-btn-upload-action"
                            style={{ padding: "5px 8px", fontSize: "0.78rem" }}
                            onClick={() => inputRef.current?.click()}
                        >
                            <UploadCloud size={13} /> ប្តូរ
                        </button>
                        <button
                            type="button"
                            className="pe-btn-delete-action"
                            style={{ padding: "5px 8px", fontSize: "0.78rem" }}
                            onClick={onRemove}
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </>
            ) : (
                <div
                    className="pe-clean-dropzone"
                    style={{ padding: "16px 8px", minHeight: "120px" }}
                    onClick={() => inputRef.current?.click()}
                >
                    <UploadCloud size={24} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>ដាក់រូបទី {idx + 1}</span>
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onUpload}
            />
        </div>
    );
}

const DEFAULT_INVITATION_TEXT = `សម្តេច ទ្រង់ ឯកឧត្តម លោកជំទាវ លោកអ្នកឧកញ៉ា 
អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញា 
ព្រមទាំងប្រិយមិត្តអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធិពរជ័យសិរីសួស្តី ជ័យមង្គល ក្នុងពិធីអាពាហ៍ពិពាហ៍
កូនប្រុសស្រី របស់យើងខ្ញុំទាំងពីរ។`;

const DEFAULT_THANK_YOU_TEXT = `យើងខ្ញុំទាំងពីរ សូមថ្លែងអំណរគុណ យ៉ាងជ្រាលជ្រៅ ចំពោះវត្តមាន ដ៏ឧត្តុង្គឧត្តមរបស់ សម្តេច ឯកឧត្តម លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា ដែលបាន អញ្ជើញចូលរួមជាកិត្តិយស ក្នុងពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍ របស់យើងខ្ញុំ នាពេលខាងមុខនេះ។ យើងខ្ញុំសូមការខន្តីអភ័យទោស ដែលពុំបានជូនលិខិតអញ្ជើញ ដោយផ្ទាល់ ។ ដោយការវកិច្ចដ៏ខ្ពង់ខ្ពស់ពីយើងខ្ញុំ។`;

function toStandardTime(val) {
    if (!val || typeof val !== "string") return "17:00";
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    let standard = val;
    khmerDigits.forEach((kd, idx) => {
        standard = standard.replaceAll(kd, String(idx));
    });
    const match = standard.match(/(\d{1,2}):(\d{2})/);
    if (match) {
        const hh = match[1].padStart(2, "0");
        const mm = match[2];
        return `${hh}:${mm}`;
    }
    return "17:00";
}

function toStandardDate(val) {
    if (!val || typeof val !== "string") return "2026-01-28";
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    let standard = val;
    khmerDigits.forEach((kd, idx) => {
        standard = standard.replaceAll(kd, String(idx));
    });
    const match = standard.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) return match[0];
    return "2026-01-28";
}

const DEFAULT_STATE = {
    templateId: "garden-royal-khmer-wedding",
    language: "KH",
    title: "សួនរាជហង្សខ្មែរ",
    subtitle: "សូមគោរពអញ្ជើញ",
    hideCoupleNameOnCover: false,
    eventDateText: "ថ្ងៃពុធ ២៨ មករា ២០២៦",
    eventDate: "2026-01-28",
    eventTime: "17:00",
    venueName: "The Premier Center Sen Sok",
    venueAddress: "អគារ A, សែនសុខ, ភ្នំពេញ",
    googleMapUrl: "",
    hostName: "វណ្ណដា",
    partnerName: "ស្រីពេជ្រ",
    groomName: "វណ្ណដា",
    brideName: "ស្រីពេជ្រ",
    guestName: "ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា",
    messageTitle: "ដំណឹងអាពាហ៍ពិពាហ៍",
    messageText: DEFAULT_INVITATION_TEXT,
    schedule: [],
    // Styling
    frontColor: "#f9af59",
    bottomColor: "#B08E4F",
    coverImage: "/facebook/all/03-card/cover-card.jpg",
    backgroundImage: "/facebook/all/03-card/cover-card.jpg",
    sketchMapImage: null,
    // Gallery
    photos: [
        { id: "p1", url: "/facebook/all/03-card/03-01.jpg" },
        { id: "p2", url: "/facebook/all/03-card/03-02.jpg" },
        { id: "p3", url: "/facebook/all/03-card/03-03.jpg" },
        { id: "p4", url: "/facebook/all/03-card/03-04.jpg" },
    ],
    // Thank you
    thankYouTitle: "សារថ្លែងអំណរគុណ",
    thankYouText: DEFAULT_THANK_YOU_TEXT,
    // KHQR
    khqrDollar: { qrUrl: "", bankName: "KHQR Dollar ($)", accountNumber: "" },
    khqrRiel: { qrUrl: "", bankName: "KHQR Riel (៛)", accountNumber: "" },
    // Music
    musicTrackId: "waiting-day",
    musicUrl: MUSIC_TRACKS[0]?.url || "",
    // Extra
    languageMode: "KH",
    visibility: "PUBLIC",
};

export default function InvitationForm({ invitation }) {
    const { text: t } = useBackendMessages("invitations");
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const invitationId = invitation?.id || params.id;
    const isEdit = Boolean(invitationId);

    // Initial state parser
    const [form, setForm] = useState(() => {
        let customParsed = {};
        if (invitation) {
            try {
                if (invitation.designJson) {
                    const parsed = typeof invitation.designJson === "string" ? JSON.parse(invitation.designJson) : invitation.designJson;
                    customParsed = { ...customParsed, ...parsed };
                }
                if (invitation.contentJson) {
                    const parsed = typeof invitation.contentJson === "string" ? JSON.parse(invitation.contentJson) : invitation.contentJson;
                    customParsed = { ...customParsed, ...parsed };
                }
            } catch {
                // ignore JSON error
            }
        }

        const activeTplId = invitation?.templateId || customParsed.templateId || searchParams.get("templateId") || DEFAULT_STATE.templateId;
        const tpl = getTemplateById(activeTplId);

        const rawDate = invitation?.eventDate || customParsed.eventDate || DEFAULT_STATE.eventDate;
        const rawTime = invitation?.eventTime ? invitation.eventTime.slice(0, 5) : (customParsed.eventTime || tpl?.receptionTime || DEFAULT_STATE.eventTime);

        return {
            ...DEFAULT_STATE,
            templateId: activeTplId,
            title: invitation?.title || customParsed.title || tpl?.name || DEFAULT_STATE.title,
            groomName: invitation?.groomName || customParsed.groomName || tpl?.groom || DEFAULT_STATE.groomName,
            brideName: invitation?.brideName || customParsed.brideName || tpl?.bride || DEFAULT_STATE.brideName,
            hostName: invitation?.hostName || customParsed.hostName || tpl?.groom || DEFAULT_STATE.groomName,
            partnerName: invitation?.partnerName || customParsed.partnerName || tpl?.bride || DEFAULT_STATE.brideName,
            eventDate: toStandardDate(rawDate),
            eventDateText: customParsed.eventDateText || tpl?.dateText || DEFAULT_STATE.eventDateText,
            eventTime: toStandardTime(rawTime),
            venueName: invitation?.venueName || customParsed.venueName || tpl?.venueName || DEFAULT_STATE.venueName,
            venueAddress: invitation?.venueAddress || customParsed.venueAddress || tpl?.venueAddress || DEFAULT_STATE.venueAddress,
            googleMapUrl: invitation?.googleMapUrl || customParsed.googleMapUrl || tpl?.mapQuery || "",
            coverImage: customParsed.coverImage || tpl?.phoneCoverImage || tpl?.mainImage || DEFAULT_STATE.coverImage,
            messageText: invitation?.storyText || customParsed.messageText || tpl?.message || DEFAULT_STATE.messageText,
            schedule: (customParsed.schedule && customParsed.schedule.length > 0) ? customParsed.schedule : (tpl?.schedule || []),
            photos: (customParsed.photos && customParsed.photos.length > 0 && customParsed.photos.some(p => p.url)) ? customParsed.photos : DEFAULT_STATE.photos,
            languageMode: invitation?.languageMode || customParsed.languageMode || "KH",
            visibility: invitation?.visibility || "PUBLIC",
            ...customParsed,
        };
    });

    const [activeLangTab, setActiveLangTab] = useState("KH");
    const [isSaving, setIsSaving] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [leftPercent, setLeftPercent] = useState(52);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const audioPreviewRef = useRef(null);

    // Draggable Resizer Handler
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const offset = e.clientX - rect.left;
            const newPercent = (offset / rect.width) * 100;
            const clamped = Math.min(Math.max(newPercent, 28), 76);
            setLeftPercent(clamped);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "none";
            document.body.style.cursor = "col-resize";
        } else {
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };
    }, [isDragging]);

    // File input refs
    const coverInputRef = useRef(null);
    const bgInputRef = useRef(null);
    const sketchInputRef = useRef(null);
    const qrDollarInputRef = useRef(null);
    const qrRielInputRef = useRef(null);
    const galleryInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (e, callback) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            callback(event.target.result);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    // Schedule modifiers
    const handleScheduleChange = (index, key, value) => {
        const nextSchedule = [...(form.schedule || [])];
        nextSchedule[index] = { ...nextSchedule[index], [key]: value };
        update("schedule", nextSchedule);
    };

    const addScheduleItem = () => {
        const nextSchedule = [
            ...(form.schedule || []),
            { id: String(Date.now()), time: "06:00 ល្ងាច", title: "ពិធីថ្មី" },
        ];
        update("schedule", nextSchedule);
    };

    const removeScheduleItem = (index) => {
        const nextSchedule = (form.schedule || []).filter((_, i) => i !== index);
        update("schedule", nextSchedule);
    };

    // Gallery modifiers
    const updatePhoto = (index, url) => {
        const nextPhotos = [...form.photos];
        nextPhotos[index] = { ...nextPhotos[index], url };
        update("photos", nextPhotos);
    };

    // Music Selector
    const handleMusicSelect = (trackId) => {
        const track = MUSIC_TRACKS.find((t) => t.id === trackId) || MUSIC_TRACKS[0];
        update("musicTrackId", track.id);
        update("musicUrl", track.url);
        if (audioPreviewRef.current) {
            audioPreviewRef.current.load();
            setAudioPlaying(false);
        }
    };

    const toggleAudioPreview = () => {
        if (!audioPreviewRef.current) return;
        if (audioPlaying) {
            audioPreviewRef.current.pause();
            setAudioPlaying(false);
        } else {
            audioPreviewRef.current.play().then(() => setAudioPlaying(true)).catch(() => setAudioPlaying(false));
        }
    };

    // Save action
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const designPayload = {
                frontColor: form.frontColor,
                bottomColor: form.bottomColor,
                coverImage: form.coverImage,
                backgroundImage: form.backgroundImage,
                sketchMapImage: form.sketchMapImage,
                photos: form.photos,
                khqrDollar: form.khqrDollar,
                khqrRiel: form.khqrRiel,
                musicTrackId: form.musicTrackId,
                musicUrl: form.musicUrl,
            };

            const contentPayload = {
                subtitle: form.subtitle,
                hideCoupleNameOnCover: form.hideCoupleNameOnCover,
                eventDateText: form.eventDateText,
                guestName: form.guestName,
                messageTitle: form.messageTitle,
                messageText: form.messageText,
                schedule: form.schedule,
                thankYouTitle: form.thankYouTitle,
                thankYouText: form.thankYouText,
            };

            const payload = {
                title: form.title || "សិរីមង្គលអាពាហ៍ពិពាហ៍",
                eventType: "WEDDING",
                eventDate: form.eventDate || null,
                eventTime: form.eventTime || null,
                venueName: form.venueName || "",
                venueAddress: form.venueAddress || "",
                googleMapUrl: form.googleMapUrl || "",
                hostName: form.hostName || "",
                partnerName: form.partnerName || "",
                groomName: form.groomName || "",
                brideName: form.brideName || "",
                storyText: form.messageText || "",
                languageMode: form.languageMode || "KH",
                visibility: form.visibility || "PUBLIC",
                templateId: Number(form.templateId) || null,
                designJson: JSON.stringify(designPayload),
                contentJson: JSON.stringify(contentPayload),
                customColors: JSON.stringify({ front: form.frontColor, bottom: form.bottomColor }),
            };

            let saved;
            if (isEdit) {
                saved = await invitationService.update(invitationId, payload);
            } else {
                saved = await invitationService.create(payload);
            }

            toast(t("savedSuccess") || "បានរក្សាទុកគំរូធៀបដោយជោគជ័យ! (Saved successfully)");

            if (!isEdit && saved?.id) {
                navigate(`/dashboard/invitations/${saved.id}/edit`, { replace: true });
            }
        } catch (err) {
            toast(err.message || (t("savedError") || "មិនអាចរក្សាទុកបានទេ (Save error)"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="pe-editor-root">

            {/* Sub-Header Banner */}
            <div className="pe-sub-header-banner">
                <div className="pe-sub-header-left">
                    <span className="pe-sub-header-label">{t("myTemplate") || "គំរូរបស់ខ្ញុំ:"}</span>
                    <span className="pe-template-tag">
                        {getTemplateById(form.templateId)?.name || form.title || "គម្រោងអាពាហ៍ពិពាហ៍ (រចនាប័ទ្ម) W01"}
                    </span>
                    <span className="pe-status-badge">
                        <CheckCircle2 size={14} /> {t("activeBadge") || "កំពុងប្រើ"}
                    </span>
                </div>
                <div className="pe-sub-header-actions">
                    <button
                        type="button"
                        className="pe-btn-outline"
                        onClick={() => navigate("/dashboard")}
                    >
                        {t("backBtn") || "ត្រឡប់ក្រោយ"}
                    </button>
                </div>
            </div>

            {/* Split-Screen Main Workspace */}
            <div
                ref={containerRef}
                className={`pe-workspace-grid ${isDragging ? "is-resizing" : ""}`}
                style={{
                    gridTemplateColumns: isExpanded
                        ? "1fr"
                        : `${leftPercent}% 24px 1fr`,
                }}
            >
                {/* LEFT COLUMN: Customizer Form */}
                <div className="pe-editor-column">
                    {/* Dark Navy Header Bar */}
                    <div className="pe-editor-header-bar">
                        <h3 className="pe-editor-header-title">
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                <PenSquare size={18} style={{ color: "#d97706" }} />
                                {t("editorTitle") || "កម្មវិធីកែសម្រួល"}
                            </span>
                        </h3>
                        <button
                            type="button"
                            className="pe-editor-header-icon-btn"
                            onClick={() => setIsExpanded((prev) => !prev)}
                            title={isExpanded ? "Normal View" : "Fullscreen View"}
                        >
                            <Maximize2 size={16} />
                        </button>
                    </div>

                    {/* Neutral Language Sub-Banner */}
                    <div className="pe-lang-sub-banner">
                        <div className="pe-lang-switch-pills">
                            <button
                                type="button"
                                className={`pe-lang-pill-btn ${activeLangTab === "KH" ? "is-active" : ""}`}
                                onClick={() => setActiveLangTab("KH")}
                            >
                                <Globe size={13} /> {t("langKh") || "ភាសាខ្មែរ"}
                            </button>
                            <button
                                type="button"
                                className={`pe-lang-pill-btn ${activeLangTab === "EN" ? "is-active" : ""}`}
                                onClick={() => setActiveLangTab("EN")}
                            >
                                <Globe size={13} /> {t("langEn") || "អង់គ្លេស"}
                            </button>
                        </div>
                        <span className="pe-lang-editing-indicator">
                            {activeLangTab === "KH" ? (t("editingKh") || "កំពុងកែសម្រួល៖ ភាសាខ្មែរ") : (t("editingEn") || "កំពុងកែសម្រួល៖ អង់គ្លេស")}
                        </span>
                    </div>

                    <div className="pe-editor-scroll-body">
                        {/* 1. Music Section */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <Music size={17} />
                                </span>
                                <span>{t("secMusic") || "តន្ត្រី និងបទភ្លេង"}</span>
                            </h4>
                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><Music size={15} /></span>
                                    {t("labelMusic") || "ជ្រើសរើសបទភ្លេង / Music Track"}
                                </label>
                                <select
                                    className="pe-select"
                                    value={form.musicTrackId}
                                    onChange={(e) => handleMusicSelect(e.target.value)}
                                >
                                    <option value="waiting-day">Music 1 (ថ្ងៃដែលរង់ចាំ)</option>
                                    <option value="instrumental-wedding">Music 2 (Instrumental Wedding Music)</option>
                                    <option value="none">{t("noMusic") || "មិនប្រើតន្ត្រី (No Music)"}</option>
                                </select>
                            </div>

                            {/* Audio Player Widget */}
                            {form.musicUrl && (
                                <div className="pe-audio-clean-box">
                                    <audio
                                        ref={audioPreviewRef}
                                        src={form.musicUrl}
                                        onPlay={() => setAudioPlaying(true)}
                                        onPause={() => setAudioPlaying(false)}
                                    />
                                    <button
                                        type="button"
                                        className="pe-audio-play-btn"
                                        onClick={toggleAudioPreview}
                                        title={audioPlaying ? "Pause" : "Play"}
                                    >
                                        {audioPlaying ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                    <div style={{ flex: 1 }}>
                                        <div className="pe-audio-title">
                                            {form.musicTrackId === "waiting-day" ? "ថ្ងៃដែលរង់ចាំ (VannDa)" : "Instrumental Wedding Music"}
                                        </div>
                                        <div className="pe-audio-time">0:00 / 4:48</div>
                                    </div>

                                    <button
                                        type="button"
                                        className="pe-btn-delete-action"
                                        onClick={() => {
                                            update("musicUrl", "");
                                            update("musicTrackId", "none");
                                        }}
                                        title="Delete Music"
                                    >
                                        <Trash2 size={13} /> លុប
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 2. Design Section */}
                        <div className="pe-section-card">
                            {/* Clean Cover Image Upload */}
                            <CleanImageUploadField
                                label={t("coverImage") || "រូបភាពក្របខាងមុខ (Front Cover Image)"}
                                icon={ImageIcon}
                                image={form.coverImage}
                                onUpload={(e) => handleFileUpload(e, (url) => update("coverImage", url))}
                                onRemove={() => update("coverImage", "")}
                                inputRef={coverInputRef}
                                hint="បង្ហាញលើក្របទំព័រដើម (Front Cover / Hero)"
                            />

                            {/* Clean Couple / Background Image Upload */}
                            <CleanImageUploadField
                                label={t("backgroundImage") || "រូបថតគូស្នេហ៍ / ខាងក្នុង (Couple & Inner Photo)"}
                                icon={ImageIcon}
                                image={form.backgroundImage}
                                onUpload={(e) => handleFileUpload(e, (url) => update("backgroundImage", url))}
                                onRemove={() => update("backgroundImage", "")}
                                inputRef={bgInputRef}
                                hint="បង្ហាញក្នុងផ្នែកកូនកំលោះ និងកូនក្រមុំ (The Bride & Groom Card)"
                            />
                        </div>

                        {/* 3. Event Titles Section */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <Sparkles size={17} />
                                </span>
                                <span>{t("secTitle") || "ព័ត៌មាន និងកាលបរិច្ឆេទកម្មវិធី"}</span>
                            </h4>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><FileText size={15} /></span>
                                    {t("mainTitle") || "ចំណងជើងធំ"}
                                </label>
                                <input
                                    type="text"
                                    className="pe-input"
                                    value={form.title}
                                    onChange={(e) => update("title", e.target.value)}
                                    placeholder="សិរីមង្គលអាពាហ៍ពិពាហ៍"
                                />
                            </div>

                            {/* Switch to hide names on top cover */}
                            <div className="pe-switch-row">
                                <span className="pe-switch-label">{t("hideCoupleCover") || "បិទឈ្មោះកូនកំលោះ/កូនក្រមុំ (ក្របខាងលើ)"}</span>
                                <label className="pe-toggle">
                                    <input
                                        type="checkbox"
                                        checked={form.hideCoupleNameOnCover}
                                        onChange={(e) => update("hideCoupleNameOnCover", e.target.checked)}
                                    />
                                    <span className="pe-toggle-slider" />
                                </label>
                            </div>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><Sparkles size={15} /></span>
                                    {t("subTitle") || "ចំណងជើងរង"}
                                </label>
                                <input
                                    type="text"
                                    className="pe-input"
                                    value={form.subtitle}
                                    onChange={(e) => update("subtitle", e.target.value)}
                                    placeholder="សូមគោរពអញ្ជើញ"
                                />
                            </div>

                            <div className="pe-grid-2">
                                <div className="pe-form-group">
                                    <label className="pe-label">
                                        <span className="pe-label-icon"><Calendar size={15} /></span>
                                        {t("dateTime") || "កាលបរិច្ឆេទ (Date Display)"}
                                    </label>
                                    <DatePicker
                                        value={form.eventDate}
                                        onChange={(val) => {
                                            update("eventDate", val);
                                            update("eventDateText", val);
                                        }}
                                        placeholder="ជ្រើសកាលបរិច្ឆេទ"
                                    />
                                </div>
                                <div className="pe-form-group">
                                    <label className="pe-label">
                                        <span className="pe-label-icon"><Clock size={15} /></span>
                                        {t("timePicker") || "ម៉ោងទទួលភ្ញៀវ (Event Time)"}
                                    </label>
                                    <TimePicker
                                        value={form.eventTime}
                                        onChange={(val) => update("eventTime", val)}
                                        placeholder="ជ្រើសម៉ោង"
                                    />
                                </div>
                            </div>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><MapPin size={15} /></span>
                                    {t("venue") || "ទីតាំងប្រារព្ធពិធី (Venue Name)"}
                                </label>
                                <input
                                    type="text"
                                    className="pe-input"
                                    value={form.venueName}
                                    onChange={(e) => update("venueName", e.target.value)}
                                    placeholder="The Premier Center Sen Sok"
                                />
                            </div>
                        </div>

                        {/* 4. Couple Names */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <Heart size={17} />
                                </span>
                                <span>{t("secCouple") || "ឈ្មោះកូនកំលោះ និង កូនក្រមុំ"}</span>
                            </h4>
                            <div className="pe-grid-2">
                                <div className="pe-form-group">
                                    <label className="pe-label">
                                        <span className="pe-label-icon"><User size={15} /></span>
                                        {t("groom") || "កូនប្រុស (Groom Name)"}
                                    </label>
                                    <input
                                        type="text"
                                        className="pe-input"
                                        value={form.groomName}
                                        onChange={(e) => update("groomName", e.target.value)}
                                        placeholder="វណ្ណដា"
                                    />
                                </div>
                                <div className="pe-form-group">
                                    <label className="pe-label">
                                        <span className="pe-label-icon"><Heart size={15} /></span>
                                        {t("bride") || "កូនស្រី (Bride Name)"}
                                    </label>
                                    <input
                                        type="text"
                                        className="pe-input"
                                        value={form.brideName}
                                        onChange={(e) => update("brideName", e.target.value)}
                                        placeholder="ស្រីពេជ្រ"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 5. Message Section */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <Mail size={17} />
                                </span>
                                <span>{t("secMessage") || "សារអញ្ជើញភ្ញៀវកិត្តិយស"}</span>
                            </h4>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><FileText size={15} /></span>
                                    {t("messageTitle") || "ចំណងជើងសារ"}
                                </label>
                                <input
                                    type="text"
                                    className="pe-input"
                                    value={form.messageTitle}
                                    onChange={(e) => update("messageTitle", e.target.value)}
                                    placeholder="ដំណឹងអាពាហ៍ពិពាហ៍"
                                />
                            </div>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><Mail size={15} /></span>
                                    {t("messageText") || "អត្ថបទសារអញ្ជើញ"}
                                </label>
                                <textarea
                                    className="pe-textarea"
                                    rows="6"
                                    value={form.messageText}
                                    onChange={(e) => update("messageText", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 6. Agenda / Schedule Section */}
                        <div className="pe-section-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <h4 className="pe-section-heading" style={{ margin: 0 }}>
                                    <span className="pe-sec-icon-badge">
                                        <Clock size={17} />
                                    </span>
                                    <span>{t("secSchedule") || "របៀបវារៈកម្មវិធី"}</span>
                                </h4>
                                <button
                                    type="button"
                                    className="pe-btn-upload-action"
                                    onClick={addScheduleItem}
                                >
                                    <Plus size={14} /> {t("addSchedule") || "បន្ថែមកម្មវិធី"}
                                </button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {form.schedule?.map((item, idx) => (
                                    <div key={item.id || idx} className="pe-grid-2" style={{ alignItems: "center", background: "#f8f6f0", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e8e2d8" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <Clock size={15} style={{ color: "#c51c35", flexShrink: 0 }} />
                                            <input
                                                type="text"
                                                className="pe-input"
                                                value={item.time}
                                                onChange={(e) => handleScheduleChange(idx, "time", e.target.value)}
                                                placeholder="07:00 ព្រឹក"
                                            />
                                        </div>
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            <input
                                                type="text"
                                                className="pe-input"
                                                value={item.title}
                                                onChange={(e) => handleScheduleChange(idx, "title", e.target.value)}
                                                placeholder="ពិធីហែជំនូន"
                                            />
                                            <button
                                                type="button"
                                                className="pe-btn-delete-action"
                                                style={{ padding: "6px 10px" }}
                                                onClick={() => removeScheduleItem(idx)}
                                                title="Delete item"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 7. Location & Sketch Map */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <MapPin size={17} />
                                </span>
                                <span>{t("secLocation") || "ទីតាំង & ផែនទី"}</span>
                            </h4>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><MapPin size={15} /></span>
                                    {t("mapsUrl") || "Google Maps Link (URL)"}
                                </label>
                                <input
                                    type="url"
                                    className="pe-input"
                                    value={form.googleMapUrl}
                                    onChange={(e) => update("googleMapUrl", e.target.value)}
                                    placeholder="https://maps.app.goo.gl/..."
                                />
                            </div>

                            <CleanImageUploadField
                                label={t("sketchMap") || "រូបគំនូសប្លង់ទីតាំង (Sketch Map)"}
                                icon={Map}
                                image={form.sketchMapImage}
                                onUpload={(e) => handleFileUpload(e, (url) => update("sketchMapImage", url))}
                                onRemove={() => update("sketchMapImage", null)}
                                inputRef={sketchInputRef}
                                hint="រូបប្លង់បង្ហាញផ្លូវទៅកាន់រោងការ (អាចទុកទំនេរបាន)"
                            />
                        </div>

                        {/* 8. Photo Gallery (4 Photos) */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <Images size={17} />
                                </span>
                                <span>{t("secGallery") || "វិចិត្រសាលរូបថត (Gallery 4 Photos)"}</span>
                            </h4>
                            <div className="pe-gallery-grid-clean">
                                {[0, 1, 2, 3].map((idx) => {
                                    const photo = form.photos[idx] || { id: `p${idx + 1}`, url: "" };
                                    return (
                                        <CleanGalleryItem
                                            key={idx}
                                            idx={idx}
                                            photo={photo}
                                            onUpload={(e) => handleFileUpload(e, (url) => updatePhoto(idx, url))}
                                            onRemove={() => updatePhoto(idx, "")}
                                            inputRef={galleryInputRefs[idx]}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* 9. Thank You Message */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <Gift size={17} />
                                </span>
                                <span>{t("secThankYou") || "សារថ្លែងអំណរគុណ"}</span>
                            </h4>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><FileText size={15} /></span>
                                    {t("thankYouTitle") || "ចំណងជើងសារអរគុណ"}
                                </label>
                                <input
                                    type="text"
                                    className="pe-input"
                                    value={form.thankYouTitle}
                                    onChange={(e) => update("thankYouTitle", e.target.value)}
                                    placeholder="សារថ្លែងអំណរគុណ"
                                />
                            </div>

                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><Gift size={15} /></span>
                                    {t("thankYouText") || "អត្ថបទសារអរគុណ"}
                                </label>
                                <textarea
                                    className="pe-textarea"
                                    rows="5"
                                    value={form.thankYouText}
                                    onChange={(e) => update("thankYouText", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 10. KHQR Section */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <QrCode size={17} />
                                </span>
                                <span>{t("secKhqr") || "KHQR ផ្ញើរចំណងដៃ"}</span>
                            </h4>

                            <div className="pe-grid-2">
                                {/* Dollar QR */}
                                <CleanImageUploadField
                                    label={t("qrDollar") || "KHQR Dollar ($)"}
                                    icon={QrCode}
                                    image={form.khqrDollar?.qrUrl}
                                    onUpload={(e) =>
                                        handleFileUpload(e, (url) =>
                                            update("khqrDollar", { ...form.khqrDollar, qrUrl: url })
                                        )
                                    }
                                    onRemove={() => update("khqrDollar", { ...form.khqrDollar, qrUrl: "" })}
                                    inputRef={qrDollarInputRef}
                                    hint="រូបភាព QR កូដប្រាក់ដុល្លារ ($)"
                                />

                                {/* Riel QR */}
                                <CleanImageUploadField
                                    label={t("qrRiel") || "KHQR Riel (៛)"}
                                    icon={QrCode}
                                    image={form.khqrRiel?.qrUrl}
                                    onUpload={(e) =>
                                        handleFileUpload(e, (url) =>
                                            update("khqrRiel", { ...form.khqrRiel, qrUrl: url })
                                        )
                                    }
                                    onRemove={() => update("khqrRiel", { ...form.khqrRiel, qrUrl: "" })}
                                    inputRef={qrRielInputRef}
                                    hint="រូបភាព QR កូដប្រាក់រៀល (៛)"
                                />
                            </div>
                        </div>

                        {/* 11. Language */}
                        <div className="pe-section-card">
                            <h4 className="pe-section-heading">
                                <span className="pe-sec-icon-badge">
                                    <Globe size={17} />
                                </span>
                                <span>{t("secLangMode") || "ភាសាធៀបការ"}</span>
                            </h4>
                            <div className="pe-form-group">
                                <label className="pe-label">
                                    <span className="pe-label-icon"><Globe size={15} /></span>
                                    ភាសាបង្ហាញក្នុងសំបុត្រ
                                </label>
                                <select
                                    className="pe-select"
                                    value={form.languageMode}
                                    onChange={(e) => update("languageMode", e.target.value)}
                                >
                                    <option value="KH">ភាសាខ្មែរ (Khmer)</option>
                                    <option value="EN">ភាសាអង់គ្លេស (English)</option>
                                    <option value="BILINGUAL">ភាសាទាំងពីរ (Bilingual Khmer + English)</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>

                {/* CENTER DIVIDER / RESIZER */}
                {!isExpanded && (
                    <div
                        className={`pe-workspace-divider ${isDragging ? "is-active" : ""}`}
                        onMouseDown={handleMouseDown}
                        title="អូសទៅឆ្វេង ឬស្តាំដើម្បីប្តូរទំហំ (Drag left/right to resize)"
                    >
                        <div className="pe-divider-line">
                            <button
                                type="button"
                                className="pe-divider-toggle-btn"
                                title={isExpanded ? "បង្រួម / Normal View" : "ពង្រីក / Full View"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded((prev) => !prev);
                                }}
                            >
                                {isExpanded ? "▶" : "◀"}
                            </button>
                        </div>
                    </div>
                )}

                {/* RIGHT COLUMN: Live Mobile Phone Simulation */}
                {!isExpanded && (
                    <LivePhoneSimulator
                        data={form}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                )}
            </div>
        </div>
    );
}
