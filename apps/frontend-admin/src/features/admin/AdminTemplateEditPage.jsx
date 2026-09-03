import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Palette,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  Heart,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Music,
  Gift,
  Shirt,
  Layers,
  Crown,
  Share2,
  RotateCcw,
  ExternalLink
} from "lucide-react";
import Toast from "../../components/Toast";
import { useToast } from "../../hooks/useToast";
import adminManagementService from "./adminManagementService";

// Preset Theme Styles
const THEME_PRESETS = [
  {
    id: "GARDEN_ROYAL",
    name: "Garden Royal (សួនផ្កា)",
    primary: "#2D7FA6",
    secondary: "#6F9E2E",
    bg: "#FFFDF7",
    badge: "Garden Royal",
    amp: "❀",
    fontKhmer: "Moul",
    fontLatin: "Playfair Display",
    dressColors: [
      { hex: "#2D7FA6", name: "ខៀវផ្កា" },
      { hex: "#6F9E2E", name: "បៃតងស្លឹក" },
      { hex: "#FFFDF7", name: "ស" },
      { hex: "#D6A63C", name: "មាស" },
    ],
  },
  {
    id: "ROYAL_KHMER",
    name: "Royal Khmer (ក្រហមមាស)",
    primary: "#8B1E2D",
    secondary: "#D4AF37",
    bg: "#FFFDF7",
    badge: "Royal Khmer",
    amp: "❖",
    fontKhmer: "Moul",
    fontLatin: "Cinzel",
    dressColors: [
      { hex: "#8B1E2D", name: "ក្រហមទុំ" },
      { hex: "#D4AF37", name: "មាស" },
      { hex: "#FFFDF7", name: "ស" },
      { hex: "#4A151C", name: "ក្រហមចាស់" },
    ],
  },
  {
    id: "KHMER_GOLDEN",
    name: "Khmer Golden (មាសប្រណិត)",
    primary: "#C99A3D",
    secondary: "#E9D0A2",
    bg: "#FFFDF7",
    badge: "Khmer Golden",
    amp: "✦",
    fontKhmer: "Moul",
    fontLatin: "Playfair Display",
    dressColors: [
      { hex: "#FFFDF7", name: "ភ្លុក" },
      { hex: "#C99A3D", name: "មាស" },
      { hex: "#E9D0A2", name: "សាំប៉ាញ" },
      { hex: "#4B2F1A", name: "ត្នោត" },
    ],
  },
  {
    id: "MODERN_MINIMAL",
    name: "Modern Minimal (សម័យសាមញ្ញ)",
    primary: "#0F172A",
    secondary: "#64748B",
    bg: "#FFFFFF",
    badge: "Modern Luxury",
    amp: "&",
    fontKhmer: "Kantumruy Pro",
    fontLatin: "Inter",
    dressColors: [
      { hex: "#0F172A", name: "ខ្មៅប្រណិត" },
      { hex: "#94A3B8", name: "ប្រផេះ" },
      { hex: "#FFFFFF", name: "ស" },
      { hex: "#F59E0B", name: "មាសខ្ចី" },
    ],
  },
];

const DEFAULT_SCHEDULE = [
  { id: "1", time: "07:00 ព្រឹក", title: "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត", desc: "នៅគេហដ្ឋានខាងស្រី" },
  { id: "2", time: "08:30 ព្រឹក", title: "ពិធីហែកំណត់ និងកាត់សក់បង្កក់សិរី", desc: "ជួបជុំញាតិមិត្តទាំងសងខាង" },
  { id: "3", time: "10:00 ព្រឹក", title: "ពិធីសំពះផ្ទឹម និងចងដៃសិរីសួស្តី", desc: "ជូនពរជ័យដល់គូស្វាមីភរិយាថ្មី" },
  { id: "4", time: "05:00 ល្ងាច", title: "ពិធីពិសាភោជនាហារ និងរាំកម្សាន្ត", desc: "សូមអញ្ជើញចូលរួមពិធីលៀងសាយភោជនាហារ" },
];

const DEFAULT_STUDIO_STATE = {
  // Metadata
  name: "Royal Khmer Wedding Studio 2026",
  category: "TRADITIONAL",
  status: "ACTIVE",
  premium: true,
  price: "0.00",
  thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  previewUrl: "",

  // Theme & Appearance
  presetId: "ROYAL_KHMER",
  primaryColor: "#8B1E2D",
  secondaryColor: "#D4AF37",
  backgroundColor: "#FFFDF7",
  badgeText: "Royal Khmer",
  ampSymbol: "❖",
  fontKhmer: "Moul",
  fontLatin: "Playfair Display",
  mood: "light",

  // Hero & Envelope
  invitationTitle: "សិរីសួស្តី អាពាហ៍ពិពាហ៍",
  invitationSubtitle: "សូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា",
  coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  weddingDate: "2026-11-28",
  weddingTime: "17:00",
  blessingMessage: "ដោយសេចក្តីសោមនស្សរីករាយក្រៃលែង យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា អញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យសិរីមង្គល ក្នុងពិធីអាពាហ៍ពិពាហ៍ របស់យើងខ្ញុំទាំងពីរ។",

  // Couple & Parents
  groomName: "ជា វណ្ណដា",
  groomNameEn: "Vanda Chea",
  groomFather: "លោក ជា សុផល",
  groomMother: "លោកស្រី កែវ ចរិយា",
  brideName: "សុខ ស្រីពេជ្រ",
  brideNameEn: "Sreypich Sok",
  brideFather: "លោក សុខ វិបុល",
  brideMother: "លោកស្រី អ៊ុំ សោភា",

  // Schedule
  schedule: DEFAULT_SCHEDULE,

  // Venue & Location
  venueName: "The Premier Center Sen Sok",
  venueHall: "អគារ A (Building A)",
  venueAddress: "ផ្លូវ 1003, សង្កាត់ភ្នំពេញថ្មី, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ",
  googleMapUrl: "https://maps.google.com",

  // Dress code & Gift QR
  dressColors: [
    { hex: "#8B1E2D", name: "ក្រហមទុំ" },
    { hex: "#D4AF37", name: "មាស" },
    { hex: "#FFFDF7", name: "ស" },
    { hex: "#4A151C", name: "ក្រហមចាស់" },
  ],
  qrGiftUrl: "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&w=400&q=80",
  bankAccountName: "VANDA & SREYPICHOfficial",
};

export default function AdminTemplateEditPage() {
  const { templateId } = useParams();
  const isNew = templateId === "new";
  const navigate = useNavigate();
  const { toast, show, clear } = useToast();

  const [activeTab, setActiveTab] = useState("theme"); // 'theme' | 'cover' | 'couple' | 'schedule' | 'venue' | 'dress' | 'catalog'
  const [deviceView, setDeviceView] = useState("mobile"); // 'mobile' | 'tablet' | 'desktop'
  const [previewGateOpen, setPreviewGateOpen] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_STUDIO_STATE);

  // Load existing template data if editing
  useEffect(() => {
    if (isNew) return;
    let active = true;
    adminManagementService
      .template(templateId)
      .then((t) => {
        if (!active) return;
        let parsedConfig = {};
        try {
          if (t.description && t.description.startsWith("{")) {
            parsedConfig = JSON.parse(t.description);
          }
        } catch (e) {}

        setForm((prev) => ({
          ...prev,
          name: t.name || prev.name,
          category: t.category || prev.category,
          thumbnailUrl: t.thumbnailUrl || prev.thumbnailUrl,
          previewUrl: t.previewUrl || prev.previewUrl,
          premium: Boolean(t.premium),
          status: t.status || "ACTIVE",
          price: t.price != null ? String(t.price) : prev.price,
          ...parsedConfig,
        }));
      })
      .catch((err) => {
        if (active) show(err?.message || "មិនអាចទាញយកទិន្នន័យគំរូបានទេ", "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isNew, templateId]);

  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  // Apply Theme Preset
  const handleApplyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      presetId: preset.id,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
      badgeText: preset.badge,
      ampSymbol: preset.amp,
      fontKhmer: preset.fontKhmer,
      fontLatin: preset.fontLatin,
      dressColors: preset.dressColors,
    }));
    show(`បានកំណត់ Theme "${preset.name}" ✓`);
  };

  // Schedule management
  const handleAddScheduleItem = () => {
    const newItem = {
      id: String(Date.now()),
      time: "12:00 ថ្ងៃត្រង់",
      title: "កម្មវិធីថ្មី",
      desc: "ពិពណ៌នាកម្មវិធី",
    };
    setForm((prev) => ({ ...prev, schedule: [...prev.schedule, newItem] }));
  };

  const handleUpdateScheduleItem = (id, field, val) => {
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const handleDeleteScheduleItem = (id) => {
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((item) => item.id !== id),
    }));
  };

  // Save Template
  const handleSave = async () => {
    if (!form.name.trim()) {
      show("សូមបញ្ចូលឈ្មោះគំរូធៀបការ (Template Name)", "error");
      return;
    }

    setSaving(true);
    try {
      // Serialize full studio config into description JSON
      const fullConfigJson = JSON.stringify({
        presetId: form.presetId,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        backgroundColor: form.backgroundColor,
        badgeText: form.badgeText,
        ampSymbol: form.ampSymbol,
        fontKhmer: form.fontKhmer,
        fontLatin: form.fontLatin,
        mood: form.mood,
        invitationTitle: form.invitationTitle,
        invitationSubtitle: form.invitationSubtitle,
        coverImage: form.coverImage,
        weddingDate: form.weddingDate,
        weddingTime: form.weddingTime,
        blessingMessage: form.blessingMessage,
        groomName: form.groomName,
        groomNameEn: form.groomNameEn,
        groomFather: form.groomFather,
        groomMother: form.groomMother,
        brideName: form.brideName,
        brideNameEn: form.brideNameEn,
        brideFather: form.brideFather,
        brideMother: form.brideMother,
        schedule: form.schedule,
        venueName: form.venueName,
        venueHall: form.venueHall,
        venueAddress: form.venueAddress,
        googleMapUrl: form.googleMapUrl,
        dressColors: form.dressColors,
        qrGiftUrl: form.qrGiftUrl,
        bankAccountName: form.bankAccountName,
      });

      const payload = {
        name: form.name.trim(),
        category: form.category,
        thumbnailUrl: form.thumbnailUrl || form.coverImage,
        previewUrl: form.previewUrl || `/templates/${form.presetId?.toLowerCase() || "custom"}`,
        premium: form.premium,
        status: form.status,
        price: parseFloat(form.price) || 0,
        description: fullConfigJson,
      };

      const res = isNew
        ? await adminManagementService.createTemplate(payload)
        : await adminManagementService.updateTemplate(templateId, payload);

      show("បានរក្សាទុក និងផ្សព្វផ្សាយគំរូធៀបការជោគជ័យ ✓");
      navigate(`/templates/${res.id || templateId}`, { replace: true });
    } catch (err) {
      show(err?.message || "បរាជ័យក្នុងការរក្សាទុកគំរូ", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-amber-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <span className="text-sm font-semibold">កំពុងដំណើរការទាញយក Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* 1. TOP STUDIO TOOLBAR */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/templates"
            className="flex h-9 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-800/50 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ត្រឡប់ទៅបញ្ជីគំរូ</span>
          </Link>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h1 className="text-sm font-bold text-white tracking-wide">
                {isNew ? "✨ បង្កើតគំរូថ្មី (Template Visual Studio)" : `🎨 កែសម្រួល: ${form.name}`}
              </h1>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                Studio Editor v2
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              រៀបចំ Themes, Layouts, ព័ត៌មានកូនកំលោះ-កូនក្រមុំ និងកម្មវិធី Live Realtime
            </p>
          </div>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/70 p-1">
          <button
            type="button"
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              deviceView === "mobile"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile (390px)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("tablet")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              deviceView === "tablet"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Tablet (680px)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              deviceView === "desktop"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href={`http://localhost:5173/templates/${form.presetId?.toLowerCase() || "garden-royal-khmer-wedding"}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700"
          >
            <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
            <span>មើល User Tab</span>
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក & ផ្សព្វផ្សាយ"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN SPLIT STUDIO WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        {/* ================= LEFT CONTROLS PANEL (50%) ================= */}
        <aside className="w-1/2 flex flex-col border-r border-zinc-800 bg-zinc-900/50">
          {/* Studio Navigation Tabs */}
          <div className="flex border-b border-zinc-800/80 bg-zinc-950/60 px-4 overflow-x-auto no-scrollbar">
            {[
              { id: "theme", label: "Theme & ពណ៌", icon: Palette },
              { id: "cover", label: "Cover & ស្រោម", icon: Layers },
              { id: "couple", label: "សាមីខ្លួន & មាតាបិតា", icon: Heart },
              { id: "schedule", label: "កម្មវិធីបុណ្យ", icon: Calendar },
              { id: "venue", label: "ទីតាំង & Map", icon: MapPin },
              { id: "dress", label: "Dress Code & QR", icon: Shirt },
              { id: "catalog", label: "កំណត់ Catalog", icon: Crown },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-bold transition cursor-pointer ${
                    active
                      ? "border-amber-500 text-amber-400 bg-amber-500/5"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-amber-500" : "text-zinc-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: THEME & APPEARANCE */}
            {activeTab === "theme" && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>រចនាបថគំរូ Preset Styles</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    ជ្រើសរើស Style មេមួយ ដើម្បីកំណត់ Theme Color និង Font ដោយស្វ័យប្រវត្តិ
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                          form.presetId === preset.id
                            ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                            : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-zinc-100">{preset.name}</span>
                          <span className="text-xs">{preset.amp}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-auto">
                          {preset.dressColors.map((c, i) => (
                            <span
                              key={i}
                              className="h-4 w-4 rounded-full border border-black/30 shadow-sm"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Custom Color Overrides */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">ពណ៌ចម្បង (Custom Colors)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        ពណ៌គោល (Primary)
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-2">
                        <input
                          type="color"
                          value={form.primaryColor}
                          onChange={(e) => setField("primaryColor", e.target.value)}
                          className="h-7 w-7 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.primaryColor}
                          onChange={(e) => setField("primaryColor", e.target.value)}
                          className="w-full bg-transparent text-xs text-zinc-200 outline-none uppercase font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        ពណ៌បន្ទាប់បន្សំ (Secondary)
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-2">
                        <input
                          type="color"
                          value={form.secondaryColor}
                          onChange={(e) => setField("secondaryColor", e.target.value)}
                          className="h-7 w-7 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.secondaryColor}
                          onChange={(e) => setField("secondaryColor", e.target.value)}
                          className="w-full bg-transparent text-xs text-zinc-200 outline-none uppercase font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        ផ្ទៃខាងក្រោយ (Background)
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-2">
                        <input
                          type="color"
                          value={form.backgroundColor}
                          onChange={(e) => setField("backgroundColor", e.target.value)}
                          className="h-7 w-7 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.backgroundColor}
                          onChange={(e) => setField("backgroundColor", e.target.value)}
                          className="w-full bg-transparent text-xs text-zinc-200 outline-none uppercase font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Typography & Fonts */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">ពុម្ពអក្សរ (Typography)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Khmer Font (អក្សរខ្មែរ)
                      </label>
                      <select
                        value={form.fontKhmer}
                        onChange={(e) => setField("fontKhmer", e.target.value)}
                        className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-200 outline-none focus:border-amber-500"
                      >
                        <option value="Moul">Moul (អក្សរមូលឆ្លាក់បុរាណ)</option>
                        <option value="Kantumruy Pro">Kantumruy Pro (សម័យទំនើប)</option>
                        <option value="Battambang">Battambang (ស្រទន់)</option>
                        <option value="Siemreap">Siemreap (រៀបរយ)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Latin Font (អក្សរឡាតាំង)
                      </label>
                      <select
                        value={form.fontLatin}
                        onChange={(e) => setField("fontLatin", e.target.value)}
                        className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-200 outline-none focus:border-amber-500"
                      >
                        <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                        <option value="Cinzel">Cinzel (Royal Classical)</option>
                        <option value="Inter">Inter (Clean Modern Sans)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COVER & HERO */}
            {activeTab === "cover" && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Badge លើស្រោមសំបុត្រ (Seal Badge)
                  </label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setField("badgeText", e.target.value)}
                    placeholder="Garden Royal / Royal Khmer"
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    និមិត្តសញ្ញាផ្កា (Ornament Amp Symbol)
                  </label>
                  <input
                    type="text"
                    value={form.ampSymbol}
                    onChange={(e) => setField("ampSymbol", e.target.value)}
                    placeholder="❀ ឬ ❖ ឬ ✦"
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ចំណងជើងធៀប (Hero Title)
                  </label>
                  <input
                    type="text"
                    value={form.invitationTitle}
                    onChange={(e) => setField("invitationTitle", e.target.value)}
                    placeholder="សិរីសួស្តី អាពាហ៍ពិពាហ៍"
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500 font-moul"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    រូបភាព Cover Banner (URL)
                  </label>
                  <input
                    type="text"
                    value={form.coverImage}
                    onChange={(e) => setField("coverImage", e.target.value)}
                    placeholder="https://..."
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ពាក្យជូនពរផ្លូវការ (Formal Blessing Greeting)
                  </label>
                  <textarea
                    rows={4}
                    value={form.blessingMessage}
                    onChange={(e) => setField("blessingMessage", e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-100 outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: COUPLE & PARENTS */}
            {activeTab === "couple" && (
              <div className="space-y-6 animate-in fade-in">
                {/* Groom Info */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🤵 ព័ត៌មានខាងកូនកំលោះ (Groom)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះខ្មែរ</label>
                      <input
                        type="text"
                        value={form.groomName}
                        onChange={(e) => setField("groomName", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះឡាតាំង</label>
                      <input
                        type="text"
                        value={form.groomNameEn}
                        onChange={(e) => setField("groomNameEn", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះឪពុក</label>
                      <input
                        type="text"
                        value={form.groomFather}
                        onChange={(e) => setField("groomFather", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះម្តាយ</label>
                      <input
                        type="text"
                        value={form.groomMother}
                        onChange={(e) => setField("groomMother", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bride Info */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>👰 ព័ត៌មានខាងកូនក្រមុំ (Bride)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះខ្មែរ</label>
                      <input
                        type="text"
                        value={form.brideName}
                        onChange={(e) => setField("brideName", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះឡាតាំង</label>
                      <input
                        type="text"
                        value={form.brideNameEn}
                        onChange={(e) => setField("brideNameEn", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះឪពុក</label>
                      <input
                        type="text"
                        value={form.brideFather}
                        onChange={(e) => setField("brideFather", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">ឈ្មោះម្តាយ</label>
                      <input
                        type="text"
                        value={form.brideMother}
                        onChange={(e) => setField("brideMother", e.target.value)}
                        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SCHEDULE & AGENDA */}
            {activeTab === "schedule" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">កាលវិភាគកម្មវិធី (Ceremony Agenda)</h3>
                  <button
                    type="button"
                    onClick={handleAddScheduleItem}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>បន្ថែមកម្មវិធី</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {form.schedule.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 transition hover:border-zinc-700"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-400">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">ម៉ោង (Time)</label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleUpdateScheduleItem(item.id, "time", e.target.value)}
                            className="h-8 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">
                            ឈ្មោះកម្មវិធី (Title)
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateScheduleItem(item.id, "title", e.target.value)}
                            className="h-8 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] text-zinc-400 mb-1">
                            ពិពណ៌នាសង្ខេប (Description)
                          </label>
                          <input
                            type="text"
                            value={item.desc}
                            onChange={(e) => handleUpdateScheduleItem(item.id, "desc", e.target.value)}
                            className="h-8 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteScheduleItem(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                        title="លុប"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: VENUE & LOCATION */}
            {activeTab === "venue" && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ឈ្មោះសាលមង្គលការ (Venue / Hall Name)
                  </label>
                  <input
                    type="text"
                    value={form.venueName}
                    onChange={(e) => setField("venueName", e.target.value)}
                    placeholder="The Premier Center Sen Sok"
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    អគារ / បន្ទប់ (Building / Room)
                  </label>
                  <input
                    type="text"
                    value={form.venueHall}
                    onChange={(e) => setField("venueHall", e.target.value)}
                    placeholder="អគារ A (Building A)"
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    អាសយដ្ឋានលម្អិត (Address)
                  </label>
                  <input
                    type="text"
                    value={form.venueAddress}
                    onChange={(e) => setField("venueAddress", e.target.value)}
                    placeholder="ផ្លូវ 1003, សង្កាត់ភ្នំពេញថ្មី, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ"
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Link Google Maps URL
                  </label>
                  <input
                    type="text"
                    value={form.googleMapUrl}
                    onChange={(e) => setField("googleMapUrl", e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* TAB 6: DRESS CODE & QR */}
            {activeTab === "dress" && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">ពណ៌សម្លៀកបំពាក់ភ្ញៀវ (Dress Code)</h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    កំណត់ពណ៌ និងឈ្មោះពណ៌ដែលភ្ញៀវត្រូវស្លៀកពាក់ចូលរួម
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {form.dressColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-2"
                      >
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => {
                            const newColors = [...form.dressColors];
                            newColors[idx] = { ...newColors[idx], hex: e.target.value };
                            setField("dressColors", newColors);
                          }}
                          className="h-7 w-7 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => {
                            const newColors = [...form.dressColors];
                            newColors[idx] = { ...newColors[idx], name: e.target.value };
                            setField("dressColors", newColors);
                          }}
                          placeholder="ឈ្មោះពណ៌ (ឧ. មាស)"
                          className="w-full bg-transparent text-xs text-zinc-100 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-zinc-800" />

                <div>
                  <h3 className="text-sm font-bold text-white mb-3">QR Code ចងដៃ (Digital Gift)</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        រូបភាព QR Code (ABA/Bakong URL)
                      </label>
                      <input
                        type="text"
                        value={form.qrGiftUrl}
                        onChange={(e) => setField("qrGiftUrl", e.target.value)}
                        placeholder="https://..."
                        className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        ឈ្មោះគណនីធនាគារ (Account Name)
                      </label>
                      <input
                        type="text"
                        value={form.bankAccountName}
                        onChange={(e) => setField("bankAccountName", e.target.value)}
                        placeholder="VANDA & SREYPICHOfficial"
                        className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: CATALOG & PRICING */}
            {activeTab === "catalog" && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ឈ្មោះគំរូធៀបការ (Template Name) *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Royal Khmer Wedding Studio 2026"
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      ប្រភេទ (Category)
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                    >
                      <option value="TRADITIONAL">ប្រពៃណីខ្មែរ (TRADITIONAL)</option>
                      <option value="LUXURY">ប្រណិតរាជវាំង (LUXURY)</option>
                      <option value="MODERN">សម័យទំនើប (MODERN)</option>
                      <option value="FLORAL">ផ្កាស្រស់ (FLORAL)</option>
                      <option value="MINIMALIST">សាមញ្ញ (MINIMALIST)</option>
                      <option value="OTHER">ផ្សេងៗ (OTHER)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      ស្ថានភាព (Status)
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value)}
                      className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                    >
                      <option value="ACTIVE">ACTIVE (ផ្សព្វផ្សាយ)</option>
                      <option value="INACTIVE">INACTIVE (ព្រាងទុក)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      កម្រិតសេវាកម្ម (Pricing Tier)
                    </label>
                    <select
                      value={form.premium ? "true" : "false"}
                      onChange={(e) => setField("premium", e.target.value === "true")}
                      className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500"
                    >
                      <option value="false">FREE (ឥតគិតថ្លៃ)</option>
                      <option value="true">PREMIUM (បង់ប្រាក់)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      តម្លៃ (Price in USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setField("price", e.target.value)}
                      placeholder="0.00"
                      className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    រូប Thumbnail Card (URL)
                  </label>
                  <input
                    type="text"
                    value={form.thumbnailUrl}
                    onChange={(e) => setField("thumbnailUrl", e.target.value)}
                    placeholder="https://..."
                    className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ================= RIGHT LIVE PREVIEW PANEL (50%) ================= */}
        <main className="w-1/2 flex flex-col bg-zinc-950/90 relative overflow-hidden items-center justify-center p-6">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute -top-20 -right-20 h-96 w-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
            style={{ backgroundColor: form.primaryColor }}
          />

          {/* Interactive Frame Box */}
          <div
            className={`h-full flex flex-col rounded-[32px] border border-zinc-800/80 bg-white shadow-2xl overflow-hidden transition-all duration-300 ${
              deviceView === "mobile"
                ? "w-[380px]"
                : deviceView === "tablet"
                ? "w-[620px]"
                : "w-full max-w-4xl"
            }`}
            style={{
              "--primary-color": form.primaryColor,
              "--secondary-color": form.secondaryColor,
              backgroundColor: form.backgroundColor,
            }}
          >
            {/* Mockup Mobile Status Bar */}
            <div className="flex h-7 shrink-0 items-center justify-between px-6 bg-black/5 text-[10px] text-zinc-600 font-semibold border-b border-black/5">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* LIVE INVITATION RENDERER */}
            <div className="flex-1 overflow-y-auto relative scroll-smooth text-zinc-900">
              {/* Envelope Gate (Interactive State) */}
              {!previewGateOpen ? (
                <div className="flex h-full min-h-[550px] flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl shadow-xl shadow-amber-500/20 mb-4 animate-bounce"
                    style={{ backgroundColor: form.primaryColor }}
                  >
                    {form.ampSymbol || "❖"}
                  </div>
                  <span
                    className="rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm mb-3"
                    style={{ backgroundColor: form.secondaryColor || form.primaryColor }}
                  >
                    {form.badgeText || "Royal Invitation"}
                  </span>
                  <h2
                    className="text-lg font-bold text-zinc-900 mb-2"
                    style={{ fontFamily: form.fontKhmer === "Moul" ? "Moul, serif" : "inherit" }}
                  >
                    {form.invitationTitle}
                  </h2>
                  <p className="text-xs text-zinc-600 max-w-xs mb-6 leading-relaxed">
                    {form.groomName} & {form.brideName}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPreviewGateOpen(true)}
                    className="rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ backgroundColor: form.primaryColor }}
                  >
                    ✉️ ចុចបើកសំបុត្រអញ្ជើញ
                  </button>
                </div>
              ) : (
                /* Full Live Invitation Page */
                <div className="space-y-6 pb-12 animate-in fade-in">
                  {/* Floating Close / Gate Reset */}
                  <div className="sticky top-2 right-2 flex justify-end px-4 z-20">
                    <button
                      type="button"
                      onClick={() => setPreviewGateOpen(false)}
                      className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md shadow"
                    >
                      🔄 បិទស្រោមវិញ
                    </button>
                  </div>

                  {/* Hero Cover */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-6 text-center text-white">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                        {form.badgeText}
                      </span>
                      <h2
                        className="text-xl font-bold mt-1"
                        style={{ fontFamily: form.fontKhmer === "Moul" ? "Moul, serif" : "inherit" }}
                      >
                        {form.invitationTitle}
                      </h2>
                    </div>
                  </div>

                  {/* Groom & Bride Names */}
                  <div className="px-6 text-center space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <span
                        className="text-lg font-bold"
                        style={{ color: form.primaryColor, fontFamily: form.fontKhmer === "Moul" ? "Moul, serif" : "inherit" }}
                      >
                        {form.groomName}
                      </span>
                      <span className="text-sm text-zinc-400">{form.ampSymbol}</span>
                      <span
                        className="text-lg font-bold"
                        style={{ color: form.primaryColor, fontFamily: form.fontKhmer === "Moul" ? "Moul, serif" : "inherit" }}
                      >
                        {form.brideName}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-serif">
                      {form.groomNameEn} & {form.brideNameEn}
                    </p>
                  </div>

                  {/* Parents Blessing */}
                  <div className="mx-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 text-center text-xs text-zinc-700 leading-relaxed shadow-sm">
                    <p className="font-semibold text-zinc-900 mb-2">សេចក្តីគោរពអញ្ជើញ</p>
                    <p className="text-[11px] text-zinc-600 mb-3">{form.blessingMessage}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-800 border-t border-zinc-200/60 pt-2">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">មាតាបិតាខាងប្រុស</span>
                        <strong>{form.groomFather}</strong>
                        <br />
                        <strong>{form.groomMother}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">មាតាបិតាខាងស្រី</span>
                        <strong>{form.brideFather}</strong>
                        <br />
                        <strong>{form.brideMother}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Ceremony Schedule */}
                  <div className="px-6 space-y-2">
                    <h4
                      className="text-xs font-bold text-center mb-3"
                      style={{ color: form.primaryColor }}
                    >
                      កម្មវិធីសិរីសួស្តី អាពាហ៍ពិពាហ៍
                    </h4>
                    <div className="space-y-2">
                      {form.schedule.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className="flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-white p-2.5 shadow-sm"
                        >
                          <span
                            className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold text-white"
                            style={{ backgroundColor: form.primaryColor }}
                          >
                            {s.time}
                          </span>
                          <div className="text-left">
                            <p className="text-xs font-bold text-zinc-900">{s.title}</p>
                            <p className="text-[10px] text-zinc-500">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Venue & Map */}
                  <div className="mx-6 rounded-2xl border border-zinc-200 bg-white p-4 text-center space-y-2 shadow-sm">
                    <MapPin className="h-5 w-5 mx-auto text-amber-600" />
                    <h5 className="text-xs font-bold text-zinc-900">{form.venueName}</h5>
                    <p className="text-[11px] text-zinc-600">{form.venueHall}</p>
                    <p className="text-[10px] text-zinc-500">{form.venueAddress}</p>
                    <a
                      href={form.googleMapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 rounded-full px-4 py-1.5 text-[11px] font-bold text-white shadow"
                      style={{ backgroundColor: form.primaryColor }}
                    >
                      📍 បើកមើល Google Maps
                    </a>
                  </div>

                  {/* Dress Code Swatches */}
                  <div className="px-6 text-center space-y-2">
                    <span className="text-[11px] font-bold text-zinc-700">ពណ៌សម្លៀកបំពាក់ (Dress Code)</span>
                    <div className="flex items-center justify-center gap-2">
                      {form.dressColors.map((c, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <span
                            className="h-6 w-6 rounded-full border border-black/20 shadow-sm"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[9px] text-zinc-500 mt-0.5">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Digital Gift QR */}
                  <div className="mx-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 text-center space-y-2">
                    <Gift className="h-5 w-5 mx-auto text-amber-700" />
                    <span className="text-xs font-bold text-zinc-900 block">ចងដៃឌីជីថល (QR Code)</span>
                    <img
                      src={form.qrGiftUrl}
                      alt="QR Gift"
                      className="h-28 w-28 mx-auto rounded-xl border border-zinc-200 object-cover shadow-sm"
                    />
                    <p className="text-[10px] font-mono font-bold text-zinc-700">
                      {form.bankAccountName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Toast toast={toast} onClose={clear} />
    </div>
  );
}
