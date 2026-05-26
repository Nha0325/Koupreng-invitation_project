import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminShell() {
  const colors = {
    gold: "#B0926A",
    deepPurple: "#3D2461",
    bgAlpha: "rgba(255, 252, 247, 0.85)",
  };

  return (
    <div className="admin-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap');

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #FBF7F0;
          font-family: 'Kantumruy Pro', sans-serif;
          color: #4A3E3D;
        }

        .admin-main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        /* Mini Header ខាងលើ */
        .admin-top-nav {
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid rgba(176, 146, 106, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          box-shadow: 0 2px 10px rgba(176, 146, 106, 0.05);
        }

        .admin-page-title {
          font-size: 20px;
          font-weight: 700;
          color: ${colors.deepPurple};
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .admin-info {
          text-align: right;
        }

        .admin-info .name {
          display: block;
          font-weight: 600;
          font-size: 14px;
          color: #333;
        }

        .admin-info .role {
          font-size: 12px;
          color: ${colors.gold};
          font-weight: 700;
        }

        .admin-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid ${colors.gold};
          object-fit: cover;
        }

        .admin-content-view {
          flex: 1;
          padding: 30px;
          background-image: radial-gradient(rgba(176, 146, 106, 0.05) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
        }
      `}</style>

      {/* ម៉ឺនុយចំហៀងឆ្វេង */}
      <AdminSidebar />

      {/* ផ្ទៃមាតិកាខាងស្តាំ */}
      <div className="admin-main-area">
        <header className="admin-top-nav">
          <div className="admin-page-title">រដ្ឋបាលរៀបអាពាហ៍ពិពាហ៍ (Wedding Administration)</div>
          <div className="admin-profile">
            <div className="admin-info">
              <span className="name">Kouk Sreypkay</span>
              <span className="role">👑 សួស្តី, Admin</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" 
              alt="Admin Avatar" 
              className="admin-avatar"
            />
          </div>
        </header>

        {/* កន្លែងបង្ហាញទំព័រដែលប្តូរតាម Route */}
        <div className="admin-content-view">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
