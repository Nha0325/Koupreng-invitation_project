import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
import ScrollReveal from "../../shared/ui/ScrollReveal";
import { fadeUp, staggerContainer } from "../../shared/ui/scrollRevealVariants";
=======
import ScrollReveal, {
  fadeUp,
  staggerContainer,
} from "../../shared/ui/ScrollReveal";
>>>>>>> 60dfe88 (Debug all Frontend pages.)
import { useImageSlider } from "../../shared/hooks/useImageSlider";
import { useHeroAnimation } from "../../shared/hooks/useHeroAnimation";
import AnimatedButton from "../../shared/ui/AnimatedButton";
import MagicCard from "../../shared/ui/MagicCard";
import "./HomePage.css";
import heroBg from "../../assets/icons/background.png";
import icon3 from "../../assets/icons/icon-3.png";

// Hero slider — free Unsplash wedding photos (served via CDN, no download needed)
const imgStyle1 =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";
const imgStyle2 =
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80";
const imgStyle3 =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80";
const imgStyle4 =
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80";
const imgStyle5 =
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80";
const imgStyle6 =
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80";
const imgStyle7 =
  "https://images.unsplash.com/photo-1525772764200-be829a350797?w=800&q=80";

const heroImages = [
  imgStyle1,
  imgStyle2,
  imgStyle3,
  imgStyle4,
  imgStyle5,
  imgStyle6,
  imgStyle7,
];

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
const StarRating = ({ count }) => {
  return (
    <div className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
};

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button
        className="faq-question"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span
          className="faq-icon"
          style={{
            transition: "transform 0.3s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      <div
        className="faq-answer-wrap"
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p className="faq-answer">{a}</p>
        </div>
      </div>
    </div>
  );
};

/* ── Page ── */
const Home = () => {
  const { currentIndex: currentImageIndex } = useImageSlider(
    heroImages.length,
    3000,
  );
  useHeroAnimation();

  return (
    <div className="home" style={{ backgroundImage: `url(${heroBg})` }}>
      {/* ── Hero ── */}
      <div id="hero-s" className="hero-bg">
        <section className="hero-section">
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            viewport={{ once: false, amount: 0.2 }}
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
              <AnimatedButton to="/booking">ចាប់ផ្តើមឥឡូវនេះ</AnimatedButton>
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
            exit={{ opacity: 0, x: 60 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25,
            }}
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
              <div className="hero-photo-frame">
                {heroImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Cambodian wedding ${index + 1}`}
                    className="hero-photo"
                    style={{
                      opacity: currentImageIndex === index ? 1 : 0,
                      transition: "opacity 1s ease-in-out",
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
      </div>
      {/* end hero-bg */}

      {/* ── Testimonials ── */}
      <div className="section-band">
        <section className="testimonials-section">
          <ScrollReveal>
            <h2 className="section-title">អ្វីដែលអតិថិជនរបស់យើងនិយាយ</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="section-sub">
              គូស្វាមីភរិយាដែលបានជ្រើសរើស Koupreng
              រៀបចំពិធីមង្គលការរបស់ពួកគេដោយជោគជ័យ
            </p>
          </ScrollReveal>

          {/* Row 1 — scrolls left */}
          <motion.div
            className="marquee-wrapper"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            viewport={{ once: false, amount: 0.2, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>

          {/* Row 2 — scrolls right */}
          <motion.div
            className="marquee-wrapper"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            viewport={{ once: false, amount: 0.2, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
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
          </motion.div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing-s" className="pricing-section">
          <ScrollReveal>
            <div className="pricing-eyebrow">
              <span className="pricing-tag">✦ aly · PRICING</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="section-title pricing-title">
              តម្លៃបំផុតដែលដែល<span className="title-highlight">សមស្រប</span>
              សម្រាប់អ្នក
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="section-sub">
              ក្រុមការងាររបស់យើងបានរៀបចំដើម្បីជួយអ្នករៀបចំ
              <br />
              ពិធីមង្គលការដោយងាយស្រួល
            </p>
          </ScrollReveal>
          {/* Decorative icon row */}
          {/* <div className="pricing-deco-row" aria-hidden="true">
            <img src={icon_1} alt="" className="pricing-deco-icon" />
            <img src={icon_2_2} alt="" className="pricing-deco-icon" />
            <img src={icon_2_3} alt="" className="pricing-deco-icon" />
            <img src={icon3} alt="" className="pricing-deco-icon" />
            <img src={icon_4} alt="" className="pricing-deco-icon" />
          </div> */}
          <motion.div
            className="pricing-grid"
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false, amount: 0.15, margin: "-80px" }}
            variants={staggerContainer}
          >
            {plans.map((plan) => (
              <motion.div key={plan.id} variants={fadeUp}>
                <MagicCard
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
              </motion.div>
            ))}
          </motion.div>

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
        <section id="faqs" className="faq-section">
          <ScrollReveal>
            <h2 className="section-title">សំណួរដែលសួរញឹកញាប់</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <p className="section-sub">
              រកមិនឃើញចម្លើយដែលអ្នកត្រូវការ? ទំនាក់ទំនងក្រុមការងារ Koupreng
            </p>
          </ScrollReveal>
          <motion.div
            className="faq-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2, margin: "-60px" }}
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
                  វេទិកាឌីជីថលដ៏ល្អបំផុតសម្រាប់ការរៀបចំ ពិធីមង្គលការ
                  ជួយអ្នករៀបចំ គ្រប់គ្រង និងធ្វើឱ្យថ្ងៃពិសេសរបស់អ្នកល្អឥតខ្ចោះ។
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
      {/* end section-band */}
    </div>
  );
};

export default Home;
