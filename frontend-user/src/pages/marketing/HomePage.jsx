import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollReveal } from "../../shared/ui/ScrollReveal";
import { AnimatedButton } from "../../shared/ui/AnimatedButton";
import { MagicCard } from "../../shared/ui/MagicCard";
import "./HomePage.css";

import heroBg from "../../assets/icons/background.png";

const plans = [
  {
    id: "basic",
    name: "គតិដៃគូ",
    price: "$0",
    desc: "សម្រាប់ការរៀបចំដំបូង",
    features: [
      "ផែនការការងារ ៥ ចំណុច",
      "គ្រប់គ្រងភ្ញៀវ ៤០ នាក់",
      "ថវិការ ១ ព្រឹត្តិការណ៍",
    ],
  },
  {
    id: "pro",
    name: "កញ្ចប់ប្រូ",
    price: "$169",
    desc: "ពេញនិយមបំផុតសម្រាប់គូស្វាមីភរិយា",
    features: [
      "ផែនការមិនដែនកំណត់",
      "គ្រប់គ្រងភ្ញៀវមិនដែនកំណត់",
      "ការទូទាត់ Bakong QR",
      "គាំទ្រ ២៤/៧",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "សហគ្រាស",
    price: "តម្លៃពិគ្រោះ",
    desc: "សម្រាប់ក្រុមហ៊ុនរៀបចំការ",
    features: [
      "White-label Branding",
      "គ្រប់គ្រងក្រុមការងារ",
      "API Integration",
    ],
  },
];

export default function Home() {
  return (
    <div className="khmer-theme">
      {/* Hero Section */}
      <section
        className="hero-modern"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="overlay-gradient"></div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-center"
          >
            <span className="khmer-sub">មង្គលការឌីជីថល</span> <br />
            <h1 className="khmer-title">
              រៀបចំពិធីមង្គលការ
              <br />
              <span className="gold-gradient">ដ៏ល្អឥតខ្ចោះ</span>
            </h1>
            <p className="khmer-p">
              គ្រប់គ្រងភ្ញៀវ ថវិកា និងផែនការការងាររបស់អ្នក ក្នុងវេទិកាតែមួយ
              ប្រកបដោយភាពងាយស្រួល និងស៊ីវិល័យ។
            </p>
            <div className="hero-btns">
              {/* ប៊ូតុងទី១: Link ទៅ /templates */}
              <AnimatedButton to="/templates" className="btn-main-gold">
                ចាប់ផ្តើមបង្កើត
              </AnimatedButton>
              {/* ប៊ូតុងទី២: Link ទៅ /pricing */}
              <Link to="/pricing" className="btn-outline">
                មើលតម្លៃកញ្ចប់
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ៣. Section: តើវាដំណើរការយ៉ាងដូចម្ដេច? (How it works) */}
      <section className="how-it-works">
        <ScrollReveal>
          <div className="section-head">
            <h2 className="khmer-title-small">តើវាដំណើរការយ៉ាងដូចម្ដេច?</h2>
            <div className="gold-divider"></div>
          </div>
        </ScrollReveal>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-num">០១</div>
            <h3>
              ជ្រើសរើស{" "}
              <Link to="/templates" className="step-link">
                គំរូសន្លឹកការ
              </Link>
            </h3>
            <p>ស្វែងរកស្ទីលដែលអ្នកស្រលាញ់បំផុត ពីបុរាណដល់សម័យទំនើប។</p>
          </div>
          <div className="step-card">
            <div className="step-num">០២</div>
            <h3>
              រៀបចំ{" "}
              <Link to="/pricing" className="step-link">
                កញ្ចប់សេវា
              </Link>
            </h3>
            <p>ជ្រើសរើសមុខងារដែលត្រូវនឹងតម្រូវការ និងថវិកាក្នុងក្តីស្រមៃ។</p>
          </div>
          <div className="step-card">
            <div className="step-num">០៣</div>
            <h3>
              ស្វែងរក{" "}
              <Link to="/venues" className="step-link">
                ទីកន្លែង
              </Link>
            </h3>
            <p>សម្រាំងទីតាំងរៀបការដ៏ស្រស់ស្អាតបំផុតសម្រាប់ភ្ញៀវកិត្តិយស។</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-modern" id="pricing-section">
        <ScrollReveal>
          <div className="section-head">
            <h2 className="khmer-title-small">ជ្រើសរើសកញ្ចប់ដែលសាកសម</h2>
            <div className="gold-divider"></div>
          </div>
        </ScrollReveal>

        <div className="pricing-container">
          {plans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <MagicCard className={`kh-card ${plan.featured ? "active" : ""}`}>
                {plan.featured && <div className="card-tag">ពេញនិយម</div>}
                <h3 className="card-name">{plan.name}</h3>
                <div className="card-price">
                  {plan.price}
                  <span>
                    {plan.id !== "enterprise" ? "/ព្រឹត្តិការណ៍" : ""}
                  </span>
                </div>
                <p className="card-desc">{plan.desc}</p>
                <ul className="card-feats">
                  {plan.features.map((f, idx) => (
                    <li key={idx}>✓ {f}</li>
                  ))}
                </ul>
                <button className={`card-btn ${plan.featured ? "gold" : ""}`}>
                  ជ្រើសរើសយកនេះ
                </button>
              </MagicCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ៤. Footer ពេញលេញ */}
      <footer className="kh-footer-main">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-logo">គូព្រេង</h4>
            <p>វេទិកាឌីជីថលឈានមុខគេ សម្រាប់ការរៀបចំមង្គលការនៅកម្ពុជា។</p>
          </div>
          <div className="footer-col">
            <h5>សេវាកម្ម</h5>
            <Link to="/templates">គំរូសន្លឹកការ</Link>
            <Link to="/pricing">តម្លៃកញ្ចប់</Link>
            <Link to="/venues">ទីកន្លែងរៀបការ</Link>
          </div>
          <div className="footer-col">
            <h5>ក្រុមហ៊ុន</h5>
            <Link to="/about">អំពីយើង</Link>
            <Link to="/contact">ទំនាក់ទំនង</Link>
            <Link to="/help">ជំនួយ</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 Koupreng. រៀបចំឡើងដោយក្តីស្រលាញ់ សម្រាប់គូស្វាមីភរិយាខ្មែរ
          </p>
        </div>
      </footer>

      <style>{`
        /* --- Styles បន្ថែមសម្រាប់ Section ថ្មី --- */
        .khmer-theme { background: #FCF8F2; }
        
        .how-it-works { padding: 80px 0; max-width: 1200px; margin: 0 auto; text-align: center; }
        .steps-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; padding: 40px 20px; }
        .step-card { position: relative; padding: 30px; }
        .step-num { font-size: 60px; font-weight: 900; color: rgba(176,146,106,0.1); position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 1; }
        .step-card h3 { position: relative; z-index: 2; font-family: 'Moul'; font-size: 18px; margin-bottom: 15px; }
        .step-link { color: #B0926A; text-decoration: underline; }
        .step-card p { font-family: 'Kantumruy Pro'; color: #777; line-height: 1.6; }

        .kh-footer-main { background: #1a1510; color: #fff; padding: 80px 20px 20px; margin-top: 100px; }
        .footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 50px; }
        .footer-logo { font-family: 'Moul'; color: #B0926A; font-size: 24px; margin-bottom: 20px; }
        .footer-col h5 { font-family: 'Moul'; color: #fff; margin-bottom: 25px; font-size: 16px; }
        .footer-col a { display: block; color: #aaa; text-decoration: none; margin-bottom: 12px; font-family: 'Kantumruy Pro'; font-size: 14px; transition: 0.3s; }
        .footer-col a:hover { color: #B0926A; padding-left: 5px; }
        .footer-bottom { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #666; font-family: 'Kantumruy Pro'; font-size: 13px; }

        /* --- រក្សារចនាបថចាស់ដែលបងមាន --- */
        .hero-modern { height: 100vh; background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; }
        .overlay-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(252,248,242,0.4) 0%, rgba(252,248,242,1) 100%); }
        .hero-content { position: relative; z-index: 10; max-width: 800px; }
        .khmer-title { font-family: 'Moul', serif; padding-top: 15px; font-size: clamp(32px, 8vw, 50px); color: #333; line-height: 1.3; }
        .gold-gradient { background: linear-gradient(90deg, #B0926A, #D4AF37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .khmer-sub { font-family: 'Kantumruy Pro', sans-serif; font-size: 16px; color: #B0926A; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
        .khmer-p { font-family: 'Kantumruy Pro', sans-serif; font-size: 16px; color: #555; line-height: 1.8; margin-top: 20px; max-width: 600px; margin-left: auto; margin-right: auto; }
        .hero-btns { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
        .btn-main-gold { display: inline-block; background: linear-gradient(135deg, #B0926A, #D4AF37); color: #fff; padding: 12px 30px; border-radius: 30px; font-family: 'Kantumruy Pro'; font-weight: 700; text-decoration: none; transition: 0.3s; box-shadow: 0 4px 15px rgba(176,146,106,0.3); }
        .btn-main-gold:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(176,146,106,0.4); }
        .btn-outline { border: 2px solid #B0926A; color: #B0926A; padding: 12px 30px; border-radius: 30px; font-family: 'Kantumruy Pro'; font-weight: 700; text-decoration: none; transition: 0.3s; }
        .btn-outline:hover { background: rgba(176,146,106,0.1); }
        .pricing-modern { padding: 100px 0; max-width: 1200px; margin: 0 auto; }
        .section-head { text-align: center; margin-bottom: 50px; }
        .khmer-title-small { font-family: 'Moul', serif; font-size: 26px; color: #333; }
        .gold-divider { width: 60px; height: 4px; background: #B0926A; margin: 15px auto; }
        .pricing-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .kh-card { background: white; padding: 40px; border-radius: 20px; border: 1px solid rgba(176,146,106,0.1); text-align: center; position: relative; }
        .kh-card.active { border: 2px solid #B0926A; transform: translateY(-10px); }
        .card-tag { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #B0926A; color: white; padding: 5px 20px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .card-name { font-family: 'Moul'; color: #7D6443; margin-bottom: 15px; }
        .card-price { font-size: 36px; font-weight: 800; color: #333; }
        .card-feats { list-style: none; margin: 30px 0; text-align: left; }
        .card-feats li { font-family: 'Kantumruy Pro'; padding: 8px 0; color: #555; border-bottom: 1px solid #f5f5f5; }
        .card-btn { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #ddd; background: white; font-family: 'Kantumruy Pro'; font-weight: 700; cursor: pointer; }
        .card-btn.gold { background: #B0926A; color: white; border: none; }
      `}</style>
    </div>
  );
}
