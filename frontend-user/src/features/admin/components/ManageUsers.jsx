/**
 * កំណត់ចំណាំ: UI users
 * ឯកសារ: src/features/admin/components/ManageUsers.jsx
 * ចាស់: ./components/ManageUsers.jsx
 */
// # Table បញ្ជីឈ្មោះ User និងប៊ូតុង Block
import React from "react";

export default function ManageUsers() {
  return (
    <div className="admin-card" style={{ background: "#FFFDF9", padding: "25px", borderRadius: "20px", border: "1px solid rgba(176, 146, 106, 0.25)" }}>
      <h3 style={{ margin: "0 0 20px 0", borderLeft: "4px solid #B0926A", paddingLeft: "10px" }}>គ្រប់គ្រងអ្នកប្រើប្រាស់ (Manage Users)</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>ទំព័រសម្រាប់មើល និងគ្រប់គ្រងគណនីអ្នកប្រើប្រាស់ទាំងអស់។</p>
      {/* ទីនេះអាចបង្កើតជា Table បង្ហាញបញ្ជី Users */}
    </div>
  );
}
