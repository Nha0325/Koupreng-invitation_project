import { DatePicker } from "../../../shared/ui/DatePicker";
import { TimePicker } from "../../../shared/ui/TimePicker";

export default function CoupleEventStep({ draft, updateField }) {
    const couple = draft?.couple || {};
    const event = draft?.event || {};

    return (
        <div>
            <h2>2. ព័ត៌មានគូ និងថ្ងៃកម្មវិធី</h2>
            <p className="wb-help">បំពេញតែព័ត៌មានសំខាន់សម្រាប់ឱ្យសន្លឹកការអាចបង្ហាញបាន។</p>

            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Couple</span>
                    <h3>ឈ្មោះគូស្វាមីភរិយា</h3>
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label>ឈ្មោះកូនកំលោះ</label>
                        <input
                            type="text"
                            value={couple.groom || ""}
                            onChange={(e) => updateField("couple", { groom: e.target.value })}
                            placeholder="ឧ. បញ្ញា"
                        />
                    </div>

                    <div className="wb-field">
                        <label>ឈ្មោះកូនក្រមុំ</label>
                        <input
                            type="text"
                            value={couple.bride || ""}
                            onChange={(e) => updateField("couple", { bride: e.target.value })}
                            placeholder="ឧ. ផ្កាយ"
                        />
                    </div>
                </div>
            </section>

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
        </div>
    );
}
