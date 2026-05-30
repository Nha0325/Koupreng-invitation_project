import { DatePicker } from "../../../shared/ui/DatePicker";
import { TimePicker } from "../../../shared/ui/TimePicker";

export default function CoupleEventStep({ draft, updateField }) {
    const couple = draft?.couple || {};
    const event = draft?.event || {};
    const contact = draft?.contact || {};

    return (
        <div>
            <h2>Couple &amp; celebration</h2>
            <p className="wb-help">បំពេញព័ត៌មានសំខាន់ៗ ដើម្បីឱ្យសន្លឹកការអាចបង្ហាញបាន។</p>

            {/* Card 1 — Couple */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Couple</span>
                    <h3>ឈ្មោះគូស្វាមីភរិយា</h3>
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label htmlFor="couple-groom">ឈ្មោះកូនកំលោះ</label>
                        <input
                            id="couple-groom"
                            type="text"
                            value={couple.groom || ""}
                            onChange={(e) => updateField("couple", { groom: e.target.value })}
                            placeholder="ឧ. បញ្ញា"
                        />
                    </div>

                    <div className="wb-field">
                        <label htmlFor="couple-bride">ឈ្មោះកូនក្រមុំ</label>
                        <input
                            id="couple-bride"
                            type="text"
                            value={couple.bride || ""}
                            onChange={(e) => updateField("couple", { bride: e.target.value })}
                            placeholder="ឧ. ផ្កាយ"
                        />
                    </div>
                </div>

                <div className="wb-field">
                    <label htmlFor="event-title">ចំណងជើងសន្លឹកការ (ស្រេចចិត្ត)</label>
                    <input
                        id="event-title"
                        type="text"
                        value={event.title || ""}
                        onChange={(e) => updateField("event", { title: e.target.value })}
                        placeholder="ឧ. ពិធីមង្គលការ បញ្ញា & ផ្កាយ"
                    />
                </div>
            </section>

            {/* Card 2 — Schedule */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Schedule</span>
                    <h3>ថ្ងៃ និងពេលវេលា</h3>
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label>ថ្ងៃកម្មវិធី</label>
                        <DatePicker
                            value={event.date || ""}
                            onChange={(value) => updateField("event", { date: value })}
                            placeholder="ជ្រើសកាលបរិច្ឆេទ"
                        />
                    </div>

                    <div className="wb-field">
                        <label>ពេលវេលាពិធី</label>
                        <TimePicker
                            value={event.ceremonyTime || ""}
                            onChange={(value) => updateField("event", { ceremonyTime: value })}
                            placeholder="ជ្រើសម៉ោងពិធី"
                        />
                    </div>
                </div>

                <div className="wb-field">
                    <label>ពេលវេលាពិសាភោជនាហារ</label>
                    <TimePicker
                        value={event.receptionTime || ""}
                        onChange={(value) => updateField("event", { receptionTime: value })}
                        placeholder="ជ្រើសម៉ោងពិសាភោជនាហារ"
                    />
                </div>
            </section>

            {/* Card 3 — Contact 
            
            
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Contact</span>
                    <h3>ព័ត៌មានទំនាក់ទំនង (ស្រេចចិត្ត)</h3>
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label htmlFor="contact-phone">លេខទូរស័ព្ទ</label>
                        <input
                            id="contact-phone"
                            type="tel"
                            value={contact.phone || ""}
                            onChange={(e) => updateField("contact", { phone: e.target.value })}
                            placeholder="012 345 678"
                        />
                    </div>

                    <div className="wb-field">
                        <label htmlFor="contact-telegram">Telegram</label>
                        <input
                            id="contact-telegram"
                            type="text"
                            value={contact.telegram || ""}
                            onChange={(e) => updateField("contact", { telegram: e.target.value })}
                            placeholder="@username ឬ link"
                        />
                    </div>
                </div>

                <div className="wb-field">
                    <label htmlFor="contact-email">អ៊ីមែល</label>
                    <input
                        id="contact-email"
                        type="email"
                        value={contact.email || ""}
                        onChange={(e) => updateField("contact", { email: e.target.value })}
                        placeholder="name@email.com"
                    />
                </div>
            </section>
            
            
            */}
        </div>
    );
}
