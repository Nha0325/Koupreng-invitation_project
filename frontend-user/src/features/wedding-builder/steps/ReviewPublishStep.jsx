import { useState } from "react";
import { Link } from "react-router-dom";
import { getTemplateById } from "../../templates/data/templatesData";

export default function ReviewPublishStep({ draft, onPublish, publishedDraft }) {
    const [copied, setCopied] = useState(false);
    const template = getTemplateById(draft?.templateId);
    const couple = draft?.couple || {};
    const event = draft?.event || {};
    const rsvp = draft?.rsvp || {};
    const contact = draft?.contact || {};
    const storyChapters = draft?.storyChapters || [];
    const schedule = draft?.schedule || [];
    const party = draft?.party || [];
    const gift = draft?.gift || [];
    const faq = draft?.faq || [];
    const activeDraft = publishedDraft || draft;
    const isPublished = Boolean(activeDraft?.publishedAt || publishedDraft);
    const publicPath = activeDraft?.slug ? `/w/${activeDraft.slug}` : "";

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
    const checklist = [
        { label: "គំរូសន្លឹកការ", done: Boolean(draft?.templateId) },
        { label: "ឈ្មោះគូស្វាមីភរិយា", done: Boolean(couple.groom && couple.bride) },
        { label: "ថ្ងៃកម្មវិធី", done: Boolean(event.date) },
        { label: "ទីតាំងកម្មវិធី", done: Boolean(event.venueName) },
    ];
    const completedCount = checklist.filter((item) => item.done).length;

    return (
        <div>
            <h2>Review &amp; create link</h2>
            <p className="wb-help">ពិនិត្យព័ត៌មានទាំងអស់ មុនបោះផ្សាយសន្លឹកការទៅភ្ញៀវ។</p>

            {!isPublished && (
                <section className="wb-checklist" aria-label="បញ្ជីពិនិត្យព័ត៌មាន">
                    <div className="wb-checklist-head">
                        <span className="wb-section-kicker">Checklist</span>
                        <h3>ព័ត៌មានសំខាន់ ({completedCount}/{checklist.length})</h3>
                    </div>
                    <ul className="wb-checklist-list">
                        {checklist.map((item) => (
                            <li
                                key={item.label}
                                className={`wb-checklist-item${item.done ? " is-done" : ""}`}
                            >
                                <span className="wb-checklist-mark" aria-hidden="true">
                                    {item.done ? "✓" : "•"}
                                </span>
                                {item.label}
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
                        <Link to="/dashboard" className="wb-btn wb-btn-primary">
                            ទៅផ្ទាំងគ្រប់គ្រង
                        </Link>
                        <Link to={`/event/${activeDraft.id}`} className="wb-btn">
                            មើលជាមុន
                        </Link>
                        <button type="button" className="wb-btn" onClick={handleCopy} disabled={!publicPath}>
                            {copied ? "បានចម្លង" : "ចម្លងតំណភ្ជាប់"}
                        </button>
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
                        <div>👥 ក្រុមការងារ: {party.length}</div>
                        <div>🎁 គណនីចងដៃ: {gift.length}</div>
                        <div>❓ សំណួរញឹកញាប់: {faq.length}</div>
                    </div>
                </div>

                <div className="wb-field">
                    <label>លេខទូរស័ព្ទទំនាក់ទំនង</label>
                    <p className="wb-review-text">{contact.phone || "មិនទាន់បំពេញ"}</p>
                </div>
            </div>

            {!isPublished && (
                <div className="wb-publish-actions">
                    <button type="button" className="wb-btn wb-btn-primary" onClick={onPublish}>
                        បោះផ្សាយសន្លឹកការ
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
