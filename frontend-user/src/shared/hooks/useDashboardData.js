import { useState } from "react";

/* ── Summary cards data (no JSX — icons are emoji strings) ── */
export const summaryCards = [
    {
        title: "ភ្ញៀវសរុប",
        value: "248",
        borderClass: "border-[#8686d914]",
        shadowClass: "shadow-[0px_2px_16px_#8686d91a]",
        iconWrapperClass: "bg-[linear-gradient(145deg,rgba(234,233,248,1)_0%,rgba(213,213,245,1)_100%)]",
        icon: "👥",
        footerType: "trend",
        trendValue: "+12%",
        trendValueClass: "text-green-600",
        trendText: "ធៀបនឹងខែមុន",
    },
    {
        title: "បានបញ្ជាក់",
        value: "182",
        borderClass: "border-[#16a34a14]",
        shadowClass: "shadow-[0px_2px_16px_#16a34a1a]",
        iconWrapperClass: "bg-green-50",
        icon: "✅",
        footerType: "progress",
        progressTrackClass: "bg-green-100",
        progressBarClass: "bg-green-600",
        progressWidth: 73,
        progressLabel: "73%",
        progressLabelClass: "text-green-600",
    },
    {
        title: "កំពុងរង់ចាំ",
        value: "42",
        borderClass: "border-[#ca8a0414]",
        shadowClass: "shadow-[0px_2px_16px_#ca8a041a]",
        iconWrapperClass: "bg-amber-50",
        icon: "⏳",
        footerType: "progress",
        progressTrackClass: "bg-yellow-100",
        progressBarClass: "bg-yellow-600",
        progressWidth: 17,
        progressLabel: "17%",
        progressLabelClass: "text-yellow-600",
    },
    {
        title: "បានបដិសេធ",
        value: "24",
        borderClass: "border-[#dc262614]",
        shadowClass: "shadow-[0px_2px_16px_#dc26261a]",
        iconWrapperClass: "bg-red-50",
        icon: "❌",
        footerType: "progress",
        progressTrackClass: "bg-red-100",
        progressBarClass: "bg-red-600",
        progressWidth: 10,
        progressLabel: "10%",
        progressLabelClass: "text-red-600",
    },
    {
        title: "ចំណងដៃសរុប",
        value: "67",
        borderClass: "border-[#ea580c14]",
        shadowClass: "shadow-[0px_2px_16px_#ea580c1a]",
        iconWrapperClass: "bg-orange-50",
        icon: "🎁",
        footerType: "trend",
        trendValue: "+8",
        trendValueClass: "text-orange-600",
        trendText: "ថ្ងៃនេះ",
    },
];

/* ── Guest table ── */
export const guestHeaders = ["ឈ្មោះ", "ទំនាក់ទំនង", "ម៉ាស៊ីន", "ស្ថានភាព", "ចំណងដៃ"];

export const guests = [
    { name: "ចន្ទ្រា សុខ", phone: "012 345 678", group: "គ្រួសារ", status: "បញ្ជាក់", statusClass: "bg-green-50 text-green-600", amount: "$150", amountClass: "text-slate-800" },
    { name: "សុខ វណ្ណដា", phone: "095 678 901", group: "មិត្តភក្ដិ", status: "រង់ចាំ", statusClass: "bg-amber-50 text-yellow-600", amount: "—", amountClass: "text-[#7a8799]" },
    { name: "លក្ខណ៍ ធារា", phone: "077 234 567", group: "ការងារ", status: "បញ្ជាក់", statusClass: "bg-green-50 text-green-600", amount: "$200", amountClass: "text-slate-800" },
    { name: "ពេជ្រ រតនា", phone: "068 901 234", group: "គ្រួសារ", status: "បដិសេធ", statusClass: "bg-red-50 text-red-600", amount: "—", amountClass: "text-[#7a8799]" },
    { name: "ស្រីពៅ ចាន់", phone: "085 432 109", group: "មិត្តភក្ដិ", status: "បញ្ជាក់", statusClass: "bg-green-50 text-green-600", amount: "$80", amountClass: "text-slate-800" },
];

/* ── Quick actions ── */
export const quickActions = [
    { label: "បន្ថែមភ្ញៀវ", bg: "bg-[#eae9f8]", border: "border-[#d5d5f5]", iconBg: "bg-[linear-gradient(145deg,rgba(134,134,217,1)_0%,rgba(167,139,250,1)_100%)]", icon: "👥" },
    { label: "ផ្ញើអញ្ជើញ", bg: "bg-green-50", border: "border-green-200", iconBg: "bg-green-600", icon: "✉️" },
    { label: "នាំចេញ PDF", bg: "bg-orange-50", border: "border-orange-200", iconBg: "bg-orange-600", icon: "📄" },
    { label: "QR Code", bg: "bg-fuchsia-50", border: "border-purple-200", iconBg: "bg-purple-500", icon: "📱" },
];

/* ── Upcoming tasks ── */
export const upcomingTasks = [
    { title: "ជួបជាមួយអ្នករៀបចំ", time: "ថ្ងៃស្អែក ម៉ោង ១០:០០", dotClass: "bg-[#6b6bc4]" },
    { title: "ញ៉ាំបំណែងម្ហូប", time: "ថ្ងៃទី ០៣ ធ្នូ ម៉ោង ១៤:០០", dotClass: "bg-yellow-600" },
    { title: "ធ្វើតេស្តស្លៀកពាក់", time: "ថ្ងៃទី ០៥ ធ្នូ ម៉ោង ០៩:០០", dotClass: "bg-green-600" },
];

/* ── Donut segments ── */
export const donutSegments = [
    { label: "បានបញ្ជាក់ (182)", pct: 73.4, color: "#16a34a" },
    { label: "រង់ចាំ (42)", pct: 16.9, color: "#ca8a04" },
    { label: "បដិសេធ (24)", pct: 9.68, color: "#dc2626" },
];

/* ── Chart data ── */
export const months = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
export const expenseData = [800, 1200, 950, 1400, 1100, 1600, 1800, 1300, 1500, 1700, 1200, 1900];
export const budgetData = [1000, 1250, 1000, 1500, 1250, 1750, 2000, 1500, 1750, 2000, 1500, 2000];

/* ── Hook ── */
export function useAnalyticsFilter() {
    const [activeFilter, setActiveFilter] = useState("all");
    return { activeFilter, setActiveFilter };
}
