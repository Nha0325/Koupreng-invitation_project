import { useState } from "react";
import "../enterprise/EnterprisePages.css";
import aiAssistantService from "./aiAssistantService";

const initialForm = {
    language: "Khmer",
    tone: "formal",
    eventType: "Wedding",
    coupleNames: "",
    hostName: "",
    venueName: "",
    eventDate: "",
    notes: "",
};

export default function AiAssistantPage() {
    const [form, setForm] = useState(initialForm);
    const [result, setResult] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            setResult(await aiAssistantService.draftInvitationCopy(form));
        } catch (err) {
            setError(err.message || "Could not request AI draft");
        } finally {
            setSaving(false);
        }
    };

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    return (
        <main className="enterprise-page">
            <header className="enterprise-head">
                <div>
                    <span className="enterprise-eyebrow">AI assistant</span>
                    <h1>Invitation writing assistant</h1>
                    <p>Prepare invitation copy prompts and verify whether AI generation is configured.</p>
                </div>
            </header>

            {error && <div className="enterprise-error">{error}</div>}

            <section className="enterprise-layout">
                <form className="enterprise-panel enterprise-form" onSubmit={submit}>
                    <h2>Draft request</h2>
                    <label>
                        Language
                        <select value={form.language} onChange={(event) => setField("language", event.target.value)}>
                            <option>Khmer</option>
                            <option>English</option>
                            <option>Khmer and English</option>
                        </select>
                    </label>
                    <label>
                        Tone
                        <select value={form.tone} onChange={(event) => setField("tone", event.target.value)}>
                            <option>formal</option>
                            <option>warm</option>
                            <option>modern</option>
                            <option>traditional</option>
                        </select>
                    </label>
                    <label>
                        Event type
                        <input value={form.eventType} onChange={(event) => setField("eventType", event.target.value)} />
                    </label>
                    <label>
                        Couple names
                        <input value={form.coupleNames} onChange={(event) => setField("coupleNames", event.target.value)} />
                    </label>
                    <label>
                        Host name
                        <input value={form.hostName} onChange={(event) => setField("hostName", event.target.value)} />
                    </label>
                    <label>
                        Venue
                        <input value={form.venueName} onChange={(event) => setField("venueName", event.target.value)} />
                    </label>
                    <label>
                        Event date
                        <input value={form.eventDate} onChange={(event) => setField("eventDate", event.target.value)} />
                    </label>
                    <label>
                        Notes
                        <textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} />
                    </label>
                    <button className="enterprise-btn" type="submit" disabled={saving}>
                        {saving ? "Checking..." : "Request draft"}
                    </button>
                </form>

                <section className="enterprise-panel">
                    <h2>Assistant response</h2>
                    {!result ? (
                        <div className="enterprise-empty">Submit a request to check assistant availability.</div>
                    ) : (
                        <div>
                            <p>
                                <span className={`enterprise-badge ${result.enabled ? "good" : "warn"}`}>
                                    {result.enabled ? "Enabled" : "Not configured"}
                                </span>
                                {" "}
                                <span className="enterprise-muted">Provider: {result.provider || "—"}</span>
                            </p>
                            {result.generatedText && (
                                <textarea className="enterprise-form" readOnly value={result.generatedText} style={{ width: "100%", minHeight: 160 }} />
                            )}
                            {result.warnings?.map((warning) => (
                                <div className="enterprise-error" key={warning}>{warning}</div>
                            ))}
                            <h3>Suggestions</h3>
                            <ul className="enterprise-list">
                                {(result.suggestions || []).map((suggestion) => <li key={suggestion}>{suggestion}</li>)}
                            </ul>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
