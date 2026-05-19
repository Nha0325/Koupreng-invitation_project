import { DatePicker } from "../../../shared/ui/DatePicker";

export default function RsvpSettingsStep({ draft, updateField }) {
    return (
        <div>
            <h2>5. ការកំណត់ RSVP</h2>
            <p className="wb-help">បើក/បិទផ្នែក RSVP និងកំណត់ថ្ងៃផុតកំណត់។</p>

            <div className="wb-field">
                <label>
                    <input
                        type="checkbox"
                        checked={draft.rsvp.enabled}
                        onChange={(e) =>
                            updateField("rsvp", { enabled: e.target.checked })
                        }
                        style={{ marginRight: 8 }}
                    />
                    បើកការទទួល RSVP
                </label>
            </div>

            <div className="wb-field">
                <label>ថ្ងៃផុតកំណត់ឆ្លើយតប</label>
                {draft.rsvp.enabled ? (
                    <DatePicker
                        value={draft.rsvp.deadline}
                        onChange={(val) => updateField("rsvp", { deadline: val })}
                        placeholder="ជ្រើសថ្ងៃផុតកំណត់"
                    />
                ) : (
                    <DatePicker
                        value={draft.rsvp.deadline}
                        onChange={() => { }}
                        placeholder="ជ្រើសថ្ងៃផុតកំណត់"
                    />
                )}
            </div>
        </div>
    );
}
