import { DatePicker } from "../../../shared/ui/DatePicker";
import { DressCodePicker } from "../../../shared/ui/DressCodePicker";
import { MusicPicker } from "../../../shared/ui/MusicPicker";
import { TimePicker } from "../../../shared/ui/TimePicker";
import { VenuePicker } from "../../../shared/ui/VenuePicker";
import { DRESS_CODE_COMBOS } from "../../../shared/data/dressCodeColors";
import { MUSIC_TRACKS } from "../../../shared/data/musicTracks";

export default function EventInfoStep({ draft, updateField, update }) {
    const event = draft?.event || {};
    const dressCode = draft?.dressCode || DRESS_CODE_COMBOS[0];
    const music = draft?.music || MUSIC_TRACKS[0];

    return (
        <div>
            <h2>3. ព័ត៌មានពិធី</h2>
            <p className="wb-help">បំពេញកាលបរិច្ឆេទ ពេលវេលា និងទីកន្លែង។</p>

            <div className="wb-row">
                <div className="wb-field">
                    <label>កាលបរិច្ឆេទ</label>
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

            <div className="wb-field">
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
            </div>

            <div className="wb-field">
                <label htmlFor="addr">អាសយដ្ឋាន</label>
                <textarea
                    id="addr"
                    rows={3}
                    value={event.venueAddress || ""}
                    onChange={(ev) => updateField("event", { venueAddress: ev.target.value })}
                    placeholder="ផ្លូវ ៥២០ ក្រុងបាត់ដំបង..."
                />
            </div>

            <div className="wb-field">
                <label>ពណ៌ Dress Code</label>
                <p className="wb-help" style={{ marginBottom: 8, marginTop: 0 }}>
                    ជ្រើសរើសពណ៌ Dress Code សម្រាប់ភ្ញៀវ ឬ បង្កើតពណ៌ផ្ទាល់ខ្លួន។
                </p>
                <DressCodePicker
                    value={dressCode}
                    onChange={(combo) => update({ dressCode: combo })}
                />
            </div>

            <div className="wb-field">
                <label>តន្ត្រី Background</label>
                <p className="wb-help" style={{ marginBottom: 8, marginTop: 0 }}>
                    ជ្រើសរើសតន្ត្រីដែលនឹងលេងពេលភ្ញៀវបើកការអញ្ជើញ។
                </p>
                <MusicPicker
                    value={music}
                    onChange={(track) => update({ music: track })}
                />
            </div>
        </div>
    );
}
