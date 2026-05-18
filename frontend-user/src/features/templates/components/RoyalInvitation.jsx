/**
 * កំណត់ចំណាំ: preview royal
 * ឯកសារ: src/features/templates/components/RoyalInvitation.jsx
 * ចាស់: ./components/RoyalInvitation.jsx
 */
import { useRef, useState } from "react";


// previews page in phone

const galleryBlocks = [
    "tpl-gallery-a",
    "tpl-gallery-b",
    "tpl-gallery-c",
    "tpl-gallery-d",
];

function CountdownGrid({ countdown }) {
    return (
        <div className="tpl-count-grid" aria-label="countdown">
            {[
                ["ថ្ងៃ", countdown.d],
                ["ម៉ោង", countdown.h],
                ["នាទី", countdown.m],
                ["វិនាទី", countdown.s],
            ].map(([label, value]) => (
                <div className="tpl-count-cell" key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                </div>
            ))}
        </div>
    );
}

export default function RoyalInvitation({ tpl, countdown, mode = "full" }) {
    const [guestName, setGuestName] = useState("");
    const [guestCount, setGuestCount] = useState("2");
    const [rsvpSent, setRsvpSent] = useState(false);
    const nameRef = useRef(null);
    const isPhone = mode === "phone";

    const submitRSVP = () => {
        if (!guestName.trim()) {
            nameRef.current?.focus();
            return;
        }
        setRsvpSent(true);
    };

    return (
        <article
            className={`tpl-royal-invitation ${isPhone ? "is-phone" : "is-full"}`}
            style={{
                "--tpl-bg": tpl.bg,
                "--tpl-paper": tpl.paper,
                "--tpl-gold": tpl.color,
                "--tpl-accent": tpl.accent,
                "--tpl-dark": tpl.dark,
            }}
        >
            <section className="tpl-ri-cover">
                <div className="tpl-ri-scene" aria-hidden="true">
                    <div className="tpl-ri-sky" />
                    <div className="tpl-ri-pavilion">
                        <span className="tpl-ri-dome" />
                        <span className="tpl-ri-roof" />
                        <span className="tpl-ri-column one" />
                        <span className="tpl-ri-column two" />
                        <span className="tpl-ri-column three" />
                    </div>
                    <div className="tpl-ri-aisle" />
                    <div className="tpl-ri-florals left" />
                    <div className="tpl-ri-florals right" />
                    <div className="tpl-ri-couple">
                        <span className="tpl-ri-bride" />
                        <span className="tpl-ri-groom" />
                    </div>
                </div>
                <div className="tpl-ri-lang" aria-hidden="true">
                    <span>EN</span>
                    <span>ខ្មែរ</span>
                </div>
                <div className="tpl-ri-border" />
                <div className="tpl-ri-corners" />
                <div className="tpl-ri-cover-mark">Koupreng</div>
                <p className="tpl-ri-eyebrow">{isPhone ? "WE'RE GETTING MARRIED" : "សូមអញ្ជើញចូលរួមពិធីមង្គលការ"}</p>
                <h1 className="tpl-ri-names">
                    <span>{tpl.groom}</span>
                    <em>&</em>
                    <span>{tpl.bride}</span>
                </h1>
                <div className="tpl-ri-rule">
                    <span />
                    <i />
                    <span />
                </div>
                <p className="tpl-ri-date">{tpl.dateText}</p>
                <div className="tpl-ri-audio" aria-hidden="true">♪</div>
                <div className="tpl-ri-scroll">{isPhone ? "RSVP" : "រំកិលចុះក្រោម"}</div>
            </section>

            <section className="tpl-ri-section tpl-ri-intro">
                <p className="tpl-ri-kicker">ដោយក្តីសោមនស្សរីករាយ</p>
                <h2>សូមអញ្ជើញលោកអ្នកចូលរួមជាសក្ខីភាព</h2>
                <p>
                    ក្រុមគ្រួសារទាំងសងខាងសូមគោរពអញ្ជើញលោកអ្នកចូលរួមពិធីមង្គលការ
                    របស់កូនប្រុស កូនស្រីយើងខ្ញុំ ក្នុងថ្ងៃដ៏មានអត្ថន័យនេះ។
                </p>
            </section>

            <section className="tpl-ri-section tpl-ri-schedule">
                <p className="tpl-ri-kicker">កម្មវិធី</p>
                <h2>ពេលវេលាពិធី</h2>
                <div className="tpl-ri-time-grid">
                    <div>
                        <span>ពិធីសូត្រមន្ត</span>
                        <strong>{tpl.ceremonyTime}</strong>
                    </div>
                    <div>
                        <span>ពិសាភោជនាហារ</span>
                        <strong>{tpl.receptionTime}</strong>
                    </div>
                </div>
                <CountdownGrid countdown={countdown} />
            </section>

            <section className="tpl-ri-section tpl-ri-venue">
                <p className="tpl-ri-kicker">ទីតាំង</p>
                <h2>{tpl.venueName}</h2>
                <p>{tpl.venueAddress}</p>
                <div className="tpl-ri-map">
                    <div className="tpl-ri-map-pin" />
                    <span>Map Preview</span>
                </div>
            </section>

            <section className="tpl-ri-section tpl-ri-gallery">
                <p className="tpl-ri-kicker">រូបភាពអនុស្សាវរីយ៍</p>
                <h2>Our Story</h2>
                <div className="tpl-ri-gallery-grid">
                    {galleryBlocks.map((block) => (
                        <div className={block} key={block} />
                    ))}
                </div>
            </section>

            <section className="tpl-ri-section tpl-ri-note">
                <p className="tpl-ri-kicker">Dress Code</p>
                <h2>សូមស្លៀកពាក់ពណ៌សុភាព</h2>
                <div className="tpl-ri-swatches">
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <p>ពណ៌ក្រមុំ មាស ស និងត្នោតស្រាល សមសម្រាប់ថតរូបជុំគ្នា។</p>
            </section>

            <section className="tpl-ri-section tpl-ri-rsvp">
                <p className="tpl-ri-kicker">RSVP</p>
                <h2>តើលោកអ្នកនឹងចូលរួមទេ?</h2>
                {!rsvpSent ? (
                    <div className="tpl-ri-rsvp-form">
                        <input
                            ref={nameRef}
                            type="text"
                            value={guestName}
                            onChange={(event) => setGuestName(event.target.value)}
                            placeholder="ឈ្មោះភ្ញៀវ"
                        />
                        <select value={guestCount} onChange={(event) => setGuestCount(event.target.value)}>
                            <option value="1">ភ្ញៀវ ១ នាក់</option>
                            <option value="2">ភ្ញៀវ ២ នាក់</option>
                            <option value="3">ភ្ញៀវ ៣ នាក់</option>
                            <option value="4">ភ្ញៀវ ៤ នាក់</option>
                        </select>
                        <button type="button" onClick={submitRSVP}>
                            បញ្ជាក់ការចូលរួម
                        </button>
                    </div>
                ) : (
                    <div className="tpl-ri-rsvp-done">
                        បានទទួលការឆ្លើយតបរបស់ {guestName.trim()} សម្រាប់ភ្ញៀវ {guestCount} នាក់។
                    </div>
                )}
            </section>

            <footer className="tpl-ri-footer">
                <strong>{tpl.groom} & {tpl.bride}</strong>
                <span>{tpl.dateText}</span>
            </footer>
        </article>
    );
}
