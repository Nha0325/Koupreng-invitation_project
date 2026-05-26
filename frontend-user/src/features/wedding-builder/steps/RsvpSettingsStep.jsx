/**
 * RsvpSettingsStep — Step 5: ការកំណត់ RSVP
 * Enable/disable RSVP + deadline
 */
import { DatePicker } from "../../../shared/ui/DatePicker";

export default function RsvpSettingsStep({ draft, updateField }) {
    const rsvp = draft?.rsvp || { enabled: true, deadline: "" };

    return (
        <div>
            <h2>5. ការកំណត់ RSVP</h2>
            <p className="wb-help">កំណត់ការឆ្លើយតបពីភ្ញៀវ។</p>

            <div className="wb-field">
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                        type="checkbox"
                        checked={rsvp.enabled}
                        onChange={(e) => updateField("rsvp", { enabled: e.target.checked })}
                        style={{ width: 18, height: 18 }}
                    />
                    បើកការឆ្លើយតប RSVP
                </label>
            </div>

            {rsvp.enabled && (
                <div className="wb-field">
                    <label>ថ្ងៃផុតកំណត់ RSVP</label>
                    <DatePicker
                        value={rsvp.deadline || ""}
                        onChange={(value) => updateField("rsvp", { deadline: value })}
                        placeholder="ជ្រើសថ្ងៃផុតកំណត់ RSVP"
                    />
                </div>
            )}
        </div>
    );
}
