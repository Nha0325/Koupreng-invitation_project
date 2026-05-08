import { Link } from "react-router-dom";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { animate, stagger } from "animejs";
import { motion, useInView } from "framer-motion";
import { AnimatedButton } from "../../components/ui/AnimatedButton";
import { MagicCard } from "../../components/ui/MagicCard";
import heroBg from "../../assets/img/background.png";
import "./Home.css";
import icon_1 from "../../assets/img/icon-1.png";
import icon_2_2 from "../../assets/img/icon-2-2.png";
import icon_2_3 from "../../assets/img/icon-2-3.png";
import icon3 from "../../assets/img/icon-3.png";
import icon_4 from "../../assets/img/icon-4.png";
import image_1 from "../../assets/img/image.png";
import imgStyle1 from "../../assets/img-style/1.png";
import imgStyle2 from "../../assets/img-style/2.png";
import imgStyle3 from "../../assets/img-style/3.png";

const heroImages = [imgStyle1, imgStyle2, imgStyle3];

const Spline = lazy(() => import("@splinetool/react-spline"));

/* ── Scroll Reveal wrapper ── */
const fadeUp = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function ScrollReveal({ children, className = "", delay = 0, variants = fadeUp }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}


/* ── Data ── */
const testimonials = [
  {
    id: 1,
    stars: 5,
    text: "Koupreng គឺជាវេទិកាដ៏ល្អបំផុតសម្រាប់ការរៀបចំពិធីមង្គលការ។ ខ្ញុំពេញចិត្តណាស់ ហើយណែនាំដល់គ្រប់គ្នា។",
    couple: "សុខា & ស្រីរ័ត្ន",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    stars: 5,
    text: "ការប្រើប្រាស់ Koupreng ធ្វើឱ្យការរៀបចំពិធីមង្គលការរបស់យើងកាន់តែងាយស្រួល និងរីករាយ។",
    couple: "ឧត្តម & ចាន់ថា",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    stars: 5,
    text: "ក្រុមការងារ Koupreng ជួយយើងគ្រប់ជំហាន ពីការជ្រើសរើសកញ្ចប់រហូតដល់ថ្ងៃពិធី។",
    couple: "វិចិត្រ & សុភាព",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 4,
    stars: 4,
    text: "ជាមួយ Koupreng យើងអាចតាមដានការចំណាយ និងគ្រប់គ្រងភ្ញៀវបានយ៉ាងងាយស្រួល ណាស់ពិតជាល្អ។",
    couple: "ដារ៉ា & ស្រីនាង",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: 5,
    stars: 5,
    text: "Koupreng ជួយឱ្យពិធីមង្គលការរបស់យើងដំណើរការយ៉ាងរលូន ហើយអ្វីៗគ្រប់យ៉ាងល្អឥតខ្ចោះ។",
    couple: "វីរៈ & ស្រីពេជ្រ",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: 6,
    stars: 5,
    text: "ការប្រើប្រាស់ Koupreng ធ្វើឱ្យការរៀបចំពិធីមង្គលការ ក្លាយជារឿងសប្បាយ មិនមែនជាបន្ទុក។",
    couple: "ភក្ត្រ & ស្រីមុំ",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=6",
  },
  {
    id: 7,
    stars: 4,
    text: "ក្រុមការងារ Koupreng ផ្តល់ការគាំទ្រ ២៤/៧ ហើយតែងតែឆ្លើយតបយ៉ាងរហ័ស ខ្ញុំពេញចិត្តណាស់។",
    couple: "ទ្រី & ស្រីពេជ្រ",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=7",
  },
  {
    id: 8,
    stars: 5,
    text: "Koupreng ជួយឱ្យពិធីមង្គលការរបស់យើងដំណើរការយ៉ាងរលូន ហើយអ្វីៗគ្រប់យ៉ាងល្អឥតខ្ចោះ។",
    couple: "ដែនណា & ចាន់ថា",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=8",
  },
  {
    id: 9,
    stars: 5,
    text: "ការប្រើប្រាស់ Koupreng ធ្វើឱ្យការរៀបចំពិធីមង្គលការ ក្លាយជារឿងសប្បាយ មិនមែនជាបន្ទុក។",
    couple: "ស្រីណា & ស្រីពេជ្រ",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=9",
  },
  {
    id: 10,
    stars: 4,
    text: "ក្រុមការងារ Koupreng ផ្តល់ការគាំទ្រ ២៤/៧ ហើយតែងតែឆ្លើយតបយ៉ាងរហ័ស ខ្ញុំពេញចិត្តណាស់។",
    couple: "ឧត្តម & ចាន់ថា",
    role: "អតិថិជន Koupreng",
    avatar: "https://i.pravatar.cc/40?img=10",
  },
];

const plans = [
  {
    id: "basic",
    tier: "ឥតគិតថ្លៃ",
    icon: "",
    name: "គតិដៃគូ",
    desc: "សម្រាប់គូស្វាមីភរិយាដែលចង់ចាប់ផ្តើម",
    price: "$0",
    originalPrice: null,
    period: "/ព្រឹត្តិការណ៍",
    featured: false,
    features: [
      { text: "បង្ហើបផែនការការងារ ៥ ចំណុច", active: true },
      { text: "គ្រប់គ្រងភ្ញៀវ ៤០ នាក់", active: true },
      { text: "ថវិការសម្រាប់ ១ ព្រឹត្តិការណ៍", active: true },
      { text: "ការទូទាត់ Bakong QR", active: false },
      { text: "ការគាំទ្រ ២៤ ម៉ោង/៧ ថ្ងៃ", active: false },
      { text: "ផ្ញើការអញ្ជើញ", active: false },
    ],
    cta: "ចាប់ផ្តើមឥឡូវនេះ",
    ctaLink: "/register",
  },
  {
    id: "pro",
    tier: "តម្លៃពិសេស",
    icon: icon3,
    name: "ប្រូ",
    desc: "សម្រាប់គូស្វាមីភរិយាដែលចង់ការគ្រប់គ្រងពេញលេញ",
    price: "$168.99",
    originalPrice: "$300",
    period: "/ព្រឹត្តិការណ៍",
    featured: true,
    features: [
      { text: "បង្ហើបផែនការការងារ គ្មានដែនកំណត់", active: true },
      { text: "គ្រប់គ្រងភ្ញៀវ គ្មានដែនកំណត់", active: true },
      { text: "ថវិការសម្រាប់ ៣ ព្រឹត្តិការណ៍", active: true },
      { text: "ការទូទាត់ Bakong QR", active: true },
      { text: "ការគាំទ្រ ២៤ ម៉ោង/៧ ថ្ងៃ", active: true },
      { text: "ផ្ញើការអញ្ជើញ", active: true },
      { text: "ផ្ញើការអញ្ជើញ", active: true },
    ],
    cta: "ចាប់ផ្តើមជាមួយ Pro",
    ctaLink: "/register",
  },
  {
    id: "enterprise",
    tier: "សេវា Concierge",
    icon: "",
    name: "សហគ្រាស",
    desc: "សម្រាប់ក្រុមហ៊ុនរៀបចំពិធីមង្គលការ និងក់ស្ថាន",
    price: "តម្លៃតាមការ\nពិគ្រោះ",
    originalPrice: null,
    period: "",
    featured: false,
    isEnterprise: true,
    features: [
      { text: "រួមបញ្ចូល Pro", active: true },
      { text: "ប្រើប្រាស់ Teams", active: true },
      { text: "API Integration", active: true },
      { text: "Dashboard ផ្ទាល់ខ្លួន", active: true },
      { text: "ចំណុច KPI ២៤ ម៉ោង", active: true },
      { text: "ការគ្រប់គ្រងក្រុមការងារ", active: true },
      { text: "White-label branding", active: true },
    ],
    cta: "ទំនាក់ទំនងផ្ទាល់យើង",
    ctaLink: "/booking",
  },
];

const trustItems = [
  { icon: "🔒", text: "ការទូទាត់ប្រកបដោយសុវត្ថិភាព" },
  { icon: "⚡", text: "ដំឡើងក្នុង ២ នាទី" },
  { icon: "🛡️", text: "ការការពារទិន្នន័យ" },
  { icon: "🔄", text: "លុបចោលបានគ្រប់ពេល" },
  { icon: "👥", text: "ក្រុមការងារ ១០០+ នាក់" },
];

const faqs = [
  {
    q: "តើខ្ញុំអាចប្រើប្រាស់ Koupreng បានដោយរបៀបណា?",
    a: "គ្រាន់តែចុះឈ្មោះ ជ្រើសរើសកញ្ចប់ដែលសមស្រប ហើយចាប់ផ្តើមរៀបចំពិធីមង្គលការរបស់អ្នកភ្លាមៗ។ ប្រព័ន្ធរបស់យើងងាយស្រួលប្រើ ហើយអ្នកអាចចូលប្រើបានគ្រប់ពេល គ្រប់ទីកន្លែង។",
  },
  {
    q: "តើខ្ញុំអាចផ្លាស់ប្តូរកញ្ចប់បន្ទាប់ពីការជ្រើសរើសដំបូងបានទេ?",
    a: "បាន។ អ្នកអាចធ្វើការ upgrade ឬ downgrade កញ្ចប់របស់អ្នកបានគ្រប់ពេល ដោយគ្មានការប្រាក់ពិន័យ។",
  },
  {
    q: "តើការទូទាត់ Bakong KHQR ដំណើរការដោយរបៀបណា?",
    a: "ប្រព័ន្ធរបស់យើងបង្កើត QR Code ស្វ័យប្រវត្តិ ហើយផ្ញើទៅអ្នកតាម Telegram។ អ្នកអាចស្កែន QR ដើម្បីទូទាត់ប្រាក់ភ្លាមៗ។",
  },
  {
    q: "តើខ្ញុំអាចទទួលបានការគាំទ្រដោយរបៀបណា?",
    a: "ក្រុមការងាររបស់យើងផ្តល់ការគាំទ្រ 24/7 តាមរយៈ Telegram, Email, និងទូរស័ព្ទ។ យើងតែងតែឆ្លើយតបក្នុងរយៈពេល 1 ម៉ោង។",
  },
  {
    q: "តើទិន្នន័យរបស់ខ្ញុំមានសុវត្ថិភាពទេ?",
    a: "យើងប្រើប្រាស់ការអ៊ិនគ្រីបកម្រិតខ្ពស់ ហើយទិន្នន័យរបស់អ្នកត្រូវបានរក្សាទុកដោយសុវត្ថិភាពនៅលើ server ដែលមានការការពារ។",
  },
];

const footerLinks = {
  ផលិតផល: ["មុខងារ", "តម្លៃ", "ការធ្វើបច្ចុប្បន្នភាព", "ផែនទីផ្លូវ"],
  ក្រុមហ៊ុន: ["អំពីយើង", "ក្រុមការងារ", "ប្លក់", "អាជីព"],
  ជំនួយ: ["មជ្ឈមណ្ឌលជំនួយ", "ឯកសារ", "ស្ថានភាព", "ទំនាក់ទំនង"],
};

/* ── Sub-components ── */
function StarRating({ count }) {
  return (
    <div className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button
        className="faq-question"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

/* ── Page ── */
function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    animate('.float-chip', {
      translateY: [20, 0],
      opacity: [0, 1],
      delay: stagger(200, { start: 500 }),
      ease: 'outElastic(1, .8)'
    });
    animate('.hero-title, .hero-desc', {
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: stagger(100),
      ease: 'outExpo'
    });
  }, []);

  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── Hero ── */}
      <section className="hero-section">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <p className="hero-badge">
            ❤️ ដៃគូដ៏ល្អបំផុតសម្រាប់ថ្ងៃពិសេសរបស់អ្នក
          </p>
          <h1 className="hero-title">
            រៀបចំ
            <br />
            អាពាហ៍ពិពាហ៍
            <br />
            របស់អ្នកយ៉ាង
            <br />
            ងាយស្រួល
          </h1>
          <p className="hero-desc">
            Koupreng គឺជាវេទិកាឌីជីថលដែលជួយអ្នករៀបចំផែនការ គ្រប់គ្រងភ្ញៀវ និង
            តាមដានការចំណាយក្នុងពិធីមង្គលការរបស់អ្នកប្រកបដោយប្រសិទ្ធភាព។
          </p>
          <div className="hero-actions">
            <AnimatedButton to="/booking">
              ចាប់ផ្តើមឥឡូវនេះ
            </AnimatedButton>
            <button className="btn-secondary">មើលមុខងារ</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <div>
                <strong>500+</strong>
                <p>គូស្វាមីភរិយា</p>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <div>
                <strong>98%</strong>
                <p>ការពេញចិត្ត</p>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-icon">🕐</span>
              <div>
                <strong>24/7</strong>
                <p>ការគាំទ្រ</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <div className="hero-visual">
            {/* Decorative blobs */}
            <div className="blob blob-tl" />
            <div className="blob blob-br" />

            {/* Floating chip — top left: date */}
            <div className="float-chip chip-date">
              <div className="chip-icon-wrap">❓</div>
              <div className="chip-text">
                <span className="chip-label">ថ្ងៃចែក</span>
                <span className="chip-value">០៥ មករា ២០២៦</span>
              </div>
            </div>

            {/* Floating chip — top right: guests */}
            <div className="float-chip chip-guests">
              <div className="chip-icon-wrap pink">👥</div>
              <div className="chip-text">
                <span className="chip-label">ភ្ញៀវ</span>
                <span className="chip-value">៦៥០ នាក់</span>
              </div>
            </div>

            {/* Image Slider */}
            <div className="hero-photo-frame" style={{ overflow: 'hidden', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Cambodian wedding ${index + 1}`}
                  className="hero-photo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: currentImageIndex === index ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                  }}
                />
              ))}
            </div>

            {/* Floating chip — bottom left: status */}
            <div className="float-chip chip-status">
              <div className="chip-icon-wrap green">✓</div>
              <div className="chip-text">
                <span className="chip-label">ការរៀបចំ</span>
                <span className="chip-value">៤៥% រួចរាល់</span>
              </div>
            </div>

            {/* Floating chip — bottom right: budget */}
            <div className="float-chip chip-budget">
              <div className="chip-text">
                <div className="budget-top">
                  <span className="chip-label">ថវិកា</span>
                  <span className="budget-pct">72%</span>
                </div>
                <div className="budget-bar">
                  <div className="budget-fill" style={{ width: "72%" }} />
                </div>
                <span className="budget-amount">$2,160 / $3,000</span>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="deco-circle deco-top" />
            <div className="deco-circle deco-bottom" />
          </div>
        </motion.div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section">
        <ScrollReveal><h2 className="section-title">អ្វីដែលអតិថិជនរបស់យើងនិយាយ</h2></ScrollReveal>
        <ScrollReveal delay={0.1}><p className="section-sub">
          គូស្វាមីភរិយាដែលបានជ្រើសរើស Koupreng
          រៀបចំពិធីមង្គលការរបស់ពួកគេដោយជោគជ័យ
        </p></ScrollReveal>

        {/* Row 1 — scrolls left */}
        <div className="marquee-wrapper">
          <div className="marquee-track marquee-left">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="testimonial-card">
                <StarRating count={t.stars} />
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img
                    src={t.avatar}
                    alt={t.couple}
                    className="author-avatar"
                  />
                  <div>
                    <strong>{t.couple}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-wrapper">
          <div className="marquee-track marquee-right">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="testimonial-card">
                <StarRating count={t.stars} />
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img
                    src={t.avatar}
                    alt={t.couple}
                    className="author-avatar"
                  />
                  <div>
                    <strong>{t.couple}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="pricing-section">
        <ScrollReveal><div className="pricing-eyebrow">
          <span className="pricing-tag">✦ aly · PRICING</span>
        </div></ScrollReveal>
        <ScrollReveal delay={0.08}><h2 className="section-title pricing-title">
          តម្លៃបំផុតដែលដែល<span className="title-highlight">សមស្រប</span>
          សម្រាប់អ្នក
        </h2></ScrollReveal>
        <ScrollReveal delay={0.15}><p className="section-sub">
          ក្រុមការងាររបស់យើងបានរៀបចំដើម្បីជួយអ្នករៀបចំ
          <br />
          ពិធីមង្គលការដោយងាយស្រួល
        </p></ScrollReveal>
        <img
          className="ml-4 icon4"
          src={icon_4}
          alt=""
          style={{
            zIndex: 2,
            marginRight: 600,
            marginBottom: -140,
            height: 150,
            // mixBlendMode: "screen",
            objectFit: "contain",
            position: "relative", // ✅ zIndex only works with position set
          }}
        />
        <div
          className="section-sub"
          style={{ marginBottom: "-55px", zIndex: 5 }}
        >
          <img
            src={icon_2_3}
            className="icon4"
            alt=""
            style={{
              zIndex: 2,
              width: 152,
              height: 150,
              // mixBlendMode: "screen",
              objectFit: "contain",
              position: "relative", // ✅ required for zIndex to work
            }}
          />
          <img
            src={icon_2_2}
            className="icon4"
            alt=""
            style={{
              zIndex: 2,
              marginRight: -90,
              width: 144,
              height: 150,
              // mixBlendMode: "screen",
              objectFit: "contain",
              position: "relative", // ✅ required for zIndex to work
            }}
          />
          <img
            src={icon_1}
            className="icon4"
            alt=""
            style={{
              zIndex: 2,
              bottom: -250,
              marginRight: -20,
              width: 100,
              height: 150,
              // mixBlendMode: "screen",
              objectFit: "contain",
              position: "relative", // ✅ required for zIndex to work
            }}
          />
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <MagicCard
              key={plan.id}
              className={`pricing-card${plan.featured ? " featured" : ""}${plan.isEnterprise ? " enterprise" : ""}`}
            >
              {plan.featured && (
                <div className="featured-top-badge">⭐ ពេញនិយមជាងគេ</div>
              )}
              {/* Icon + tier */}
              <div className="plan-icon-row">
                <div className={`${plan.id}`}>
                  {plan.icon && (
                    <img
                      src={plan.icon}
                      alt=""
                      style={{
                        width: 50,
                        height: 50,
                        mixBlendMode: "screen",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
                <span className={`tier-badge tier-${plan.id}`}>
                  {plan.tier}
                </span>
              </div>
              {/* Name + desc */}
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="plan-price">
                {plan.isEnterprise ? (
                  <div className="enterprise-price">
                    <span className="price-amount enterprise-text">
                      {plan.price}
                    </span>
                    <span className="enterprise-phone">📞</span>
                  </div>
                ) : (
                  <>
                    <span className="price-amount">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="price-original">
                        {plan.originalPrice}
                      </span>
                    )}
                    {plan.period && (
                      <span className="price-period">{plan.period}</span>
                    )}
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="plan-divider" />

              {/* Features */}
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i} className={f.active ? "active" : "inactive"}>
                    <span className="feat-dot" />
                    {f.text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.ctaLink}
                className={`plan-cta${plan.featured ? " plan-cta-featured" : ""}${plan.isEnterprise ? " plan-cta-enterprise" : ""}`}
              >
                {plan.isEnterprise && <span className="cta-icon">🏛️</span>}
                {plan.cta}
              </Link>

              {plan.featured && (
                <p className="plan-note">
                  ចុចដើម្បីចាប់ផ្តើម — មិនតម្រូវការ Credit Card
                </p>
              )}
            </MagicCard>
          ))}
        </div>

        {/* Trust bar */}
        <div className="trust-bar">
          {trustItems.map((item, i) => (
            <div key={i} className="trust-item">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <ScrollReveal><h2 className="section-title">សំណួរដែលសួរញឹកញាប់</h2></ScrollReveal>
        <ScrollReveal delay={0.08}><p className="section-sub">
          រកមិនឃើញចម្លើយដែលអ្នកត្រូវការ? ទំនាក់ទំនងក្រុមការងារ Koupreng
        </p></ScrollReveal>
        <motion.div
          className="faq-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {faqs.map((item, i) => (
            <motion.div key={i} variants={fadeUp}>
              <FaqItem q={item.q} a={item.a} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <ScrollReveal>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">Koupreng</span>
            <p className="footer-tagline">Plan Essential</p>
            <p className="footer-about">
              វេទិកាឌីជីថលដ៏ល្អបំផុតសម្រាប់ការរៀបចំ ពិធីមង្គលការ ជួយអ្នករៀបចំ
              គ្រប់គ្រង និងធ្វើឱ្យថ្ងៃពិសេសរបស់អ្នកល្អឥតខ្ចោះ។
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                f
              </a>
              <a href="#" aria-label="Instagram">
                ◎
              </a>
              <a href="#" aria-label="Telegram">
                ✈
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="footer-col">
              <h4>{group}</h4>
              <ul>
                {links.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Koupreng. រក្សាសិទ្ធិគ្រប់យ៉ាង</span>
          <div className="footer-bottom-links">
            <a href="#">គោលការណ៍ភាពឯកជន</a>
            <span>·</span>
            <a href="#">លក្ខខណ្ឌប្រើប្រាស់</a>
          </div>
        </div>
      </footer>
      </ScrollReveal>
    </div>
  );
}

export default Home;
