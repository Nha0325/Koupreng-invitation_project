import { useEffect, useMemo, useRef, useState } from "react";
import "./InvitationPages.css";
import { EVENT_TYPE_LABELS, formatDate, formatTime } from "./invitationUtils";

const LABELS = {
    en: {
        invited: "You are invited",
        date: "Date",
        venue: "Venue",
        map: "Open in Google Maps",
        deadline: "RSVP deadline",
        countdown: "Countdown",
        started: "The event has started",
        story: "Our story",
        timeline: "Event timeline",
        gallery: "Gallery",
        video: "Video",
        music: "Music",
        play: "Play music",
        pause: "Pause music",
        noGallery: "No gallery images yet.",
        share: "Share",
        copy: "Copy link",
        telegram: "Telegram",
        messenger: "Messenger",
        copied: "Copied",
        footer: "Created with Koupreng",
        guestFor: "Invitation for",
        group: "Group",
        table: "Table",
        seat: "Seat",
        seats: "Seats",
        note: "Note",
    },
    km: {
        invited: "សូមគោរពអញ្ជើញ",
        date: "កាលបរិច្ឆេទ",
        venue: "ទីតាំង",
        map: "បើកផែនទី Google",
        deadline: "ថ្ងៃផុតកំណត់ RSVP",
        countdown: "រាប់ថយក្រោយ",
        started: "កម្មវិធីបានចាប់ផ្តើមហើយ",
        story: "រឿងរ៉ាវរបស់យើង",
        timeline: "លំដាប់កម្មវិធី",
        gallery: "អាល់ប៊ុមរូបភាព",
        video: "វីដេអូ",
        music: "តន្ត្រី",
        play: "ចាក់តន្ត្រី",
        pause: "ផ្អាកតន្ត្រី",
        noGallery: "មិនទាន់មានរូបភាពទេ។",
        share: "ចែករំលែក",
        copy: "ចម្លងតំណ",
        telegram: "Telegram",
        messenger: "Messenger",
        copied: "បានចម្លង",
        footer: "បង្កើតដោយ Koupreng",
        guestFor: "សំបុត្រអញ្ជើញសម្រាប់",
        group: "ក្រុម",
        table: "តុ",
        seat: "កៅអី",
        seats: "ចំនួនកៅអី",
        note: "ចំណាំ",
    },
};

function displayNames(invitation) {
    if (invitation.groomName || invitation.brideName) {
        return [invitation.groomName, invitation.brideName].filter(Boolean).join(" & ");
    }
    if (invitation.hostName || invitation.partnerName) {
        return [invitation.hostName, invitation.partnerName].filter(Boolean).join(" & ");
    }
    return invitation.title;
}

function initialLanguage(languageMode) {
    const mode = (languageMode || "").toLowerCase();
    if (mode.includes("en")) return "en";
    return "km";
}

function safeJson(value) {
    if (!value || typeof value !== "string") return {};
    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
}

function validGoogleMapUrl(value) {
    if (!value) return "";
    try {
        const url = new URL(value);
        const host = url.hostname.toLowerCase();
        const allowed = host === "maps.app.goo.gl"
            || host.endsWith(".google.com")
            || host === "google.com"
            || host === "www.google.com";
        return allowed ? url.toString() : "";
    } catch {
        return "";
    }
}

function timelineFromContent(invitation, labels) {
    const content = safeJson(invitation.contentJson);
    const candidates = [
        content.timeline,
        content.eventTimeline,
        content.sections?.timeline,
    ].find(Array.isArray);

    if (candidates?.length) {
        return candidates
            .map((item) => ({
                time: item.time || item.startTime || "",
                title: item.title || item.label || item.name || "",
                description: item.description || item.note || "",
            }))
            .filter((item) => item.title || item.description || item.time);
    }

    return [
        { time: "4:30 PM", title: labels.en ? "Guest arrival" : "ទទួលភ្ញៀវ" },
        { time: "5:30 PM", title: labels.en ? "Ceremony" : "ពិធីការ" },
        { time: "6:30 PM", title: labels.en ? "Dinner" : "អាហារ" },
        { time: "7:30 PM", title: labels.en ? "Celebration" : "អបអរសាទរ" },
    ];
}

export default function InvitationDisplay({ invitation, media, preview = false, children }) {
    const [language, setLanguage] = useState(initialLanguage(invitation.languageMode));
    const labels = LABELS[language];
    const dateText = formatDate(invitation.eventDate);
    const timeText = formatTime(invitation.eventTime);
    const coverUrl = media?.coverImage?.fileUrl || "/image/a1.png";
    const galleryImages = (media?.galleryImages || []).filter((item) => item?.fileUrl);
    const mapHref = validGoogleMapUrl(invitation.googleMapUrl);
    const names = displayNames(invitation);
    const timeline = useMemo(() => timelineFromContent(invitation, { en: language === "en" }), [invitation, language]);
    const guest = invitation.guest;

    return (
        <main className="pub-invitation" lang={language === "km" ? "km" : "en"}>
            <section className="pub-hero">
                <img className="pub-hero-image" src={coverUrl} alt={invitation.title || names} />
                <div className="pub-hero-copy">
                    {preview && <span className="pub-preview-pill">Preview</span>}
                    <div className="pub-language-toggle" role="group" aria-label="Language">
                        <button type="button" className={language === "km" ? "active" : ""} onClick={() => setLanguage("km")}>
                            ខ្មែរ
                        </button>
                        <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
                            EN
                        </button>
                    </div>
                    <p className="pub-kicker">{EVENT_TYPE_LABELS[invitation.eventType] || "Invitation"}</p>
                    <h1>{invitation.title}</h1>
                    <h2>{names}</h2>
                    <p>{dateText}{timeText ? ` • ${timeText}` : ""}</p>
                </div>
            </section>

            <section className="pub-section pub-intro">
                <p className="pub-kicker">{labels.invited}</p>
                <h2>{names}</h2>
                <p>
                    {invitation.storyText
                        || (language === "km"
                            ? "យើងខ្ញុំពិតជារីករាយណាស់ដែលបានអញ្ជើញលោកអ្នកចូលរួមអបអរសាទរ។"
                            : "We would be honored to have you join us for this special celebration.")}
                </p>
            </section>

            {guest && (
                <section className="pub-section pub-personal-section">
                    <p className="pub-kicker">{labels.guestFor}</p>
                    <div className="pub-personal-card">
                        <h2>{guest.guestName}</h2>
                        <div className="pub-personal-grid">
                            {guest.guestGroup && <span><strong>{labels.group}</strong>{guest.guestGroup}</span>}
                            {(guest.tableLabel || guest.tableName || guest.tableNumber) && (
                                <span><strong>{labels.table}</strong>{guest.tableLabel || guest.tableName || guest.tableNumber}</span>
                            )}
                            {guest.seatLabel && <span><strong>{labels.seat}</strong>{guest.seatLabel}</span>}
                            {guest.seatCount && <span><strong>{labels.seats}</strong>{guest.seatCount}</span>}
                        </div>
                        {guest.note && <p>{labels.note}: {guest.note}</p>}
                    </div>
                </section>
            )}

            <section className="pub-section pub-countdown-section">
                <p className="pub-kicker">{labels.countdown}</p>
                <CountdownTimer eventDate={invitation.eventDate} eventTime={invitation.eventTime} labels={labels} />
            </section>

            <section className="pub-section pub-details-grid">
                <article>
                    <span>{labels.date}</span>
                    <strong>{dateText}</strong>
                    {timeText && <p>{timeText}</p>}
                </article>
                <article>
                    <span>{labels.venue}</span>
                    <strong>{invitation.venueName || (language === "km" ? "នឹងជម្រាបជូនពេលក្រោយ" : "Venue to be announced")}</strong>
                    <p>{invitation.venueAddress || (language === "km" ? "នឹងជម្រាបជូនពេលក្រោយ" : "Address to be announced")}</p>
                    {mapHref && (
                        <a href={mapHref} target="_blank" rel="noreferrer">
                            {labels.map}
                        </a>
                    )}
                </article>
                <article>
                    <span>{labels.deadline}</span>
                    <strong>{invitation.rsvpDeadline ? formatDate(invitation.rsvpDeadline) : "—"}</strong>
                </article>
            </section>

            <section className="pub-section pub-timeline-section">
                <p className="pub-kicker">{labels.timeline}</p>
                <div className="pub-timeline">
                    {timeline.map((item, index) => (
                        <article key={`${item.time}-${item.title}-${index}`}>
                            <span>{item.time || "•"}</span>
                            <div>
                                <strong>{item.title}</strong>
                                {item.description && <p>{item.description}</p>}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="pub-section pub-media-section">
                <div className="pub-section-heading">
                    <p className="pub-kicker">{labels.gallery}</p>
                    {media?.backgroundMusic && <MusicButton src={media.backgroundMusic.fileUrl} labels={labels} />}
                </div>
                {galleryImages.length > 0 ? (
                    <div className="pub-gallery">
                        {galleryImages.map((item, index) => (
                            <img
                                key={item.id || item.fileUrl}
                                src={item.fileUrl}
                                alt={item.originalFilename || `${labels.gallery} ${index + 1}`}
                                loading="lazy"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="pub-empty-panel">{labels.noGallery}</div>
                )}
                {media?.video?.fileUrl && (
                    <div className="pub-video-wrap">
                        <p className="pub-kicker">{labels.video}</p>
                        <video className="pub-video" src={media.video.fileUrl} controls preload="metadata" />
                    </div>
                )}
            </section>

            {children && (
                <section className="pub-section pub-rsvp-section">
                    {children}
                </section>
            )}

            <section className="pub-section pub-share-section">
                <ShareButtons title={invitation.title || names} labels={labels} />
            </section>

            <footer className="pub-footer">{labels.footer}</footer>
        </main>
    );
}

function CountdownTimer({ eventDate, eventTime, labels }) {
    const eventAt = useMemo(() => {
        if (!eventDate) return null;
        return new Date(`${eventDate}T${eventTime || "00:00:00"}`);
    }, [eventDate, eventTime]);
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    if (!eventAt || Number.isNaN(eventAt.getTime())) {
        return <div className="pub-empty-panel">—</div>;
    }

    const diff = eventAt.getTime() - now.getTime();
    if (diff <= 0) {
        return <div className="pub-countdown-started">{labels.started}</div>;
    }

    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const units = [
        ["Days", days],
        ["Hours", hours],
        ["Minutes", minutes],
        ["Seconds", remainingSeconds],
    ];

    return (
        <div className="pub-countdown">
            {units.map(([label, value]) => (
                <article key={label}>
                    <strong>{String(value).padStart(2, "0")}</strong>
                    <span>{label}</span>
                </article>
            ))}
        </div>
    );
}

function MusicButton({ src, labels }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const toggle = async () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
            return;
        }
        try {
            await audioRef.current.play();
            setPlaying(true);
        } catch {
            setPlaying(false);
        }
    };

    return (
        <div className="pub-music-control">
            <audio ref={audioRef} src={src} loop onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
            <button type="button" onClick={toggle} aria-label={playing ? labels.pause : labels.play}>
                {playing ? "Pause" : "Play"}
            </button>
        </div>
    );
}

function ShareButtons({ title, labels }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window === "undefined" ? "" : window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title || "Invitation");

    const copy = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch {
                // Fall back to clipboard below.
            }
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <div className="pub-share-buttons">
            <p className="pub-kicker">{labels.share}</p>
            <button type="button" onClick={copy}>{copied ? labels.copied : labels.copy}</button>
            <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">
                {labels.telegram}
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">
                {labels.messenger}
            </a>
        </div>
    );
}
