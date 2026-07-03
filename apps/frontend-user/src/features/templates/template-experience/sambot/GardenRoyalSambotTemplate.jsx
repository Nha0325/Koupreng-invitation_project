import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    IoCalendarOutline,
    IoCallOutline,
    IoCameraOutline,
    IoChatbubbleEllipsesOutline,
    IoCheckmarkOutline,
    IoChevronDown,
    IoClose,
    IoCopyOutline,
    IoGiftOutline,
    IoHeartOutline,
    IoLocationOutline,
    IoLogoFacebook,
    IoMapOutline,
    IoPaperPlaneOutline,
    IoSparklesOutline,
    IoTimeOutline,
} from "react-icons/io5";
import { GiDiamondRing } from "react-icons/gi";

import TemplateImage from "../TemplateImage";
import TemplateMusicControl from "../controls/TemplateMusicControl";
import TemplateRsvp from "../sections/TemplateRsvp";

const NAV_ITEMS = [
    { id: "program", label: "កម្មវិធី", icon: IoCalendarOutline, sectionKey: "schedule" },
    { id: "location", label: "ទីតាំង", icon: IoLocationOutline, sectionKey: "map" },
    { id: "gallery", label: "រូបភាព", icon: IoCameraOutline, sectionKey: "gallery" },
    { id: "thanks", label: "អរគុណ", icon: IoHeartOutline },
    { id: "wish", label: "ជូនពរ", icon: IoChatbubbleEllipsesOutline, sectionKey: "wish" },
];

function isMeaningful(value) {
    return typeof value === "string" && value.trim() && !value.includes("...");
}

function openingVideoUrl(value) {
    if (typeof value === "string") return value;
    return value?.url || "";
}

function SambotMedia({ src, alt, className = "", eager = false }) {
    const [failed, setFailed] = useState(!src);

    useEffect(() => {
        setFailed(!src);
    }, [src]);

    if (failed) {
        return (
            <div className={`grs-media-fallback ${className}`} role="img" aria-label={alt}>
                <span className="grs-media-fallback__flower" aria-hidden="true" />
            </div>
        );
    }

    return (
        <img
            className={className}
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            onError={() => setFailed(true)}
        />
    );
}

function SambotSectionTitle({ english, title, icon: Icon }) {
    return (
        <header className="grs-heading">
            {Icon && <Icon className="grs-heading__icon" aria-hidden="true" />}
            <p>{english}</p>
            <h2>{title}</h2>
            <span className="grs-divider" aria-hidden="true" />
        </header>
    );
}

function SambotOpeningScreen({ content, onOpen }) {
    const [videoFailed, setVideoFailed] = useState(false);
    const videoUrl = openingVideoUrl(content.openingVideo);

    return (
        <motion.section
            className="grs-opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            aria-label="បើកសន្លឹកការ"
        >
            {videoUrl && !videoFailed ? (
                <video
                    className="grs-opening__media"
                    src={videoUrl}
                    poster={content.coverImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onError={() => setVideoFailed(true)}
                    aria-hidden="true"
                />
            ) : (
                <SambotMedia
                    className="grs-opening__media"
                    src={content.coverImage}
                    alt={`${content.groom} និង ${content.bride}`}
                    eager
                />
            )}
            <span className="grs-opening__overlay" aria-hidden="true" />
            <span className="grs-opening__texture" aria-hidden="true" />
            <span className="grs-frame grs-frame--opening" aria-hidden="true" />
            <span className="grs-petal grs-petal--a" aria-hidden="true" />
            <span className="grs-petal grs-petal--b" aria-hidden="true" />
            <span className="grs-sparkle grs-sparkle--a" aria-hidden="true"><IoSparklesOutline /></span>

            <div className="grs-opening__content">
                <p className="grs-opening__kh-title">សិរីមង្គលអាពាហ៍ពិពាហ៍</p>
                <p className="grs-opening__english">The Wedding Celebration</p>
                <span className="grs-opening__line" aria-hidden="true" />
                <h1>
                    <span>{content.groom}</span>
                    <em>{content.amp}</em>
                    <span>{content.bride}</span>
                </h1>
                {content.dateText && <p className="grs-opening__date">{content.dateText}</p>}
                <button type="button" className="grs-button grs-opening__button" onClick={onOpen}>
                    <GiDiamondRing aria-hidden="true" />
                    ចុចដើម្បីបើក
                </button>
                <small>Tap to view invitation details</small>
            </div>
        </motion.section>
    );
}

function SambotPosterSection({ content, sectionRef, onDetails }) {
    const venueShort = (content.venue?.name || "").split(",")[0].trim();

    return (
        <section className="grs-poster" ref={sectionRef} aria-label="សន្លឹកការមង្គលការ">
            <SambotMedia
                className="grs-poster__media"
                src={content.coverImage}
                alt={`${content.groom} និង ${content.bride}`}
                eager
            />
            <span className="grs-poster__overlay" aria-hidden="true" />
            <span className="grs-frame grs-frame--poster" aria-hidden="true" />
            <span className="grs-petal grs-petal--poster-a" aria-hidden="true" />
            <span className="grs-petal grs-petal--poster-b" aria-hidden="true" />

            <div className="grs-poster__content">
                <div className="grs-monogram" aria-hidden="true">
                    <span>{content.monogramText}</span>
                </div>
                <p className="grs-poster__title">សិរីមង្គលអាពាហ៍ពិពាហ៍</p>
                <p className="grs-poster__english">Together with their families</p>
                <h2>
                    <span>{content.groom}</span>
                    <em>{content.amp}</em>
                    <span>{content.bride}</span>
                </h2>
                <span className="grs-divider grs-divider--light" aria-hidden="true" />
                {content.dateText && (
                    <p className="grs-poster__meta"><IoCalendarOutline aria-hidden="true" />{content.dateText}</p>
                )}
                {venueShort && (
                    <p className="grs-poster__meta"><IoLocationOutline aria-hidden="true" />{venueShort}</p>
                )}
            </div>

            <button type="button" className="grs-poster__scroll" onClick={onDetails} aria-label="មើលព័ត៌មានលម្អិត">
                <span>ព័ត៌មានលម្អិត</span>
                <IoChevronDown aria-hidden="true" />
            </button>
        </section>
    );
}

function SambotDetailSection({ content, sectionRef }) {
    const groomParents = isMeaningful(content.couple?.groomParents) ? content.couple.groomParents : "";
    const brideParents = isMeaningful(content.couple?.brideParents) ? content.couple.brideParents : "";

    return (
        <section className="grs-section grs-detail" ref={sectionRef}>
            <span className="grs-paper-corner grs-paper-corner--top" aria-hidden="true" />
            <div className="grs-detail__seal" aria-hidden="true"><GiDiamondRing /></div>
            <p className="grs-detail__small">សូមគោរពអញ្ជើញ</p>
            <h2>ពិធីមង្គលការរបស់យើងខ្ញុំ</h2>
            <span className="grs-divider" aria-hidden="true" />
            <p className="grs-detail__message">{content.message}</p>
            {(groomParents || brideParents) && (
                <div className="grs-detail__parents">
                    {groomParents && <p><span>ខាងកូនកំលោះ</span>{groomParents}</p>}
                    {brideParents && <p><span>ខាងកូនក្រមុំ</span>{brideParents}</p>}
                </div>
            )}
            <p className="grs-detail__couple">
                <span>{content.groom}</span>
                <em>{content.amp}</em>
                <span>{content.bride}</span>
            </p>
            {content.dateText && <p className="grs-detail__date">{content.dateText}</p>}
            <span className="grs-paper-corner grs-paper-corner--bottom" aria-hidden="true" />
        </section>
    );
}

function SambotProgramSection({ content }) {
    const items = useMemo(() => {
        if (content.schedule?.length) return content.schedule;
        return [
            content.ceremonyTime && {
                id: "ceremony",
                time: content.ceremonyTime,
                title: "ពិធីមង្គលការ",
                titleEn: "Ceremony",
            },
            content.receptionTime && {
                id: "reception",
                time: content.receptionTime,
                title: "ពិធីជប់លៀង",
                titleEn: "Reception",
            },
        ].filter(Boolean);
    }, [content.ceremonyTime, content.receptionTime, content.schedule]);

    if (!items.length) return null;

    return (
        <section id="grs-program" className="grs-section grs-program">
            <SambotSectionTitle english="WEDDING PROGRAM" title="កម្មវិធី" icon={IoCalendarOutline} />
            {content.dateText && <p className="grs-program__date">{content.dateText}</p>}
            <div className="grs-program__timeline">
                {items.map((item, index) => (
                    <motion.article
                        className="grs-program__item"
                        key={item.id || `${item.time}-${index}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.45, delay: index * 0.04 }}
                    >
                        <span className="grs-program__node" aria-hidden="true">
                            {index % 2 === 0 ? <IoTimeOutline /> : <IoCalendarOutline />}
                        </span>
                        <div>
                            <time>{item.time}</time>
                            <h3>{item.title}</h3>
                            {item.titleEn && <small>{item.titleEn}</small>}
                            {item.description && <p>{item.description}</p>}
                            {item.location && <p className="grs-program__place">{item.location}</p>}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

function SambotLocationSection({ content }) {
    const venue = content.venue || {};
    const [mapState, setMapState] = useState(venue.mapEmbedUrl ? "loading" : "fallback");
    const hasLocation = venue.name || venue.address || venue.mapLink || venue.mapEmbedUrl;

    useEffect(() => {
        if (!venue.mapEmbedUrl) {
            setMapState("fallback");
            return undefined;
        }

        setMapState("loading");
        const fallbackTimer = window.setTimeout(() => {
            setMapState((current) => (current === "loading" ? "fallback" : current));
        }, 5000);

        return () => window.clearTimeout(fallbackTimer);
    }, [venue.mapEmbedUrl]);

    if (!hasLocation) return null;

    const mapReady = mapState === "ready";
    const showIframe = Boolean(venue.mapEmbedUrl) && mapState !== "fallback";

    const locationActions = (
        <div className="grs-location__actions">
            {venue.mapLink && (
                <a className="grs-button" href={venue.mapLink} target="_blank" rel="noopener noreferrer">
                    <IoLocationOutline aria-hidden="true" />
                    បើកផែនទី
                </a>
            )}
            {content.contact?.facebook && (
                <a className="grs-button grs-button--outline" href={content.contact.facebook} target="_blank" rel="noopener noreferrer">
                    <IoLogoFacebook aria-hidden="true" />
                    Facebook
                </a>
            )}
        </div>
    );

    return (
        <section id="grs-location" className="grs-section grs-location">
            <SambotSectionTitle english="LOCATION" title="ទីតាំងកម្មវិធី" icon={IoLocationOutline} />
            <div className="grs-location__panel" data-map-state={mapState}>
                <div className={`grs-location__map${mapReady ? " is-ready" : " is-fallback"}`}>
                    <div className="grs-location__fallback">
                        <span className="grs-location__fallback-pin" aria-hidden="true"><IoLocationOutline /></span>
                        <p className="grs-location__fallback-label">LOCATION</p>
                        <h3>{venue.name || "ទីតាំងកម្មវិធី"}</h3>
                        {venue.address && <p className="grs-location__fallback-address">{venue.address}</p>}
                        <p className="grs-location__fallback-note">សូមបើក Google Maps ដើម្បីមើលទិសដៅ</p>
                        {locationActions}
                    </div>
                    {showIframe && (
                        <iframe
                            className={mapReady ? "is-ready" : ""}
                            src={venue.mapEmbedUrl}
                            title={`ផែនទី ${venue.name || "ទីតាំងកម្មវិធី"}`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                            onLoad={() => setMapState("ready")}
                            onError={() => setMapState("fallback")}
                        />
                    )}
                    {mapReady && <span className="grs-location__map-frame" aria-hidden="true" />}
                </div>
                {mapReady && (
                    <div className="grs-location__copy">
                        <span className="grs-location__pin" aria-hidden="true"><IoMapOutline /></span>
                        {venue.name && <h3>{venue.name}</h3>}
                        {venue.address && <p>{venue.address}</p>}
                        {locationActions}
                    </div>
                )}
            </div>
        </section>
    );
}

function SambotGallerySection({ content, showEmpty = false }) {
    const images = content.gallery || [];
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        if (activeIndex === null) return undefined;
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setActiveIndex(null);
        };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [activeIndex]);

    if (!images.length && !showEmpty) return null;

    return (
        <section id="grs-gallery" className="grs-section grs-gallery">
            <SambotSectionTitle english="OUR GALLERY" title="រូបភាពអនុស្សាវរីយ៍" icon={IoCameraOutline} />
            {images.length ? (
                <div className="grs-gallery__stack">
                    {images.map((image, index) => (
                        <motion.button
                            type="button"
                            className="grs-gallery__photo"
                            key={`${image.src}-${index}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`មើលរូបភាពទី ${index + 1}`}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.18 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TemplateImage src={image.src} alt={`រូបភាពអនុស្សាវរីយ៍ ${index + 1}`} />
                            <span>{String(index + 1).padStart(2, "0")}</span>
                        </motion.button>
                    ))}
                </div>
            ) : (
                <div className="grs-gallery__empty">
                    <IoCameraOutline aria-hidden="true" />
                    <p>រូបភាពអនុស្សាវរីយ៍នឹងបង្ហាញនៅទីនេះ</p>
                    <small>Wedding memories coming soon</small>
                </div>
            )}

            {activeIndex !== null && images[activeIndex] && (
                <div className="grs-lightbox" role="dialog" aria-modal="true" onClick={() => setActiveIndex(null)}>
                    <button type="button" onClick={() => setActiveIndex(null)} aria-label="បិទ"><IoClose /></button>
                    <TemplateImage
                        src={images[activeIndex].src}
                        alt={`រូបភាពអនុស្សាវរីយ៍ ${activeIndex + 1}`}
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}

function SambotGiftSection({ content }) {
    const accounts = content.gift || [];
    const [copiedId, setCopiedId] = useState("");
    if (!accounts.length) return null;

    const copyNumber = async (number, key) => {
        if (!number) return;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(number);
            } else {
                const input = document.createElement("textarea");
                input.value = number;
                input.setAttribute("readonly", "");
                input.style.position = "fixed";
                input.style.opacity = "0";
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                input.remove();
            }
            setCopiedId(key);
            window.setTimeout(() => setCopiedId(""), 1600);
        } catch {
            setCopiedId("");
        }
    };

    return (
        <section className="grs-section grs-gift">
            <SambotSectionTitle english="GIFT" title="ចំណងដៃ" icon={IoGiftOutline} />
            <p className="grs-gift__intro">វត្តមាន និងពរជ័យរបស់លោកអ្នក គឺជាអំណោយដ៏មានតម្លៃបំផុត</p>
            <div className="grs-gift__list">
                {accounts.map((account, index) => {
                    const key = account.id || `${account.bank}-${index}`;
                    const copied = copiedId === key;
                    return (
                        <article className="grs-gift__account" key={key}>
                            <div className="grs-gift__qr">
                                {account.qrImage ? (
                                    <TemplateImage src={account.qrImage} alt={`QR ${account.bank || "គណនី"}`} />
                                ) : (
                                    <span aria-label="QR payment placeholder"><IoGiftOutline /><small>QR</small></span>
                                )}
                            </div>
                            <div className="grs-gift__copy">
                                <div>
                                    <h3>{account.bank}</h3>
                                    {account.note && <small>{account.note}</small>}
                                </div>
                                {account.account && <p>{account.account}</p>}
                                {account.number && <strong>{account.number}</strong>}
                                {account.number && (
                                    <button type="button" onClick={() => copyNumber(account.number, key)}>
                                        {copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
                                        {copied ? "បានចម្លង" : "ចម្លងលេខគណនី"}
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

function SambotRsvpSection({ children, useTemplateLink }) {
    return (
        <div id="grs-rsvp" className="grs-section grs-rsvp">
            <SambotSectionTitle english="RSVP" title="បញ្ជាក់ការចូលរួម" icon={IoHeartOutline} />
            {children || <TemplateRsvp useTemplateLink={useTemplateLink} />}
        </div>
    );
}

function SambotWishSection({ content, onRsvp, showRsvp }) {
    return (
        <section id="grs-wish" className="grs-section grs-wish">
            <SambotSectionTitle english="WISHES & BLESSINGS" title="ជូនពរ" icon={IoChatbubbleEllipsesOutline} />
            <div className="grs-wish__note">
                <span aria-hidden="true">“</span>
                <p>{content.wish?.message}</p>
                <strong>{content.groom} <em>{content.amp}</em> {content.bride}</strong>
                {showRsvp && (
                    <button type="button" className="grs-button" onClick={onRsvp}>
                        <IoChatbubbleEllipsesOutline aria-hidden="true" />
                        ផ្ញើពាក្យជូនពរ
                    </button>
                )}
            </div>
        </section>
    );
}

function SambotThanksSection({ content }) {
    const contact = content.contact || {};

    return (
        <footer id="grs-thanks" className="grs-thanks">
            <span className="grs-frame grs-frame--thanks" aria-hidden="true" />
            <div className="grs-thanks__content">
                <IoHeartOutline className="grs-thanks__heart" aria-hidden="true" />
                <p className="grs-thanks__english">THANK YOU</p>
                <h2>អរគុណ</h2>
                <span className="grs-divider grs-divider--light" aria-hidden="true" />
                <p className="grs-thanks__names">{content.groom} <em>{content.amp}</em> {content.bride}</p>
                <p className="grs-thanks__message">សូមអរគុណដែលបានចូលរួមចែករំលែកក្ដីស្រឡាញ់ និងអំណររបស់យើងខ្ញុំ</p>
                <p className="grs-thanks__romantic">Thank you for joining our special day</p>
                {content.dateText && <p className="grs-thanks__date">{content.dateText}</p>}
                <div className="grs-thanks__contacts">
                    {contact.telegram && (
                        <a href={contact.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                            <IoPaperPlaneOutline />
                        </a>
                    )}
                    {contact.phone && (
                        <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} aria-label={contact.phone}>
                            <IoCallOutline />
                        </a>
                    )}
                    {contact.facebook && (
                        <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <IoLogoFacebook />
                        </a>
                    )}
                </div>
                <small>Powered by Koupreng</small>
            </div>
        </footer>
    );
}

function SambotBottomNav({ availableSections, enabledSections, onNavigate }) {
    const items = NAV_ITEMS.filter((item) => {
        if (item.sectionKey && enabledSections?.[item.sectionKey] === false) return false;
        return availableSections?.[item.id] !== false;
    });

    return (
        <nav
            className="grs-bottom-nav"
            aria-label="រុករកសន្លឹកការ"
            style={{ "--grs-nav-count": items.length }}
        >
            {items.map(({ id, label, icon: Icon }) => (
                <button type="button" key={id} onClick={() => onNavigate(id)} title={label}>
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    );
}

export default function GardenRoyalSambotTemplate({
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
    const posterRef = useRef(null);
    const detailRef = useRef(null);
    const sectionEnabled = useCallback(
        (key) => content.enabledSections?.[key] !== false,
        [content.enabledSections]
    );

    const navigateTo = useCallback((id) => {
        canvasRef.current?.querySelector(`#grs-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    const openInvitation = useCallback(() => {
        setOpened(true);
    }, []);
    const availableSections = useMemo(() => ({
        program: Boolean(content.schedule?.length || content.ceremonyTime || content.receptionTime),
        location: Boolean(content.venue?.name || content.venue?.address || content.venue?.mapLink || content.venue?.mapEmbedUrl),
        gallery: Boolean(content.gallery?.length || !isHostedInvitation),
        thanks: true,
        wish: sectionEnabled("wish"),
    }), [content, isHostedInvitation, sectionEnabled]);

    useEffect(() => {
        if (!opened || preview) return undefined;
        const frame = window.requestAnimationFrame(() => {
            posterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [opened, preview]);

    return (
        <div className={`grs-stage${preview ? " grs-stage--preview" : ""}`}>
            <div className="grs-canvas" ref={canvasRef}>
                <AnimatePresence mode="wait">
                    {!opened ? (
                        <SambotOpeningScreen key="opening" content={content} onOpen={openInvitation} />
                    ) : (
                        <motion.main
                            key="invitation"
                            className="grs-invitation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.55 }}
                        >
                            <SambotPosterSection
                                content={content}
                                sectionRef={posterRef}
                                onDetails={() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                            />
                            <SambotDetailSection content={content} sectionRef={detailRef} />
                            {sectionEnabled("schedule") && <SambotProgramSection content={content} />}
                            {sectionEnabled("map") && <SambotLocationSection content={content} />}
                            {sectionEnabled("gallery") && (
                                <SambotGallerySection content={content} showEmpty={!isHostedInvitation} />
                            )}
                            {sectionEnabled("gift") && <SambotGiftSection content={content} />}
                            {sectionEnabled("rsvp") && (
                                <SambotRsvpSection useTemplateLink={useTemplateLink}>{children}</SambotRsvpSection>
                            )}
                            {sectionEnabled("wish") && (
                                <SambotWishSection
                                    content={content}
                                    onRsvp={() => navigateTo("rsvp")}
                                    showRsvp={sectionEnabled("rsvp")}
                                />
                            )}
                            <SambotThanksSection content={content} />

                            {!preview && showActions && useTemplateLink && (
                                <div className="grs-template-actions">
                                    <Link className="grs-button" to={useTemplateLink}>{primaryCtaLabel}</Link>
                                    <Link className="grs-button grs-button--outline" to={backLink}>{backLabel}</Link>
                                </div>
                            )}
                        </motion.main>
                    )}
                </AnimatePresence>

                <TemplateMusicControl src={content.music} />
                {opened && showStickyCta && (
                    <SambotBottomNav
                        availableSections={availableSections}
                        enabledSections={content.enabledSections}
                        onNavigate={navigateTo}
                    />
                )}
            </div>
        </div>
    );
}
