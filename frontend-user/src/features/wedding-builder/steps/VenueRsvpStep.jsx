import { DatePicker } from "../../../shared/ui/DatePicker";
import { VenuePicker } from "../../../shared/ui/VenuePicker";

export default function VenueRsvpStep({ draft, updateField }) {
    const event = draft?.event || {};
    const rsvp = draft?.rsvp || { enabled: true, deadline: "" };

    return (
        <div>
            <h2>3. ទីកន្លែង និង RSVP</h2>
            <p className="wb-help">បន្ថែមទីតាំង ព័ត៌មានទំនាក់ទំនង និងរបៀបឱ្យភ្ញៀវឆ្លើយតប។</p>

            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Venue</span>
                    <h3>ទីតាំងកម្មវិធី</h3>
                </div>

                    <label>ឈ្មោះទីកន្លែង</label>
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

                <div className="wb-field">
                    <label htmlFor="venue-map">តំណភ្ជាប់ផែនទី</label>
                    <input
                        id="venue-map"
                        type="url"
                        value={event.mapLink || ""}
                        onChange={(e) => updateField("event", { mapLink: e.target.value })}
                        placeholder="https://maps.google.com/..."
                    />
                </div>
            </section>

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
