import { useCallback, useEffect, useState } from "react";
import { rsvpService } from "../../shared/services/rsvpService";

const initialForm = {
    guestName: "",
    phone: "",
    email: "",
    responseStatus: "ATTENDING",
    attendeeCount: 1,
    message: "",
};

export default function PublicRsvpForm({ slug, inviteToken }) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(null);
    const [wishes, setWishes] = useState([]);

    const loadWishes = useCallback(() => {
        if (!slug) return;
        rsvpService.publicWishes(slug, inviteToken)
            .then((items) => setWishes(Array.isArray(items) ? items : []))
            .catch(() => setWishes([]));
    }, [slug, inviteToken]);

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
                : await rsvpService.submitPublic(slug, payload);
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
                    <h2>RSVP received</h2>
                    <p>Thank you{submitted.guestName ? `, ${submitted.guestName}` : ""}. Your response has been saved.</p>
                </div>
            ) : (
                <form className="pub-rsvp-form" onSubmit={submit}>
                    <div>
                        <p className="pub-kicker">RSVP</p>
                        <h2>Will you attend?</h2>
                    </div>
                    {!inviteToken && (
                        <div className="inv-form-grid">
                            <label>
                                Guest name
                                <input
                                    value={form.guestName}
                                    onChange={(event) => update("guestName", event.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Phone
                                <input
                                    value={form.phone}
                                    onChange={(event) => update("phone", event.target.value)}
                                />
                            </label>
                            <label>
                                Email
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
                            Response
                            <select
                                value={form.responseStatus}
                                onChange={(event) => update("responseStatus", event.target.value)}
                            >
                                <option value="ATTENDING">Attending</option>
                                <option value="NOT_ATTENDING">Not attending</option>
                                <option value="MAYBE">Maybe</option>
                            </select>
                        </label>
                        <label>
                            Attendee count
                            <input
                                type="number"
                                min="0"
                                value={form.attendeeCount}
                                onChange={(event) => update("attendeeCount", event.target.value)}
                            />
                        </label>
                    </div>
                    <label>
                        Message
                        <textarea
                            value={form.message}
                            onChange={(event) => update("message", event.target.value)}
                            rows="3"
                        />
                    </label>
                    {error && <div className="inv-error">{error}</div>}
                    <button className="inv-primary-btn" type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit RSVP"}
                    </button>
                </form>
            )}

            {wishes.length > 0 && (
                <div className="pub-wishes-wall">
                    <p className="pub-kicker">Wishes</p>
                    <h2>Blessings from guests</h2>
                    <div className="pub-wishes-list">
                        {wishes.map((wish) => (
                            <article className="pub-wish-card" key={wish.id || `${wish.guestName}-${wish.respondedAt}`}>
                                <p>{wish.message}</p>
                                <span>{wish.guestName || "Guest"}</span>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
