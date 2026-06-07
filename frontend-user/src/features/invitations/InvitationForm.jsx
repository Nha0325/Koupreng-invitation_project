import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "../../shared/ui/toast";
import { invitationService } from "../../shared/services/invitationService";
import "./InvitationPages.css";

const EVENT_TYPES = ["WEDDING", "ENGAGEMENT", "BIRTHDAY", "ANNIVERSARY", "CORPORATE", "OTHER"];
const VISIBILITIES = ["PUBLIC", "PRIVATE", "PASSWORD_PROTECTED"];
const LANGUAGE_MODES = ["KH", "EN", "BILINGUAL"];

const emptyForm = {
    templateId: "",
    title: "",
    eventType: "WEDDING",
    eventDate: "",
    eventTime: "",
    venueName: "",
    venueAddress: "",
    googleMapUrl: "",
    hostName: "",
    partnerName: "",
    groomName: "",
    brideName: "",
    storyText: "",
    languageMode: "KH",
    visibility: "PUBLIC",
    accessPassword: "",
    rsvpDeadline: "",
};

function fromInvitation(invitation) {
    return {
        ...emptyForm,
        templateId: invitation.templateId || "",
        title: invitation.title || "",
        eventType: invitation.eventType || "WEDDING",
        eventDate: invitation.eventDate || "",
        eventTime: invitation.eventTime ? invitation.eventTime.slice(0, 5) : "",
        venueName: invitation.venueName || "",
        venueAddress: invitation.venueAddress || "",
        googleMapUrl: invitation.googleMapUrl || "",
        hostName: invitation.hostName || "",
        partnerName: invitation.partnerName || "",
        groomName: invitation.groomName || "",
        brideName: invitation.brideName || "",
        storyText: invitation.storyText || "",
        languageMode: invitation.languageMode || "KH",
        visibility: invitation.visibility || "PUBLIC",
        accessPassword: "",
        rsvpDeadline: invitation.rsvpDeadline || "",
    };
}

function toPayload(form) {
    return {
        ...form,
        templateId: form.templateId === "" ? null : Number(form.templateId),
        eventDate: form.eventDate || null,
        eventTime: form.eventTime || null,
        rsvpDeadline: form.rsvpDeadline || null,
        accessPassword: form.visibility === "PASSWORD_PROTECTED" ? form.accessPassword : null,
    };
}

export default function InvitationForm({ invitation }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState(() => {
        if (invitation) return fromInvitation(invitation);
        const templateId = searchParams.get("templateId") || "";
        return { ...emptyForm, templateId };
    });
    const [currentStatus, setCurrentStatus] = useState(invitation?.status || "DRAFT");
    const [saving, setSaving] = useState("");
    const [error, setError] = useState("");
    const isEdit = Boolean(invitation?.id);

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const saveBase = async () => {
        const payload = toPayload(form);
        return isEdit
            ? invitationService.update(invitation.id, payload)
            : invitationService.create(payload);
    };

    const handleAction = async (action) => {
        setSaving(action);
        setError("");
        try {
            const saved = await saveBase();
            let next = saved;
            if (action === "draft") {
                next = await invitationService.saveDraft(saved.id);
                setCurrentStatus(next.status);
                toast("Invitation saved as draft");
            }
            if (action === "publish") {
                next = await invitationService.publish(saved.id);
                setCurrentStatus(next.status);
                toast("Invitation published");
            }
            if (action === "preview") {
                navigate(`/dashboard/invitations/${saved.id}/preview`);
                return;
            }
            navigate(`/dashboard/invitations/${next.id}/edit`, { replace: true });
        } catch (err) {
            setError(err.message || "Could not save invitation");
        } finally {
            setSaving("");
        }
    };

    const unpublish = async () => {
        if (!isEdit) return;
        setSaving("unpublish");
        setError("");
        try {
            await invitationService.unpublish(invitation.id);
            toast("Invitation unpublished");
            navigate("/dashboard/invitations");
        } catch (err) {
            setError(err.message || "Could not unpublish invitation");
        } finally {
            setSaving("");
        }
    };

    return (
        <div className="inv-page">
            <header className="inv-page-header">
                <div>
                    <span className="inv-eyebrow">{isEdit ? currentStatus : "New invitation"}</span>
                    <h1>{isEdit ? "Edit invitation" : "Create invitation"}</h1>
                    <p>Save incomplete details as draft, then publish when the required event fields are ready.</p>
                </div>
                <button className="inv-secondary-btn" type="button" onClick={() => navigate("/dashboard/invitations")}>
                    Back
                </button>
            </header>

            <form className="inv-form" onSubmit={(event) => event.preventDefault()}>
                <section className="inv-form-section">
                    <h2>Core details</h2>
                    <div className="inv-form-grid">
                        <label className="span-2">
                            Event title
                            <input value={form.title} onChange={(event) => update("title", event.target.value)} required />
                        </label>
                        <label>
                            Template ID
                            <input
                                type="number"
                                min="1"
                                value={form.templateId}
                                onChange={(event) => update("templateId", event.target.value)}
                                placeholder="Optional"
                            />
                        </label>
                        <label>
                            Event type
                            <select value={form.eventType} onChange={(event) => update("eventType", event.target.value)}>
                                {EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </label>
                        <label>
                            Date
                            <input type="date" value={form.eventDate} onChange={(event) => update("eventDate", event.target.value)} />
                        </label>
                        <label>
                            Time
                            <input type="time" value={form.eventTime} onChange={(event) => update("eventTime", event.target.value)} />
                        </label>
                    </div>
                </section>

                <section className="inv-form-section">
                    <h2>People</h2>
                    <div className="inv-form-grid">
                        <label>
                            Host name
                            <input value={form.hostName} onChange={(event) => update("hostName", event.target.value)} />
                        </label>
                        <label>
                            Partner name
                            <input value={form.partnerName} onChange={(event) => update("partnerName", event.target.value)} />
                        </label>
                        <label>
                            Groom name
                            <input value={form.groomName} onChange={(event) => update("groomName", event.target.value)} />
                        </label>
                        <label>
                            Bride name
                            <input value={form.brideName} onChange={(event) => update("brideName", event.target.value)} />
                        </label>
                    </div>
                </section>

                <section className="inv-form-section">
                    <h2>Venue and story</h2>
                    <div className="inv-form-grid">
                        <label>
                            Venue name
                            <input value={form.venueName} onChange={(event) => update("venueName", event.target.value)} />
                        </label>
                        <label>
                            Google Maps link
                            <input value={form.googleMapUrl} onChange={(event) => update("googleMapUrl", event.target.value)} />
                        </label>
                        <label className="span-2">
                            Venue address
                            <textarea rows="3" value={form.venueAddress} onChange={(event) => update("venueAddress", event.target.value)} />
                        </label>
                        <label className="span-2">
                            Story / description
                            <textarea rows="5" value={form.storyText} onChange={(event) => update("storyText", event.target.value)} />
                        </label>
                    </div>
                </section>

                <section className="inv-form-section">
                    <h2>Access and RSVP</h2>
                    <div className="inv-form-grid">
                        <label>
                            Language
                            <select value={form.languageMode} onChange={(event) => update("languageMode", event.target.value)}>
                                {LANGUAGE_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
                            </select>
                        </label>
                        <label>
                            Visibility
                            <select value={form.visibility} onChange={(event) => update("visibility", event.target.value)}>
                                {VISIBILITIES.map((visibility) => (
                                    <option key={visibility} value={visibility}>{visibility}</option>
                                ))}
                            </select>
                        </label>
                        {form.visibility === "PASSWORD_PROTECTED" && (
                            <label>
                                Access password
                                <input
                                    type="password"
                                    value={form.accessPassword}
                                    onChange={(event) => update("accessPassword", event.target.value)}
                                    placeholder={isEdit ? "Leave blank to keep current password" : ""}
                                />
                            </label>
                        )}
                        <label>
                            RSVP deadline
                            <input type="date" value={form.rsvpDeadline} onChange={(event) => update("rsvpDeadline", event.target.value)} />
                        </label>
                    </div>
                </section>

                {error && <div className="inv-error">{error}</div>}

                <div className="inv-form-actions">
                    <button type="button" className="inv-secondary-btn" onClick={() => handleAction("draft")} disabled={Boolean(saving)}>
                        {saving === "draft" ? "Saving..." : "Save as Draft"}
                    </button>
                    <button type="button" className="inv-secondary-btn" onClick={() => handleAction("preview")} disabled={Boolean(saving)}>
                        Preview
                    </button>
                    {currentStatus === "PUBLISHED" ? (
                        <button type="button" className="inv-danger-btn" onClick={unpublish} disabled={Boolean(saving)}>
                            {saving === "unpublish" ? "Saving..." : "Unpublish"}
                        </button>
                    ) : (
                        <button type="button" className="inv-primary-btn" onClick={() => handleAction("publish")} disabled={Boolean(saving)}>
                            {saving === "publish" ? "Publishing..." : "Publish"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
