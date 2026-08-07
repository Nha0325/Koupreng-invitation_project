import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";

import { usePrefersReducedMotion } from "../../../../shared/hooks/usePrefersReducedMotion";

const DEFAULT_MONOGRAM = "V & P";
const DEFAULT_GUEST_NAME = "លោកអ្នក និងក្រុមគ្រួសារ";

const petals = [
    { className: "ck-cover__petal ck-cover__petal--one", duration: 8.5, delay: 0 },
    { className: "ck-cover__petal ck-cover__petal--two", duration: 10, delay: -2.5 },
    { className: "ck-cover__petal ck-cover__petal--three", duration: 12, delay: -5 },
];

const particles = Array.from({ length: 14 }, (_, index) => `ck-cover__particle ck-cover__particle--${index + 1}`);

function KhmerCorner({ className }) {
    return (
        <span className={className} aria-hidden="true">
            <svg viewBox="0 0 120 120" focusable="false">
                <path d="M16 104C18 58 58 18 104 16" />
                <path d="M27 96C31 67 67 31 96 27" />
                <path d="M16 76C33 76 44 65 44 48C62 51 74 39 76 16" />
                <path d="M39 93C42 81 51 72 64 68C62 82 53 91 39 93Z" />
                <path d="M67 64C71 51 81 42 94 39C91 53 82 62 67 64Z" />
                <circle cx="20" cy="100" r="3" />
                <circle cx="100" cy="20" r="3" />
            </svg>
        </span>
    );
}

function LeafSprig({ className }) {
    return (
        <svg className={className} viewBox="0 0 104 26" aria-hidden="true" focusable="false">
            <path d="M5 20C24 7 40 5 52 13C64 5 80 7 99 20" />
            <path d="M24 12C20 5 13 5 9 11C15 16 21 16 24 12Z" />
            <path d="M38 8C35 1 28 2 25 8C31 12 36 12 38 8Z" />
            <path d="M66 8C69 1 76 2 79 8C73 12 68 12 66 8Z" />
            <path d="M80 12C84 5 91 5 95 11C89 16 83 16 80 12Z" />
        </svg>
    );
}

export default function CoverKhmerOpening({ content, onOpen }) {
    const reduced = usePrefersReducedMotion();
    const monogramText = content.shortName || content.monogramText || DEFAULT_MONOGRAM;
    const guestName = content.guestName || content.invitedGuestName || DEFAULT_GUEST_NAME;
    const coupleNames = [content.groom, content.bride].filter(Boolean).join(" & ") || "វណ្ណដា & ស្រីពេជ្រ";

    const reveal = (delay = 0) =>
        reduced
            ? {}
            : {
                initial: { opacity: 0, y: 18 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
            };

    const sealMotion = reduced
        ? {}
        : {
            initial: { opacity: 0, scale: 0.86 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
        };

    const buttonMotion = reduced
        ? {}
        : {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
        };

    return (
        <section className="ck-cover" data-tx-section="hero" aria-label="សំបុត្រអញ្ជើញមាសខ្មែរ">
            <div className="ck-cover__bg" aria-hidden="true" />
            <div className="ck-cover__floral-layer" aria-hidden="true">
                <span className="ck-cover__flower ck-cover__flower--top-left" />
                <span className="ck-cover__flower ck-cover__flower--top-right" />
                <span className="ck-cover__flower ck-cover__flower--bottom-left" />
                <span className="ck-cover__flower ck-cover__flower--bottom-right" />
            </div>
            {!reduced && (
                <>
                    <div className="ck-cover__particles" aria-hidden="true">
                        {particles.map((className) => <span key={className} className={className} />)}
                    </div>
                    <div className="ck-cover__petals" aria-hidden="true">
                        {petals.map((petal) => (
                            <motion.span
                                key={petal.className}
                                className={petal.className}
                                animate={{ y: [0, 30, 0], x: [0, 10, -5, 0], rotate: [0, 18, -10, 0] }}
                                transition={{
                                    duration: petal.duration,
                                    delay: petal.delay,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="ck-cover__frame" aria-hidden="true">
                <KhmerCorner className="ck-cover__corner ck-cover__corner--tl" />
                <KhmerCorner className="ck-cover__corner ck-cover__corner--tr" />
                <KhmerCorner className="ck-cover__corner ck-cover__corner--br" />
                <KhmerCorner className="ck-cover__corner ck-cover__corner--bl" />
            </div>

            <div className="ck-cover__inner">
                <motion.div className="ck-cover__monogram-wrap" {...sealMotion}>
                    <LeafSprig className="ck-cover__leaf ck-cover__leaf--top" />
                    <div className="ck-cover__monogram-ring" aria-hidden="true" />
                    <div className="ck-cover__monogram" aria-label={`អក្សរកាត់ ${monogramText}`}>
                        {monogramText}
                    </div>
                    <LeafSprig className="ck-cover__leaf ck-cover__leaf--bottom" />
                </motion.div>

                <motion.p className="ck-cover__couple" {...reveal(0.12)}>
                    {coupleNames}
                </motion.p>

                <motion.div className="ck-cover__title" {...reveal(0.18)}>
                    <h1>សិរីមង្គលអាពាហ៍ពិពាហ៍</h1>
                </motion.div>

                <motion.p className="ck-cover__invite" {...reveal(0.28)}>
                    សូមគោរពអញ្ជើញ
                </motion.p>

                <motion.div className="ck-cover__guest-frame" {...reveal(0.36)}>
                    <span className="ck-cover__guest-ornament" aria-hidden="true" />
                    <p className="ck-cover__guest-name">{guestName}</p>
                </motion.div>

                <motion.div className="ck-cover__open-frame" {...reveal(0.46)}>
                    <motion.button
                        type="button"
                        className="ck-cover__open-button"
                        onClick={onOpen}
                        aria-label="បើកសំបុត្រអញ្ជើញ"
                        {...buttonMotion}
                    >
                        <span>បើកសំបុត្រអញ្ជើញ</span>
                        <IoChevronDown aria-hidden="true" />
                    </motion.button>
                </motion.div>

                {content.dateText && (
                    <motion.p className="ck-cover__date" {...reveal(0.54)}>
                        {content.dateText}
                    </motion.p>
                )}
            </div>
        </section>
    );
}
