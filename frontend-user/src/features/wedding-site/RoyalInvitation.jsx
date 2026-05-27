import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCalendar, IoCamera, IoHome, IoLocationSharp } from "react-icons/io5";
import defaultMusicUrl from "../../assets/music/Instrumental Wedding Music (VioSounds Cover).m4a";

// ─── Default Data ───────────────────────────────────────────────────────────

const DEFAULT_STORY_CARD_GROUPS = [
    { id: "card-01", title: "Our Story", folder: "01-card", count: 4 },
    { id: "card-02", title: "Curtain Post", folder: "02-card", count: 9 },
    { id: "card-03", title: "Video Moments", folder: "03-card", count: 7 },
    { id: "card-04", title: "Reel 01", folder: "04-card", count: 5 },
    { id: "card-05", title: "Reel 02", folder: "05-card", count: 6 },
    { id: "card-06", title: "Reel 03", folder: "06-card", count: 8 },
    { id: "card-07", title: "Story 01", folder: "07-card", count: 4 },
    { id: "card-08", title: "Story 02", folder: "08-card", count: 4 },
    { id: "card-09", title: "Story 03", folder: "09-card", count: 4 },
    { id: "card-10", title: "Story 04", folder: "10-card", count: 5 },
    { id: "card-11", title: "Story 05", folder: "11-card", count: 4 },
];

function buildDefaultStoryCard({ id, title, folder, count }) {
    const sourceNumber = folder.slice(0, 2);
    return {
        id,
        title,
        images: [
            `/facebook/all/${folder}/cover-card.jpg`,
            ...Array.from(
                { length: count },
                (_, index) => `/facebook/all/${folder}/${sourceNumber}-${String(index + 1).padStart(2, "0")}.jpg`
            ),
        ],
    };
}

const defaultStoryCards = DEFAULT_STORY_CARD_GROUPS.map(buildDefaultStoryCard);

function mergeStoryImageCards(...cardSets) {
    const seen = new Set();

    return cardSets
        .flatMap((cards) => (Array.isArray(cards) ? cards : []))
        .map((card, index) => {
            const images = (Array.isArray(card?.images) ? card.images : [])
                .filter((src) => {
                    if (typeof src !== "string" || src.length === 0 || seen.has(src)) return false;
                    seen.add(src);
                    return true;
                });

            return images.length
                ? { ...card, id: card.id || `story-card-${index}`, images }
                : null;
        })
        .filter(Boolean);
}

const STORY_IMAGE_CLASSES = ["tpl-gallery-a", "tpl-gallery-b", "tpl-gallery-c", "tpl-gallery-d"];

const MAIN_IMAGE = "/facebook/all/01-card/cover-card.jpg";

const quickNavItems = [
    { target: "cover", label: "ទំព័រដើម", Icon: IoHome },
    { target: "schedule", label: "កម្មវិធី", Icon: IoCalendar },
    { target: "venue", label: "ទីតាំង", Icon: IoLocationSharp },
    { target: "gallery", label: "រូបភាព", Icon: IoCamera },
];

// ─── Logo Preloader ─────────────────────────────────────────────────────────
function LogoPreloader({ onComplete }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onComplete?.();
        }, 2200);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="royal-preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    aria-hidden="true"
                >
                    <motion.div
                        className="royal-preloader__monogram"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="royal-preloader__letter">K</span>
                        <span className="royal-preloader__ampersand">&</span>
                        <span className="royal-preloader__letter">P</span>
                    </motion.div>
                    <motion.p
                        className="royal-preloader__tagline"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Royal Wedding
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Petal shapes for variety ────────────────────────────────────────────────
const PETAL_SHAPES = [
    "50% 0 50% 50%",       // teardrop
    "60% 40% 60% 40%",     // rounded leaf
    "50% 50% 0 50%",       // inverted teardrop
    "40% 60% 40% 60%",     // soft petal
];

const PETAL_COLORS = [
    "linear-gradient(135deg, rgba(200, 163, 95, 0.6), rgba(245, 200, 180, 0.4))",
    "linear-gradient(135deg, rgba(220, 180, 160, 0.5), rgba(255, 230, 220, 0.3))",
    "linear-gradient(135deg, rgba(180, 140, 100, 0.5), rgba(255, 250, 241, 0.4))",
    "linear-gradient(135deg, rgba(140, 60, 50, 0.3), rgba(220, 160, 140, 0.3))",
    "linear-gradient(135deg, rgba(255, 215, 180, 0.5), rgba(200, 163, 95, 0.3))",
];

function seededRatio(index, salt) {
    const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
}

// ─── Animated Background (Petals + Particles + Gradients) ───────────────────
function AnimatedBackground({ isPhone }) {
    const petalCount = isPhone ? 16 : 12;
    const particleCount = isPhone ? 24 : 18;

    return (
        <div className="royal-bg" aria-hidden="true">
            {/* Multi-layer radial gradients */}
            <div className="royal-bg__gradient" />
            <div className="royal-bg__shimmer" />

            {/* Floating petals — varied shapes and colors */}
            {Array.from({ length: petalCount }).map((_, i) => {
                const size = 8 + seededRatio(i, 1) * 16;
                const shape = PETAL_SHAPES[i % PETAL_SHAPES.length];
                const color = PETAL_COLORS[i % PETAL_COLORS.length];
                const startX = 5 + seededRatio(i, 2) * 90;
                const drift = (seededRatio(i, 3) - 0.5) * 80;
                const duration = 7 + seededRatio(i, 4) * 8;
                const delay = seededRatio(i, 5) * 8;
                const opacity = 0.35 + seededRatio(i, 6) * 0.35;
                const rotateTo = 120 + seededRatio(i, 7) * 240;
                const scaleMid = 0.9 + seededRatio(i, 8) * 0.3;

                return (
                    <motion.div
                        key={`petal-${i}`}
                        className="royal-bg__petal"
                        style={{
                            left: `${startX}%`,
                            top: "-5%",
                            width: `${size}px`,
                            height: `${size * 1.2}px`,
                            borderRadius: shape,
                            background: color,
                            opacity,
                        }}
                        animate={{
                            y: ["0%", "2200%"],
                            x: [0, drift, drift * 0.6],
                            rotate: [0, rotateTo],
                            scale: [1, scaleMid, 0.8],
                        }}
                        transition={{
                            duration,
                            repeat: Infinity,
                            delay,
                            ease: "linear",
                        }}
                    />
                );
            })}

            {/* Glowing particles — gold sparkles */}
            {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="royal-bg__particle"
                    style={{
                        left: `${seededRatio(i, 9) * 100}%`,
                        top: `${seededRatio(i, 10) * 100}%`,
                        width: `${3 + seededRatio(i, 11) * 3}px`,
                        height: `${3 + seededRatio(i, 12) * 3}px`,
                    }}
                    animate={{
                        opacity: [0.15, 0.65, 0.15],
                        scale: [0.7, 1.4, 0.7],
                    }}
                    transition={{
                        duration: 2.5 + seededRatio(i, 13) * 3,
                        repeat: Infinity,
                        delay: seededRatio(i, 14) * 5,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Floating rings — decorative circles */}
            {Array.from({ length: isPhone ? 5 : 3 }).map((_, i) => (
                <motion.div
                    key={`ring-${i}`}
                    className="royal-bg__ring"
                    style={{
                        left: `${15 + seededRatio(i, 15) * 70}%`,
                        top: `${10 + seededRatio(i, 16) * 80}%`,
                        width: `${40 + seededRatio(i, 17) * 60}px`,
                        height: `${40 + seededRatio(i, 18) * 60}px`,
                    }}
                    animate={{
                        opacity: [0.06, 0.18, 0.06],
                        scale: [0.9, 1.1, 0.9],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 12 + seededRatio(i, 19) * 8,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}

// ─── Kinetic Grid ───────────────────────────────────────────────────────────
function KineticGrid() {
    return (
        <div className="royal-kinetic-grid" aria-hidden="true">
            {Array.from({ length: 80 }).map((_, i) => (
                <motion.span
                    key={i}
                    className="royal-kinetic-grid__dot"
                    animate={{
                        opacity: [0.08, 0.22, 0.08],
                        scale: [1, 1.4, 1],
                    }}
                    transition={{
                        duration: 2.5 + (i % 5) * 0.4,
                        repeat: Infinity,
                        delay: (i % 8) * 0.3,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

// ─── Image Slideshow (replaces split scroll) ────────────────────────────────
const SLIDESHOW_IMAGES = defaultStoryCards[0].images;

function ImageSplitScroll({ isPhone, images = SLIDESHOW_IMAGES }) {
    const [slideIndex, setSlideIndex] = useState(0);
    const activeImages = images.length > 0 ? images : SLIDESHOW_IMAGES;
    const activeIndex = slideIndex % activeImages.length;
    const timerRef = useRef(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % activeImages.length);
        }, 3500);
    }, [activeImages.length]);

    useEffect(() => {
        resetTimer();
        return () => clearInterval(timerRef.current);
    }, [resetTimer]);

    const goNext = () => {
        setSlideIndex((prev) => (prev + 1) % activeImages.length);
        resetTimer();
    };

    const goPrev = () => {
        setSlideIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
        resetTimer();
    };

    return (
        <section className="royal-split-scroll">
            <p className="tpl-ri-kicker">Our Moment</p>
            <h2 className="royal-split-scroll__title">រូបភាពស្នេហា</h2>
            <div className="royal-slideshow">
                {/* All images stacked — active one shows instantly */}
                {activeImages.map((src, i) => (
                    <img
                        key={src}
                        src={src}
                        alt={`Wedding moment ${i + 1}`}
                        className={`royal-slideshow__img${i === activeIndex ? " active" : ""}`}
                        loading={isPhone ? "eager" : "lazy"}
                    />
                ))}
                {/* Prev / Next arrows */}
                <button
                    type="button"
                    className="royal-slideshow__arrow royal-slideshow__arrow--prev"
                    onClick={goPrev}
                    aria-label="Previous image"
                >
                    ‹
                </button>
                <button
                    type="button"
                    className="royal-slideshow__arrow royal-slideshow__arrow--next"
                    onClick={goNext}
                    aria-label="Next image"
                >
                    ›
                </button>
                {/* Slide counter */}
                <div className="royal-slideshow__counter">
                    {activeIndex + 1} / {activeImages.length}
                </div>
                {/* Dot indicators */}
                <div className="royal-slideshow__dots">
                    {activeImages.map((_, i) => (
                        <span
                            key={i}
                            className={`royal-slideshow__dot${i === activeIndex ? " active" : ""}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Image Card Section ─────────────────────────────────────────────────────
function ImageCard({ isPhone }) {
    return (
        <section className="tpl-ri-section royal-image-card">
            {/* <p className="tpl-ri-kicker">Our Love</p>
            <h2 className="royal-image-card__heading">រូបភាពគូស្នេហ៍</h2>
            <motion.div
                className="royal-image-card__frame"
                initial={isPhone ? false : { opacity: 0, y: 30, scale: 0.96 }}
                whileInView={isPhone ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={isPhone ? undefined : { once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="royal-image-card__border-decor" aria-hidden="true" />
                <img
                    src={imageSrc}
                    alt="Royal wedding couple portrait"
                    className="royal-image-card__img"
                    loading={isPhone ? "eager" : "lazy"}
                />
                <div className="royal-image-card__overlay" />
                <div className="royal-image-card__corner tl" aria-hidden="true" />
                <div className="royal-image-card__corner tr" aria-hidden="true" />
                <div className="royal-image-card__corner bl" aria-hidden="true" />
                <div className="royal-image-card__corner br" aria-hidden="true" />
            </motion.div> */}
            {isPhone && (
                <motion.p
                    className="royal-image-card__caption"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Forever begins here ✦
                </motion.p>
            )}
        </section>
    );
}

// ─── Countdown Grid ─────────────────────────────────────────────────────────
function CountdownGrid({ countdown }) {
    return (
        <div className="tpl-count-grid" aria-label="countdown">
            {[
                ["ថ្ងៃ", countdown.d],
                ["ម៉ោង", countdown.h],
                ["នាទី", countdown.m],
                ["វិនាទី", countdown.s],
            ].map(([label, value], index) => (
                <div
                    className="tpl-count-cell tpl-ri-animate"
                    data-ri-animate
                    style={{ "--tpl-animate-index": index }}
                    key={label}
                >
                    <strong>{value}</strong>
                    <span>{label}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function RoyalInvitation({ tpl, countdown, mode = "full", autoPlay = false, skipIntro = false, flowerGate = false }) {
    const isPhone = mode === "phone";
    const flowerGateEnabled = flowerGate && !isPhone;
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [introDone, setIntroDone] = useState(false);
    const [preloaderDone, setPreloaderDone] = useState(false);
    const [activeQuickTarget, setActiveQuickTarget] = useState("cover");
    const [flowerGateState, setFlowerGateState] = useState({
        templateId: tpl.id,
        enabled: flowerGateEnabled,
        phase: flowerGateEnabled ? "closed" : "open",
    });
    const rootRef = useRef(null);
    const audioRef = useRef(null);
    const autoPlayTriggeredRef = useRef(false);
    const flowerGateTimerRef = useRef(null);
    const manualActiveLockRef = useRef(false);
    const manualActiveTimerRef = useRef(null);
    const selectedStoryCard = Array.isArray(tpl.storyCards) && tpl.storyCards[0]?.images?.length
        ? tpl.storyCards[0]
        : defaultStoryCards[0];
    const storyImageCards = mergeStoryImageCards([selectedStoryCard]);
    const slideshowImages = storyImageCards[0]?.images?.length ? storyImageCards[0].images : SLIDESHOW_IMAGES;
    const musicUrl = tpl.music?.url !== undefined ? tpl.music.url : defaultMusicUrl;
    const mainImage = tpl.mainImage || MAIN_IMAGE;
    const coverImage = tpl.phoneCoverImage || mainImage;
    const openingVideoUrl = typeof tpl.openingVideo === "string" ? tpl.openingVideo : tpl.openingVideo?.url;
    const coverVideoUrl = isPhone && openingVideoUrl ? openingVideoUrl : tpl.video;
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
    const flowerGatePhase = flowerGateState.templateId === tpl.id && flowerGateState.enabled === flowerGateEnabled
        ? flowerGateState.phase
        : flowerGateEnabled ? "closed" : "open";
    const showFlowerGate = flowerGateEnabled && flowerGatePhase !== "open";
    const handlePreloaderComplete = useCallback(() => {
        setPreloaderDone(true);
    }, []);

    const openFlowerGate = useCallback(() => {
        if (flowerGatePhase !== "closed") return;
        setFlowerGateState({ templateId: tpl.id, enabled: flowerGateEnabled, phase: "opening" });
        flowerGateTimerRef.current = window.setTimeout(() => {
            setFlowerGateState({ templateId: tpl.id, enabled: flowerGateEnabled, phase: "open" });
            flowerGateTimerRef.current = null;
            rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
        }, 950);
    }, [flowerGateEnabled, flowerGatePhase, tpl.id]);

    useEffect(() => {
        if (isPhone || skipIntro) {
            return undefined;
        }

        const timer = setTimeout(() => setIntroDone(true), 3000);
        return () => clearTimeout(timer);
    }, [tpl.id, mode, isPhone, skipIntro]);

    useEffect(() => () => {
        if (flowerGateTimerRef.current) window.clearTimeout(flowerGateTimerRef.current);
        if (manualActiveTimerRef.current) window.clearTimeout(manualActiveTimerRef.current);
    }, []);

    useEffect(() => {
        if (!autoPlay || autoPlayTriggeredRef.current) return;
        const audio = audioRef.current;
        if (!audio) return;

        autoPlayTriggeredRef.current = true;
        audio.volume = 0.55;
        audio.play().then(() => {
            setIsMusicPlaying(true);
        }).catch(() => {
            // Browser blocked autoplay
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

        // For phone mode inside a nested scroll container, use the root element
        // as the intersection root so elements are detected when scrolled into view
        const scrollRoot = isPhone ? root.closest(".tpl-phone-scroll") || null : null;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("is-visible", entry.isIntersecting);
                });
            },
            { root: scrollRoot, rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
        );

        targets.forEach((target, index) => {
            target.style.setProperty("--tpl-animate-index", String(index % 8));
            observer.observe(target);
        });

        return () => observer.disconnect();
    }, [mode, tpl.id, isPhone]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const sections = quickNavItems
            .map((item) => root.querySelector(`[data-ri-section="${item.target}"]`))
            .filter(Boolean);

        if (!sections.length) return undefined;

        const scrollRoot = isPhone ? root.closest(".tpl-phone-scroll") || null : null;

        const observer = new IntersectionObserver(
            (entries) => {
                if (manualActiveLockRef.current) return;

                const rootTop = scrollRoot?.getBoundingClientRect().top ?? 0;
                const anchorTop = rootTop + (isPhone ? 86 : window.innerHeight * 0.34);
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => (
                        Math.abs(a.boundingClientRect.top - anchorTop) -
                        Math.abs(b.boundingClientRect.top - anchorTop)
                    ))[0];

                const sectionName = visibleEntry?.target?.dataset?.riSection;
                if (sectionName) setActiveQuickTarget(sectionName);
            },
            {
                root: scrollRoot,
                rootMargin: isPhone ? "-28% 0px -48% 0px" : "-34% 0px -46% 0px",
                threshold: [0.12, 0.32, 0.58],
            }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [isPhone, tpl.id]);

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

    const scrollToSection = (targetName) => {
        manualActiveLockRef.current = true;
        if (manualActiveTimerRef.current) window.clearTimeout(manualActiveTimerRef.current);
        manualActiveTimerRef.current = window.setTimeout(() => {
            manualActiveLockRef.current = false;
            manualActiveTimerRef.current = null;
        }, 1800);
        setActiveQuickTarget(targetName);
        const target = rootRef.current?.querySelector(`[data-ri-section="${targetName}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <article
            ref={rootRef}
            className={`tpl-royal-invitation ${isPhone ? "is-phone" : "is-full"}${isPhone || skipIntro || introDone ? " intro-done" : " intro-active"}${skipIntro ? " no-intro" : ""}${showFlowerGate ? " flower-gate-active" : ""}`}
            style={{
                "--tpl-bg": tpl.bg,
                "--tpl-paper": tpl.paper,
                "--tpl-gold": tpl.color,
                "--tpl-accent": tpl.accent,
                "--tpl-dark": tpl.dark,
                "--tpl-cover-image": `url("${coverImage}")`,
            }}
        >
            {showFlowerGate && (
                <button
                    type="button"
                    className={`tpl-flower-open-gate is-${flowerGatePhase}${openingVideoUrl ? " has-video" : ""}`}
                    onClick={openFlowerGate}
                    aria-label="Open wedding invitation"
                    disabled={flowerGatePhase !== "closed"}
                >
                    <span className="tpl-flower-gate-bg" aria-hidden="true" />
                    {openingVideoUrl && (
                        <video
                            className="tpl-flower-gate-video"
                            src={openingVideoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            aria-hidden="true"
                        />
                    )}
                    <span className="tpl-gate-flower-stage is-paper" aria-hidden="true">
                        <span className="tpl-gate-flower tpl-gate-flower-main" />
                    </span>
                    <span className="tpl-gate-mark-copy" aria-hidden="true">
                        <strong>{tpl.groom}</strong>
                        <span>{tpl.bride}</span>
                    </span>
                    <span className="tpl-gate-tap-hint">ចុចដើម្បីបើក</span>
                </button>
            )}

            {/* Logo Preloader */}
            {!isPhone && !skipIntro && !preloaderDone && (
                <LogoPreloader onComplete={handlePreloaderComplete} />
            )}

            {/* Animated Background */}
            <AnimatedBackground isPhone={isPhone} />

            {/* Kinetic Grid */}
            <KineticGrid />

            {/* Cover Section */}
            <section className="tpl-ri-cover" data-ri-section="cover">
                {coverVideoUrl && ((!isPhone && !skipIntro) || isPhone) && (
                    <video
                        className="tpl-ri-hero-video"
                        src={coverVideoUrl}
                        autoPlay
                        muted
                        loop={isPhone}
                        playsInline
                        aria-hidden="true"
                    />
                )}
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
                    <p className="tpl-ri-eyebrow">
                        {isPhone ? "WE'RE GETTING MARRIED" : "សូមអញ្ជើញចូលរួមពិធីមង្គលការ"}
                    </p>
                    <h1 className="tpl-ri-names">
                        <span>{tpl.groom}</span>
                        <em>&amp;</em>
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
                <div className="tpl-ri-scroll">
                    {isPhone ? "RSVP" : "រំកិលចុះក្រោម"}
                </div>
            </section>

            {(isPhone || skipIntro) && (
                <nav className="tpl-ri-quick-nav" aria-label="Wedding invitation quick actions">
                    {quickNavItems.map(({ target, label, Icon }) => (
                        <button
                            key={target}
                            type="button"
                            className={`tpl-ri-quick-btn${activeQuickTarget === target ? " is-active" : ""}`}
                            onClick={() => scrollToSection(target)}
                            aria-label={label}
                            aria-current={activeQuickTarget === target ? "page" : undefined}
                            title={label}
                        >
                            <Icon aria-hidden="true" />
                        </button>
                    ))}
                </nav>
            )}

            {/* Intro Section */}
            <section className="tpl-ri-section tpl-ri-intro tpl-ri-animate" data-ri-animate>
                <p className="tpl-ri-kicker">ដោយក្តីសោមនស្សរីករាយ</p>
                <h2>សូមអញ្ជើញលោកអ្នកចូលរួមជាសក្ខីភាព</h2>
                <p>
                    ក្រុមគ្រួសារទាំងសងខាងសូមគោរពអញ្ជើញលោកអ្នកចូលរួមពិធីមង្គលការ
                    របស់កូនប្រុស កូនស្រីយើងខ្ញុំ ក្នុងថ្ងៃដ៏មានអត្ថន័យនេះ។
                </p>
            </section>

            {/* Image Card */}
            <ImageCard isPhone={isPhone} />

            {/* 3D Split Scroll */}
            <ImageSplitScroll key={tpl.id} isPhone={isPhone} images={slideshowImages} />

            {/* Schedule */}
            <section className="tpl-ri-section tpl-ri-schedule tpl-ri-animate" data-ri-section="schedule" data-ri-animate>
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

            {/* Venue */}
            <section className="tpl-ri-section tpl-ri-venue tpl-ri-animate" data-ri-section="venue" data-ri-animate>
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

            {/* Gallery — Image Cards */}
            <section className="tpl-ri-section tpl-ri-gallery" data-ri-section="gallery">
                <p className="tpl-ri-kicker">រូបភាពអនុស្សាវរីយ៍</p>
                <h2>រូបភាពស្នេហា</h2>

                {/* Animated wedding background for gallery */}
                <div className="royal-gallery-bg" aria-hidden="true">
                    <div className="royal-gallery-bg__hearts" />
                    <div className="royal-gallery-bg__sparkles" />
                </div>

                {/* Image gallery */}
                <div className="tpl-ri-gallery-grid royal-story-image-grid">
                    {storyImageCards.flatMap((card) => card.images || []).map((src, index) => (
                        <figure
                            className={`tpl-ri-gallery-item ${STORY_IMAGE_CLASSES[index % STORY_IMAGE_CLASSES.length]}`}
                            key={`${src}-${index}`}
                        >
                            <img
                                src={src}
                                alt={`Wedding photo ${index + 1}`}
                                loading="eager"
                            />
                        </figure>
                    ))}
                </div>
            </section>

            {/* Dress Code */}
            <section className="tpl-ri-section tpl-ri-note tpl-ri-animate" data-ri-section="dress" data-ri-animate>
                <p className="tpl-ri-kicker">Dress Code</p>
                <h2>សូមស្លៀកពាក់ពណ៌សុភាព</h2>
                <div className="tpl-ri-dress-palette tpl-ri-animate" data-ri-animate>
                    {dressCode.colors.map((c, i) => (
                        <span key={i} className="tpl-ri-dress-choice">
                            <span className="tpl-ri-dress-swatch" style={{ background: c.hex }} title={c.name} />
                            <span className="tpl-ri-color-name">{c.name}</span>
                        </span>
                    ))}
                </div>
                <p>{dressCode.description}</p>
            </section>

            {/* QR + Contact 
            
            <section className="tpl-ri-section tpl-ri-connect tpl-ri-animate" data-ri-section="qr" data-ri-animate>
                <p className="tpl-ri-kicker">QR Code</p>
                <h2>ស្កេន QR និងទាក់ទង</h2>
                <div className="tpl-ri-connect-grid">
                    <div className="tpl-ri-connect-card tpl-ri-animate" data-ri-animate>
                        <span className="tpl-ri-connect-label">Invitation QR</span>
                        <div className="tpl-ri-qr-frame" aria-label="Invitation QR code">
                            {qrImage ? (
                                <img src={qrImage} alt="Invitation QR code" loading={isPhone ? "eager" : "lazy"} />
                            ) : (
                                <span className="tpl-ri-qr-pattern" aria-hidden="true">
                                    {Array.from({ length: 49 }).map((_, index) => (
                                        <span key={index} className={qrPatternCells.has(index) ? "is-dark" : ""} />
                                    ))}
                                </span>
                            )}
                        </div>
                        <p>ស្កេន QR ដើម្បីបើកលិខិតអញ្ជើញនេះលើទូរស័ព្ទ។</p>
                    </div>
                    <div className="tpl-ri-connect-card tpl-ri-contact-card tpl-ri-animate" data-ri-section="rsvp" data-ri-animate>
                        <span className="tpl-ri-connect-label">RSVP</span>
                        <strong>សូមបញ្ជាក់ការចូលរួម</strong>
                        <p>
                            {contactPhone
                                ? `ទំនាក់ទំនង ${contactPhone}`
                                : "សូមផ្ញើសារដើម្បីបញ្ជាក់ការចូលរួមក្នុងពិធី។"}
                        </p>
                        {cleanPhone && (
                            <a href={`tel:${cleanPhone}`}>
                                Call
                            </a>
                        )}
                    </div>
                </div>
            </section>
            */}

            {/* RSVP */}
            {/* <section className="tpl-ri-section tpl-ri-rsvp tpl-ri-animate" data-ri-section="rsvp" data-ri-animate>
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
                        <select
                            value={guestCount}
                            onChange={(event) => setGuestCount(event.target.value)}
                        >
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
            </section> */}

            {/* Footer */}
            <footer className="tpl-ri-footer tpl-ri-animate" data-ri-animate>
                <strong>{tpl.groom} &amp; {tpl.bride}</strong>
                <span>{tpl.dateText}</span>
            </footer>
        </article>
    );
}
