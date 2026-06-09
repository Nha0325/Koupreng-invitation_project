import { useState } from "react";
import { Link } from "react-router-dom";
import { getTemplateById } from "../../templates/data/templatesData";

export default function ReviewPublishStep({ draft, onPublish, publishedDraft, goToStep, syncError }) {
    const [copied, setCopied] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [publishError, setPublishError] = useState("");
    const template = getTemplateById(draft?.templateId);
    const couple = draft?.couple || {};
    const event = draft?.event || {};
    const rsvp = draft?.rsvp || {};
    const storyChapters = draft?.storyChapters || [];
    const schedule = draft?.schedule || [];
    const activeDraft = publishedDraft || draft;
    const isPublished = Boolean(activeDraft?.publishedAt || publishedDraft);
    const publicPath = activeDraft?.slug ? `/w/${activeDraft.slug}` : "";
    const backendInvitationId = activeDraft?.backendInvitationId;
    const dashboardPath = backendInvitationId ? `/dashboard/invitations/${backendInvitationId}` : "/dashboard";
    const previewPath = backendInvitationId ? `/dashboard/invitations/${backendInvitationId}/preview` : `/event/${activeDraft?.id || draft?.id}`;
    const guestsPath = backendInvitationId ? `/dashboard/invitations/${backendInvitationId}/guests` : "/guests";

    const handleCopy = async () => {
        if (!publicPath) return;

        try {
            await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
            setCopied(true);
        } catch {
            setCopied(false);
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

    const handlePublishClick = async () => {
        if (typeof onPublish !== "function" || publishing) return;
        setPublishing(true);
        setPublishError("");
        try {
            await onPublish();
        } catch (err) {
            setPublishError(err.message || "Could not publish invitation");
        } finally {
            setPublishing(false);
        }
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
                    <p>អ្នកអាចទៅផ្ទាំងគ្រប់គ្រង មើលជាមុន ចម្លងតំណភ្ជាប់ ឬគ្រប់គ្រងភ្ញៀវ។</p>
                    <div className="wb-success-actions">
                        <Link to={dashboardPath} className="wb-btn wb-btn-primary">
                            ទៅផ្ទាំងគ្រប់គ្រង
                        </Link>
                        <Link to={previewPath} className="wb-btn">
                            មើលជាមុន
                        </Link>
                        <button type="button" className="wb-btn" onClick={handleCopy} disabled={!publicPath}>
                            {copied ? "បានចម្លង" : "ចម្លងតំណភ្ជាប់"}
                        </button>
                        <Link to={guestsPath} className="wb-btn">
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

            {!isPublished && (
                <div className="wb-publish-actions">
                    {(publishError || syncError) && (
                        <div className="wb-publish-error" role="alert">
                            {publishError || syncError}
                        </div>
                    )}
                    <button type="button" className="wb-btn wb-btn-primary" onClick={handlePublishClick} disabled={publishing}>
                        {publishing ? "កំពុងបោះផ្សាយ..." : "បោះផ្សាយសន្លឹកការ"}
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
