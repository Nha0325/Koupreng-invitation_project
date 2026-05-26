// # UI បង្ហាញលេខស្ថិតិ និងក្រាហ្វិក
import React from "react";

export default function AdminOverview() {
  const mockWeddings = [
    { date: "12/5/2026", names: "Sophak & Sothea", venue: "Wedding Kammenion", status: "រួចរាល់" },
    { date: "12/9/2026", names: "Chamroeun & Bopha", venue: "Phakas Cooin", status: "កំពង់ដើរ" },
    { date: "12/9/2026", names: "Sokha & Pisey", venue: "Wedding Combenia", status: "កំពង់ដើរ" },
  ];

  return (
    <div className="overview-grid">
      <style>{`
        .overview-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 25px;
        }

        .admin-card {
          background: #FFFDF9;
          border: 1px solid rgba(176, 146, 106, 0.25);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 6px 20px rgba(176, 146, 106, 0.04);
        }

        .card-header-title {
          font-size: 17px;
          font-weight: 700;
          color: #4A3E3D;
          margin-bottom: 20px;
          border-left: 4px solid #B0926A;
          padding-left: 10px;
        }

        /* ម៉ូដតារាងមង្គលការ */
        .wedding-table {
          width: 100%;
          border-collapse: collapse;
        }

        .wedding-table th {
          text-align: left;
          padding: 12px 10px;
          font-size: 14px;
          color: #7A6E6D;
          border-bottom: 1px solid rgba(176, 146, 106, 0.15);
        }

        .wedding-table td {
          padding: 16px 10px;
          font-size: 14px;
          border-bottom: 1px solid rgba(176, 146, 106, 0.1);
        }

        .status-badge {
          background: #EFE5D3;
          color: #6E5D4F;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        /* ផ្នែកស្ថិតិរង្វង់ */
        .stats-box {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
        }

        .circle-stat {
          text-align: center;
        }

        .circle-visual {
          width: 75px;
          height: 75px;
          border: 5px solid #B0926A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 8px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(176, 146, 106, 0.1);
        }

        /* ប្រតិទិនខ្នាតតូច */
        .mini-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          text-align: center;
          font-size: 13px;
        }

        .calendar-day-head {
          font-weight: 700;
          color: #B0926A;
          padding-bottom: 5px;
        }

        .calendar-cell {
          padding: 6px;
          border-radius: 8px;
          color: #555;
        }

        .calendar-cell.active {
          background: #B0926A;
          color: white;
          font-weight: 700;
        }
      `}</style>

      {/* ផ្នែកខាងឆ្វេង: តារាងទិន្នន័យ និងរង្វង់ស្ថិតិ */}
      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        <div className="admin-card">
          <div className="card-header-title">ការងាររៀបអាពាហ៍ពិពាហ៍ខាងមុខ</div>
          <table className="wedding-table">
            <thead>
              <tr>
                <th>កាលបរិច្ឆេទ</th>
                <th>ឈ្មោះគូស្វាមីភរិយា</th>
                <th>ទីកន្លែង</th>
                <th>ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {mockWeddings.map((w, idx) => (
                <tr key={idx}>
                  <td>{w.date}</td>
                  <td style={{ fontWeight: 600 }}>{w.names}</td>
                  <td>{w.venue}</td>
                  <td><span className="status-badge">{w.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div className="card-header-title">ស្ថិតិសរុប</div>
          <div className="stats-box">
            <div className="circle-stat">
              <div className="circle-visual">2,204</div>
              <span style={{ fontSize: "13px" }}>កក់សរុប</span>
            </div>
            <div className="circle-stat">
              <div className="circle-visual">$11,300</div>
              <span style={{ fontSize: "13px" }}>ចំណូល</span>
            </div>
            <div className="circle-stat">
              <div className="circle-visual">3,600</div>
              <span style={{ fontSize: "13px" }}>ភ្ញៀវចូលរួម</span>
            </div>
          </div>
        </div>
      </div>

      {/* ផ្នែកខាងស្តាំ: ប្រតិទិន */}
      <div>
        <div className="admin-card">
          <div className="card-header-title">ប្រតិទិនព្រឹត្តិការណ៍</div>
          <div className="mini-calendar">
            {["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"].map((d) => (
              <div key={d} className="calendar-day-head">{d}</div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const isEventDay = day === 15 || day === 16 || day === 17;
              return (
                <div key={i} className={`calendar-cell ${isEventDay ? "active" : ""}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
