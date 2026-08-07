import { DatePicker } from "../../../shared/ui/DatePicker";
import { TimePicker } from "../../../shared/ui/TimePicker";
import RepeatableList from "../components/RepeatableList";

export default function CoupleEventStep({ draft, update, updateField }) {
    const couple = draft?.couple || {};
    const event = draft?.event || {};
    const schedule = draft?.schedule || [];

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

                <div className="wb-row">
                    <div className="wb-field">
                        <label htmlFor="couple-groom-nickname">ឈ្មោះហៅក្រៅកូនកំលោះ (ស្រេចចិត្ត)</label>
                        <input
                            id="couple-groom-nickname"
                            type="text"
                            value={couple.groomNickname || ""}
                            onChange={(e) => updateField("couple", { groomNickname: e.target.value })}
                            placeholder="ឧ. V"
                        />
                    </div>

                    <div className="wb-field">
                        <label htmlFor="couple-bride-nickname">ឈ្មោះហៅក្រៅកូនក្រមុំ (ស្រេចចិត្ត)</label>
                        <input
                            id="couple-bride-nickname"
                            type="text"
                            value={couple.brideNickname || ""}
                            onChange={(e) => updateField("couple", { brideNickname: e.target.value })}
                            placeholder="ឧ. P"
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

                <div className="wb-field">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                        <label htmlFor="event-message" style={{ margin: 0 }}>សារអញ្ជើញ (ស្រេចចិត្ត)</label>
                        <a
                            href={`/dashboard/invitations/${draft?.backendInvitationId || draft?.id}/assistant`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "0.8125rem", color: "var(--brand-primary, #6b6bc4)", textDecoration: "none", fontWeight: "600" }}
                        >
                            ✨ ជំនួយការសរសេរ / AI Helper
                        </a>
                    </div>
                    <textarea
                        id="event-message"
                        rows={3}
                        value={draft?.message || ""}
                        onChange={(e) => update({ message: e.target.value })}
                        placeholder="ឧ. ដោយក្ដីគោរព និងសេចក្ដីស្រឡាញ់ យើងសូមអញ្ជើញលោកអ្នក..."
                    />
                </div>
            </section>

            {/* Card 2 — Couple intros & parents */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Profiles</span>
                    <h3>ការណែនាំ និងឪពុកម្ដាយ (ស្រេចចិត្ត)</h3>
                </div>

                <div className="wb-field">
                    <label htmlFor="groom-intro">ការណែនាំកូនកំលោះ</label>
                    <textarea
                        id="groom-intro"
                        rows={2}
                        value={couple.groomIntro || ""}
                        onChange={(e) => updateField("couple", { groomIntro: e.target.value })}
                        placeholder="ឧ. បុរសដ៏សុភាពរាបសា ស្រឡាញ់ភាពសាមញ្ញ..."
                    />
                </div>

                <div className="wb-field">
                    <label htmlFor="groom-parents">ឪពុកម្ដាយខាងប្រុស</label>
                    <input
                        id="groom-parents"
                        type="text"
                        value={couple.groomParents || ""}
                        onChange={(e) => updateField("couple", { groomParents: e.target.value })}
                        placeholder="ឧ. បុត្រាលោក ... និងលោកស្រី ..."
                    />
                </div>

                <div className="wb-field">
                    <label htmlFor="bride-intro">ការណែនាំកូនក្រមុំ</label>
                    <textarea
                        id="bride-intro"
                        rows={2}
                        value={couple.brideIntro || ""}
                        onChange={(e) => updateField("couple", { brideIntro: e.target.value })}
                        placeholder="ឧ. ស្ត្រីដ៏ទន់ភ្លន់ ស្លូតបូត ពោរពេញដោយក្ដីមេត្តា..."
                    />
                </div>

                <div className="wb-field">
                    <label htmlFor="bride-parents">ឪពុកម្ដាយខាងស្រី</label>
                    <input
                        id="bride-parents"
                        type="text"
                        value={couple.brideParents || ""}
                        onChange={(e) => updateField("couple", { brideParents: e.target.value })}
                        placeholder="ឧ. បុត្រីលោក ... និងលោកស្រី ..."
                    />
                </div>
            </section>

            {/* Card 3 — Date & time */}
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

            {/* Card 4 — Program agenda (repeatable) */}
            <RepeatableList
                kicker="Program"
                title="កម្មវិធីពិធីមង្គលការ (ស្រេចចិត្ត)"
                help="បន្ថែមកម្មវិធីនីមួយៗ ឧ. ពិធីសូត្រមន្ត ពិធីជប់លៀង អាហារពេលល្ងាច។"
                items={schedule}
                onChange={(next) => update({ schedule: next })}
                addLabel="+ បន្ថែមកម្មវិធី"
                itemLabel="កម្មវិធី"
                makeEmpty={() => ({ time: "", title: "", titleEn: "", description: "", location: "" })}
                fields={[
                    { key: "time", label: "ម៉ោង", type: "time", placeholder: "ជ្រើសម៉ោង" },
                    { key: "title", label: "ចំណងជើង", placeholder: "ឧ. ពិធីជប់លៀង" },
                    { key: "titleEn", label: "ចំណងជើង (EN)", placeholder: "ឧ. Reception" },
                    { key: "description", label: "ការពិពណ៌នា", type: "textarea", rows: 2, wide: true, placeholder: "ឧ. ស្វាគមន៍ភ្ញៀវ ការថតរូប និងពាក្យជូនពរ។" },
                    { key: "location", label: "ទីតាំង (ស្រេចចិត្ត)", wide: true, placeholder: "ឧ. សាលធំ ជាន់ទី ២" },
                ]}
            />
        </div>
    );
}
