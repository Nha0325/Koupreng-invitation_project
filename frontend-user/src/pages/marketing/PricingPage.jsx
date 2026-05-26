import { ScrollReveal } from "../../shared/ui/ScrollReveal";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Import Background
import heroBg from "../../assets/images/background.png";

const plans = [
  {
    id: "basic",
    name: "កញ្ចប់មង្គល",
    price: "ឥតគិតថ្លៃ",
    desc: "សាកសមសម្រាប់គូស្វាមីភរិយាដែលចង់រៀបចំផែនការដំបូង",
    features: [
      "បញ្ជីការងារ ៥ ចំណុច",
      "គ្រប់គ្រងភ្ញៀវ ៤០ នាក់",
      "សន្លឹកការឌីជីថល (Basic)",
      "Dashboard ផ្ទាល់ខ្លួន",
    ],
    btnText: "ចាប់ផ្ដើមឥឡូវនេះ",
    featured: false,
  },
  {
    id: "pro",
    name: "កញ្ចប់មាស",
    price: "$169",
    desc: "ជម្រើសដ៏ល្អបំផុតសម្រាប់ភាពឥតខ្ចោះ និងស៊ីវិល័យ",
    features: [
      "គ្រប់គ្រងភ្ញៀវមិនដែនកំណត់",
      "ការទូទាត់ QR បាគង (Bakong)",
      "សន្លឹកការ Premium Design",
      "Gallery រូបភាព និងវីដេអូ",
      "គាំទ្របច្ចេកទេស ២៤/៧",
    ],
    btnText: "ជ្រើសរើសកញ្ចប់មាស",
    featured: true,
  },
  {
    id: "enterprise",
    name: "កញ្ចប់ពេជ្រ",
    price: "តម្លៃពិគ្រោះ",
    desc: "សម្រាប់សហគ្រាស និងក្រុមហ៊ុនរៀបចំអាពាហ៍ពិពាហ៍",
    features: [
      "គ្រប់គ្រងព្រឹត្តិការណ៍ច្រើន",
      "White-label (ដាក់ Logo ខ្លួនឯង)",
      "Custom Domain ផ្ទាល់ខ្លួន",
      "របាយការណ៍លម្អិត",
      "ជំនួយការផ្ទាល់ (Manager)",
    ],
    btnText: "ទាក់ទងផ្នែកលក់",
    featured: false,
  },
];

const PricingPage = () => {
  return (
    <div className="khmer-modern-theme">
      <section
        className="pricing-wrapper"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="glass-overlay"></div>

        <div className="container">
          <ScrollReveal>
            <div className="header-content">
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0px" }}
                animate={{ opacity: 1, letterSpacing: "2px" }}
                className="sub-title"
              >
                INVEST IN YOUR MOMENT
              </motion.span>
              <h1 className="main-title">
                ជ្រើសរើសសេវាកម្ម
                <br />
                ដែល<span className="gold-text">សាកសមបំផុត</span>
              </h1>
              <div className="divider-modern">
                <span></span>
                <div className="diamond"></div>
                <span></span>
              </div>
            </div>
          </ScrollReveal>

          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div
                  className={`pricing-card ${plan.featured ? "premium" : ""}`}
                >
                  {plan.featured && <div className="badge">RECOMMENDED</div>}

                  <div className="card-top">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="price-tag">
                      <span className="currency">
                        {plan.price !== "តម្លៃពិគ្រោះ" &&
                        plan.price !== "ឥតគិតថ្លៃ"
                          ? ""
                          : ""}
                      </span>
                      <span className="amount">{plan.price}</span>
                    </div>
                    <p className="plan-desc">{plan.desc}</p>
                  </div>

                  <div className="features-list">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="feature-item">
                        <div className="check-icon">L</div>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={plan.id === "enterprise" ? "/contact" : "/register"}
                    className={`action-btn ${plan.featured ? "btn-gold" : "btn-outline"}`}
                  >
                    {plan.btnText}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;600;700&family=Moul&display=swap');

        .khmer-modern-theme { background: #FCF8F2; font-family: 'Kantumruy Pro', sans-serif; }
        
        .pricing-wrapper {
          min-height: 100vh;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
          padding: 140px 20px 80px;
        }

        .glass-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(252, 248, 242, 0.4) 0%, rgba(252, 248, 242, 1) 1000%);
        }

        .container { position: relative; z-index: 10; max-width: 1100px; margin: 0 auto; }

        /* Header Section */
        .header-content { text-align: center; margin-bottom: 60px; }
        .sub-title { font-size: 12px; font-weight: 700; color: #B0926A; display: block; margin-bottom: 10px; }
        .main-title { font-family: 'Moul', serif; font-size: clamp(26px, 5vw, 38px); color: #333; line-height: 1.5; }
        .gold-text { color: #B0926A; }
        
        .divider-modern { display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: 20px; }
        .divider-modern span { width: 50px; height: 1px; background: #B0926A; opacity: 0.5; }
        .diamond { width: 8px; height: 8px; background: #B0926A; transform: rotate(45deg); }

        /* Pricing Cards */
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; align-items: stretch; }
        
        .pricing-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(176,146,106,0.15);
          padding: 50px 35px;
          border-radius: 30px;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .pricing-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(176,146,106,0.1); border-color: #B0926A; }

        .pricing-card.premium { background: white; border: 2px solid #B0926A; box-shadow: 0 15px 35px rgba(176,146,106,0.15); }

        .badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #B0926A;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .plan-name { font-family: 'Moul'; font-size: 18px; color: #7D6443; margin-bottom: 20px; }
        .price-tag { margin-bottom: 15px; }
        .amount { font-size: 42px; font-weight: 700; color: #333; }
        .plan-desc { font-size: 14px; color: #777; line-height: 1.6; min-height: 45px; }

        .features-list { margin: 40px 0; flex-grow: 1; }
        .feature-item { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; font-size: 14px; color: #444; }
        .check-icon { 
          width: 18px; height: 18px; background: rgba(176,146,106,0.1); 
          color: #B0926A; border-radius: 50%; display: flex; 
          align-items: center; justify-content: center; font-size: 10px; font-weight: bold;
        }

        .action-btn {
          padding: 15px;
          border-radius: 15px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          text-align: center;
          transition: 0.3s;
        }

        .btn-gold { background: #B0926A; color: white; border: none; }
        .btn-gold:hover { background: #7D6443; box-shadow: 0 10px 20px rgba(125,100,67,0.3); }

        .btn-outline { border: 1px solid #ddd; color: #555; }
        .btn-outline:hover { border-color: #B0926A; color: #B0926A; background: rgba(176,146,106,0.05); }

        @media (max-width: 768px) {
          .pricing-wrapper { padding-top: 120px; }
          .pricing-card { padding: 40px 25px; }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;
