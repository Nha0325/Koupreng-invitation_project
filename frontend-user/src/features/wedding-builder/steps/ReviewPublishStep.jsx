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
    const openingVideo = draft?.openingVideoEnabled ? draft?.openingVideo : null;
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

    return (
        <div>
            <h2>5. ពិនិត្យមើល និងបោះផ្សាយ</h2>
            <p className="wb-help">ពិនិត្យព័ត៌មានទាំងអស់ មុនបោះផ្សាយសន្លឹកការទៅភ្ញៀវ។</p>

            {isPublished && (
                <section className="wb-success" aria-live="polite">
                    <span className="wb-success-badge">Published</span>
                    <h3>សន្លឹកការរបស់អ្នកត្រូវបានបោះផ្សាយ</h3>
                    <p>អ្នកអាចទៅផ្ទាំងគ្រប់គ្រង មើលជាមុន ចម្លងតំណភ្ជាប់ ឬគ្រប់គ្រងភ្ញៀវ។</p>
                    <div className="wb-success-actions">
                        <Link to="/dashboard" className="wb-btn wb-btn-primary">
                            ទៅផ្ទាំងគ្រប់គ្រង
                        </Link>
                        <Link to={`/preview/${activeDraft.id}`} className="wb-btn">
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
                        {template?.image && (
                            <img src={template.image} alt={template.name} />
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
                    <label>វីដេអូបើកសន្លឹកការ</label>
                    <p className="wb-review-text">{openingVideo?.name || "មិនប្រើវីដេអូ"}</p>
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
                    <Link to={`/preview/${draft.id}`} className="wb-btn">
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
