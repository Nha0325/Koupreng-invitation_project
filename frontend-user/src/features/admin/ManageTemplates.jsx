// # Form សម្រាប់ Upload ម៉ូដធៀបការថ្មីៗ
import React from "react";

export default function ManageTemplates() {
  return (
    <div className="admin-card" style={{ background: "#FFFDF9", padding: "25px", borderRadius: "20px", border: "1px solid rgba(176, 146, 106, 0.25)" }}>
      <h3 style={{ margin: "0 0 20px 0", borderLeft: "4px solid #B0926A", paddingLeft: "10px" }}>គ្រប់គ្រងគំរូធៀបការ (Manage Templates)</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>ទំព័រសម្រាប់បញ្ចូល និងកែសម្រួលម៉ូដធៀបការប្រណីតៗរបស់ប្រព័ន្ធ «គូព្រេង»។</p>
      {/* ទីនេះអាចបង្កើតជាហ្វម ប៊ូតុងដើម្បីផ្ទុករូបភាព ឬតារាងទិន្នន័យ */}
    </div>
  );
}
