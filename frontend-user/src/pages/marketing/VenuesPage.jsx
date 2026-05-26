import { useState } from "react";
import { ScrollReveal } from "../../shared/ui/ScrollReveal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Import Background ដូច Homepage
import heroBg from "../../assets/icons/background.png";

const venues = [
  {
    id: 1,
    name: "សាលមហោស្រព កោះពេជ្រ",
    location: "ភ្នំពេញ",
    capacity: "៥០០ - ២០០០ នាក់",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    tags: ["ពេញនិយម", "សាលធំ"],
  },
  {
    id: 2,
    name: "The Premier Centre Sen Sok",
    location: "ភ្នំពេញ",
    capacity: "៣០០ - ១៥០០ នាក់",
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    tags: ["ទំនើប", "សេវាកម្មល្អ"],
  },
  {
    id: 3,
    name: "សណ្ឋាគារ រ៉េស៊ីដង់ សុខា",
    location: "សៀមរាប",
    capacity: "២០០ - ៨០០ នាក់",
    priceRange: "$$$$",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
    tags: ["Luxury", "ប្រណីត"],
  },
  {
    id: 4,
    name: "Classy Hotel & Spa",
    location: "បាត់ដំបង",
    capacity: "១៥០ - ៥០០ នាក់",
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1543157145-f78c636d023d?q=80&w=1000&auto=format&fit=crop",
    tags: ["បាត់ដំបង", "តម្លៃសមរម្យ"],
  },
];

const VenuesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="venues-page-wrapper">
      {/* Background Section ដូច Homepage */}
      <div className="fixed-bg-overlay">
        <div
          className="bg-image"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="bg-gradient-cover"></div>
      </div>

      <main className="venues-content">
        <div className="container">
          <ScrollReveal>
            <div className="header-content">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sub-title"
              >
                FIND YOUR PERFECT VENUE
              </motion.span>
              <h1 className="main-title">
                ស្វែងរក<span className="gold-text">ទីកន្លែងមង្គល</span>
              </h1>
              <div className="divider-modern">
                <span></span>
                <div className="diamond"></div>
                <span></span>
              </div>

              {/* Modern Search Bar */}
              <div className="search-box-wrapper">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="ស្វែងរកតាមឈ្មោះ ឬទីតាំង..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn-search">ស្វែងរក</button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="venues-grid">
            {filteredVenues.map((venue, i) => (
              <ScrollReveal key={venue.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -10 }} className="venue-card">
                  <div className="venue-image-container">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="venue-img"
                    />
                    <div className="venue-tags">
                      {venue.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="img-overlay"></div>
                  </div>

                  <div className="venue-info">
                    <h3 className="venue-name">{venue.name}</h3>
                    <div className="venue-meta">
                      <p>
                        <span className="icon">📍</span> {venue.location}
                      </p>
                      <p>
                        <span className="icon">👥</span> ចំណុះ: {venue.capacity}
                      </p>
                      <p>
                        <span className="icon">💰</span> កម្រិតតម្លៃ:{" "}
                        <span className="gold-text-bold">
                          {venue.priceRange}
                        </span>
                      </p>
                    </div>
                    <Link
                      to={`/venues/${venue.id}`}
                      className="view-detail-btn"
                    >
                      មើលព័ត៌មានលម្អិត
                    </Link>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        .venues-page-wrapper {
          min-height: 100vh;
          background-color: #fffcf7;
          font-family: 'Kantumruy Pro', sans-serif;
          position: relative;
        }

        /* Fixed Background Style ដូច Homepage */
        .fixed-bg-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .bg-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }
        .bg-gradient-cover {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(252, 248, 242, 0.4) 0%, rgba(252, 248, 242, 1) 1000%);
        }

        .venues-content {
          position: relative;
          z-index: 10;
          padding: 160px 20px 100px;
        }

        .container {
          max-width: 1300px;
          margin: 0 auto;
        }
        
        .header-content { text-align: center; margin-bottom: 80px; }
        
        .sub-title { 
          font-size: 11px; 
          font-weight: 800; 
          color: #B0926A; 
          letter-spacing: 4px; 
          display: block;
          margin-bottom: 10px;
        }

        .main-title { 
          font-family: 'Moul', serif; 
          font-size: clamp(28px, 5vw, 45px); 
          color: #222; 
          line-height: 1.6;
        }

        .gold-text { color: #B0926A; margin-left: 15px; }

        .divider-modern { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 20px; 
          margin: 25px 0; 
        }
        .divider-modern span { width: 80px; height: 1px; background: linear-gradient(to right, transparent, #B0926A, transparent); }
        .diamond { width: 10px; height: 10px; background: #B0926A; transform: rotate(45deg); box-shadow: 0 0 10px rgba(176,146,106,0.5); }

        /* Search Box ឱ្យស៊ីជាមួយ Modern Theme */
        .search-box-wrapper { display: flex; justify-content: center; margin-top: 40px; }
        .search-box { 
          width: 100%;
          max-width: 550px; 
          display: flex; 
          gap: 5px; 
          background: white; 
          padding: 6px; 
          border-radius: 20px; 
          box-shadow: 0 15px 35px rgba(176,146,106,0.1); 
          border: 1px solid white;
        }
        .search-box input { 
          flex: 1; border: none; padding: 12px 20px; outline: none; 
          font-family: 'Kantumruy Pro'; font-size: 14px; background: transparent; color: #444;
        }
        .btn-search { 
          background: #1a1a1a; color: white; border: none; padding: 10px 35px; 
          border-radius: 15px; font-weight: 700; cursor: pointer; transition: 0.3s;
        }
        .btn-search:hover { background: #B0926A; transform: scale(1.02); }

        /* Venue Grid Style */
        .venues-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
          gap: 40px; 
        }
        
        .venue-card { 
          background: rgba(255, 255, 255, 0.9); 
          backdrop-filter: blur(10px);
          border-radius: 35px; 
          overflow: hidden; 
          border: 1px solid white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .venue-image-container { 
          height: 260px; 
          position: relative; 
          overflow: hidden; 
        }
        .venue-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 1s;
        }
        .venue-card:hover .venue-img { transform: scale(1.1); }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
        }

        .venue-tags { position: absolute; top: 20px; left: 20px; display: flex; gap: 8px; z-index: 5; }
        .tag { 
          background: white; 
          color: #B0926A; 
          padding: 6px 15px; 
          border-radius: 50px; 
          font-size: 10px; 
          font-weight: 800; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          text-transform: uppercase;
        }

        .venue-info { padding: 30px; text-align: center; }
        .venue-name { 
          font-family: 'Moul'; 
          font-size: 18px; 
          color: #222; 
          margin-bottom: 20px; 
          line-height: 1.6; 
        }
        
        .venue-meta { margin-bottom: 25px; }
        .venue-meta p { 
          font-size: 14px; 
          color: #666; 
          margin-bottom: 10px; 
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .gold-text-bold { color: #B0926A; font-weight: 800; }
        
        .view-detail-btn { 
          display: block; 
          padding: 15px; 
          background: #f8f8f8;
          color: #333; 
          text-decoration: none; 
          border-radius: 18px; 
          font-size: 13px; 
          font-weight: 800; 
          transition: 0.3s;
          border: 1px solid #eee;
        }
        .view-detail-btn:hover { 
          background: #1a1a1a; 
          color: white; 
          border-color: #1a1a1a;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .venues-grid { grid-template-columns: 1fr; }
          .venues-content { padding-top: 120px; }
          .main-title { font-size: 24px; }
        }
      `}</style>
    </div>
  );
};

export default VenuesPage;
