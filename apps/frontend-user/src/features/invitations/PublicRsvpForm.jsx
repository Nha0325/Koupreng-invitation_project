import { useCallback, useEffect, useState } from "react";
import { rsvpService } from "@/features/rsvp/api/rsvpApi";

const initialForm = {
    guestName: "",
    phone: "",
    email: "",
    responseStatus: "ATTENDING",
    attendeeCount: 1,
    message: "",
};

const englishLabels = {
    receivedTitle: "RSVP received",
    receivedText: "Your response has been saved.",
    kicker: "RSVP",
    title: "Will you attend?",
    guestName: "Guest name",
    phone: "Phone",
    email: "Email",
    response: "Response",
    attending: "Attending",
    notAttending: "Not attending",
    maybe: "Maybe",
    attendeeCount: "Attendee count",
    message: "Message",
    submitting: "Submitting...",
    submit: "Submit RSVP",
    wishes: "Wishes",
    blessings: "Blessings from guests",
    guest: "Guest",
};

const khmerLabels = {
    receivedTitle: "បានទទួល RSVP",
    receivedText: "ការឆ្លើយតបរបស់អ្នកត្រូវបានរក្សាទុកហើយ។",
    kicker: "ការឆ្លើយតប",
    title: "តើលោកអ្នកនឹងចូលរួមដែរឬទេ?",
    guestName: "ឈ្មោះភ្ញៀវ",
    phone: "លេខទូរស័ព្ទ",
    email: "អ៊ីមែល",
    response: "ការចូលរួម",
    attending: "ចូលរួម",
    notAttending: "មិនអាចចូលរួម",
    maybe: "ប្រហែលជាចូលរួម",
    attendeeCount: "ចំនួនភ្ញៀវ",
    message: "សារជូនពរ",
    submitting: "កំពុងផ្ញើ...",
    submit: "ផ្ញើ RSVP",
    wishes: "ពាក្យជូនពរ",
    blessings: "ពរជ័យពីភ្ញៀវ",
    guest: "ភ្ញៀវ",
};

export default function PublicRsvpForm({ slug, inviteToken, accessToken, khmerLabels: useKhmerLabels = false }) {
    const labels = useKhmerLabels ? khmerLabels : englishLabels;
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(null);
    const [wishes, setWishes] = useState([]);

    const loadWishes = useCallback(() => {
        if (!slug) return;
        rsvpService.publicWishes(slug, { token: inviteToken, accessToken })
            .then((items) => setWishes(Array.isArray(items) ? items : []))
            .catch(() => setWishes([]));
    }, [slug, inviteToken, accessToken]);

    useEffect(() => {
        loadWishes();
    }, [loadWishes]);

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = {
                ...form,
                attendeeCount: Number(form.attendeeCount),
            };
            const response = inviteToken
                ? await rsvpService.submitPublicWithToken(slug, inviteToken, payload)
                : await rsvpService.submitPublic(slug, payload, { accessToken });
            setSubmitted(response);
            setForm(initialForm);
            if (response?.message) {
                setWishes((current) => [response, ...current.filter((item) => item.id !== response.id)]);
            } else {
                loadWishes();
            }
        } catch (err) {
            setError(err.message || "Could not submit RSVP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="pub-rsvp-live">
            {submitted ? (
                <div className="pub-rsvp-done">
                    <h2>{labels.receivedTitle}</h2>
                    <p>{submitted.guestName ? `${submitted.guestName}, ` : ""}{labels.receivedText}</p>
                </div>
            ) : (
                <form className="pub-rsvp-form" onSubmit={submit}>
                    <div>
                        <p className="pub-kicker">{labels.kicker}</p>
                        <h2>{labels.title}</h2>
                    </div>
                    {!inviteToken && (
                        <div className="inv-form-grid">
                            <label>
                                {labels.guestName}
                                <input
                                    value={form.guestName}
                                    onChange={(event) => update("guestName", event.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                {labels.phone}
                                <input
                                    value={form.phone}
                                    onChange={(event) => update("phone", event.target.value)}
                                />
                            </label>
                            <label>
                                {labels.email}
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) => update("email", event.target.value)}
                                />
                            </label>
                        </div>
                    )}
                    <div className="inv-form-grid">
                        <label>
                            {labels.response}
                            <select
                                value={form.responseStatus}
                                onChange={(event) => update("responseStatus", event.target.value)}
                            >
                                <option value="ATTENDING">{labels.attending}</option>
                                <option value="NOT_ATTENDING">{labels.notAttending}</option>
                                <option value="MAYBE">{labels.maybe}</option>
                            </select>
                        </label>
                        <label>
                            {labels.attendeeCount}
                            <input
                                type="number"
                                min="0"
                                value={form.attendeeCount}
                                onChange={(event) => update("attendeeCount", event.target.value)}
                            />
                        </label>
                    </div>
                    <label>
                        {labels.message}
                        <textarea
                            value={form.message}
                            onChange={(event) => update("message", event.target.value)}
                            rows="3"
                        />
                    </label>
                    {error && <div className="inv-error">{error}</div>}
                    <button className="inv-primary-btn" type="submit" disabled={loading}>
                        {loading ? labels.submitting : labels.submit}
                    </button>
                </form>
            )}

            {wishes.length > 0 && (
                <div className="pub-wishes-wall">
                    <p className="pub-kicker">{labels.wishes}</p>
                    <h2>{labels.blessings}</h2>
                    <div className="pub-wishes-list">
                        {wishes.map((wish) => (
                            <article className="pub-wish-card" key={wish.id || `${wish.guestName}-${wish.respondedAt}`}>
                                <p>{wish.message}</p>
                                <span>{wish.guestName || labels.guest}</span>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
