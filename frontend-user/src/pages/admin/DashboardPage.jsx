/**
 * កំណត់ចំណាំ: admin overview
 * ឯកសារ: src/pages/admin/DashboardPage.jsx
 * ចាស់: ./pages/Admin/DashboardPage.jsx
 */
// # ទំព័រ Overview រួម
import React from "react";

export default function DashboardPage() {
  // ទិន្នន័យតេស្តសាកល្បង (Mock Data)
  const stats = [
    { id: 1, title: "អ្នកប្រើប្រាស់សរុប", count: "1,248 នាក់", color: "border-blue-500", text: "text-blue-600" },
    { id: 2, title: "ធៀបការដែលបានបង្កើត", count: "852 ធៀប", color: "border-green-500", text: "text-green-600" },
    { id: 3, title: "ចំណូលសរុប (ABA KHQR)", count: "$5,420.00", color: "border-amber-500", text: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">📊 ផ្ទាំងគ្រប់គ្រងទូទៅ (Overview)</h2>
      </div>

      {/* Grid កាតស្ថិតិ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item) => (
          <div key={item.id} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${item.color} flex flex-col justify-between`}>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.title}</span>
            <span className={`text-3xl font-bold ${item.text} mt-2`}>{item.count}</span>
          </div>
        ))}
      </div>

      {/* ប្រអប់បង្ហាញព័ត៌មានបន្ថែម */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-2">🎉 ស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងប្រព័ន្ធគូព្រេង</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          នេះជាទីកន្លែងសម្រាប់ Admin តាមដានរាល់ដំណើរការរបស់ Website ទាំងមូល។ បងអាចប្រើប្រាស់ម៉ឺនុយនៅខាងឆ្វេងដៃ ដើម្បីទៅកាន់ការគ្រប់គ្រងគណនីអ្នកប្រើប្រាស់, ពិនិត្យមើលរបាយការណ៍ហិរញ្ញវត្ថុ, និងបន្ថែមម៉ូដសន្លឹកការណ៍ថ្មីៗ។
        </p>
      </div>
    </div>
  );
}
