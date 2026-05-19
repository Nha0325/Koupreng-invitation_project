import { useEffect, useRef, useState } from "react";
import defaultMusicUrl from "../../assets/music/Instrumental Wedding Music (VioSounds Cover).m4a";
import heroVideoUrl from "../../assets/music/hero-phone.webm";

const defaultStoryImages = [
    { src: "/image/a1.png", alt: "Wedding story photo 1", className: "tpl-gallery-a" },
    { src: "/image/a2.png", alt: "Wedding story photo 2", className: "tpl-gallery-b" },
    { src: "/image/a3.png", alt: "Wedding story photo 3", className: "tpl-gallery-c" },
    { src: "/image/a4.png", alt: "Wedding story photo 4", className: "tpl-gallery-d" },
];

function CountdownGrid({ countdown }) {
    return (
        <div className="tpl-count-grid" aria-label="countdown">
            {[
                ["ថ្ងៃ", countdown.d],
                ["ម៉ោង", countdown.h],
                ["នាទី", countdown.m],
                ["វិនាទី", countdown.s],
            ].map(([label, value], index) => (
                <div className="tpl-count-cell tpl-ri-animate" data-ri-animate style={{ "--tpl-animate-index": index }} key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                </div>
            ))}
        </div>
    );
}
// add music
export default function RoyalInvitation({ tpl, countdown, mode = "full", autoPlay = false }) {
    const [guestName, setGuestName] = useState("");
    const [guestCount, setGuestCount] = useState("2");
    const [rsvpSent, setRsvpSent] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [introDone, setIntroDone] = useState(false);
    const rootRef = useRef(null);
    const audioRef = useRef(null);
    const nameRef = useRef(null);
    const autoPlayTriggeredRef = useRef(false);
    const isPhone = mode === "phone";
    const storyImages = tpl.storyImages || defaultStoryImages;
    const musicUrl = tpl.music?.url !== undefined ? tpl.music.url : defaultMusicUrl;
    const dressCode = tpl.dressCode || {
        colors: [
            { hex: "#D4AF37", name: "មាស" },
            { hex: "#F5E6D3", name: "ស" },
            { hex: "#B0926A", name: "ត្នោតស្រាល" },
            { hex: "#8B6F47", name: "ត្នោតចាស់" },
        ],
        description: "ពណ៌មាស ស និងត្នោតស្រាល សមសម្រាប់ថតរូបជុំគ្នា។",
    };
    const mapSearchText = tpl.mapQuery || `${tpl.venueName} ${tpl.venueAddress}`;
    const mapQuery = encodeURIComponent(mapSearchText.replace(/\s+/g, " ").trim());
    const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
    const musicLabel = isMusicPlaying ? "បិទតន្ត្រី" : "បើកតន្ត្រី";

    // Show video for ~3s before fading in the names/cards
    useEffect(() => {
        const timer = setTimeout(() => setIntroDone(true), 3000);
        return () => clearTimeout(timer);
    }, [tpl.id, mode]);

    useEffect(() => {
        if (!autoPlay || autoPlayTriggeredRef.current) return;
        const audio = audioRef.current;
        if (!audio) return;

        autoPlayTriggeredRef.current = true;
        audio.volume = 0.55;
        audio.play().then(() => {
            setIsMusicPlaying(true);
        }).catch(() => {
            // Browser blocked autoplay — user will need to tap the music button
        });
    }, [autoPlay]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const targets = Array.from(root.querySelectorAll("[data-ri-animate]"));
        if (!targets.length) return undefined;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            targets.forEach((target) => target.classList.add("is-visible"));
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("is-visible", entry.isIntersecting);
            });
        }, {
            root: null,
            rootMargin: "0px 0px -6% 0px",
            threshold: 0.12,
        });

        targets.forEach((target, index) => {
            target.style.setProperty("--tpl-animate-index", String(index % 8));
            observer.observe(target);
        });

        return () => observer.disconnect();
    }, [mode, tpl.id]);

    const toggleMusic = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!audio.paused) {
            audio.pause();
            setIsMusicPlaying(false);
            return;
        }

        audio.volume = 0.55;
        try {
            await audio.play();
            setIsMusicPlaying(true);
        } catch {
            setIsMusicPlaying(false);
        }
    };

    const submitRSVP = () => {
        if (!guestName.trim()) {
            nameRef.current?.focus();
            return;
        }
        setRsvpSent(true);
    };

    return (
        <article
            ref={rootRef}
            className={`tpl-royal-invitation ${isPhone ? "is-phone" : "is-full"}${introDone ? " intro-done" : " intro-active"}`}
            style={{
                "--tpl-bg": tpl.bg,
                "--tpl-paper": tpl.paper,
                "--tpl-gold": tpl.color,
                "--tpl-accent": tpl.accent,
                "--tpl-dark": tpl.dark,
            }}
        >
            <section className="tpl-ri-cover">
                <video
                    className="tpl-ri-hero-video"
                    src={heroVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden="true"
                />
                <div className="tpl-ri-scene" aria-hidden="true">
                    <div className="tpl-ri-sage-cloth" />
                    <div className="tpl-ri-suite-card tpl-ri-suite-back">
                        <span className="tpl-ri-floral-emboss top" />
                        <span className="tpl-ri-floral-emboss bottom" />
                    </div>
                    <div className="tpl-ri-suite-card tpl-ri-suite-envelope">
                        <span className="tpl-ri-envelope-flap" />
                        <span className="tpl-ri-floral-emboss center" />
                    </div>
                    <div className="tpl-ri-suite-card tpl-ri-main-card">
                        <span className="tpl-ri-deckle top" />
                        <span className="tpl-ri-deckle right" />
                        <span className="tpl-ri-floral-emboss main" />
                        <span className="tpl-ri-gilded-edge" />
                        <span className="tpl-ri-card-monogram">K</span>
                    </div>
                    <div className="tpl-ri-dried-flower left" />
                    <div className="tpl-ri-dried-flower right" />
                </div>
                <div className="tpl-ri-lang" aria-hidden="true">
                    <span>EN</span>
                    <span>ខ្មែរ</span>
                </div>
                <div className="tpl-ri-border" />
                <div className="tpl-ri-corners" />
                <div className="tpl-ri-cover-copy">
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
                    <div className="tpl-ri-cover-meta" aria-label="invitation highlights">
                        <span>{tpl.ceremonyTime}</span>
                        <span>{tpl.venueName}</span>
                    </div>
                </div>
                {musicUrl && (
                    <>
                        <button
                            type="button"
                            className={`tpl-ri-audio${isMusicPlaying ? " is-playing" : ""}`}
                            onClick={toggleMusic}
                            aria-label={musicLabel}
                            aria-pressed={isMusicPlaying}
                            title={musicLabel}
                        >
                            <span className="tpl-ri-audio-icon" aria-hidden="true">♪</span>
                            <span className="tpl-ri-audio-wave" aria-hidden="true" />
                        </button>
                        <audio
                            ref={audioRef}
                            src={musicUrl}
                            loop
                            preload="metadata"
                            onPlay={() => setIsMusicPlaying(true)}
                            onPause={() => setIsMusicPlaying(false)}
                        />
                    </>
                )}
                <div className="tpl-ri-scroll">{isPhone ? "RSVP" : "រំកិលចុះក្រោម"}</div>
            </section>

            <section className="tpl-ri-section tpl-ri-intro tpl-ri-animate" data-ri-animate>
                <p className="tpl-ri-kicker">ដោយក្តីសោមនស្សរីករាយ</p>
                <h2>សូមអញ្ជើញលោកអ្នកចូលរួមជាសក្ខីភាព</h2>
                <p>
                    ក្រុមគ្រួសារទាំងសងខាងសូមគោរពអញ្ជើញលោកអ្នកចូលរួមពិធីមង្គលការ
                    របស់កូនប្រុស កូនស្រីយើងខ្ញុំ ក្នុងថ្ងៃដ៏មានអត្ថន័យនេះ។
                </p>
            </section>

            <section className="tpl-ri-section tpl-ri-schedule tpl-ri-animate" data-ri-animate>
                <p className="tpl-ri-kicker">កម្មវិធី</p>
                <h2>ពេលវេលាពិធី</h2>
                <div className="tpl-ri-time-grid">
                    <div className="tpl-ri-animate" data-ri-animate>
                        <span>ពិធីសូត្រមន្ត</span>
                        <strong>{tpl.ceremonyTime}</strong>
                    </div>
                    <div className="tpl-ri-animate" data-ri-animate>
                        <span>ពិសាភោជនាហារ</span>
                        <strong>{tpl.receptionTime}</strong>
                    </div>
                </div>
                <CountdownGrid countdown={countdown} />
            </section>

            <section className="tpl-ri-section tpl-ri-venue tpl-ri-animate" data-ri-animate>
                <p className="tpl-ri-kicker">ទីតាំង</p>
                <h2>{tpl.venueName}</h2>
                <p>{tpl.venueAddress}</p>
                <div className="tpl-ri-map tpl-ri-animate" data-ri-animate>
                    <iframe
                        src={mapSrc}
                        title={`${tpl.venueName} map`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a href={mapLink} target="_blank" rel="noreferrer">
                        បើកផែនទី
                    </a>
                </div>
            </section>

            <section className="tpl-ri-section tpl-ri-gallery tpl-ri-animate" data-ri-animate>
                <p className="tpl-ri-kicker">រូបភាពអនុស្សាវរីយ៍</p>
                <h2>Our Story</h2>
                <div className="tpl-ri-gallery-grid">
                    {storyImages.map((image) => (
                        <figure className={`tpl-ri-gallery-item tpl-ri-animate ${image.className || ""}`} data-ri-animate key={image.id || image.src}>
                            {image.type === "video" ? (
                                <video
                                    src={image.src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img src={image.src} alt={image.alt || "Wedding story"} loading="lazy" />
                            )}
                        </figure>
                    ))}
                </div>
            </section>

            <section className="tpl-ri-section tpl-ri-note tpl-ri-animate" data-ri-animate>
                <p className="tpl-ri-kicker">Dress Code</p>
                <h2>សូមស្លៀកពាក់ពណ៌សុភាព</h2>
                <div className="tpl-ri-swatches tpl-ri-animate" data-ri-animate>
                    {dressCode.colors.map((c, i) => (
                        <span key={i} style={{ background: c.hex }} title={c.name} />
                    ))}
                </div>
                <div className="tpl-ri-color-names" data-ri-animate>
                    {dressCode.colors.map((c, i) => (
                        <span key={i} className="tpl-ri-color-name">{c.name}</span>
                    ))}
                </div>
                <p>{dressCode.description}</p>
            </section>

            <section className="tpl-ri-section tpl-ri-rsvp tpl-ri-animate" data-ri-animate>
                <p className="tpl-ri-kicker">RSVP</p>
                <h2>តើលោកអ្នកនឹងចូលរួមទេ?</h2>
                {!rsvpSent ? (
                    <div className="tpl-ri-rsvp-form tpl-ri-animate" data-ri-animate>
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
                    <div className="tpl-ri-rsvp-done tpl-ri-animate is-visible" data-ri-animate>
                        បានទទួលការឆ្លើយតបរបស់ {guestName.trim()} សម្រាប់ភ្ញៀវ {guestCount} នាក់។
                    </div>
                )}
            </section>

            <footer className="tpl-ri-footer tpl-ri-animate" data-ri-animate>
                <strong>{tpl.groom} & {tpl.bride}</strong>
                <span>{tpl.dateText}</span>
            </footer>
        </article>
    );
}
