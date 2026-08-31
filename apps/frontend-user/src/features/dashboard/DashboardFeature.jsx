import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoAddCircle,
  IoAddCircleOutline,
  IoBarChartOutline,
  IoCalendarClearOutline,
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoChevronForwardOutline,
  IoCopyOutline,
  IoCreateOutline,
  IoGiftOutline,
  IoGlobeOutline,
  IoHeartOutline,
  IoImagesOutline,
  IoLocationOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoQrCodeOutline,
  IoSendOutline,
  IoSparkles,
  IoSparklesOutline,
  IoTimeOutline,
  IoWalletOutline,
  IoShareSocialOutline,
} from "react-icons/io5";

import { invitationService } from "@/features/invitations/api/invitationApi";
import { guestService } from "@/features/guests/api/guestApi";
import { rsvpService } from "@/features/rsvp/api/rsvpApi";
import { budgetService } from "../budget/api/budgetApi";
import { planningService } from "@/features/planning/api/planningApi";
import notificationService from "../notifications/notificationService";
import { listDrafts } from "../../shared/storage/weddingStorage";
import { useBackendMessages } from "../../shared/i18n/useBackendMessages";

function asList(val) {
  if (Array.isArray(val)) return val;
  if (Array.isArray(val?.data)) return val.data;
  if (Array.isArray(val?.items)) return val.items;
  if (Array.isArray(val?.content)) return val.content;
  return [];
}

export default function DashboardFeature() {
  const navigate = useNavigate();
  const { lang, text } = useBackendMessages("dashboard");
  const [copied, setCopied] = useState(false);
  const [selectedInvId, setSelectedInvId] = useState(null);

  const [state, setState] = useState({
    loading: true,
    error: "",
    invitations: [],
    selectedInvitation: null,
    guests: [],
    rsvps: [],
    rsvpSummary: null,
    budgetItems: [],
    gifts: [],
    notifications: [],
    checkInSummary: null,
  });

  // Countdown timer state
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    hasDate: false,
  });

  const loadData = async (targetId = null) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: "" }));
      const invs = asList(await invitationService.listMine().catch(() => []));
      const drafts = listDrafts();
      const allInvs = [
        ...invs,
        ...drafts.filter((d) => !invs.some((i) => (i.id || i.invitationId) === (d.id || d.invitationId))),
      ];

      const activeInv = targetId
        ? allInvs.find((i) => (i.id || i.invitationId) == targetId) || allInvs[0] || null
        : allInvs[0] || null;

      const invId = activeInv?.id || activeInv?.invitationId;
      if (invId) {
        setSelectedInvId(invId);
        const [guests, rsvps, rsvpSummary, budgetItems, gifts, notifs, checkIn] =
          await Promise.all([
            guestService.listByInvitation(invId).catch(() => []),
            rsvpService.listByInvitation(invId).catch(() => []),
            rsvpService.summary(invId).catch(() => null),
            budgetService.listItems(invId).catch(() => []),
            planningService.listGifts(invId).catch(() => []),
            notificationService.listByInvitation(invId).catch(() => []),
            guestService.checkInSummary(invId).catch(() => null),
          ]);

        setState({
          loading: false,
          error: "",
          invitations: allInvs,
          selectedInvitation: activeInv,
          guests: asList(guests),
          rsvps: asList(rsvps),
          rsvpSummary,
          budgetItems: asList(budgetItems),
          gifts: asList(gifts),
          notifications: asList(notifs),
          checkInSummary: checkIn,
        });
        return;
      }

      setState({
        loading: false,
        error: "",
        invitations: allInvs,
        selectedInvitation: null,
        guests: [],
        rsvps: [],
        rsvpSummary: null,
        budgetItems: [],
        gifts: [],
        notifications: [],
        checkInSummary: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Failed to load dashboard data.",
      }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectInvitation = (id) => {
    setSelectedInvId(id);
    loadData(id);
  };

  const stats = useMemo(() => {
    const inv = state.selectedInvitation;
    const guestTotal = state.guests.reduce((sum, g) => sum + (Number(g.count) || 1), 0);
    const rsvpYes = state.rsvps.reduce(
      (sum, r) =>
        r.status === "ACCEPTED" || r.attending || r.responseStatus === "ACCEPTED"
          ? sum + (Number(r.count) || 1)
          : sum,
      0
    );
    const rsvpNo = state.rsvps.reduce(
      (sum, r) =>
        r.status === "DECLINED" || r.responseStatus === "DECLINED"
          ? sum + (Number(r.count) || 1)
          : sum,
      0
    );

    const totalBudget = state.budgetItems.reduce(
      (sum, b) => sum + (Number(b.budget) || Number(b.estimatedCost) || Number(b.amount) || 0),
      0
    );
    const actualExpense = state.budgetItems.reduce(
      (sum, b) => sum + (Number(b.actualCost) || Number(b.amount) || 0),
      0
    );
    const totalGifts = state.gifts.reduce(
      (sum, g) => sum + (Number(g.amount) || 0),
      0
    );

    const checkedInCount =
      state.checkInSummary?.totalCheckedIn ||
      state.guests.filter((g) => g.checkedIn).length ||
      0;

    const rsvpRate = guestTotal > 0 ? Math.min(100, Math.round((rsvpYes / guestTotal) * 100)) : 0;
    const budgetRate = totalBudget > 0 ? Math.min(100, Math.round((actualExpense / totalBudget) * 100)) : 0;

    return {
      hasInvitation: !!inv,
      title:
        inv?.title ||
        (inv?.groomName && inv?.brideName
          ? `${inv.groomName} & ${inv.brideName}`
          : "ផ្ទាំងគ្រប់គ្រងមង្គលការ"),
      couple: inv?.groomName && inv?.brideName ? `${inv.groomName} & ${inv.brideName}` : "",
      eventDate: inv?.eventDate || inv?.weddingDate || "",
      venue: inv?.venue || inv?.location || "",
      slug: inv?.slug || "",
      status: inv?.status || (inv?.published ? "PUBLISHED" : "DRAFT"),
      id: inv?.id || inv?.invitationId,
      guestTotal: Math.max(guestTotal, state.guests.length),
      rsvpYes,
      rsvpNo,
      rsvpPending: Math.max(0, guestTotal - rsvpYes - rsvpNo),
      rsvpRate,
      checkedInCount,
      totalBudget,
      actualExpense,
      budgetRate,
      remainingBudget: Math.max(0, totalBudget - actualExpense),
      totalGifts,
      giftCount: state.gifts.length,
    };
  }, [state]);

  // Live Countdown Effect
  useEffect(() => {
    if (!stats.eventDate) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, hasDate: false });
      return;
    }

    const calculateTime = () => {
      const target = new Date(stats.eventDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (isNaN(target)) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, hasDate: false });
        return;
      }

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, hasDate: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds, isPast: false, hasDate: true });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [stats.eventDate]);

  const handleCopyLink = (slug) => {
    if (!slug) return;
    const url = `${window.location.origin}/w/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Loading Skeleton
  if (state.loading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-8 py-8 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
          <div className="h-48 rounded-3xl bg-amber-100/50 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-white border border-stone-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-96 rounded-3xl bg-white border border-stone-200" />
            <div className="lg:col-span-4 h-96 rounded-3xl bg-white border border-stone-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] text-stone-900 px-4 sm:px-8 py-6 pb-28">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* =========================================================================
            CASE 1: HOST HAS NO INVITATIONS YET (CLEAN WELCOME HERO)
           ========================================================================= */}
        {!stats.hasInvitation ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/80 px-4 py-1.5 text-xs font-black text-amber-900 mb-6 shadow-xs">
              <IoSparkles className="text-amber-600" /> <span>Koupreng Digital Wedding Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight max-w-2xl leading-tight">
              ផ្ទាំងគ្រប់គ្រងមង្គលការឌីជីថល
            </h1>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl mt-4 leading-relaxed">
              សូមស្វាគមន៍! បង្កើតសន្លឹកការអាពាហ៍ពិពាហ៍បែបឌីជីថលដំបូងរបស់អ្នក ដើម្បីគ្រប់គ្រងបញ្ជីភ្ញៀវ តាមដានការឆ្លើយតប RSVP ថវិកា និងប្រាក់ចំណងដៃបានយ៉ាងងាយស្រួល។
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/create/wedding"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 font-black text-base shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5"
              >
                <IoAddCircle className="text-2xl" />
                <span>បង្កើតសន្លឹកការដំបូងរបស់អ្នក</span>
              </Link>

              <Link
                to="/templates/browse"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 px-6 py-4 font-bold text-sm shadow-xs transition"
              >
                <span>ស្វែងរកគំរូធៀបការ (Templates)</span>
                <IoChevronForwardOutline />
              </Link>
            </div>

            {/* Feature Highlights Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-3">
                  <IoGlobeOutline />
                </div>
                <h4 className="font-black text-stone-900 text-sm">សន្លឹកការ Online</h4>
                <p className="text-xs text-stone-500 mt-1">មាន Live Link ចែករំលែកតាម Telegram, FB</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl mb-3">
                  <IoCheckmarkCircleOutline />
                </div>
                <h4 className="font-black text-stone-900 text-sm">តាមដាន RSVP</h4>
                <p className="text-xs text-stone-500 mt-1">ដឹងចំនួនភ្ញៀវចូលរួមមុនថ្ងៃការជាក់ស្តែង</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl mb-3">
                  <IoQrCodeOutline />
                </div>
                <h4 className="font-black text-stone-900 text-sm">ស្កេន QR Check-In</h4>
                <p className="text-xs text-stone-500 mt-1">ស្កេនវត្តមានភ្ញៀវមាត់ទ្វាររហ័សទាន់ចិត្ត</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl mb-3">
                  <IoWalletOutline />
                </div>
                <h4 className="font-black text-stone-900 text-sm">ថវិកា & ចងដៃ</h4>
                <p className="text-xs text-stone-500 mt-1">កត់ត្រាចំណាយ និងប្រាក់ចំណងដៃច្បាស់លាស់</p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
              CASE 2: HOST HAS INVITATIONS (FULL CONTROL DASHBOARD)
             ========================================================================= */
          <>
            {/* Top Multi-Event Selector Bar */}
            {state.invitations.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                <span className="text-xs font-black text-stone-500 uppercase tracking-wider shrink-0">
                  កម្មវិធីរបស់អ្នក:
                </span>
                <div className="flex items-center gap-2">
                  {state.invitations.map((inv) => {
                    const id = inv.id || inv.invitationId;
                    const isSelected = id === selectedInvId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleSelectInvitation(id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-white border border-stone-200 text-stone-700 hover:bg-amber-50"
                        }`}
                      >
                        <span>{inv.title || `${inv.groomName || "កូនកំលោះ"} & ${inv.brideName || "កូនក្រមុំ"}`}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1. Grand Event Spotlight Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/95 via-white to-teal-50/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="min-w-0 max-w-3xl">
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100/90 px-3.5 py-1 text-xs font-black text-amber-900 shadow-2xs">
                      <IoSparkles className="text-amber-700 text-sm" /> ផ្ទាំងគ្រប់គ្រងមង្គលការឌីជីថល
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                        stats.status === "PUBLISHED"
                          ? "bg-teal-100 text-teal-900 border border-teal-300"
                          : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      {stats.status === "PUBLISHED" ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
                          </span>
                          <span>ផ្សាយផ្ទាល់ (Live)</span>
                        </>
                      ) : (
                        <span>ព្រាង (Draft)</span>
                      )}
                    </span>
                  </div>

                  {/* Heading 1 */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                    {stats.title}
                  </h1>

                  {/* Event Details */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-stone-600">
                    {stats.eventDate && (
                      <span className="inline-flex items-center gap-2 font-bold text-stone-800 bg-white border border-stone-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                        <IoCalendarClearOutline className="text-amber-600 text-base" />
                        <span>{stats.eventDate}</span>
                      </span>
                    )}
                    {stats.venue && (
                      <span className="inline-flex items-center gap-2 font-bold text-stone-800 bg-white border border-stone-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                        <IoLocationOutline className="text-teal-600 text-base" />
                        <span>{stats.venue}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Countdown & Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4 shrink-0 w-full lg:w-auto">
                  {timeRemaining.hasDate && (
                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-center min-w-[3.5rem] shadow-xs">
                        <div className="text-xl font-black text-amber-800 leading-none">
                          {timeRemaining.days}
                        </div>
                        <div className="text-[11px] font-bold text-amber-600 uppercase mt-0.5">ថ្ងៃ</div>
                      </div>
                      <span className="text-amber-400 font-black">:</span>
                      <div className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-center min-w-[3.5rem] shadow-xs">
                        <div className="text-xl font-black text-amber-800 leading-none">
                          {String(timeRemaining.hours).padStart(2, "0")}
                        </div>
                        <div className="text-[11px] font-bold text-amber-600 uppercase mt-0.5">ម៉ោង</div>
                      </div>
                      <span className="text-amber-400 font-black">:</span>
                      <div className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-center min-w-[3.5rem] shadow-xs">
                        <div className="text-xl font-black text-amber-800 leading-none">
                          {String(timeRemaining.minutes).padStart(2, "0")}
                        </div>
                        <div className="text-[11px] font-bold text-amber-600 uppercase mt-0.5">នាទី</div>
                      </div>
                      <span className="text-amber-400 font-black">:</span>
                      <div className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-center min-w-[3.5rem] shadow-xs">
                        <div className="text-xl font-black text-amber-800 leading-none">
                          {String(timeRemaining.seconds).padStart(2, "0")}
                        </div>
                        <div className="text-[11px] font-bold text-amber-600 uppercase mt-0.5">វិនាទី</div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5">
                    {stats.slug && (
                      <button
                        type="button"
                        onClick={() => handleCopyLink(stats.slug)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-amber-400 hover:bg-amber-50/60 transition"
                      >
                        <IoCopyOutline className="text-base text-amber-600" />
                        <span>{copied ? "បានចម្លង Link!" : "ចម្លង Link ធៀប"}</span>
                      </button>
                    )}

                    {stats.slug && (
                      <Link
                        to={`/w/${stats.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-teal-400 hover:bg-teal-50/60 transition"
                      >
                        <IoGlobeOutline className="text-base text-teal-600" />
                        <span>មើល Live</span>
                      </Link>
                    )}

                    {stats.id && (
                      <Link
                        to={`/dashboard/invitations/${stats.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-amber-400 hover:bg-amber-50/60 transition"
                      >
                        <IoCreateOutline className="text-base text-amber-600" />
                        <span>កែសម្រួល</span>
                      </Link>
                    )}

                    <Link
                      to="/create/wedding"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 text-xs font-black shadow-md shadow-amber-500/25 transition hover:-translate-y-0.5"
                    >
                      <IoAddCircleOutline className="text-base" />
                      <span>បង្កើតធៀបថ្មី</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. 4 Core KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Guests */}
              <Link
                to="/dashboard/guests"
                className="group flex flex-col justify-between rounded-3xl p-6 bg-white border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
                    ភ្ញៀវកិត្តិយស
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 text-2xl group-hover:scale-110 transition-transform">
                    <IoPeopleOutline />
                  </div>
                </div>
                <div className="my-4">
                  <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                    {stats.guestTotal}{" "}
                    <span className="text-sm font-bold text-stone-400">នាក់</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    បានបញ្ចូលក្នុងបញ្ជី {stats.guestTotal} នាក់
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-bold">
                  <span>គ្រប់គ្រងបញ្ជីភ្ញៀវ</span>
                  <IoChevronForwardOutline />
                </div>
              </Link>

              {/* Card 2: RSVP */}
              <Link
                to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"}
                className="group flex flex-col justify-between rounded-3xl p-6 bg-white border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
                    ការឆ្លើយតប RSVP
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 text-2xl group-hover:scale-110 transition-transform">
                    <IoCheckmarkCircleOutline />
                  </div>
                </div>
                <div className="my-4">
                  <div className="text-3xl sm:text-4xl font-black text-teal-700 tracking-tight">
                    {stats.rsvpRate}%
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden mt-2.5">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${stats.rsvpRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    ចូលរួម {stats.rsvpYes} នាក់ | អវត្តមាន {stats.rsvpNo} នាក់
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-teal-700 font-bold">
                  <span>ពិនិត្យ RSVP</span>
                  <IoChevronForwardOutline />
                </div>
              </Link>

              {/* Card 3: Budget */}
              <Link
                to="/dashboard/expenses"
                className="group flex flex-col justify-between rounded-3xl p-6 bg-white border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
                    ថវិកា & ចំណាយ
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 text-2xl group-hover:scale-110 transition-transform">
                    <IoWalletOutline />
                  </div>
                </div>
                <div className="my-4">
                  <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                    ${stats.actualExpense.toLocaleString()}
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden mt-2.5">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
                      style={{ width: `${stats.budgetRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    គម្រោងថវិកាសរុប ${stats.totalBudget.toLocaleString()} ({stats.budgetRate}%)
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-rose-700 font-bold">
                  <span>គ្រប់គ្រងចំណាយ</span>
                  <IoChevronForwardOutline />
                </div>
              </Link>

              {/* Card 4: Gifts */}
              <Link
                to="/dashboard/gifts"
                className="group flex flex-col justify-between rounded-3xl p-6 bg-white border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
                    ប្រាក់ចំណងដៃឌីជីថល
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 text-2xl group-hover:scale-110 transition-transform">
                    <IoGiftOutline />
                  </div>
                </div>
                <div className="my-4">
                  <div className="text-3xl sm:text-4xl font-black text-purple-700 tracking-tight">
                    ${stats.totalGifts.toLocaleString()}
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    បានកត់ត្រា {stats.giftCount} ចំណងដៃ
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-purple-700 font-bold">
                  <span>មើលបញ្ជីចងដៃ</span>
                  <IoChevronForwardOutline />
                </div>
              </Link>
            </div>

            {/* 3. Main Content 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Card: RSVP Live Progress & Status Breakdown */}
                <div className="rounded-3xl p-7 bg-white border border-stone-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                      <IoCheckmarkCircleOutline className="text-teal-600 text-xl" />
                      <span>ស្ថិតិការឆ្លើយតប RSVP & វត្តមានភ្ញៀវ</span>
                    </h3>
                    <Link
                      to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"}
                      className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <span>មើលបញ្ជីពេញលេញ</span>
                      <IoChevronForwardOutline />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 text-center">
                      <div className="text-3xl font-black text-teal-800">{stats.rsvpYes}</div>
                      <div className="text-xs font-bold text-teal-700 mt-1">✅ ចូលរួម (Yes)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-center">
                      <div className="text-3xl font-black text-rose-800">{stats.rsvpNo}</div>
                      <div className="text-xs font-bold text-rose-700 mt-1">❌ អវត្តមាន (No)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-center">
                      <div className="text-3xl font-black text-amber-800">{stats.rsvpPending}</div>
                      <div className="text-xs font-bold text-amber-700 mt-1">⏳ រង់ចាំ (Pending)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 text-center">
                      <div className="text-3xl font-black text-purple-800">{stats.checkedInCount}</div>
                      <div className="text-xs font-bold text-purple-700 mt-1">🎟️ បាន Check-in</div>
                    </div>
                  </div>
                </div>

                {/* Card: Wedding Readiness Checklist */}
                <div className="rounded-3xl p-7 bg-white border border-stone-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                      <IoCheckmarkCircle className="text-emerald-600 text-xl" />
                      <span>តារាងត្រួតពិនិត្យការរៀបចំ (Readiness Checklist)</span>
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {/* Step 1 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/60">
                      <div className="flex items-center gap-3.5">
                        <IoCheckmarkCircle className="text-2xl text-emerald-600 shrink-0" />
                        <div>
                          <h5 className="text-sm font-black text-stone-900">រៀបចំគំរូធៀបការ & ព័ត៌មាន</h5>
                          <p className="text-xs text-stone-500 mt-0.5">បានបំពេញឈ្មោះកូនកំលោះ-ក្រមុំ និងទីតាំងរួចរាល់</p>
                        </div>
                      </div>
                      {stats.id && (
                        <Link
                          to={`/dashboard/invitations/${stats.id}/edit`}
                          className="text-xs font-bold text-stone-700 hover:text-amber-700 shrink-0"
                        >
                          កែសម្រួល
                        </Link>
                      )}
                    </div>

                    {/* Step 2 */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      stats.guestTotal > 0
                        ? "bg-emerald-50/60 border-emerald-200/80"
                        : "bg-stone-50 border-stone-200/80"
                    }`}>
                      <div className="flex items-center gap-3.5">
                        {stats.guestTotal > 0 ? (
                          <IoCheckmarkCircle className="text-2xl text-emerald-600 shrink-0" />
                        ) : (
                          <IoPeopleOutline className="text-2xl text-amber-600 shrink-0" />
                        )}
                        <div>
                          <h5 className="text-sm font-black text-stone-900">
                            បញ្ចូលបញ្ជីភ្ញៀវកិត្តិយស ({stats.guestTotal} នាក់)
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">រៀបចំឈ្មោះភ្ញៀវ ចំនួនមនុស្ស និងលេខតុ</p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard/guests"
                        className="text-xs font-bold text-amber-700 hover:underline shrink-0"
                      >
                        គ្រប់គ្រងភ្ញៀវ
                      </Link>
                    </div>

                    {/* Step 3 */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      stats.rsvpYes > 0
                        ? "bg-emerald-50/60 border-emerald-200/80"
                        : "bg-stone-50 border-stone-200/80"
                    }`}>
                      <div className="flex items-center gap-3.5">
                        {stats.rsvpYes > 0 ? (
                          <IoCheckmarkCircle className="text-2xl text-emerald-600 shrink-0" />
                        ) : (
                          <IoCheckmarkCircleOutline className="text-2xl text-teal-600 shrink-0" />
                        )}
                        <div>
                          <h5 className="text-sm font-black text-stone-900">
                            តាមដានការឆ្លើយតប RSVP ({stats.rsvpRate}%)
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">ទទួលការបញ្ជាក់វត្តមានពីភ្ញៀវដើម្បីរៀបចំម្ហូប</p>
                        </div>
                      </div>
                      <Link
                        to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"}
                        className="text-xs font-bold text-teal-700 hover:underline shrink-0"
                      >
                        ពិនិត្យ RSVP
                      </Link>
                    </div>

                    {/* Step 4 */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      stats.totalBudget > 0
                        ? "bg-emerald-50/60 border-emerald-200/80"
                        : "bg-stone-50 border-stone-200/80"
                    }`}>
                      <div className="flex items-center gap-3.5">
                        {stats.totalBudget > 0 ? (
                          <IoCheckmarkCircle className="text-2xl text-emerald-600 shrink-0" />
                        ) : (
                          <IoWalletOutline className="text-2xl text-rose-600 shrink-0" />
                        )}
                        <div>
                          <h5 className="text-sm font-black text-stone-900">
                            គម្រោងថវិកា & តាមដានការចំណាយ (${stats.actualExpense.toLocaleString()})
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">កត់ត្រាចំណាយទីតាំង ម្ហូបការ សំលៀកបំពាក់ និងរូបថត</p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard/expenses"
                        className="text-xs font-bold text-rose-700 hover:underline shrink-0"
                      >
                        គម្រោងថវិកា
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                
                {/* Card: Quick Action 8-Tool Control Grid */}
                <div className="rounded-3xl p-6 bg-white border border-stone-200/90 shadow-xs">
                  <h3 className="text-base font-black text-stone-900 mb-5 flex items-center gap-2">
                    <IoSparkles className="text-amber-600 text-lg" />
                    <span>ផ្ទាំងគ្រប់គ្រងរហ័ស (Control Hub)</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3.5">
                    {/* 1. Guests */}
                    <Link
                      to="/dashboard/guests"
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl mb-2">
                        <IoPeopleOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">បញ្ជីភ្ញៀវ</span>
                    </Link>

                    {/* 2. RSVP */}
                    <Link
                      to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center text-2xl mb-2">
                        <IoCheckmarkCircleOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">RSVP</span>
                    </Link>

                    {/* 3. Check-In Scanner */}
                    <Link
                      to={stats.id ? `/dashboard/invitations/${stats.id}/check-in` : "/dashboard"}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl mb-2">
                        <IoQrCodeOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">ស្កេន Check-In</span>
                    </Link>

                    {/* 4. Seating */}
                    <Link
                      to="/dashboard/seating"
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-2xl mb-2">
                        <IoBarChartOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">រៀបចំតុ</span>
                    </Link>

                    {/* 5. Budget */}
                    <Link
                      to="/dashboard/expenses"
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-2xl mb-2">
                        <IoWalletOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">ថវិកា & ចំណាយ</span>
                    </Link>

                    {/* 6. Gifts */}
                    <Link
                      to="/dashboard/gifts"
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl mb-2">
                        <IoGiftOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">ចងដៃ & KHQR</span>
                    </Link>

                    {/* 7. Media */}
                    <Link
                      to={stats.id ? `/dashboard/invitations/${stats.id}/media` : "/dashboard"}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl mb-2">
                        <IoImagesOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">រូបថត & មេឌា</span>
                    </Link>

                    {/* 8. Delivery */}
                    <Link
                      to={stats.id ? `/dashboard/invitations/${stats.id}/delivery` : "/dashboard"}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center text-2xl mb-2">
                        <IoShareSocialOutline />
                      </div>
                      <span className="text-xs font-black text-stone-800">ផ្ញើ & ចែករំលែក</span>
                    </Link>
                  </div>
                </div>

                {/* Card: AI Assistant Quick Launcher */}
                {stats.id && (
                  <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-50/90 via-white to-teal-50/80 border border-amber-200/90 shadow-xs">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
                        <IoSparkles className="text-lg" />
                      </div>
                      <h4 className="font-black text-stone-900 text-sm">AI ជំនួយការមង្គលការ</h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      សួរ AI ជួយសរសេរពាក្យជូនពរ សេចក្តីថ្លែងអំណរគុណ ឬគម្រោងកម្មវិធីតាមប្រពៃណីខ្មែរ។
                    </p>
                    <Link
                      to={`/dashboard/invitations/${stats.id}/assistant`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 text-xs font-black shadow-xs transition hover:-translate-y-0.5"
                    >
                      <span>សួរ AI ជំនួយការឥឡូវនេះ</span>
                      <IoChevronForwardOutline />
                    </Link>
                  </div>
                )}

                {/* Card: Recent Notifications */}
                <div className="rounded-3xl p-6 bg-white border border-stone-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                      <IoNotificationsOutline className="text-amber-600 text-lg" />
                      <span>ការជូនដំណឹងថ្មីៗ</span>
                    </h3>
                    <Link
                      to="/dashboard/notifications"
                      className="text-xs font-bold text-amber-700 hover:underline"
                    >
                      មើលទាំងអស់
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {state.notifications.length > 0 ? (
                      state.notifications.slice(0, 4).map((n, i) => (
                        <div
                          key={n.id || i}
                          className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 text-xs"
                        >
                          <div className="font-bold text-stone-900">{n.title || "សកម្មភាពថ្មី"}</div>
                          <div className="text-stone-500 mt-1">{n.body || n.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-stone-200/60 bg-stone-50/40 p-6 text-center text-xs text-stone-400">
                        មិនទាន់មានការជូនដំណឹងថ្មីនៅឡើយ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
