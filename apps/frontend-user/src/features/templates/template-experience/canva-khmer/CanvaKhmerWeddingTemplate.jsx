import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    IoCalendarOutline,
    IoCallOutline,
    IoCameraOutline,
    IoCheckmarkOutline,
    IoCopyOutline,
    IoGiftOutline,
    IoHeartOutline,
    IoLocationOutline,
    IoLogoFacebook,
    IoMailOutline,
    IoPaperPlaneOutline,
    IoTimeOutline,
} from "react-icons/io5";

import TemplateImage from "../TemplateImage";
import TemplateMusicControl from "../controls/TemplateMusicControl";
import TemplateRsvp from "../sections/TemplateRsvp";

const ASSET_ROOT = "/invitations/canva-khmer";
const NAV_ITEMS = [
    { id: "program", label: "កម្មវិធី", icon: IoCalendarOutline, section: "schedule" },
    { id: "location", label: "ទីតាំង", icon: IoLocationOutline, section: "map" },
    { id: "gallery", label: "រូបភាព", icon: IoCameraOutline, section: "gallery" },
    { id: "gift", label: "ចំណងដៃ", icon: IoGiftOutline, section: "gift" },
    { id: "wish", label: "ជូនពរ", icon: IoHeartOutline, section: "wish" },
];

function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function meaningful(value) {
    const text = cleanText(value);
    return text && !text.includes("...");
}

function CanvaArtwork({ name }) {
    return <span className="ck-artwork" style={{ "--ck-art": `url("${ASSET_ROOT}/sections/${name}.webp")` }} aria-hidden="true" />;
}

function SectionTitle({ english, children }) {
    return (
        <header className="ck-section-title">
            <small>{english}</small>
            <h2>{children}</h2>
        </header>
    );
}

function useCountdown(targetDate) {
    const target = useMemo(() => {
        const date = targetDate ? new Date(targetDate) : null;
        return date && !Number.isNaN(date.getTime()) ? date : null;
    }, [targetDate]);
    const [remaining, setRemaining] = useState(null);

    useEffect(() => {
        if (!target) {
            setRemaining(null);
            return undefined;
        }
        const update = () => {
            const distance = Math.max(0, target.getTime() - Date.now());
            setRemaining({
                days: Math.floor(distance / 86400000),
                hours: Math.floor((distance / 3600000) % 24),
                minutes: Math.floor((distance / 60000) % 60),
                seconds: Math.floor((distance / 1000) % 60),
            });
        };
        update();
        const timer = window.setInterval(update, 1000);
        return () => window.clearInterval(timer);
    }, [target]);

    return remaining;
}

function CanvaKhmerOpeningCover({ content, onOpen }) {
    return (
        <motion.section
            className="ck-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.5 }}
            aria-label="បើកសន្លឹកអញ្ជើញ"
        >
            <img className="ck-cover__art" src={`${ASSET_ROOT}/CoverKhmer.svg`} alt="" />
            <div className="ck-cover__monogram" aria-label={`អក្សរកាត់ ${content.monogramText}`}>{content.monogramText}</div>
            <div className="ck-cover__title">
                <small>THE WEDDING INVITATION</small>
                <h1>{content.eventTitle || "សិរីមង្គលអាពាហ៍ពិពាហ៍"}</h1>
            </div>
            <p className="ck-cover__names">
                <strong>{content.groom}</strong>
                <span>❦</span>
                <strong>{content.bride}</strong>
            </p>
            <button type="button" className="ck-cover__open" onClick={onOpen}>
                ចុចទីនេះដើម្បីមើលព័ត៌មានលម្អិត
            </button>
            {content.dateText && <time className="ck-cover__date">{content.dateText}</time>}
        </motion.section>
    );
}

function CanvaKhmerHero({ content, sectionRef, onDetails }) {
    const nicknames = [content.groomNickname, content.brideNickname].filter(Boolean).join(" · ");
    return (
        <section className="ck-slice ck-hero" ref={sectionRef} data-ck-section="hero">
            <CanvaArtwork name="hero" />
            <div className="ck-hero__copy">
                <p>THE WEDDING INVITATION</p>
                <div className="ck-hero__monogram">{content.monogramText}</div>
                <h1>{content.eventTitle || "សិរីមង្គលអាពាហ៍ពិពាហ៍"}</h1>
                <div className="ck-hero__names"><strong>{content.groom}</strong><span>❦</span><strong>{content.bride}</strong></div>
                {nicknames && <small>{nicknames}</small>}
                {content.dateText && <time>{content.dateText}</time>}
                {content.venue?.name && <b>{content.venue.name}</b>}
                <button type="button" onClick={onDetails}>សូមគោរពអញ្ជើញ</button>
            </div>
        </section>
    );
}

function CanvaKhmerDetails({ content, sectionRef, showCountdown }) {
    const remaining = useCountdown(showCountdown ? content.targetDate : null);
    const parents = [
        ["មាតាបិតាកូនកំលោះ", content.couple?.groomParents],
        ["មាតាបិតាកូនក្រមុំ", content.couple?.brideParents],
    ].filter(([, value]) => meaningful(value));
    const units = remaining ? [
        [remaining.days, "ថ្ងៃ"],
        [remaining.hours, "ម៉ោង"],
        [remaining.minutes, "នាទី"],
        [remaining.seconds, "វិនាទី"],
    ] : [];

    return (
        <section className="ck-slice ck-details" ref={sectionRef}>
            <CanvaArtwork name="details" />
            <div className="ck-details__paper">
                <SectionTitle english="TOGETHER WITH OUR FAMILIES">សូមគោរពអញ្ជើញ</SectionTitle>
                {parents.length > 0 && (
                    <div className="ck-details__parents">
                        {parents.map(([label, value]) => <p key={label}><small>{label}</small><strong>{value}</strong></p>)}
                    </div>
                )}
                <p className="ck-details__message">{content.message}</p>
                <div className="ck-details__names"><strong>{content.groom}</strong><span>❦</span><strong>{content.bride}</strong></div>
                <div className="ck-details__meta">
                    {content.dateText && <p><IoCalendarOutline />{content.dateText}</p>}
                    {content.ceremonyTime && <p><IoTimeOutline />ពិធីមង្គលការ {content.ceremonyTime}</p>}
                    {content.receptionTime && <p><IoTimeOutline />ពិធីជប់លៀង {content.receptionTime}</p>}
                    {content.venue?.name && <p><IoLocationOutline />{content.venue.name}</p>}
                </div>
                {units.length > 0 && (
                    <div className="ck-countdown" aria-label="រាប់ថយក្រោយ">
                        {units.map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, "0")}</strong><small>{label}</small></div>)}
                    </div>
                )}
            </div>
        </section>
    );
}

function CanvaKhmerProgram({ content }) {
    const items = useMemo(() => {
        if (content.schedule?.length) return content.schedule.slice(0, 7);
        return [
            content.ceremonyTime && { id: "ceremony", time: content.ceremonyTime, title: "ពិធីមង្គលការ" },
            content.receptionTime && { id: "reception", time: content.receptionTime, title: "ពិធីជប់លៀង" },
        ].filter(Boolean);
    }, [content.ceremonyTime, content.receptionTime, content.schedule]);

    if (!items.length) return null;
    return (
        <section id="ck-program" className="ck-slice ck-program">
            <CanvaArtwork name="program" />
            <div className="ck-program__paper">
                <SectionTitle english="WEDDING PROGRAM">កម្មវិធីមង្គលការ</SectionTitle>
                {content.dateText && <time className="ck-program__date">{content.dateText}</time>}
                <div className="ck-program__list">
                    {items.map((item, index) => (
                        <article key={item.id || `${item.time}-${index}`}>
                            <div className="ck-program__icon"><IoTimeOutline /></div>
                            <div><time>{item.time}</time><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}{item.location && <small>{item.location}</small>}</div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CanvaKhmerLocation({ content }) {
    const venue = content.venue || {};
    if (!venue.name && !venue.address && !venue.mapLink) return null;
    return (
        <section id="ck-location" className="ck-slice ck-location">
            <CanvaArtwork name="location" />
            <div className="ck-location__title"><SectionTitle english="LOCATION">ទីតាំងកម្មវិធី</SectionTitle></div>
            <div className="ck-location__info">
                {venue.name && <h3>{venue.name}</h3>}
                {venue.address && <p>{venue.address}</p>}
                {venue.mapLink && <a href={venue.mapLink} target="_blank" rel="noopener noreferrer"><IoLocationOutline /> បើក Google Maps</a>}
            </div>
        </section>
    );
}

function CanvaKhmerStory({ content }) {
    const chapters = content.story || [];
    const hasStory = chapters.some((chapter) => chapter.title || chapter.text) || cleanText(content.message);
    if (!hasStory) return null;
    return (
        <section className="ck-slice ck-story">
            <CanvaArtwork name="story" />
            <div className="ck-story__paper">
                <SectionTitle english="OUR STORY">រឿងរ៉ាវរបស់យើង</SectionTitle>
                <div className="ck-story__chapters">
                    {chapters.length ? chapters.map((chapter, index) => (
                        <article key={chapter.id || index}>
                            <div>{chapter.kicker && <small>{chapter.kicker}</small>}<h3>{chapter.title}</h3>{chapter.date && <time>{chapter.date}</time>}</div>
                            {chapter.text && <p>{chapter.text}</p>}
                        </article>
                    )) : <p>{content.message}</p>}
                </div>
            </div>
        </section>
    );
}

const GALLERY_FRAMES = [
    { left: 6, top: 12.2, width: 88, height: 45.2 },
    { left: 4.5, top: 59.1, width: 44.2, height: 18.8 },
    { left: 51.3, top: 59.1, width: 44.2, height: 18.8 },
    { left: 4.5, top: 79.5, width: 44.2, height: 19.1 },
    { left: 51.3, top: 79.5, width: 44.2, height: 19.1 },
];

function CanvaKhmerGallery({ content }) {
    const images = content.gallery || [];
    const [active, setActive] = useState(null);
    useEffect(() => {
        if (active === null) return undefined;
        const close = (event) => event.key === "Escape" && setActive(null);
        document.addEventListener("keydown", close);
        return () => document.removeEventListener("keydown", close);
    }, [active]);

    return (
        <section id="ck-gallery" className="ck-slice ck-gallery">
            <CanvaArtwork name="gallery" />
            {images.slice(0, GALLERY_FRAMES.length).map((image, index) => {
                const frame = GALLERY_FRAMES[index];
                return (
                    <button
                        type="button"
                        className="ck-gallery__photo"
                        style={{ left: `${frame.left}%`, top: `${frame.top}%`, width: `${frame.width}%`, height: `${frame.height}%` }}
                        key={`${image.src}-${index}`}
                        onClick={() => setActive(index)}
                        aria-label={`មើលរូបភាពទី ${index + 1}`}
                    >
                        <TemplateImage src={image.src} alt={`រូបភាពអនុស្សាវរីយ៍ទី ${index + 1}`} />
                        {index === GALLERY_FRAMES.length - 1 && images.length > GALLERY_FRAMES.length && <span>+{images.length - GALLERY_FRAMES.length}</span>}
                    </button>
                );
            })}
            {active !== null && images[active] && (
                <div className="ck-lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
                    <button type="button" onClick={() => setActive(null)} aria-label="បិទ">×</button>
                    <div onClick={(event) => event.stopPropagation()}><TemplateImage src={images[active].src} alt="រូបភាពអនុស្សាវរីយ៍" /></div>
                </div>
            )}
        </section>
    );
}

function CanvaKhmerGift({ content }) {
    const accounts = content.gift || [];
    const [selected, setSelected] = useState(0);
    const [copied, setCopied] = useState(false);
    const account = accounts[selected] || accounts[0];
    if (!account) return null;

    const copyNumber = async () => {
        if (!account.number) return;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(account.number);
            } else {
                const input = document.createElement("textarea");
                input.value = account.number;
                input.style.position = "fixed";
                input.style.opacity = "0";
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                input.remove();
            }
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <section id="ck-gift" className="ck-slice ck-gift">
            <CanvaArtwork name="gift" />
            <div className="ck-gift__card">
                <SectionTitle english="A GIFT FROM THE HEART">ចំណងដៃ</SectionTitle>
                <p className="ck-gift__note">{account.note || "វត្តមាន និងពរជ័យរបស់លោកអ្នក គឺជាអំណោយដ៏មានតម្លៃបំផុត"}</p>
                <h3>{account.bank || "ធនាគារ"}</h3>
                {account.account && <p>{account.account}</p>}
                {account.number && <strong>{account.number}</strong>}
                <div className="ck-gift__qr">{account.qrImage ? <TemplateImage src={account.qrImage} alt={`QR ${account.bank || "ធនាគារ"}`} /> : <IoGiftOutline />}</div>
                {account.number && <button type="button" onClick={copyNumber}>{copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}{copied ? "បានចម្លង" : "ចម្លងលេខគណនី"}</button>}
                {accounts.length > 1 && (
                    <div className="ck-gift__tabs">
                        {accounts.map((item, index) => <button type="button" className={selected === index ? "is-active" : ""} key={item.id || index} onClick={() => setSelected(index)}>{item.bank || index + 1}</button>)}
                    </div>
                )}
            </div>
        </section>
    );
}

function CanvaKhmerWishRsvp({ content, children, useTemplateLink, showRsvp }) {
    return (
        <section id="ck-wish" className="ck-slice ck-wish">
            <CanvaArtwork name="rsvp" />
            <div className="ck-wish__panel">
                <SectionTitle english="WISHES & RSVP">ជូនពរ</SectionTitle>
                {content.wish?.message && <blockquote><p>{content.wish.message}</p><cite>{content.groom} ❦ {content.bride}</cite></blockquote>}
                {showRsvp && (
                    <div className="ck-rsvp">
                        {content.rsvpDeadline && <p className="ck-rsvp__deadline">សូមឆ្លើយតបមុនថ្ងៃទី {content.rsvpDeadline}</p>}
                        {children || <TemplateRsvp useTemplateLink={useTemplateLink} />}
                    </div>
                )}
            </div>
        </section>
    );
}

function CanvaKhmerFooter({ content }) {
    const contact = content.contact || {};
    return (
        <footer className="ck-slice ck-footer">
            <CanvaArtwork name="footer" />
            <div>
                <small>WITH LOVE AND GRATITUDE</small>
                <h2>សូមអរគុណ</h2>
                <p>{content.groom} <span>❦</span> {content.bride}</p>
                {content.dateText && <time>{content.dateText}</time>}
                <nav aria-label="ទំនាក់ទំនង">
                    {contact.telegram && <a href={contact.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><IoPaperPlaneOutline /></a>}
                    {contact.phone && <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} aria-label={contact.phone}><IoCallOutline /></a>}
                    {contact.email && <a href={`mailto:${contact.email}`} aria-label={contact.email}><IoMailOutline /></a>}
                    {contact.facebook && <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IoLogoFacebook /></a>}
                </nav>
            </div>
        </footer>
    );
}

function CanvaKhmerBottomNav({ enabledSections, availableSections, onNavigate }) {
    const items = NAV_ITEMS.filter((item) => enabledSections?.[item.section] !== false && availableSections[item.id] !== false);
    return (
        <nav className="ck-bottom-nav" aria-label="រុករកសន្លឹកអញ្ជើញ" style={{ "--ck-nav-count": items.length }}>
            {items.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => onNavigate(id)}><Icon /><span>{label}</span></button>)}
        </nav>
    );
}

export default function CanvaKhmerWeddingTemplate({
    content,
    useTemplateLink,
    backLink = "/templates",
    backLabel = "ត្រឡប់ទៅគំរូទាំងអស់",
    primaryCtaLabel = "ប្រើគំរូនេះ",
    preview = false,
    showActions = true,
    showStickyCta = true,
    children,
}) {
    const [opened, setOpened] = useState(preview);
    const canvasRef = useRef(null);
    const heroRef = useRef(null);
    const detailRef = useRef(null);
    const sectionEnabled = useCallback((key) => content.enabledSections?.[key] !== false, [content.enabledSections]);
    const navigateTo = useCallback((id) => canvasRef.current?.querySelector(`#ck-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), []);

    useEffect(() => {
        if (!opened || preview) return undefined;
        const frame = window.requestAnimationFrame(() => heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
        return () => window.cancelAnimationFrame(frame);
    }, [opened, preview]);

    const availableSections = {
        program: Boolean(content.schedule?.length || content.ceremonyTime || content.receptionTime),
        location: Boolean(content.venue?.name || content.venue?.address || content.venue?.mapLink),
        gallery: true,
        gift: Boolean(content.gift?.length),
        wish: sectionEnabled("wish") || sectionEnabled("rsvp"),
    };

    return (
        <div className={`ck-page${preview ? " ck-page--preview" : ""}`}>
            <div className="ck-phone" ref={canvasRef}>
                <AnimatePresence mode="wait">
                    {!opened ? (
                        <CanvaKhmerOpeningCover key="cover" content={content} onOpen={() => setOpened(true)} />
                    ) : (
                        <motion.main key="invitation" className="ck-invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <CanvaKhmerHero content={content} sectionRef={heroRef} onDetails={() => detailRef.current?.scrollIntoView({ behavior: "smooth" })} />
                            <CanvaKhmerDetails content={content} sectionRef={detailRef} showCountdown={sectionEnabled("countdown")} />
                            {sectionEnabled("schedule") && <CanvaKhmerProgram content={content} />}
                            {sectionEnabled("map") && <CanvaKhmerLocation content={content} />}
                            {sectionEnabled("story") && <CanvaKhmerStory content={content} />}
                            {sectionEnabled("gallery") && <CanvaKhmerGallery content={content} />}
                            {sectionEnabled("gift") && <CanvaKhmerGift content={content} />}
                            {(sectionEnabled("wish") || sectionEnabled("rsvp")) && <CanvaKhmerWishRsvp content={content} useTemplateLink={useTemplateLink} showRsvp={sectionEnabled("rsvp")}>{children}</CanvaKhmerWishRsvp>}
                            <CanvaKhmerFooter content={content} />
                            {!preview && showActions && useTemplateLink && <div className="ck-actions"><Link to={useTemplateLink}>{primaryCtaLabel}</Link><Link to={backLink}>{backLabel}</Link></div>}
                        </motion.main>
                    )}
                </AnimatePresence>
                <TemplateMusicControl src={content.music} />
                {opened && showStickyCta && <CanvaKhmerBottomNav enabledSections={content.enabledSections} availableSections={availableSections} onNavigate={navigateTo} />}
            </div>
        </div>
    );
}
