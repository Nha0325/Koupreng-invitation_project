import { DatePicker } from "../../../shared/ui/DatePicker";
import { VenuePicker } from "../../../shared/ui/VenuePicker";

export default function VenueRsvpStep({ draft, updateField }) {
    const event = draft?.event || {};
    const contact = draft?.contact || {};
    const rsvp = draft?.rsvp || { enabled: true, deadline: "" };

    return (
        <div>
            <h2>Place &amp; RSVP</h2>
            <p className="wb-help">បន្ថែមទីតាំង តំណផែនទី និងរបៀបឱ្យភ្ញៀវឆ្លើយតប។</p>

            {/* Card 1 — Venue */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Venue</span>
                    <h3>ទីតាំងកម្មវិធី</h3>
                </div>

                {/* <div className="wb-fields"> */}
                <label htmlFor="venue-name">ឈ្មោះទីកន្លែង</label>
                <VenuePicker
                    value={event.venueName || ""}
                    onChange={(value) => updateField("event", { venueName: value })}
                    onSelect={(venue) =>
                        updateField("event", {
                            venueName: venue.name,
                            venueAddress: venue.address,
                        })
                    }
                    placeholder="សាលមង្គល..."
                />
                {/* </div> */}

                <div className="wb-field">
                    <label htmlFor="venue-address">អាសយដ្ឋាន</label>
                    <textarea
                        id="venue-address"
                        rows={3}
                        value={event.venueAddress || ""}
                        onChange={(e) => updateField("event", { venueAddress: e.target.value })}
                        placeholder="ផ្លូវ ៥២០ ក្រុងបាត់ដំបង..."
                    />
                </div>
            </section>

            {/* Card 2 — Map */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Map</span>
                    <h3>តំណភ្ជាប់ផែនទី</h3>
                </div>

                <div className="wb-field">
                    <label htmlFor="venue-map">Google Maps link</label>
                    <input
                        id="venue-map"
                        type="url"
                        value={event.mapLink || ""}
                        onChange={(e) => updateField("event", { mapLink: e.target.value })}
                        placeholder="https://maps.google.com/..."
                    />
                </div>
            </section>

            {/* Card 3 — Contact */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Contact</span>
                    <h3>ព័ត៌មានទំនាក់ទំនង</h3>
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label htmlFor="contact-phone">លេខទូរស័ព្ទ</label>
                        <input
                            id="contact-phone"
                            type="tel"
                            value={contact.phone || ""}
                            onChange={(e) => updateField("contact", { phone: e.target.value })}
                            placeholder="+855 12 345 678"
                        />
                    </div>

                    <div className="wb-field">
                        <label htmlFor="contact-telegram">Telegram</label>
                        <input
                            id="contact-telegram"
                            type="text"
                            value={contact.telegram || ""}
                            onChange={(e) => updateField("contact", { telegram: e.target.value })}
                            placeholder="@koupreng"
                        />
                    </div>
                </div>

                <div className="wb-field">
                    <label htmlFor="contact-email">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        value={contact.email || ""}
                        onChange={(e) => updateField("contact", { email: e.target.value })}
                        placeholder="host@example.com"
                    />
                </div>

                <div className="wb-field">
                    <label htmlFor="contact-facebook">Facebook page or profile</label>
                    <input
                        id="contact-facebook"
                        type="text"
                        value={contact.facebook || ""}
                        onChange={(e) => updateField("contact", { facebook: e.target.value })}
                        placeholder="https://facebook.com/... or @username"
                    />
                </div>
            </section>

            {/* Card 3 — RSVP */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">RSVP</span>
                    <h3>ការឆ្លើយតបភ្ញៀវ</h3>
                </div>

                <label className="wb-toggle-row">
                    <input
                        type="checkbox"
                        checked={Boolean(rsvp.enabled)}
                        onChange={(e) => updateField("rsvp", { enabled: e.target.checked })}
                    />
                    <span>
                        <strong>បើកការឆ្លើយតប RSVP</strong>
                        <small>ភ្ញៀវអាចបញ្ជាក់ការចូលរួមពីសន្លឹកការបាន។</small>
                    </span>
                </label>

                {rsvp.enabled && (
                    <div className="wb-row">
                        <div className="wb-field">
                            <label>ថ្ងៃផុតកំណត់ RSVP</label>
                            <DatePicker
                                value={rsvp.deadline || ""}
                                onChange={(value) => updateField("rsvp", { deadline: value })}
                                placeholder="ជ្រើសថ្ងៃផុតកំណត់ RSVP"
                            />
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
