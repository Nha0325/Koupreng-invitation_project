import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoAddCircleOutline,
  IoAlbumsOutline,
  IoBarChartOutline,
  IoCalendarClearOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoChevronForwardOutline,
  IoCreateOutline,
  IoGiftOutline,
  IoGlobeOutline,
  IoHeartOutline,
  IoLocationOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoRefreshOutline,
  IoSparklesOutline,
  IoTicketOutline,
  IoTimeOutline,
  IoWalletOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  getActiveEventId,
  listBudgetExpenses,
  listManualGuests,
  listWeddingGifts,
  setActiveEventId,
} from "../../../services/hostPlanningStorage";
import { listRsvps } from "../../../services/rsvpService";
import { listDrafts } from "../../../services/weddingStorage";
import { budgetService } from "../../../features/budget/budgetService";
import notificationService from "../../../features/notifications/notificationService";
import seatingService from "../../../features/seating/seatingService";
import { planningService } from "../../../shared/services/planningService";
import { guestService } from "../../../shared/services/guestService";
import { invitationService } from "../../../shared/services/invitationService";
import { rsvpService } from "../../../shared/services/rsvpService";
import { useBackendMessages } from "../../../shared/i18n/useBackendMessages";
import "./Dashboard.css";

const FALLBACK_TEXT = {
  title: "ផ្ទាំងគ្រប់គ្រងកម្មវិធី",
  subtitle: "A polished planning workspace for guests, RSVP, budget, gifts, and event readiness.",
  emptyTitle: "មិនទាន់មានការអញ្ជើញ",
  emptyText: "Create your first wedding invitation to start managing guests, RSVP, budget, gifts, and event progress.",
  createInvitation: "Create invitation",
};

const pageMotion = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const riseMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const cardMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const panelClass = "rounded-[1.25rem] border border-stone-200/70 bg-white/90 p-5 shadow-[0_14px_45px_rgba(92,64,32,0.07)] ring-1 ring-white/80 backdrop-blur-xl";
const eyebrowClass = "inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.08em] text-teal-700";
const panelHeadClass = "mb-5 flex items-start justify-between gap-4";
const linkClass = "inline-flex items-center gap-1 text-sm font-black text-teal-700 transition hover:text-teal-900";
const buttonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-black text-stone-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-md";
const primaryButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-teal-700 bg-teal-700 px-4 py-2 text-sm font-black text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md";

function asList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.notifications)) return value.notifications;
  if (Array.isArray(value?.guests)) return value.guests;
  if (Array.isArray(value?.rsvps)) return value.rsvps;
  if (Array.isArray(value?.gifts)) return value.gifts;
  return [];
}

function firstNumber(...values) {
  const value = values.find((item) => item !== undefined && item !== null && item !== "");
  return Number(value) || 0;
}

function field(source, ...names) {
  return names.map((name) => source?.[name]).find((value) => value !== undefined && value !== null && value !== "");
}

function normalizeStatus(value) {
  return String(value || "").trim().toUpperCase();
}

function invitationId(invitation) {
  return field(invitation, "id", "invitationId");
}

function isPublished(invitation) {
  const status = normalizeStatus(field(invitation, "status"));
  return status === "PUBLISHED" || Boolean(field(invitation, "publishedAt", "published_at") && field(invitation, "slug", "publicSlug"));
}

function selectInvitation(invitations) {
  return invitations.find(isPublished) || invitations.find((item) => invitationId(item)) || null;
}

function invitationTitle(invitation, draft) {
  if (field(invitation, "title", "eventTitle")) return field(invitation, "title", "eventTitle");
  const groom = field(invitation, "groomName", "groom_name") || invitation?.event?.groomName || draft?.event?.groomName;
  const bride = field(invitation, "brideName", "bride_name") || invitation?.event?.brideName || draft?.event?.brideName;
  if (groom && bride) return `${groom} & ${bride}`;
  return draft?.title || "Koupreng Wedding";
}

function coupleNames(invitation, draft) {
  const groom = field(invitation, "groomName", "groom_name") || invitation?.event?.groomName || draft?.event?.groomName;
  const bride = field(invitation, "brideName", "bride_name") || invitation?.event?.brideName || draft?.event?.brideName;
  if (groom && bride) return `${groom} & ${bride}`;
  return field(invitation, "coupleName", "couple_name") || "";
}

function eventDate(invitation, draft) {
  return field(invitation, "eventDate", "event_date", "date", "weddingDate", "wedding_date") || invitation?.event?.date || draft?.event?.date || "";
}

function eventTime(invitation, draft) {
  return field(invitation, "eventTime", "event_time") || invitation?.event?.time || draft?.event?.time || "";
}

function venueName(invitation, draft) {
  return field(invitation, "venueName", "venue_name", "venue") || invitation?.event?.venueName || draft?.event?.venueName || "";
}

function venueAddress(invitation, draft) {
  return field(invitation, "venueAddress", "venue_address") || invitation?.event?.venueAddress || draft?.event?.venueAddress || "";
}

function publicUrl(invitation, draft) {
  const slug = field(invitation, "slug", "publicSlug") || draft?.slug;
  return slug ? `/w/${encodeURIComponent(slug)}` : "";
}

function normalizeGuest(guest) {
  return {
    id: field(guest, "id", "guestId", "phone", "email", "name", "guestName"),
    name: field(guest, "guestName", "name", "fullName") || "Guest",
    group: field(guest, "group", "guestGroup", "category", "tableNumber") || "",
    status: normalizeStatus(field(guest, "rsvpStatus", "status", "responseStatus", "sendStatus")),
    contributionStatus: field(guest, "contributionStatus") || "",
    totalContributed: firstNumber(guest.totalContributed),
    count: Math.max(1, firstNumber(guest.count, guest.attendeeCount, guest.guestCount, 1)),
    checkedIn: Boolean(guest.checkedIn || guest.checkInAt || guest.checkedInAt),
    createdAt: field(guest, "createdAt", "created_at", "updatedAt", "respondedAt") || "",
  };
}

function normalizeRsvp(rsvp) {
  const status = normalizeStatus(field(rsvp, "status", "responseStatus", "attendingStatus"));
  let mapped = status;
  if (!mapped && rsvp.attending === true) mapped = "ACCEPTED";
  if (!mapped && rsvp.attending === false) mapped = "DECLINED";
  return {
    id: field(rsvp, "id", "rsvpId", "guestId", "guestName", "name"),
    name: field(rsvp, "guestName", "name", "fullName") || "RSVP",
    status: mapped || "PENDING",
    count: Math.max(1, firstNumber(rsvp.attendeeCount, rsvp.count, rsvp.guestCount, 1)),
    createdAt: field(rsvp, "respondedAt", "createdAt", "created_at", "submittedAt") || "",
  };
}

function normalizeBudgetItem(item) {
  return {
    id: field(item, "id", "itemId", "name", "itemName"),
    name: field(item, "name", "itemName") || "Budget item",
    category: field(item, "category") || "Other",
    budget: firstNumber(item.budget, item.estimatedCost),
    amount: firstNumber(item.amount, item.actualCost),
    status: field(item, "status") || "",
    vendorName: field(item, "vendorName", "vendor_name") || "",
    createdAt: field(item, "date", "expenseDate", "createdAt", "created_at", "updatedAt") || "",
  };
}

function normalizeGift(gift) {
  return {
    id: field(gift, "id", "giftId", "payerName", "guestName", "name"),
    name: field(gift, "payerName", "guestName", "name") || "Gift",
    amount: firstNumber(gift.amount, gift.value),
    currency: field(gift, "currency") || "USD",
    status: field(gift, "status") || "",
    createdAt: field(gift, "paidAt", "createdAt", "created_at", "date", "updatedAt") || "",
  };
}

function normalizeNotification(notification) {
  return {
    id: field(notification, "id", "notificationId", "createdAt", "title"),
    title: field(notification, "title", "message", "type") || "Activity",
    body: field(notification, "body", "message") || "",
    createdAt: field(notification, "createdAt", "created_at", "sentAt", "updatedAt") || "",
  };
}

function localRsvpsForDraft(draft) {
  if (!draft) return [];
  const map = new Map();
  listRsvps(draft.id || "").forEach((item) => map.set(item.id, item));
  if (draft.slug) {
    listRsvps(draft.slug).forEach((item) => map.set(item.id, item));
  }
  return Array.from(map.values()).map(normalizeRsvp);
}

function dateLabel(value, lang, fallback = "Not completed") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(lang === "km" ? "km-KH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function relativeTime(value) {
  if (!value) return "Recently";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Recently";
  const diff = Date.now() - time;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function daysUntil(value) {
  if (!value) return null;
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function pct(part, total) {
  return total ? Math.min(100, Math.max(0, Math.round((part / total) * 100))) : 0;
}

function money(value, currency = "USD") {
  const amount = Math.round(Number(value) || 0).toLocaleString();
  return currency === "KHR" ? `${amount}៛` : `$${amount}`;
}

async function safeLoad(loader, fallback) {
  try {
    return await loader();
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const { lang, text } = useBackendMessages("dashboard");
  const label = (key, fallback, replacements) => {
    const translated = text(key, replacements);
    return translated === key ? fallback : translated;
  };

  const [state, setState] = useState({
    loading: true,
    error: "",
    source: "backend",
    selectedInvitation: null,
    draft: null,
    invitations: [],
    guests: [],
    rsvps: [],
    rsvpSummary: null,
    budgetItems: [],
    gifts: [],
    notifications: [],
    checkInSummary: null,
    seatingPlan: null,
  });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setState((current) => ({ ...current, loading: true, error: "" }));
      const drafts = listDrafts();
      const activeEventId = getActiveEventId();
      const currentDraft = drafts.find((draft) => draft.id === activeEventId) || drafts[0] || null;

      try {
        const invitations = asList(await invitationService.listMine());
        const selectedInvitation = selectInvitation(invitations);
        const selectedId = invitationId(selectedInvitation);

        if (selectedId) {
          const [guests, rsvps, rsvpSummary, budgetItems, gifts, notifications, checkInSummary, seatingPlan] =
            await Promise.all([
              safeLoad(() => guestService.listByInvitation(selectedId), []),
              safeLoad(() => rsvpService.listByInvitation(selectedId), []),
              safeLoad(() => rsvpService.summary(selectedId), null),
              safeLoad(() => budgetService.listItems(selectedId), []),
              safeLoad(() => planningService.listGifts(selectedId), []),
              safeLoad(() => notificationService.listByInvitation(selectedId), []),
              safeLoad(() => guestService.checkInSummary(selectedId), null),
              safeLoad(() => seatingService.plan(selectedId), null),
            ]);

          if (!active) return;
          setState({
            loading: false,
            error: "",
            source: "backend",
            selectedInvitation,
            draft: currentDraft,
            invitations,
            guests: asList(guests).map(normalizeGuest),
            rsvps: asList(rsvps).map(normalizeRsvp),
            rsvpSummary,
            budgetItems: asList(budgetItems).map(normalizeBudgetItem),
            gifts: asList(gifts).map(normalizeGift),
            notifications: asList(notifications).map(normalizeNotification),
            checkInSummary,
            seatingPlan,
          });
          return;
        }

        if (currentDraft?.id) {
          setActiveEventId(currentDraft.id);
        }

        if (!active) return;
        setState({
          loading: false,
          error: "",
          source: "local",
          selectedInvitation: null,
          draft: currentDraft,
          invitations,
          guests: listManualGuests(currentDraft?.id).map(normalizeGuest),
          rsvps: localRsvpsForDraft(currentDraft),
          rsvpSummary: null,
          budgetItems: listBudgetExpenses([], currentDraft?.id).map(normalizeBudgetItem),
          gifts: listWeddingGifts([], currentDraft?.id).map(normalizeGift),
          notifications: [],
          checkInSummary: null,
          seatingPlan: null,
        });
      } catch (error) {
        if (!active) return;
        setState({
          loading: false,
          error: error?.message || "Could not load dashboard data.",
          source: "backend",
          selectedInvitation: null,
          draft: null,
          invitations: [],
          guests: [],
          rsvps: [],
          rsvpSummary: null,
          budgetItems: [],
          gifts: [],
          notifications: [],
          checkInSummary: null,
          seatingPlan: null,
        });
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const data = useMemo(() => {
    const { selectedInvitation, draft, guests, rsvps, rsvpSummary, budgetItems, gifts, notifications, checkInSummary, seatingPlan } = state;
    const selectedId = invitationId(selectedInvitation);
    const eventDay = eventDate(selectedInvitation, draft);
    const daysRemaining = daysUntil(eventDay);
    const published = selectedInvitation ? isPublished(selectedInvitation) : Boolean(draft?.publishedAt && draft?.slug);
    const guestTotal = guests.reduce((sum, guest) => sum + guest.count, 0);
    const rsvpTotal = rsvps.reduce((sum, item) => sum + item.count, 0);
    const expectedGuests = Math.max(guestTotal, rsvpTotal);
    const summaryExpected = firstNumber(rsvpSummary?.totalGuests, rsvpSummary?.guestTotal, rsvpSummary?.expectedGuests, rsvpSummary?.total);
    const summaryAccepted = firstNumber(rsvpSummary?.accepted, rsvpSummary?.acceptedCount, rsvpSummary?.yes, rsvpSummary?.attending);
    const summaryDeclined = firstNumber(rsvpSummary?.declined, rsvpSummary?.declinedCount, rsvpSummary?.no, rsvpSummary?.notAttending);
    const summaryMaybe = firstNumber(rsvpSummary?.maybe, rsvpSummary?.maybeCount, rsvpSummary?.tentative);
    const accepted = summaryAccepted || rsvps.filter((item) => ["ACCEPTED", "YES", "ATTENDING", "CONFIRMED"].includes(item.status)).reduce((sum, item) => sum + item.count, 0);
    const declined = summaryDeclined || rsvps.filter((item) => ["DECLINED", "NO", "REJECTED"].includes(item.status)).reduce((sum, item) => sum + item.count, 0);
    const maybe = summaryMaybe || rsvps.filter((item) => ["MAYBE", "TENTATIVE"].includes(item.status)).reduce((sum, item) => sum + item.count, 0);
    const expected = Math.max(expectedGuests, summaryExpected);
    const responded = firstNumber(rsvpSummary?.responded, rsvpSummary?.respondedCount, rsvpSummary?.responseCount) || accepted + declined + maybe || rsvpTotal;
    const pending = firstNumber(rsvpSummary?.pending, rsvpSummary?.pendingCount) || Math.max(expected - responded, 0);
    const rsvpRate = firstNumber(rsvpSummary?.responseRate, rsvpSummary?.completionRate, rsvpSummary?.rsvpRate) || pct(responded, expected);
    const totalBudget = budgetItems.reduce((sum, item) => sum + item.budget, 0);
    const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const budgetRate = pct(totalSpent, totalBudget);
    const giftTotal = gifts.reduce((sum, item) => sum + item.amount, 0);
    const checkInCount = firstNumber(checkInSummary?.checkedIn, checkInSummary?.checkedInCount, checkInSummary?.totalCheckedIn)
      || guests.filter((guest) => guest.checkedIn).length;
    const hasPaymentSetup = gifts.length > 0 || Boolean(draft?.gift?.length || selectedInvitation?.giftEnabled || selectedInvitation?.giftInfo);
    const venueComplete = Boolean(venueName(selectedInvitation, draft));
    const dateComplete = Boolean(eventDay);
    const rsvpEnabled = Boolean(selectedInvitation?.rsvpEnabled ?? selectedInvitation?.rsvp?.enabled ?? draft?.rsvp?.enabled ?? rsvps.length);
    const seatingReady = Boolean(asList(seatingPlan?.tables).length || asList(seatingPlan).length);
    const healthScore = Math.min(100, Math.round([
      published ? 18 : 0,
      dateComplete ? 12 : 0,
      venueComplete ? 12 : 0,
      guestTotal > 0 ? 16 : 0,
      Math.min(18, Math.round(rsvpRate * 0.18)),
      budgetItems.length ? Math.max(8, Math.min(14, 14 - Math.max(0, budgetRate - 100) * 0.08)) : 0,
      hasPaymentSetup ? 10 : 0,
    ].reduce((sum, item) => sum + item, 0)));
    const healthLabel = healthScore >= 82 ? "Excellent" : healthScore >= 58 ? "Good progress" : "Needs attention";
    const recommendation = healthScore >= 82
      ? "Your event is well prepared. Keep monitoring RSVP and guest arrivals."
      : healthScore >= 58
        ? "Focus on the missing checklist items to make the event ready."
        : "Publish the invitation, complete event details, and start collecting guest responses.";

    const recentActivity = [
      ...notifications.map((item) => ({ id: `notification-${item.id}`, type: "Notification", title: item.title, detail: item.body, time: item.createdAt, Icon: IoNotificationsOutline })),
      ...guests.slice(0, 6).map((item) => ({ id: `guest-${item.id}`, type: "Guest", title: `${item.name} added`, detail: item.group || "Guest list updated", time: item.createdAt, Icon: IoPeopleOutline })),
      ...rsvps.slice(0, 6).map((item) => ({ id: `rsvp-${item.id}`, type: "RSVP", title: `${item.name} responded`, detail: item.status, time: item.createdAt, Icon: IoCheckmarkCircleOutline })),
      ...gifts.slice(0, 6).map((item) => ({ id: `gift-${item.id}`, type: "Gift", title: `${item.name} gift recorded`, detail: money(item.amount, item.currency), time: item.createdAt, Icon: IoGiftOutline })),
      ...budgetItems.slice(0, 6).map((item) => ({ id: `budget-${item.id}`, type: "Budget", title: item.name, detail: `${item.category} · ${money(item.amount)} spent`, time: item.createdAt, Icon: IoCashOutline })),
    ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 8);

    const giftBars = gifts.slice(0, 8);
    const maxGift = Math.max(1, ...giftBars.map((item) => item.amount));

    return {
      selectedId,
      eventDay,
      eventTime: eventTime(selectedInvitation, draft),
      daysRemaining,
      published,
      title: invitationTitle(selectedInvitation, draft),
      couple: coupleNames(selectedInvitation, draft),
      venue: venueName(selectedInvitation, draft),
      venueAddress: venueAddress(selectedInvitation, draft),
      publicLink: publicUrl(selectedInvitation, draft),
      status: field(selectedInvitation, "status") || (published ? "PUBLISHED" : "DRAFT"),
      guestTotal,
      expectedGuests: expected,
      rsvp: { accepted, declined, maybe, pending, responded, rate: rsvpRate },
      budget: { total: totalBudget, spent: totalSpent, remaining: totalBudget - totalSpent, rate: budgetRate },
      giftTotal,
      checkInCount,
      healthScore,
      healthLabel,
      recommendation,
      hasPaymentSetup,
      venueComplete,
      dateComplete,
      rsvpEnabled,
      seatingReady,
      recentActivity,
      giftBars,
      maxGift,
    };
  }, [state]);

  if (state.loading) {
    return (
      <main className="dash-main min-h-screen bg-[#fbf6ee] px-4 pb-10 text-stone-900 sm:px-6 lg:px-10">
        <SkeletonDashboard />
      </main>
    );
  }

  if (!state.selectedInvitation && !state.draft) {
    return (
      <main className="dash-main min-h-screen bg-[#fbf6ee] px-4 pb-10 text-stone-900 sm:px-6 lg:px-10">
        <ErrorBanner error={state.error} />
        <EmptyDashboard label={label} />
      </main>
    );
  }

  return (
    <motion.main
      className="dash-main min-h-screen bg-[#fbf6ee] px-4 pb-10 text-stone-900 sm:px-6 lg:px-10"
      initial="hidden"
      animate="visible"
      variants={pageMotion}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <ErrorBanner error={state.error} fallback={state.source === "local"} />
        <HeroPanel data={data} source={state.source} lang={lang} />
        <KpiGrid data={data} giftCount={state.gifts.length} lang={lang} />

        <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <ReadinessPanel data={data} />
          <AnalyticsPanel data={data} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <BudgetPanel budget={data.budget} items={state.budgetItems} />
          <GiftPanel gifts={data.giftBars} max={data.maxGift} total={data.giftTotal} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <ActivityPanel items={data.recentActivity} />
          <div className="grid gap-6">
            <EventDetailsPanel data={data} lang={lang} />
            <QuickActions data={data} source={state.source} />
          </div>
        </section>
      </div>
    </motion.main>
  );
}

function ErrorBanner({ error, fallback }) {
  if (!error) return null;
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm font-bold text-red-800 shadow-sm sm:flex-row sm:items-center">
      <IoWarningOutline className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{error}</span>
      <small className="text-red-600 sm:ml-auto">{fallback ? "Showing local fallback data." : "Dashboard data could not be loaded from the backend."}</small>
    </div>
  );
}

function EmptyDashboard({ label }) {
  return (
    <motion.section className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-amber-100 bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(92,64,32,0.12)] backdrop-blur-xl" variants={riseMotion}>
      <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-[1.5rem] bg-gradient-to-br from-amber-100 via-white to-teal-100 text-4xl text-teal-700 ring-1 ring-amber-100">
        <IoSparklesOutline aria-hidden="true" />
      </div>
      <span className={eyebrowClass}>{label("title", FALLBACK_TEXT.title)}</span>
      <h1 className="mt-3 text-3xl font-black leading-tight text-stone-900 sm:text-5xl">{label("emptyTitle", FALLBACK_TEXT.emptyTitle)}</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">{label("emptyText", FALLBACK_TEXT.emptyText)}</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/create/wedding" className={primaryButtonClass}>
          <IoSparklesOutline aria-hidden="true" />
          {label("createInvitation", FALLBACK_TEXT.createInvitation)}
        </Link>
        <Link to="/templates/browse" className={buttonClass}>
          <IoAlbumsOutline aria-hidden="true" />
          Browse templates
        </Link>
      </div>
    </motion.section>
  );
}

function HeroPanel({ data, source, lang }) {
  const editLink = data.selectedId ? `/dashboard/invitations/${data.selectedId}/edit` : data.selectedId === null ? "/create/wedding" : "/create/wedding";
  const guestLink = "/guests";

  return (
    <motion.section className="relative overflow-hidden rounded-[1.75rem] border border-amber-100/80 bg-[linear-gradient(135deg,#fffaf0_0%,#ffffff_52%,#ecfdf8_100%)] p-5 shadow-[0_18px_60px_rgba(92,64,32,0.10)] ring-1 ring-white/80 backdrop-blur-xl md:p-6" variants={riseMotion}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-teal-600 to-amber-200" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <span className={eyebrowClass}><IoSparklesOutline aria-hidden="true" /> Good day, host</span>
          <h1 className="mt-3 max-w-4xl break-words text-[clamp(2rem,3.6vw,3.4rem)] font-black leading-[1.04] tracking-normal text-stone-950">{data.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-[15px]">
            {data.couple || FALLBACK_TEXT.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-black ${data.published ? "border-teal-200 bg-teal-50 text-teal-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              {data.published ? "Published" : "Draft"}
            </span>
            <MetaPill icon={IoCalendarClearOutline} text={dateLabel(data.eventDay, lang, "No date yet")} />
            <MetaPill icon={IoTimeOutline} text={data.eventTime || "Time not completed"} />
            <MetaPill icon={IoLocationOutline} text={data.venue || "Venue not completed"} />
            <MetaPill icon={IoRefreshOutline} text={source === "backend" ? "Backend data" : "Local draft fallback"} />
          </div>
        </div>

        <div className="grid content-start gap-3">
          <div className="rounded-[1.35rem] border border-teal-100 bg-white/80 p-4 shadow-inner">
            <span className="text-xs font-black uppercase tracking-[0.08em] text-stone-500">Countdown</span>
            <strong className="mt-1 block text-5xl font-black leading-none text-teal-700">{data.daysRemaining ?? "—"}</strong>
            <small className="mt-1 block text-sm font-bold text-stone-500">{data.daysRemaining === 1 ? "day remaining" : "days remaining"}</small>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Link to={editLink} className={primaryButtonClass}><IoCreateOutline aria-hidden="true" /> Edit invitation</Link>
            <Link to={guestLink} className={buttonClass}><IoPeopleOutline aria-hidden="true" /> Manage guests</Link>
            <Link to="/expenses" className={buttonClass}><IoCashOutline aria-hidden="true" /> Manage budget</Link>
            {data.publicLink ? (
              <Link to={data.publicLink} className={buttonClass}><IoGlobeOutline aria-hidden="true" /> View public</Link>
            ) : (
              <span className={`${buttonClass} cursor-not-allowed opacity-60`}><IoGlobeOutline aria-hidden="true" /> Public unavailable</span>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function MetaPill({ icon: Icon, text }) {
  return (
    <span className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-stone-200 bg-white/75 px-3 text-xs font-black text-stone-600">
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{text}</span>
    </span>
  );
}

function KpiGrid({ data, giftCount, lang }) {
  const cards = [
    { icon: IoPeopleOutline, value: data.guestTotal, label: "Total guests", note: `${data.rsvp.responded} RSVP responses`, trend: data.guestTotal > 0 ? "List started" : "Add guests", tone: "teal" },
    { icon: IoCheckmarkCircleOutline, value: `${data.rsvp.rate}%`, label: "RSVP completion", note: `${data.rsvp.pending} guests pending`, trend: data.rsvp.rate >= 70 ? "On track" : "Needs follow-up", tone: "green" },
    { icon: IoWalletOutline, value: `${data.budget.rate}%`, label: "Budget used", note: `${money(data.budget.spent)} of ${money(data.budget.total)}`, trend: data.budget.rate > 100 ? "Over budget" : "Controlled", tone: "gold" },
    { icon: IoGiftOutline, value: money(data.giftTotal), label: "Gifts received", note: `${giftCount} records`, trend: giftCount ? "Updated" : "No records", tone: "violet" },
    { icon: IoCalendarClearOutline, value: data.daysRemaining ?? "—", label: "Days remaining", note: data.eventDay ? dateLabel(data.eventDay, lang) : "Event date missing", trend: data.dateComplete ? "Scheduled" : "Set date", tone: "stone" },
    { icon: IoTicketOutline, value: data.checkInCount, label: "Check-ins", note: "Guests arrived", trend: data.checkInCount ? "Active" : "Waiting", tone: "blue" },
  ];

  return (
    <motion.section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" variants={pageMotion}>
      {cards.map((card) => <StatCard key={card.label} {...card} />)}
    </motion.section>
  );
}

function StatCard({ icon: Icon, value, label, note, trend, tone }) {
  const toneClass = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    gold: "bg-amber-50 text-amber-700 ring-amber-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    stone: "bg-stone-100 text-stone-700 ring-stone-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
  }[tone];

  return (
    <motion.article className="group rounded-[1.2rem] border border-stone-200/70 bg-white/90 p-4 shadow-[0_10px_35px_rgba(92,64,32,0.06)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_18px_50px_rgba(92,64,32,0.12)]" variants={cardMotion} whileHover={{ scale: 1.012 }}>
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="rounded-full bg-stone-50 px-2 py-1 text-[10px] font-black text-stone-500 ring-1 ring-stone-100">{trend}</span>
      </div>
      <strong className="mt-4 block break-words text-[1.7rem] font-black leading-none text-stone-950">{value}</strong>
      <span className="mt-2 block text-sm font-black text-stone-700">{label}</span>
      <small className="mt-1.5 block text-xs font-bold leading-5 text-stone-500">{note}</small>
    </motion.article>
  );
}

function ReadinessPanel({ data }) {
  return (
    <motion.article className={`${panelClass} grid gap-5 lg:grid-cols-[180px_1fr]`} variants={riseMotion}>
      <div className={`${panelHeadClass} lg:col-span-2`}>
        <div>
          <span className={eyebrowClass}>Event health</span>
          <h2 className="mt-1 text-xl font-black text-stone-950">{data.healthLabel}</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-stone-500">{data.recommendation}</p>
        </div>
        <Link to={data.selectedId ? `/dashboard/invitations/${data.selectedId}/edit` : "/create/wedding"} className={linkClass}>
          Improve <IoChevronForwardOutline aria-hidden="true" />
        </Link>
      </div>
      <ReadinessRing value={data.healthScore} label={data.healthLabel} />
      <ChecklistCard data={data} />
    </motion.article>
  );
}

function ReadinessRing({ value, label }) {
  return (
    <div className="dash-readiness-ring mx-auto" style={{ "--score": `${value}%` }} aria-label={`Event readiness score ${value}%`}>
      <div className="grid place-items-center text-center">
        <strong className="text-3xl font-black leading-none text-stone-950">{value}%</strong>
        <span className="mt-1 max-w-28 text-xs font-black text-stone-500">{label}</span>
      </div>
    </div>
  );
}

function ChecklistCard({ data }) {
  const editLink = data.selectedId ? `/dashboard/invitations/${data.selectedId}/edit` : "/create/wedding";
  const guestLink = "/guests";
  const items = [
    { label: "Invitation created", done: true, to: editLink },
    { label: "Invitation published", done: data.published, to: editLink },
    { label: "Event date completed", done: data.dateComplete, to: editLink },
    { label: "Venue completed", done: data.venueComplete, to: editLink },
    { label: "Guests added", done: data.guestTotal > 0, to: guestLink },
    { label: "RSVP responses received", done: data.rsvp.responded > 0, to: guestLink },
    { label: "Budget planned", done: data.budget.total > 0, to: "/expenses" },
    { label: "Gift/payment configured", done: data.hasPaymentSetup, to: "/gifts" },
  ];

  return (
    <motion.div className="grid gap-2" variants={pageMotion}>
      {items.map((item) => (
        <motion.div key={item.label} variants={cardMotion}>
          <Link to={item.to} className="group flex min-h-11 items-center gap-3 rounded-xl border border-stone-100 bg-white/75 px-3 py-2 text-sm font-black text-stone-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/60">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${item.done ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
              {item.done ? <IoCheckmarkCircleOutline aria-hidden="true" /> : <IoTimeOutline aria-hidden="true" />}
            </span>
            <span className="min-w-0 flex-1">{item.label}</span>
            <small className={`text-xs ${item.done ? "text-teal-700" : "text-amber-700"}`}>{item.done ? "Done" : "Open"}</small>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AnalyticsPanel({ data }) {
  const segments = [
    { label: "Accepted", value: data.rsvp.accepted, color: "#0f766e" },
    { label: "Maybe", value: data.rsvp.maybe, color: "#4f7a95" },
    { label: "Declined", value: data.rsvp.declined, color: "#b95c50" },
    { label: "Pending", value: data.rsvp.pending, color: "#c49a55" },
  ];

  return (
    <motion.article className={panelClass} variants={riseMotion}>
      <div className={panelHeadClass}>
        <div>
          <span className={eyebrowClass}>RSVP insight</span>
          <h2 className="mt-1 text-xl font-black text-stone-950">Guest response mix</h2>
        </div>
        <strong className="text-2xl font-black text-teal-700">{data.rsvp.rate}%</strong>
      </div>
      <div className="grid items-center gap-5 md:grid-cols-[180px_1fr]">
        <RsvpDonutChart items={segments} total={data.expectedGuests} />
        <GuestStatusBar items={segments} total={data.expectedGuests} />
      </div>
    </motion.article>
  );
}

function RsvpDonutChart({ items, total }) {
  let offset = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label="RSVP donut chart">
        <circle cx="50" cy="50" r={radius} className="dash-donut-bg" />
        {items.map((item) => {
          const length = total ? (item.value / total) * circumference : 0;
          const circle = (
            <motion.circle
              key={item.label}
              cx="50"
              cy="50"
              r={radius}
              className="dash-donut-segment"
              stroke={item.color}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${length} ${circumference - length}` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          );
          offset += length;
          return circle;
        })}
      </svg>
      <div className="absolute inset-[28%] grid place-items-center rounded-full bg-white text-center shadow-[0_14px_35px_rgba(31,36,33,0.10)]">
        <div>
          <strong className="block text-2xl font-black leading-none text-stone-950">{total || 0}</strong>
          <span className="mt-1 block text-xs font-black text-stone-500">Guests</span>
        </div>
      </div>
    </div>
  );
}

function GuestStatusBar({ items, total }) {
  return (
    <div className="min-w-0">
      <div className="flex h-4 overflow-hidden rounded-full bg-stone-100" aria-label="Guest status stacked bar">
        {items.map((item) => (
          <motion.span
            key={item.label}
            style={{ width: `${pct(item.value, total)}%`, background: item.color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct(item.value, total)}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-white/75 p-3 text-sm font-black text-stone-700">
            <i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <strong className="text-stone-950">{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetPanel({ budget, items }) {
  return (
    <motion.article className={panelClass} variants={riseMotion}>
      <div className={panelHeadClass}>
        <div>
          <span className={eyebrowClass}>Budget</span>
          <h2 className="mt-1 text-xl font-black text-stone-950">Spending progress</h2>
        </div>
        <Link to="/expenses" className={linkClass}>Manage budget <IoChevronForwardOutline aria-hidden="true" /></Link>
      </div>
      <div className="rounded-[1.1rem] bg-gradient-to-br from-amber-50 to-teal-50 p-4 ring-1 ring-amber-100">
        <span className="text-xs font-black uppercase tracking-[0.08em] text-stone-500">Used</span>
        <strong className="mt-2 block text-4xl font-black leading-none text-stone-950">{budget.rate}%</strong>
        <p className="mt-2 text-sm font-bold leading-6 text-stone-500">{money(budget.spent)} spent, {money(Math.max(0, budget.remaining))} remaining</p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/80">
          <motion.span className="block h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-700" style={{ width: `${Math.min(100, budget.rate)}%` }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, budget.rate)}%` }} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.slice(0, 5).map((item) => (
          <div key={item.id} className="min-w-0 rounded-xl border border-stone-100 bg-white/75 p-3">
            <span className="block truncate text-xs font-black text-stone-500">{item.category}</span>
            <strong className="mt-1 block truncate text-sm font-black text-stone-950">{money(item.amount)}</strong>
          </div>
        ))}
        {!items.length && <EmptyInline>No budget items yet.</EmptyInline>}
      </div>
    </motion.article>
  );
}

function GiftPanel({ gifts, max, total }) {
  return (
    <motion.article className={panelClass} variants={riseMotion}>
      <div className={panelHeadClass}>
        <div>
          <span className={eyebrowClass}>Gifts</span>
          <h2 className="mt-1 text-xl font-black text-stone-950">Gift amount trend</h2>
          <p className="mt-1 text-sm font-bold text-stone-500">{money(total)} received</p>
        </div>
        <Link to="/gifts" className={linkClass}>View gifts <IoChevronForwardOutline aria-hidden="true" /></Link>
      </div>
      {!gifts.length ? (
        <EmptyInline>No gift records yet.</EmptyInline>
      ) : (
        <div className="grid min-h-56 grid-cols-4 items-end gap-3 sm:grid-cols-8" aria-label="Gift amount mini bar chart">
          {gifts.map((gift) => (
            <div key={gift.id} className="grid min-w-0 grid-rows-[145px_auto_auto] gap-2 text-center">
              <motion.span className="self-end rounded-t-xl rounded-b bg-gradient-to-b from-violet-500 to-amber-500" style={{ height: `${Math.max(10, (gift.amount / max) * 100)}%` }} initial={{ height: 0 }} animate={{ height: `${Math.max(10, (gift.amount / max) * 100)}%` }} />
              <small className="truncate text-[11px] font-black text-stone-500">{gift.name}</small>
              <strong className="truncate text-xs font-black text-stone-900">{money(gift.amount, gift.currency)}</strong>
            </div>
          ))}
        </div>
      )}
    </motion.article>
  );
}

function ActivityPanel({ items }) {
  return (
    <motion.article className={panelClass} variants={riseMotion}>
      <div className={panelHeadClass}>
        <div>
          <span className={eyebrowClass}>Recent activity</span>
          <h2 className="mt-1 text-xl font-black text-stone-950">What changed lately</h2>
        </div>
      </div>
      {!items.length ? (
        <EmptyInline>New guests, RSVP responses, gifts, and budget updates will appear here.</EmptyInline>
      ) : (
        <div className="grid gap-3">
          {items.map(({ id, Icon, title, detail, type, time }) => (
            <div key={id} className="grid min-h-14 grid-cols-[40px_1fr_auto] items-center gap-3 rounded-xl border border-stone-100 bg-white/75 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-sm font-black text-stone-950">{title}</strong>
                <small className="block truncate text-xs font-bold text-stone-500">{type} · {detail}</small>
              </div>
              <em className="whitespace-nowrap text-xs font-black not-italic text-stone-400">{relativeTime(time)}</em>
            </div>
          ))}
        </div>
      )}
    </motion.article>
  );
}

function EventDetailsPanel({ data, lang }) {
  const items = [
    { icon: IoCalendarClearOutline, label: "Event date", value: dateLabel(data.eventDay, lang, "Not completed") },
    { icon: IoTimeOutline, label: "Event time", value: data.eventTime || "Not completed" },
    { icon: IoLocationOutline, label: "Venue", value: data.venue || "Not completed" },
    { icon: IoHeartOutline, label: "RSVP", value: data.rsvpEnabled ? "Enabled" : "Needs setup" },
    { icon: IoBarChartOutline, label: "Budget", value: `${money(data.budget.total)} planned` },
    { icon: IoGlobeOutline, label: "Public link", value: data.publicLink || "Unavailable" },
  ];

  return (
    <motion.article className={panelClass} variants={riseMotion}>
      <div className={panelHeadClass}>
        <div>
          <span className={eyebrowClass}>Event details</span>
          <h2 className="mt-1 break-words text-xl font-black text-stone-950">{data.title}</h2>
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-stone-100 bg-white/75 p-3">
            <dt className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.06em] text-stone-500">
              <Icon aria-hidden="true" />
              {label}
            </dt>
            <dd className="mt-2 break-words text-sm font-black text-stone-950">{value}</dd>
          </div>
        ))}
      </dl>
      {data.venueAddress && <p className="mt-3 rounded-xl bg-amber-50/80 p-3 text-sm font-bold leading-6 text-stone-600">{data.venueAddress}</p>}
    </motion.article>
  );
}

function QuickActions({ data }) {
  const editLink = data.selectedId ? `/dashboard/invitations/${data.selectedId}/edit` : "/create/wedding";
  const guestLink = "/guests";
  const actions = [
    { label: "Add guest", to: guestLink, Icon: IoAddCircleOutline },
    { label: "Open guest manager", to: guestLink, Icon: IoPeopleOutline },
    { label: "Manage budget", to: "/expenses", Icon: IoCashOutline },
    { label: "Manage gifts", to: "/gifts", Icon: IoGiftOutline },
    { label: "Edit invitation", to: editLink, Icon: IoCreateOutline },
    { label: "Browse templates", to: "/templates/browse", Icon: IoAlbumsOutline },
  ];
  if (data.publicLink) {
    actions.splice(5, 0, { label: "Preview public invitation", to: data.publicLink, Icon: IoGlobeOutline });
  }

  return (
    <motion.article className={panelClass} variants={riseMotion}>
      <div className={panelHeadClass}>
        <div>
          <span className={eyebrowClass}>Quick actions</span>
          <h2 className="mt-1 text-xl font-black text-stone-950">Move the plan forward</h2>
        </div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {actions.map(({ label, to, Icon }) => (
          <Link key={label} to={to} className="group flex items-center gap-3 rounded-xl border border-stone-100 bg-white/75 p-2.5 text-sm font-black text-stone-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/70">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-50 to-teal-50 text-teal-700 ring-1 ring-amber-100">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">{label}</span>
            <IoChevronForwardOutline className="h-4 w-4 text-stone-400 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </motion.article>
  );
}

function EmptyInline({ children }) {
  return (
    <div className="col-span-full grid min-h-32 place-items-center rounded-xl border border-dashed border-stone-200 bg-white/60 p-5 text-center text-sm font-bold leading-6 text-stone-500">
      {children}
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="mx-auto grid max-w-[1440px] gap-6">
      <div className="dash-skeleton min-h-[260px] rounded-[1.75rem]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => <div className="dash-skeleton min-h-32 rounded-[1.2rem]" key={index} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="dash-skeleton min-h-80 rounded-[1.5rem]" />
        <div className="dash-skeleton min-h-80 rounded-[1.5rem]" />
      </div>
    </div>
  );
}
