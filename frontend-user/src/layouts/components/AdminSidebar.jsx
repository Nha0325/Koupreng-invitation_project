/**
 * កំណត់ចំណាំ: ម៉ឺនុយ admin
 * ឯកសារ: src/layouts/components/AdminSidebar.jsx
 * ចាស់: ./components/AdminSidebar.jsx
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  // បញ្ជីម៉ឺនុយរៀបចំតាមរូបភាពគំរូ និងតម្រូវការប្រព័ន្ធ
  const adminLinks = [
    { path: "/admin/dashboard", label: "📋 ផ្ទាំងគ្រប់គ្រង", icon: "📋" },
    { path: "/admin/users", label: "👥 អតិថិជន (Users)", icon: "👥" },
    { path: "/admin/subscriptions", label: "🗓️ ធ្វើកាលវិភាគ", icon: "🗓️" },
    { path: "/admin/templates", label: "🪄 សេវាកម្ម (Templates)", icon: "🪄" },
    { path: "/admin/venues", label: "⑤ ហិរញ្ញវត្ថុ (Venues)", icon: "⑤" },
    { path: "/admin/logs", label: "⚙️ កំណត់ចំណាំ (Logs)", icon: "⚙️" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&display=swap');

        .wedding-sidebar-container {
          font-family: 'Kantumruy Pro', sans-serif;
          /* ពណ៌ខៀវក្រម៉ៅលំដាប់រោងការខ្មែរ (Deep Royal Blue) */
          background-color: #112533; 
          background-image: radial-gradient(circle at top right, #1a354b 0%, #0d1b26 100%);
          border-right: 1px solid rgba(176, 146, 106, 0.2);
        }

        .wedding-moul-title {
          font-family: 'Moul', serif;
          color: #E2C293; /* ពណ៌ទឹកមាសក្រឡៅ */
          letter-spacing: 1px;
        }

        .wedding-link {
          font-weight: 500;
          color: #a3b8cc;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wedding-link:hover {
          color: #E2C293;
          background: rgba(176, 146, 106, 0.1);
          padding-left: 24px;
        }

        /* ប៊ូតុង Active ពណ៌មាសឆ្អិនឆ្អៅដូចក្នុងរូបភាពគំរូ */
        .wedding-link-active {
          background: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%) !important;
          color: #0d1b26 !important;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        /* និមិត្តសញ្ញាក្បាច់ផ្កាខ្មែរចំហៀងខាងក្រោម (Khmer Art Background Decor) */
        .khmer-decor-bg {
          position: absolute;
          bottom: 60px;
          left: 20px;
          opacity: 0.05;
          pointer-events: none;
          width: 80%;
        }
      `}</style>

      <div className="wedding-sidebar-container w-64 h-screen flex flex-col flex-shrink-0 relative">

        {/* ផ្នែកខាងលើ៖ Logo ផ្កាភ្ញីមាស និងចំណងជើងរដ្ឋបាល */}
        <div className="p-6 flex flex-col items-center justify-center gap-2 border-b border-[rgba(176,146,106,0.15)] min-h-[140px]">
          {/* រូបរង្វង់ក្បាច់មាសតំណាងឱ្យអាពាហ៍ពិពាហ៍ */}
          <div className="w-14 h-14 rounded-full border-2 border-[#E2C293] flex items-center justify-center bg-[#1a354b] shadow-inner">
            <span className="text-[#E2C293] text-xl">⚜️</span>
          </div>
          <span className="wedding-moul-title text-base mt-2">រដ្ឋបាលរៀបការ</span>
        </div>

        {/* ផ្នែកកណ្តាល៖ បញ្ជីលីងម៉ឺនុយស្ទីលស្អាតម៉ត់ចត់ */}
        <div className="flex-1 overflow-y-auto p-4 pt-6 space-y-2 z-10">
          {adminLinks.map((link) => {
            const isActive = location.pathname.toLowerCase() === link.path.toLowerCase();
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`wedding-link flex items-center gap-4 px-5 py-3.5 rounded-xl text-[14px] ${
                  isActive ? "wedding-link-active" : ""
                }`}
              >
                {/* បើ Active លាក់ Icon ធម្មតាចេញ ឬទុកតាមការគួរ */}
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* រូបភាពក្រាហ្វិកប្រាសាទអង្គរវត្ត ឬក្បាច់ខ្មែរស្រាលៗនៅបាតក្រោម (តាមរូបគំរូ) */}
        <div className="khmer-decor-bg text-[#E2C293] text-center text-7xl">
          🛕
        </div>

        {/* ផ្នែកខាងក្រោមបង្អស់៖ Footer Sidebar */}
        <div className="p-4 border-t border-[rgba(176,146,106,0.12)] text-[11px] text-[#E2C293] opacity-50 text-center font-medium uppercase tracking-wider bg-black/10">
          Wedding Admin v2.0
        </div>
      </div>
    </>
  );
}
