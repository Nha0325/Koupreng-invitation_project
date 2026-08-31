import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  IoImagesOutline,
  IoLocationOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoQrCodeOutline,
  IoSparkles,
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
import { SkeletonTable } from "@/shared/ui";
import "./DashboardPage.css";

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
      const isNumericBackendId = Boolean(
        invId && (/^\d+$/.test(String(invId)) || typeof invId === "number")
      );

      if (invId) {
        setSelectedInvId(invId);
        const [guests, rsvps, rsvpSummary, budgetItems, gifts, notifs, checkIn] =
          isNumericBackendId
            ? await Promise.all([
                guestService.listByInvitation(invId).catch(() => []),
                rsvpService.listByInvitation(invId).catch(() => []),
                rsvpService.summary(invId).catch(() => null),
                budgetService.listItems(invId).catch(() => []),
                planningService.listGifts(invId).catch(() => []),
                notificationService.listByInvitation(invId).catch(() => []),
                guestService.checkInSummary(invId).catch(() => null),
              ])
            : [[], [], null, [], [], [], null];

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

  // Loading Skeleton matching host pages
  if (state.loading) {
    return (
      <main className="dash-main pe-guests-page pe-dashboard-page">
        <header className="dash-page-header">
          <div>
            <span className="dash-kicker">Digital Wedding Hub</span>
            <h1>ផ្ទាំងគ្រប់គ្រងមង្គលការ</h1>
            <p>កំពុងទាញយកទិន្នន័យ...</p>
          </div>
        </header>
        <SkeletonTable rows={4} columns={4} />
      </main>
    );
  }

  return (
    <main className="dash-main pe-guests-page pe-dashboard-page">
      {/* Page Header (Matching /dashboard/guests) */}
      <header className="dash-page-header">
        <div>
          <span className="dash-kicker">
            <IoSparkles /> Digital Wedding Hub
          </span>
          <h1>ផ្ទាំងគ្រប់គ្រងមង្គលការ</h1>
          <p>គ្រប់គ្រងសន្លឹកការ បញ្ជីភ្ញៀវ RSVP ថវិកា និងប្រាក់ចំណងដៃឌីជីថលរបស់អ្នក។</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <Link to="/templates/browse" className="dash-btn-outline">
            <span>ស្វែងរកគំរូធៀបការ</span>
          </Link>
          <Link to="/create/wedding" className="dash-btn-gold">
            <IoAddCircleOutline style={{ fontSize: "1.2rem" }} />
            <span>បង្កើតសន្លឹកការថ្មី</span>
          </Link>
        </div>
      </header>

      {/* =========================================================================
          CASE 1: HOST HAS NO INVITATIONS YET
         ========================================================================= */}
      {!stats.hasInvitation ? (
        <>
          {/* Clean Welcome Board */}
          <section className="dash-welcome-board">
            <div className="dash-welcome-badge">
              <IoSparkles />
              <span>ស្វាគមន៍មកកាន់ Koupreng Digital Wedding</span>
            </div>

            <h2 className="dash-welcome-title">
              ចាប់ផ្តើមរៀបចំ <span>មង្គលការឌីជីថល</span> របស់អ្នក
            </h2>

            <p className="dash-welcome-desc">
              បង្កើតសន្លឹកការអាពាហ៍ពិពាហ៍បែបឌីជីថលដំបូង ដើម្បីចែករំលែក Live Link តាម Telegram, Facebook និងគ្រប់គ្រងភ្ញៀវ RSVP ថវិកា និងចំណងដៃបានយ៉ាងងាយស្រួល។
            </p>

            <div className="dash-welcome-actions">
              <Link to="/create/wedding" className="dash-btn-gold">
                <IoAddCircle style={{ fontSize: "1.25rem" }} />
                <span>បង្កើតសន្លឹកការដំបូងរបស់អ្នក</span>
              </Link>
              <Link to="/templates/browse" className="dash-btn-outline">
                <span>មើលគំរូធៀបការ (Templates)</span>
                <IoChevronForwardOutline />
              </Link>
            </div>
          </section>

          {/* 4 Feature Cards matching Koupreng style */}
          <section className="dash-features-grid">
            <div className="dash-feature-card">
              <div className="dash-feature-icon" style={{ background: "rgba(185, 139, 66, 0.12)", color: "#b98b42" }}>
                <IoGlobeOutline />
              </div>
              <h4>សន្លឹកការ Online</h4>
              <p>Live Link ចែករំលែកតាម Telegram, FB និង Social Media យ៉ាងងាយស្រួល។</p>
            </div>

            <div className="dash-feature-card">
              <div className="dash-feature-icon" style={{ background: "rgba(15, 118, 110, 0.12)", color: "#0f766e" }}>
                <IoCheckmarkCircleOutline />
              </div>
              <h4>តាមដាន RSVP</h4>
              <p>ដឹងចំនួនភ្ញៀវចូលរួម និងកៅអីជាក់ស្តែងមុនថ្ងៃកម្មវិធី។</p>
            </div>

            <div className="dash-feature-card">
              <div className="dash-feature-icon" style={{ background: "rgba(124, 58, 237, 0.12)", color: "#7c3aed" }}>
                <IoQrCodeOutline />
              </div>
              <h4>ស្កេន QR Check-In</h4>
              <p>ស្កេនវត្តមានភ្ញៀវនៅមាត់ទ្វារកម្មវិធីរហ័សទាន់ចិត្ត។</p>
            </div>

            <div className="dash-feature-card">
              <div className="dash-feature-icon" style={{ background: "rgba(225, 29, 72, 0.12)", color: "#e11d48" }}>
                <IoWalletOutline />
              </div>
              <h4>ថវិកា & ចំណងដៃ</h4>
              <p>កត់ត្រាចំណាយ និងប្រាក់ចំណងដៃឌីជីថលច្បាស់លាស់។</p>
            </div>
          </section>
        </>
      ) : (
        /* =========================================================================
            CASE 2: HOST HAS INVITATIONS (FULL CONTROL DASHBOARD)
           ========================================================================= */
        <>
          {/* Multi-Event Selector Bar if multiple invitations */}
          {state.invitations.length > 1 && (
            <div className="dash-event-tabs">
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--brand-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
                កម្មវិធី:
              </span>
              {state.invitations.map((inv) => {
                const id = inv.id || inv.invitationId;
                const isSelected = id === selectedInvId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelectInvitation(id)}
                    className={`dash-event-tab ${isSelected ? "active" : ""}`}
                  >
                    <span>{inv.title || `${inv.groomName || "កូនកំលោះ"} & ${inv.brideName || "កូនក្រមុំ"}`}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 1. Grand Event Spotlight Card */}
          <section className="dash-event-card">
            <div className="dash-event-info">
              <div className="dash-event-badges">
                <span className={`dash-status-pill ${stats.status === "PUBLISHED" ? "live" : "draft"}`}>
                  {stats.status === "PUBLISHED" ? "● ផ្សាយផ្ទាល់ (Live)" : "○ ព្រាង (Draft)"}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-text-muted)" }}>
                  ID: #{String(stats.id).slice(-6)}
                </span>
              </div>

              <h2 className="dash-event-title">{stats.title}</h2>

              <div className="dash-event-meta">
                {stats.eventDate && (
                  <div className="dash-meta-item">
                    <IoCalendarClearOutline style={{ color: "var(--brand-primary)" }} />
                    <span>{stats.eventDate}</span>
                  </div>
                )}
                {stats.venue && (
                  <div className="dash-meta-item">
                    <IoLocationOutline style={{ color: "#0f766e" }} />
                    <span>{stats.venue}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="dash-event-aside">
              {timeRemaining.hasDate && (
                <div className="dash-countdown">
                  <div className="dash-count-box">
                    <div className="dash-count-val">{timeRemaining.days}</div>
                    <div className="dash-count-lbl">ថ្ងៃ</div>
                  </div>
                  <span style={{ color: "var(--brand-primary)", fontWeight: 900 }}>:</span>
                  <div className="dash-count-box">
                    <div className="dash-count-val">{String(timeRemaining.hours).padStart(2, "0")}</div>
                    <div className="dash-count-lbl">ម៉ោង</div>
                  </div>
                  <span style={{ color: "var(--brand-primary)", fontWeight: 900 }}>:</span>
                  <div className="dash-count-box">
                    <div className="dash-count-val">{String(timeRemaining.minutes).padStart(2, "0")}</div>
                    <div className="dash-count-lbl">នាទី</div>
                  </div>
                  <span style={{ color: "var(--brand-primary)", fontWeight: 900 }}>:</span>
                  <div className="dash-count-box">
                    <div className="dash-count-val">{String(timeRemaining.seconds).padStart(2, "0")}</div>
                    <div className="dash-count-lbl">វិនាទី</div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {stats.slug && (
                  <button type="button" onClick={() => handleCopyLink(stats.slug)} className="dash-btn-outline" style={{ minHeight: "36px", padding: "0 14px", fontSize: "0.8125rem" }}>
                    <IoCopyOutline style={{ color: "var(--brand-primary)" }} />
                    <span>{copied ? "បានចម្លង!" : "ចម្លង Link"}</span>
                  </button>
                )}

                {stats.slug && (
                  <Link to={`/w/${stats.slug}`} target="_blank" rel="noreferrer" className="dash-btn-outline" style={{ minHeight: "36px", padding: "0 14px", fontSize: "0.8125rem" }}>
                    <IoGlobeOutline style={{ color: "#0f766e" }} />
                    <span>មើល Live</span>
                  </Link>
                )}

                {stats.id && (
                  <Link to={`/dashboard/invitations/${stats.id}/edit`} className="dash-btn-outline" style={{ minHeight: "36px", padding: "0 14px", fontSize: "0.8125rem" }}>
                    <IoCreateOutline style={{ color: "var(--brand-primary)" }} />
                    <span>កែសម្រួល</span>
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* 2. 4 Core KPI Stat Cards matching pe-summary-grid of GuestsPage */}
          <section className="pe-summary-grid">
            <Link to="/dashboard/guests" className="pe-summary-card" style={{ textDecoration: "none", cursor: "pointer", transition: "all 0.2s ease" }}>
              <div>
                <span>ភ្ញៀវកិត្តិយស</span>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>
                  ក្នុងបញ្ជី {stats.guestTotal} នាក់
                </p>
              </div>
              <strong>{stats.guestTotal}</strong>
            </Link>

            <Link to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"} className="pe-summary-card" style={{ textDecoration: "none", cursor: "pointer", transition: "all 0.2s ease" }}>
              <div>
                <span>ការឆ្លើយតប RSVP</span>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#0f766e" }}>
                  ចូលរួម {stats.rsvpYes} | អវត្តមាន {stats.rsvpNo}
                </p>
              </div>
              <strong style={{ color: "#0f766e" }}>{stats.rsvpRate}%</strong>
            </Link>

            <Link to="/dashboard/expenses" className="pe-summary-card" style={{ textDecoration: "none", cursor: "pointer", transition: "all 0.2s ease" }}>
              <div>
                <span>ថវិកា & ចំណាយ</span>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>
                  គម្រោង ${stats.totalBudget.toLocaleString()}
                </p>
              </div>
              <strong style={{ color: "#e11d48" }}>${stats.actualExpense.toLocaleString()}</strong>
            </Link>

            <Link to="/dashboard/gifts" className="pe-summary-card" style={{ textDecoration: "none", cursor: "pointer", transition: "all 0.2s ease" }}>
              <div>
                <span>ចំណងដៃឌីជីថល</span>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>
                  កត់ត្រា {stats.giftCount} ចំណងដៃ
                </p>
              </div>
              <strong style={{ color: "#7c3aed" }}>${stats.totalGifts.toLocaleString()}</strong>
            </Link>
          </section>

          {/* 3. Main 2-Column Grid */}
          <section className="dash-main-grid">
            {/* Left Column (Stats & Readiness) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* RSVP Breakdown */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>
                    <IoCheckmarkCircleOutline style={{ color: "#0f766e", fontSize: "1.25rem" }} />
                    <span>ស្ថិតិការឆ្លើយតប RSVP & វត្តមាន</span>
                  </h3>
                  <Link to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"} className="dash-card-link">
                    <span>មើលបញ្ជី</span>
                    <IoChevronForwardOutline />
                  </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "12px" }}>
                  <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(15, 118, 110, 0.08)", border: "1px solid rgba(15, 118, 110, 0.18)", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f766e" }}>{stats.rsvpYes}</div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f766e", marginTop: "4px" }}>✓ ចូលរួម (Yes)</div>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(225, 29, 72, 0.08)", border: "1px solid rgba(225, 29, 72, 0.18)", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#e11d48" }}>{stats.rsvpNo}</div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e11d48", marginTop: "4px" }}>✗ អវត្តមាន (No)</div>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(185, 139, 66, 0.08)", border: "1px solid rgba(185, 139, 66, 0.18)", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#b98b42" }}>{stats.rsvpPending}</div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#b98b42", marginTop: "4px" }}>⏳ រង់ចាំ (Pending)</div>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.18)", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#7c3aed" }}>{stats.checkedInCount}</div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7c3aed", marginTop: "4px" }}>🎟️ បាន Check-in</div>
                  </div>
                </div>
              </div>

              {/* Readiness Checklist */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>
                    <IoCheckmarkCircle style={{ color: "#0f766e", fontSize: "1.25rem" }} />
                    <span>តារាងត្រួតពិនិត្យការរៀបចំ (Checklist)</span>
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Step 1 */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(15, 118, 110, 0.2)", background: "rgba(15, 118, 110, 0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <IoCheckmarkCircle style={{ fontSize: "1.4rem", color: "#0f766e", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--brand-text)" }}>រៀបចំព័ត៌មានធៀបការ</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>ឈ្មោះកូនកំលោះ-ក្រមុំ ទីតាំង និងកាលបរិច្ឆេទ</div>
                      </div>
                    </div>
                    {stats.id && (
                      <Link to={`/dashboard/invitations/${stats.id}/edit`} style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-primary)", textDecoration: "none" }}>
                        កែសម្រួល
                      </Link>
                    )}
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "12px", border: stats.guestTotal > 0 ? "1px solid rgba(15, 118, 110, 0.2)" : "1px solid var(--brand-border)", background: stats.guestTotal > 0 ? "rgba(15, 118, 110, 0.04)" : "#fdfbf7" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {stats.guestTotal > 0 ? (
                        <IoCheckmarkCircle style={{ fontSize: "1.4rem", color: "#0f766e", flexShrink: 0 }} />
                      ) : (
                        <IoPeopleOutline style={{ fontSize: "1.4rem", color: "var(--brand-primary)", flexShrink: 0 }} />
                      )}
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--brand-text)" }}>បញ្ចូលបញ្ជីភ្ញៀវ ({stats.guestTotal} នាក់)</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>រៀបចំឈ្មោះ ចំនួនមនុស្ស និងលេខតុ</div>
                      </div>
                    </div>
                    <Link to="/dashboard/guests" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-primary)", textDecoration: "none" }}>
                      គ្រប់គ្រងភ្ញៀវ
                    </Link>
                  </div>

                  {/* Step 3 */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "12px", border: stats.rsvpYes > 0 ? "1px solid rgba(15, 118, 110, 0.2)" : "1px solid var(--brand-border)", background: stats.rsvpYes > 0 ? "rgba(15, 118, 110, 0.04)" : "#fdfbf7" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {stats.rsvpYes > 0 ? (
                        <IoCheckmarkCircle style={{ fontSize: "1.4rem", color: "#0f766e", flexShrink: 0 }} />
                      ) : (
                        <IoCheckmarkCircleOutline style={{ fontSize: "1.4rem", color: "#0f766e", flexShrink: 0 }} />
                      )}
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--brand-text)" }}>តាមដាន RSVP ({stats.rsvpRate}%)</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>ការឆ្លើយតបបញ្ជាក់វត្តមានពីភ្ញៀវ</div>
                      </div>
                    </div>
                    <Link to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
                      ពិនិត្យ RSVP
                    </Link>
                  </div>

                  {/* Step 4 */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "12px", border: stats.totalBudget > 0 ? "1px solid rgba(15, 118, 110, 0.2)" : "1px solid var(--brand-border)", background: stats.totalBudget > 0 ? "rgba(15, 118, 110, 0.04)" : "#fdfbf7" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {stats.totalBudget > 0 ? (
                        <IoCheckmarkCircle style={{ fontSize: "1.4rem", color: "#0f766e", flexShrink: 0 }} />
                      ) : (
                        <IoWalletOutline style={{ fontSize: "1.4rem", color: "#e11d48", flexShrink: 0 }} />
                      )}
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--brand-text)" }}>ថវិកា & ចំណាយ (${stats.actualExpense.toLocaleString()})</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>កត់ត្រាចំណាយទីតាំង ម្ហូប និងសម្លៀកបំពាក់</div>
                      </div>
                    </div>
                    <Link to="/dashboard/expenses" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e11d48", textDecoration: "none" }}>
                      គម្រោងថវិកា
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Control Hub & Notifications) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Quick Actions 8-Grid */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>
                    <IoSparkles style={{ color: "var(--brand-primary)", fontSize: "1.2rem" }} />
                    <span>ផ្ទាំងគ្រប់គ្រងរហ័ស</span>
                  </h3>
                </div>

                <div className="dash-quick-grid">
                  <Link to="/dashboard/guests" className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(185, 139, 66, 0.12)", color: "#b98b42" }}>
                      <IoPeopleOutline />
                    </div>
                    <span>បញ្ជីភ្ញៀវ</span>
                  </Link>

                  <Link to={stats.id ? `/dashboard/invitations/${stats.id}/rsvp` : "/dashboard/guests"} className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(15, 118, 110, 0.12)", color: "#0f766e" }}>
                      <IoCheckmarkCircleOutline />
                    </div>
                    <span>RSVP</span>
                  </Link>

                  <Link to={stats.id ? `/dashboard/invitations/${stats.id}/check-in` : "/dashboard"} className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(124, 58, 237, 0.12)", color: "#7c3aed" }}>
                      <IoQrCodeOutline />
                    </div>
                    <span>Check-In</span>
                  </Link>

                  <Link to="/dashboard/seating" className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(79, 70, 229, 0.12)", color: "#4f46e5" }}>
                      <IoBarChartOutline />
                    </div>
                    <span>រៀបចំតុ</span>
                  </Link>

                  <Link to="/dashboard/expenses" className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(225, 29, 72, 0.12)", color: "#e11d48" }}>
                      <IoWalletOutline />
                    </div>
                    <span>ថវិកា</span>
                  </Link>

                  <Link to="/dashboard/gifts" className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(124, 58, 237, 0.12)", color: "#7c3aed" }}>
                      <IoGiftOutline />
                    </div>
                    <span>ចំណងដៃ</span>
                  </Link>

                  <Link to={stats.id ? `/dashboard/invitations/${stats.id}/media` : "/dashboard"} className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(185, 139, 66, 0.12)", color: "#b98b42" }}>
                      <IoImagesOutline />
                    </div>
                    <span>មេឌា</span>
                  </Link>

                  <Link to={stats.id ? `/dashboard/invitations/${stats.id}/delivery` : "/dashboard"} className="dash-quick-btn">
                    <div className="quick-icon" style={{ background: "rgba(15, 118, 110, 0.12)", color: "#0f766e" }}>
                      <IoShareSocialOutline />
                    </div>
                    <span>ចែករំលែក</span>
                  </Link>
                </div>
              </div>

              {/* AI Assistant launcher */}
              {stats.id && (
                <div className="dash-card" style={{ background: "linear-gradient(135deg, #fdfbf7 0%, #ffffff 100%)", border: "1px solid var(--brand-border-warm)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--brand-primary)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IoSparkles />
                    </div>
                    <h4 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 800, color: "var(--brand-text)" }}>AI ជំនួយការមង្គលការ</h4>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--brand-text-muted)", lineHeight: 1.6, margin: "0 0 16px" }}>
                    សួរ AI ជួយសរសេរពាក្យជូនពរ សេចក្តីថ្លែងអំណរគុណ ឬគម្រោងកម្មវិធីមង្គលការ។
                  </p>
                  <Link to={`/dashboard/invitations/${stats.id}/assistant`} className="dash-btn-gold" style={{ width: "100%", textDecoration: "none" }}>
                    <span>សួរ AI ជំនួយការឥឡូវនេះ</span>
                    <IoChevronForwardOutline />
                  </Link>
                </div>
              )}

              {/* Recent Notifications */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>
                    <IoNotificationsOutline style={{ color: "var(--brand-primary)", fontSize: "1.2rem" }} />
                    <span>ការជូនដំណឹង</span>
                  </h3>
                  <Link to="/dashboard/notifications" className="dash-card-link">
                    <span>មើលទាំងអស់</span>
                  </Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {state.notifications.length > 0 ? (
                    state.notifications.slice(0, 4).map((n, i) => (
                      <div key={n.id || i} style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--brand-border)", background: "#f8fafc" }}>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--brand-text)" }}>{n.title || "សកម្មភាពថ្មី"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--brand-text-muted)", marginTop: "2px" }}>{n.body || n.message}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "24px 16px", textAlign: "center", border: "1px dashed var(--brand-border)", borderRadius: "12px" }}>
                      <IoNotificationsOutline style={{ fontSize: "1.5rem", color: "var(--brand-text-muted)", marginBottom: "4px" }} />
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>មិនទាន់មានការជូនដំណឹងថ្មីទេ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
