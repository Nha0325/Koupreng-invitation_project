import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { getTemplateById } from "../../templates/data/templatesData";

export default function ReviewPublishStep({ draft, onSaveDraft, onPublish, publishedDraft, publishState, goToStep }) {
    const [copied, setCopied] = useState(false);
    const qrRef = useRef(null);
    const template = getTemplateById(draft?.templateId);
    const couple = draft?.couple || {};
    const event = draft?.event || {};
    const rsvp = draft?.rsvp || {};
    const storyChapters = draft?.storyChapters || [];
    const schedule = draft?.schedule || [];
    const activeDraft = publishedDraft || draft;
    const isPublished = Boolean(activeDraft?.publishedAt || publishedDraft);
    const publicPath = activeDraft?.slug ? `/i/${activeDraft.slug}` : "";
    const publicUrl = publicPath ? `${window.location.origin}${publicPath}` : "";
    const isBusy = Boolean(publishState?.action);

    const handleCopy = async () => {
        if (!publicUrl) return;

        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    const handleDownloadQr = () => {
        const svg = qrRef.current?.querySelector("svg");
        if (!svg || !activeDraft?.slug) return;
        const data = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${activeDraft.slug}-qr.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveDraft = async () => {
        try {
            await onSaveDraft?.();
        } catch {
            // Error text is owned by publishState.
        }
    };

    const handlePublish = async () => {
        try {
            await onPublish?.();
        } catch {
            // Error text is owned by publishState.
        }
    };

    // Missing-info checklist (display only — does not block publishing).
    // `step` points to the builder step that collects each item so clicking
    // an unfilled row jumps straight there.
    const checklist = [
        { label: "គំរូសន្លឹកការ", done: Boolean(draft?.templateId), step: 0 },
        { label: "ឈ្មោះគូស្វាមីភរិយា", done: Boolean(couple.groom && couple.bride), step: 1 },
        { label: "ថ្ងៃកម្មវិធី", done: Boolean(event.date), step: 1 },
        { label: "ទីតាំងកម្មវិធី", done: Boolean(event.venueName), step: 2 },
        { label: "កម្មវិធីពិធី", done: schedule.length > 0, step: 1 },
        { label: "ជំពូករឿងរ៉ាវ", done: storyChapters.length > 0, step: 3 },
    ];
    const completedCount = checklist.filter((item) => item.done).length;
    const progressPct = Math.round((completedCount / checklist.length) * 100);

    const handleChecklistClick = (stepIndex) => {
        if (typeof goToStep !== "function") return;
        goToStep(stepIndex);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div>
            <h2>Review &amp; create link</h2>
            <p className="wb-help">ពិនិត្យព័ត៌មានទាំងអស់ មុនបោះផ្សាយសន្លឹកការទៅភ្ញៀវ។</p>

            {!isPublished && (
                <section className="wb-checklist" aria-label="បញ្ជីពិនិត្យព័ត៌មាន">
                    <div className="wb-checklist-head">
                        <span className="wb-section-kicker">Checklist</span>
                        <h3>ព័ត៌មានសំខាន់ ({completedCount}/{checklist.length} · {progressPct}%)</h3>
                    </div>
                    <div className="wb-checklist-progress" aria-hidden="true">
                        <div className="wb-checklist-progress-bar" style={{ width: `${progressPct}%` }} />
                    </div>
                    <ul className="wb-checklist-list">
                        {checklist.map((item) => (
                            <li
                                key={item.label}
                                className={`wb-checklist-item${item.done ? " is-done" : ""}`}
                            >
                                <button
                                    type="button"
                                    className="wb-checklist-btn"
                                    onClick={() => handleChecklistClick(item.step)}
                                >
                                    <span className="wb-checklist-mark" aria-hidden="true">
                                        {item.done ? "✓" : "•"}
                                    </span>
                                    <span className="wb-checklist-label">{item.label}</span>
                                    {!item.done && (
                                        <span className="wb-checklist-cta" aria-hidden="true">បំពេញ →</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {isPublished && (
                <section className="wb-success" aria-live="polite">
                    <span className="wb-success-badge">Published</span>
                    <h3>សន្លឹកការរបស់អ្នកត្រូវបានបោះផ្សាយ</h3>
                    <p>អ្នកអាចចម្លងតំណភ្ជាប់ បើកសន្លឹកការសាធារណៈ ឬទាញយក QR code សម្រាប់ចែករំលែក។</p>
                    {publicUrl && (
                        <div className="wb-share-panel">
                            <div className="wb-share-qr" ref={qrRef}>
                                <QRCode value={publicUrl} size={168} level="M" />
                            </div>
                            <div className="wb-share-copy">
                                <label htmlFor="published-url">Public URL</label>
                                <input id="published-url" value={publicUrl} readOnly />
                            </div>
                        </div>
                    )}
                    <div className="wb-success-actions">
                        <button type="button" className="wb-btn" onClick={handleCopy} disabled={!publicPath}>
                            {copied ? "បានចម្លង" : "ចម្លងតំណភ្ជាប់"}
                        </button>
                        <Link to={publicPath || `/event/${activeDraft.id}`} className="wb-btn wb-btn-primary" target="_blank" rel="noopener noreferrer">
                            បើកសន្លឹកការ
                        </Link>
                        <button type="button" className="wb-btn" onClick={handleDownloadQr} disabled={!publicUrl}>
                            ទាញយក QR
                        </button>
                        <Link to="/dashboard" className="wb-btn">
                            ទៅផ្ទាំងគ្រប់គ្រង
                        </Link>
                        <Link to="/events" className="wb-btn">
                            ត្រឡប់ទៅកម្មវិធី
                        </Link>
                        <Link to="/guests" className="wb-btn">
                            គ្រប់គ្រងភ្ញៀវ
                        </Link>
                    </div>
                </section>
            )}

            <div className="wb-review-list">
                <div className="wb-field">
                    <label>គំរូដែលបានជ្រើស</label>
                    <div className="wb-review-template">
                        {template && (
                            <img
                                src={template.phoneCoverImage || template.mainImage || template.image || "/facebook/all/01-card/cover-card.jpg"}
                                alt={template.name}
                                onError={(e) => {
                                    const fallback = "/facebook/all/01-card/cover-card.jpg";
                                    if (e.currentTarget.src.indexOf(fallback) === -1) {
                                        e.currentTarget.src = fallback;
                                    }
                                }}
                            />
                        )}
                        <div>
                            <div className="wb-review-title">{template?.name || draft?.templateId}</div>
                            <div className="wb-review-muted">{template?.style}</div>
                        </div>
                    </div>
                </div>

                <div className="wb-field">
                    <label>គូស្វាមីភរិយា</label>
                    <p className="wb-review-text">
                        {couple.groom || "-"} & {couple.bride || "-"}
                    </p>
                </div>

                <div className="wb-field">
                    <label>ព័ត៌មានពិធី</label>
                    <div className="wb-review-lines">
                        <div>📅 {event.date || "មិនទាន់បំពេញ"}</div>
                        <div>⏰ ពិធី: {event.ceremonyTime || "-"} | ពិសា: {event.receptionTime || "-"}</div>
                        <div>📍 {event.venueName || "-"}</div>
                        <div className="wb-review-muted">{event.venueAddress || ""}</div>
                        {event.mapLink && <div>Map: {event.mapLink}</div>}
                    </div>
                </div>

                <div className="wb-field">
                    <label>RSVP</label>
                    <p className="wb-review-text">
                        {rsvp.enabled ? `បើក - ផុតកំណត់: ${rsvp.deadline || "មិនទាន់កំណត់"}` : "បិទ"}
                    </p>
                </div>

                <div className="wb-field">
                    <label>មាតិកាបន្ថែម</label>
                    <div className="wb-review-lines">
                        <div>📖 ជំពូករឿងរ៉ាវ: {storyChapters.length}</div>
                        <div>🗓️ កម្មវិធី: {schedule.length}</div>
                    </div>
                </div>
            </div>

            {publishState?.error && <div className="wb-publish-message is-error">{publishState.error}</div>}
            {publishState?.warning && <div className="wb-publish-message is-warning">{publishState.warning}</div>}

            {!isPublished && (
                <div className="wb-publish-actions">
                    <button type="button" className="wb-btn" onClick={handleSaveDraft} disabled={isBusy}>
                        {publishState?.action === "draft" ? "កំពុងរក្សាទុក..." : "រក្សាទុក Draft"}
                    </button>
                    <button type="button" className="wb-btn wb-btn-primary" onClick={handlePublish} disabled={isBusy}>
                        {publishState?.action === "publish" ? "កំពុងបោះផ្សាយ..." : "បោះផ្សាយសន្លឹកការ"}
                    </button>
                    <Link to={`/event/${draft.id}`} className="wb-btn">
                        មើលជាមុន
                    </Link>
                    <Link to="/dashboard" className="wb-btn">
                        ទៅផ្ទាំងគ្រប់គ្រង
                    </Link>
                </div>
            )}
        </div>
    );
}
