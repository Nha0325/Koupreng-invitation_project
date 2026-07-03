import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    IoCalendarOutline,
    IoCallOutline,
    IoCameraOutline,
    IoCheckmarkOutline,
    IoChevronDown,
    IoClose,
    IoCopyOutline,
    IoGiftOutline,
    IoHeartOutline,
    IoLocationOutline,
    IoMailOutline,
    IoPaperPlaneOutline,
    IoSparklesOutline,
    IoTimeOutline,
} from "react-icons/io5";
import { GiDiamondRing } from "react-icons/gi";

import TemplateImage from "../TemplateImage";
import TemplateMusicControl from "../controls/TemplateMusicControl";
import TemplateRsvp from "../sections/TemplateRsvp";

const NAV_ITEMS = [
    { id: "program", label: "កម្មវិធី", icon: IoCalendarOutline, section: "schedule" },
    { id: "location", label: "ទីតាំង", icon: IoLocationOutline, section: "map" },
    { id: "gallery", label: "រូបភាព", icon: IoCameraOutline, section: "gallery" },
    { id: "gift", label: "ចំណងដៃ", icon: IoGiftOutline, section: "gift" },
    { id: "wish", label: "ជូនពរ", icon: IoHeartOutline },
];

function textValue(value) {
    return typeof value === "string" ? value.trim() : "";
}

function meaningful(value) {
    const text = textValue(value);
    return text && !text.includes("...");
}

function mediaUrl(value) {
    return typeof value === "string" ? value : value?.url || "";
}

function CanvaKhmerOrnament({ light = false }) {
    return (
        <span className={`ck-ornament${light ? " ck-ornament--light" : ""}`} aria-hidden="true">
            <i />
            <GiDiamondRing />
            <i />
        </span>
    );
}

function CanvaKhmerSectionHeading({ english, title, icon: Icon }) {
    return (
        <header className="ck-heading">
            {Icon && <Icon aria-hidden="true" />}
            <p>{english}</p>
            <h2>{title}</h2>
            <CanvaKhmerOrnament />
        </header>
    );
}

export function CanvaKhmerOpeningCover({ content, onOpen }) {
    const [videoFailed, setVideoFailed] = useState(false);
    const video = mediaUrl(content.openingVideo);

    return (
        <motion.section
            className="ck-opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.6 }}
            aria-label="បើកសន្លឹកអញ្ជើញ"
        >
            <div className="ck-opening__sky" aria-hidden="true" />
            {video && !videoFailed ? (
                <video
                    className="ck-opening__media"
                    src={video}
                    poster={content.coverImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => setVideoFailed(true)}
                />
            ) : content.coverImage ? (
                <img className="ck-opening__media" src={content.coverImage} alt="" />
            ) : null}
            <span className="ck-garden ck-garden--opening" aria-hidden="true" />
            <span className="ck-floral-side ck-floral-side--left" aria-hidden="true" />
            <span className="ck-floral-side ck-floral-side--right" aria-hidden="true" />

            <div className="ck-opening__content">
                <p className="ck-opening__eyebrow">THE WEDDING INVITATION</p>
                <div className="ck-monogram" aria-label={`អក្សរកាត់ ${content.monogramText}`}>
                    <span>{content.monogramText}</span>
                </div>
                <h1>សិរីមង្គលអាពាហ៍ពិពាហ៍</h1>
                <CanvaKhmerOrnament />
                <p className="ck-opening__names">
                    <strong>{content.groom}</strong>
                    <em>{content.amp}</em>
                    <strong>{content.bride}</strong>
                </p>
                {content.dateText && <time>{content.dateText}</time>}
                <button type="button" className="ck-button ck-opening__button" onClick={onOpen}>
                    <IoSparklesOutline aria-hidden="true" />
                    ចុចទីនេះដើម្បីមើលព័ត៌មានលម្អិត
                </button>
                <small>Tap to open our invitation</small>
            </div>
        </motion.section>
    );
}

export function CanvaKhmerGardenHero({ content, sectionRef, onDetails }) {
    const nicknameLine = [content.groomNickname, content.brideNickname].filter(Boolean).join("  •  ");

    return (
        <section className="ck-hero" ref={sectionRef} aria-label="សិរីមង្គលអាពាហ៍ពិពាហ៍">
            <span className="ck-cloud ck-cloud--one" aria-hidden="true" />
            <span className="ck-cloud ck-cloud--two" aria-hidden="true" />
            <span className="ck-hero__lake" aria-hidden="true" />
            <span className="ck-hero__pavilion" aria-hidden="true" />
            <span className="ck-garden ck-garden--hero" aria-hidden="true" />
            {content.coverImage && (
                <div className="ck-hero__portrait">
                    <TemplateImage src={content.coverImage} alt={`${content.groom} និង ${content.bride}`} />
                </div>
            )}

            <div className="ck-hero__content">
                <p className="ck-hero__english">Together with our families</p>
                <div className="ck-monogram ck-monogram--small" aria-hidden="true">
                    <span>{content.monogramText}</span>
                </div>
                <h1>សិរីមង្គលអាពាហ៍ពិពាហ៍</h1>
                {content.eventTitle && <p className="ck-hero__event">{content.eventTitle}</p>}
                <div className="ck-hero__names">
                    <strong>{content.groom}</strong>
                    <em>{content.amp}</em>
                    <strong>{content.bride}</strong>
                </div>
                {nicknameLine && <p className="ck-hero__nicknames">{nicknameLine}</p>}
                <CanvaKhmerOrnament />
                {content.dateText && <p className="ck-hero__date">{content.dateText}</p>}
                {content.venue?.name && <p className="ck-hero__venue">{content.venue.name}</p>}
            </div>

            <button type="button" className="ck-hero__scroll" onClick={onDetails} aria-label="មើលព័ត៌មានអញ្ជើញ">
                <span>ព័ត៌មានលម្អិត</span>
                <IoChevronDown aria-hidden="true" />
            </button>
        </section>
    );
}

export function CanvaKhmerDetails({ content, sectionRef }) {
    const groomParents = meaningful(content.couple?.groomParents) ? content.couple.groomParents : "";
    const brideParents = meaningful(content.couple?.brideParents) ? content.couple.brideParents : "";
    const hasTime = content.ceremonyTime || content.receptionTime;

    return (
        <section className="ck-section ck-details" ref={sectionRef}>
            <span className="ck-leafy-frame" aria-hidden="true" />
            <p className="ck-details__kicker">សូមគោរពអញ្ជើញ</p>
            <h2>{content.eventTitle || "ចូលរួមជាភ្ញៀវកិត្តិយស"}</h2>
            <CanvaKhmerOrnament />
            {(groomParents || brideParents) && (
                <div className="ck-details__parents">
                    {groomParents && <p><span>មាតាបិតាកូនកំលោះ</span><strong>{groomParents}</strong></p>}
                    {brideParents && <p><span>មាតាបិតាកូនក្រមុំ</span><strong>{brideParents}</strong></p>}
                </div>
            )}
            <p className="ck-details__message">{content.message}</p>
            <div className="ck-details__couple">
                <strong>{content.groom}</strong>
                <em>{content.amp}</em>
                <strong>{content.bride}</strong>
            </div>
            {(content.dateText || hasTime) && (
                <div className="ck-details__meta">
                    {content.dateText && <p><IoCalendarOutline />{content.dateText}</p>}
                    {content.ceremonyTime && <p><IoTimeOutline />ពិធីមង្គលការ {content.ceremonyTime}</p>}
                    {content.receptionTime && <p><IoTimeOutline />ពិធីជប់លៀង {content.receptionTime}</p>}
                </div>
            )}
            {content.venue?.name && <p className="ck-details__place">{content.venue.name}</p>}
        </section>
    );
}

function remainingTime(target) {
    if (!target) return null;
    const distance = Math.max(0, target.getTime() - Date.now());
    return {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
    };
}

export function CanvaKhmerCountdown({ content }) {
    const target = useMemo(() => {
        if (!content.targetDate) return null;
        const date = new Date(content.targetDate);
        return Number.isNaN(date.getTime()) ? null : date;
    }, [content.targetDate]);
    const [remaining, setRemaining] = useState(() => remainingTime(target));

    useEffect(() => {
        setRemaining(remainingTime(target));
        if (!target) return undefined;
        const timer = window.setInterval(() => setRemaining(remainingTime(target)), 1000);
        return () => window.clearInterval(timer);
    }, [target]);

    if (!target || !remaining) return null;

    const units = [
        [remaining.days, "ថ្ងៃ"],
        [remaining.hours, "ម៉ោង"],
        [remaining.minutes, "នាទី"],
        [remaining.seconds, "វិនាទី"],
    ];

    return (
        <section className="ck-section ck-countdown">
            <p>COUNTING DOWN TO OUR DAY</p>
            <h2>រាប់ថយក្រោយ</h2>
            <div className="ck-countdown__grid">
                {units.map(([value, label]) => (
                    <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>
                ))}
            </div>
        </section>
    );
}

export function CanvaKhmerProgram({ content }) {
    const items = useMemo(() => {
        if (content.schedule?.length) return content.schedule;
        return [
            content.ceremonyTime && { id: "ceremony", time: content.ceremonyTime, title: "ពិធីមង្គលការ", titleEn: "Ceremony" },
            content.receptionTime && { id: "reception", time: content.receptionTime, title: "ពិធីជប់លៀង", titleEn: "Reception" },
        ].filter(Boolean);
    }, [content.ceremonyTime, content.receptionTime, content.schedule]);

    if (!items.length) return null;

    return (
        <section id="ck-program" className="ck-section ck-program">
            <CanvaKhmerSectionHeading english="WEDDING PROGRAM" title="កម្មវិធី" icon={IoCalendarOutline} />
            {content.dateText && <p className="ck-program__date">{content.dateText}</p>}
            <div className="ck-program__list">
                {items.map((item, index) => (
                    <motion.article
                        key={item.id || `${item.time}-${index}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <div className="ck-program__time"><IoTimeOutline /><time>{item.time}</time></div>
                        <div className="ck-program__copy">
                            <h3>{item.title}</h3>
                            {item.titleEn && <small>{item.titleEn}</small>}
                            {item.description && <p>{item.description}</p>}
                            {item.location && <p className="ck-program__location"><IoLocationOutline />{item.location}</p>}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

export function CanvaKhmerStory({ content }) {
    const chapters = content.story || [];
    if (!chapters.length) return null;

    return (
        <section className="ck-section ck-story">
            <CanvaKhmerSectionHeading english="OUR LOVE STORY" title="រឿងរ៉ាវរបស់យើង" icon={IoHeartOutline} />
            <div className="ck-story__chapters">
                {chapters.map((chapter, index) => (
                    <motion.article
                        key={chapter.id || index}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {chapter.image && (
                            <div className="ck-story__image"><TemplateImage src={chapter.image} alt={chapter.title || "រឿងរ៉ាវស្នេហា"} /></div>
                        )}
                        <div className="ck-story__copy">
                            {chapter.kicker && <small>{chapter.kicker}</small>}
                            <h3>{chapter.title}</h3>
                            {chapter.date && <time>{chapter.date}</time>}
                            {chapter.text && <p>{chapter.text}</p>}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

export function CanvaKhmerLocation({ content }) {
    const venue = content.venue || {};
    if (!venue.name && !venue.address && !venue.mapLink) return null;

    return (
        <section id="ck-location" className="ck-section ck-location">
            <CanvaKhmerSectionHeading english="LOCATION" title="ទីតាំងកម្មវិធី" icon={IoLocationOutline} />
            <div className="ck-location__illustration" aria-hidden="true">
                <span className="ck-location__pin"><IoLocationOutline /></span>
                <span className="ck-location__route" />
            </div>
            <div className="ck-location__copy">
                {venue.name && <h3>{venue.name}</h3>}
                {venue.address && <p>{venue.address}</p>}
                {venue.mapLink && (
                    <a className="ck-button" href={venue.mapLink} target="_blank" rel="noopener noreferrer">
                        <IoLocationOutline /> បើក Google Maps
                    </a>
                )}
            </div>
        </section>
    );
}

export function CanvaKhmerGallery({ content, showEmpty = false }) {
    const images = content.gallery || [];
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (active === null) return undefined;
        const onKeyDown = (event) => event.key === "Escape" && setActive(null);
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [active]);

    if (!images.length && !showEmpty) return null;

    return (
        <section id="ck-gallery" className="ck-section ck-gallery">
            <CanvaKhmerSectionHeading english="OUR GALLERY" title="រូបភាពអនុស្សាវរីយ៍" icon={IoCameraOutline} />
            {images.length ? (
                <div className="ck-gallery__grid">
                    {images.map((image, index) => (
                        <motion.button
                            type="button"
                            key={`${image.src}-${index}`}
                            className={index === 0 ? "ck-gallery__photo ck-gallery__photo--lead" : "ck-gallery__photo"}
                            onClick={() => setActive(index)}
                            aria-label={`មើលរូបភាពទី ${index + 1}`}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                        >
                            <TemplateImage src={image.src} alt={`រូបភាពអនុស្សាវរីយ៍ទី ${index + 1}`} />
                        </motion.button>
                    ))}
                </div>
            ) : (
                <div className="ck-gallery__empty"><IoCameraOutline /><p>រូបភាពអនុស្សាវរីយ៍នឹងបង្ហាញនៅទីនេះ</p></div>
            )}

            {active !== null && images[active] && (
                <div className="ck-lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
                    <button type="button" onClick={() => setActive(null)} aria-label="បិទរូបភាព"><IoClose /></button>
                    <div onClick={(event) => event.stopPropagation()}>
                        <TemplateImage src={images[active].src} alt={`រូបភាពអនុស្សាវរីយ៍ទី ${active + 1}`} />
                    </div>
                </div>
            )}
        </section>
    );
}

export function CanvaKhmerGift({ content }) {
    const accounts = content.gift || [];
    const [copied, setCopied] = useState("");

    if (!accounts.length) return null;

    const copyNumber = async (number, key) => {
        if (!number) return;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(number);
            } else {
                const input = document.createElement("textarea");
                input.value = number;
                input.style.position = "fixed";
                input.style.opacity = "0";
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                input.remove();
            }
            setCopied(key);
            window.setTimeout(() => setCopied(""), 1600);
        } catch {
            setCopied("");
        }
    };

    return (
        <section id="ck-gift" className="ck-section ck-gift">
            <CanvaKhmerSectionHeading english="A GIFT FROM THE HEART" title="ចំណងដៃ" icon={IoGiftOutline} />
            <p className="ck-gift__intro">វត្តមាន និងពរជ័យរបស់លោកអ្នក គឺជាអំណោយដ៏មានតម្លៃបំផុតសម្រាប់យើងខ្ញុំ</p>
            <div className="ck-gift__accounts">
                {accounts.map((account, index) => {
                    const key = account.id || `${account.bank}-${index}`;
                    return (
                        <article key={key}>
                            <div className="ck-gift__qr">
                                {account.qrImage ? <TemplateImage src={account.qrImage} alt={`QR ${account.bank}`} /> : <IoGiftOutline />}
                            </div>
                            <div>
                                <small>{account.note || "WEDDING GIFT"}</small>
                                <h3>{account.bank || "Bank account"}</h3>
                                {account.account && <p>{account.account}</p>}
                                {account.number && <strong>{account.number}</strong>}
                                {account.number && (
                                    <button type="button" onClick={() => copyNumber(account.number, key)}>
                                        {copied === key ? <IoCheckmarkOutline /> : <IoCopyOutline />}
                                        {copied === key ? "បានចម្លង" : "ចម្លងលេខគណនី"}
                                    </button>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export function CanvaKhmerWishRsvp({ content, children, useTemplateLink, showRsvp }) {
    return (
        <section id="ck-wish" className="ck-section ck-wish">
            <CanvaKhmerSectionHeading english="WISHES & RSVP" title="ជូនពរ" icon={IoHeartOutline} />
            {content.wish?.message && (
                <blockquote>
                    <span aria-hidden="true">“</span>
                    <p>{content.wish.message}</p>
                    <cite>{content.groom} {content.amp} {content.bride}</cite>
                </blockquote>
            )}
            {showRsvp && (
                <div className="ck-rsvp">
                    <div className="ck-rsvp__head">
                        <GiDiamondRing aria-hidden="true" />
                        <h3>សូមបញ្ជាក់ការចូលរួម</h3>
                        {content.rsvpDeadline && <p>សូមឆ្លើយតបមុនថ្ងៃទី {content.rsvpDeadline}</p>}
                    </div>
                    {children || <TemplateRsvp useTemplateLink={useTemplateLink} />}
                </div>
            )}
        </section>
    );
}

export function CanvaKhmerFaq({ content }) {
    const items = content.faq || [];
    if (!items.length) return null;
    return (
        <section className="ck-section ck-faq">
            <CanvaKhmerSectionHeading english="GOOD TO KNOW" title="សំណួរញឹកញាប់" icon={IoSparklesOutline} />
            <div className="ck-faq__list">
                {items.map((item, index) => (
                    <details key={item.id || index}>
                        <summary>{item.q}</summary>
                        <p>{item.a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

export function CanvaKhmerFooter({ content }) {
    const contact = content.contact || {};
    return (
        <footer className="ck-footer">
            <span className="ck-garden ck-garden--footer" aria-hidden="true" />
            <div className="ck-footer__content">
                <IoHeartOutline aria-hidden="true" />
                <p className="ck-footer__english">WITH LOVE AND GRATITUDE</p>
                <h2>សូមអរគុណ</h2>
                <CanvaKhmerOrnament light />
                <p>សូមអរគុណដែលបានចូលរួមចែករំលែកក្ដីស្រឡាញ់ និងអំណររបស់យើងខ្ញុំ</p>
                <strong>{content.groom} <em>{content.amp}</em> {content.bride}</strong>
                {content.dateText && <time>{content.dateText}</time>}
                <div className="ck-footer__contacts">
                    {contact.telegram && <a href={contact.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><IoPaperPlaneOutline /></a>}
                    {contact.phone && <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} aria-label={contact.phone}><IoCallOutline /></a>}
                    {contact.email && <a href={`mailto:${contact.email}`} aria-label={contact.email}><IoMailOutline /></a>}
                </div>
                <small>Powered by Koupreng</small>
            </div>
        </footer>
    );
}

export function CanvaKhmerBottomNav({ enabledSections, availableSections, onNavigate }) {
    const items = NAV_ITEMS.filter((item) => enabledSections?.[item.section] !== false && availableSections[item.id] !== false);
    return (
        <nav className="ck-bottom-nav" aria-label="រុករកសន្លឹកអញ្ជើញ" style={{ "--ck-nav-count": items.length }}>
            {items.map(({ id, label, icon: Icon }) => (
                <button type="button" key={id} onClick={() => onNavigate(id)}>
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                </button>
            ))}
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
    isHostedInvitation = false,
    children,
}) {
    const [opened, setOpened] = useState(preview);
    const canvasRef = useRef(null);
    const heroRef = useRef(null);
    const detailRef = useRef(null);
    const sectionEnabled = useCallback((key) => content.enabledSections?.[key] !== false, [content.enabledSections]);

    const navigateTo = useCallback((id) => {
        canvasRef.current?.querySelector(`#ck-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    const openInvitation = useCallback(() => setOpened(true), []);

    useEffect(() => {
        if (!opened || preview) return undefined;
        const frame = window.requestAnimationFrame(() => heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
        return () => window.cancelAnimationFrame(frame);
    }, [opened, preview]);

    const availableSections = useMemo(() => ({
        program: Boolean(content.schedule?.length || content.ceremonyTime || content.receptionTime),
        location: Boolean(content.venue?.name || content.venue?.address || content.venue?.mapLink),
        gallery: Boolean(content.gallery?.length || !isHostedInvitation),
        gift: Boolean(content.gift?.length),
        wish: sectionEnabled("wish") || sectionEnabled("rsvp"),
    }), [content, isHostedInvitation, sectionEnabled]);

    return (
        <div className={`ck-stage${preview ? " ck-stage--preview" : ""}`}>
            <div className="ck-canvas" ref={canvasRef}>
                <AnimatePresence mode="wait">
                    {!opened ? (
                        <CanvaKhmerOpeningCover key="cover" content={content} onOpen={openInvitation} />
                    ) : (
                        <motion.main key="invitation" className="ck-invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <CanvaKhmerGardenHero content={content} sectionRef={heroRef} onDetails={() => detailRef.current?.scrollIntoView({ behavior: "smooth" })} />
                            <CanvaKhmerDetails content={content} sectionRef={detailRef} />
                            {sectionEnabled("countdown") && <CanvaKhmerCountdown content={content} />}
                            {sectionEnabled("schedule") && <CanvaKhmerProgram content={content} />}
                            {sectionEnabled("story") && <CanvaKhmerStory content={content} />}
                            {sectionEnabled("map") && <CanvaKhmerLocation content={content} />}
                            {sectionEnabled("gallery") && <CanvaKhmerGallery content={content} showEmpty={!isHostedInvitation} />}
                            {sectionEnabled("gift") && <CanvaKhmerGift content={content} />}
                            {sectionEnabled("faq") && <CanvaKhmerFaq content={content} />}
                            {(sectionEnabled("wish") || sectionEnabled("rsvp")) && (
                                <CanvaKhmerWishRsvp
                                    content={content}
                                    useTemplateLink={useTemplateLink}
                                    showRsvp={sectionEnabled("rsvp")}
                                >
                                    {children}
                                </CanvaKhmerWishRsvp>
                            )}
                            <CanvaKhmerFooter content={content} />

                            {!preview && showActions && useTemplateLink && (
                                <div className="ck-template-actions">
                                    <Link className="ck-button" to={useTemplateLink}>{primaryCtaLabel}</Link>
                                    <Link className="ck-button ck-button--outline" to={backLink}>{backLabel}</Link>
                                </div>
                            )}
                        </motion.main>
                    )}
                </AnimatePresence>

                <TemplateMusicControl src={content.music} />
                {opened && showStickyCta && (
                    <CanvaKhmerBottomNav
                        enabledSections={content.enabledSections}
                        availableSections={availableSections}
                        onNavigate={navigateTo}
                    />
                )}
            </div>
        </div>
    );
}
