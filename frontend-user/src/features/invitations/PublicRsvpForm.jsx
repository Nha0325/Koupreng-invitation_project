import { useEffect, useState } from "react";
import { rsvpService } from "../../shared/services/rsvpService";

const initialForm = {
    guestName: "",
    phone: "",
    email: "",
    responseStatus: "ATTENDING",
    attendeeCount: 1,
    message: "",
};

const LABELS = {
    en: {
        rsvp: "RSVP",
        question: "Will you attend?",
        guestName: "Guest name",
        phone: "Phone",
        email: "Email",
        response: "Response",
        attending: "Attending",
        notAttending: "Not attending",
        maybe: "Maybe",
        attendeeCount: "Attendee count",
        message: "Message",
        submit: "Submit RSVP",
        submitting: "Submitting...",
        received: "RSVP received",
        thanks: "Your response has been saved.",
        wishes: "Wishes",
        noWishes: "No wishes yet.",
    },
    km: {
        rsvp: "RSVP",
        question: "តើលោកអ្នកនឹងចូលរួមទេ?",
        guestName: "ឈ្មោះភ្ញៀវ",
        phone: "លេខទូរស័ព្ទ",
        email: "អ៊ីមែល",
        response: "ការឆ្លើយតប",
        attending: "ចូលរួម",
        notAttending: "មិនចូលរួម",
        maybe: "មិនទាន់ប្រាកដ",
        attendeeCount: "ចំនួនអ្នកចូលរួម",
        message: "សារជូនពរ",
        submit: "ផ្ញើ RSVP",
        submitting: "កំពុងផ្ញើ...",
        received: "បានទទួល RSVP",
        thanks: "ការឆ្លើយតបរបស់លោកអ្នកត្រូវបានរក្សាទុក។",
        wishes: "សារជូនពរ",
        noWishes: "មិនទាន់មានសារជូនពរទេ។",
    },
};

function languageFromMode(languageMode) {
    return (languageMode || "").toLowerCase().includes("en") ? "en" : "km";
}

async function fetchPublicWishes(slug, params) {
    if (!slug) {
        return [];
    }
    return rsvpService.publicWishes(slug, params);
}

export default function PublicRsvpForm({ slug, inviteToken, accessToken, languageMode }) {
    const labels = LABELS[languageFromMode(languageMode)];
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(null);
    const [wishes, setWishes] = useState([]);
    const [wishesError, setWishesError] = useState("");
    const refreshWishes = async () => {
        try {
            setWishes(await fetchPublicWishes(slug, { accessToken, token: inviteToken }));
            setWishesError("");
        } catch (err) {
            setWishesError(err.message || "Could not load wishes");
        }
    };

    useEffect(() => {
        let active = true;
        fetchPublicWishes(slug, { accessToken, token: inviteToken })
            .then((data) => {
                if (active) {
                    setWishes(data);
                    setWishesError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setWishesError(err.message || "Could not load wishes");
                }
            });
        return () => {
            active = false;
        };
    }, [slug, accessToken, inviteToken]);

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
            await refreshWishes();
        } catch (err) {
            setError(err.message || "Could not submit RSVP");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <>
                <div className="pub-rsvp-done">
                    <h2>{labels.received}</h2>
                    <p>{submitted.guestName ? `${submitted.guestName}, ` : ""}{labels.thanks}</p>
                </div>
                <WishesWall wishes={wishes} error={wishesError} labels={labels} />
            </>
        );
    }

    return (
        <>
            <form className="pub-rsvp-form" onSubmit={submit}>
                <div>
                    <p className="pub-kicker">{labels.rsvp}</p>
                    <h2>{labels.question}</h2>
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
                            onChange={(event) => {
                                const nextStatus = event.target.value;
                                update("responseStatus", nextStatus);
                                if (nextStatus === "NOT_ATTENDING") {
                                    update("attendeeCount", 0);
                                } else if (Number(form.attendeeCount) < 1) {
                                    update("attendeeCount", 1);
                                }
                            }}
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
                            min={form.responseStatus === "ATTENDING" ? "1" : "0"}
                            value={form.attendeeCount}
                            disabled={form.responseStatus === "NOT_ATTENDING"}
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
            <WishesWall wishes={wishes} error={wishesError} labels={labels} />
        </>
    );
}

function WishesWall({ wishes, error, labels }) {
    if (error) {
        return <div className="inv-error">{error}</div>;
    }

    return (
        <section className="pub-wishes-wall">
            <div>
                <p className="pub-kicker">{labels.wishes}</p>
                <h2>{labels.wishes}</h2>
            </div>
            <div className="pub-wishes-list">
                {wishes.map((wish) => (
                    <article key={wish.rsvpId} className="pub-wish-card">
                        <p>{wish.message}</p>
                        <strong>{wish.guestName || "Guest"}</strong>
                        {wish.respondedAt && (
                            <time>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(wish.respondedAt))}</time>
                        )}
                    </article>
                ))}
                {!wishes.length && <div className="pub-wish-empty">{labels.noWishes}</div>}
            </div>
        </section>
    );
}
