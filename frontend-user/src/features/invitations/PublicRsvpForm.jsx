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

async function fetchPublicWishes(slug) {
    if (!slug) {
        return [];
    }
    return rsvpService.publicWishes(slug);
}

export default function PublicRsvpForm({ slug, inviteToken }) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(null);
    const [wishes, setWishes] = useState([]);
    const [wishesError, setWishesError] = useState("");

    const refreshWishes = async () => {
        try {
            setWishes(await fetchPublicWishes(slug));
            setWishesError("");
        } catch (err) {
            setWishesError(err.message || "Could not load wishes");
        }
    };

    useEffect(() => {
        let active = true;
        fetchPublicWishes(slug)
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
    }, [slug]);

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
                    <h2>RSVP received</h2>
                    <p>Thank you{submitted.guestName ? `, ${submitted.guestName}` : ""}. Your response has been saved.</p>
                </div>
                <WishesWall wishes={wishes} error={wishesError} />
            </>
        );
    }

    return (
        <>
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
                            <option value="ATTENDING">Attending</option>
                            <option value="NOT_ATTENDING">Not attending</option>
                            <option value="MAYBE">Maybe</option>
                        </select>
                    </label>
                    <label>
                        Attendee count
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
            <WishesWall wishes={wishes} error={wishesError} />
        </>
    );
}

function WishesWall({ wishes, error }) {
    if (error) {
        return <div className="inv-error">{error}</div>;
    }

    return (
        <section className="pub-wishes-wall">
            <div>
                <p className="pub-kicker">Wishes</p>
                <h2>សារជូនពរ</h2>
            </div>
            <div className="pub-wishes-list">
                {wishes.map((wish) => (
                    <article key={wish.rsvpId} className="pub-wish-card">
                        <p>{wish.message}</p>
                        <strong>{wish.guestName || "Guest"}</strong>
                    </article>
                ))}
                {!wishes.length && <div className="pub-wish-empty">No wishes yet.</div>}
            </div>
        </section>
    );
}
