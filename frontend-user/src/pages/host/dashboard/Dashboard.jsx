import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IoCalendarClearOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoGiftOutline,
  IoPeopleOutline,
  IoSparklesOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { getTemplateById } from "../../../features/templates/data/templatesData";
import {
  getActiveEventId,
  listBudgetExpenses,
  listManualGuests,
  listWeddingGifts,
  setActiveEventId,
} from "../../../services/hostPlanningStorage";
import { listRsvps } from "../../../services/rsvpService";
import { listDrafts } from "../../../services/weddingStorage";
import { useBackendMessages } from "../../../shared/i18n/useBackendMessages";

export default function Dashboard() {
  const { lang, text } = useBackendMessages("dashboard");
  const drafts = listDrafts();

  // Active event selection
  const storedActiveId = getActiveEventId();
  const [activeEventId, setActiveEvent] = useState(() => {
    if (storedActiveId && drafts.find((d) => d.id === storedActiveId)) {
      return storedActiveId;
    }
    return drafts[0]?.id || null;
  });

  useEffect(() => {
    if (activeEventId) {
      setActiveEventId(activeEventId);
    }
  }, [activeEventId]);

  const currentDraft = drafts.find((d) => d.id === activeEventId) || drafts[0];
  const template = currentDraft ? getTemplateById(currentDraft.templateId) : null;
  // Show the same cover image the user picked in the builder's card grid
  // (phoneCoverImage / mainImage), not the generic thumbnail.
  const coverImage = template?.phoneCoverImage || template?.mainImage || template?.image;
  const responses = getDraftResponses(currentDraft);
  const acceptedGuests = countGuests(responses.filter((item) => getResponseStatus(item) === "accepted"));
  const declinedGuests = countGuests(responses.filter((item) => getResponseStatus(item) === "declined"));
  const maybeGuests = countGuests(responses.filter((item) => getResponseStatus(item) === "maybe"));
  const respondedGuests = countGuests(responses);
  const manualGuests = listManualGuests(currentDraft?.id);
  const expenses = listBudgetExpenses([], currentDraft?.id);
  const gifts = listWeddingGifts([], currentDraft?.id);
  const manualGuestCount = countGuests(manualGuests);
  const expectedGuests = Math.max(manualGuestCount, respondedGuests);
  const pendingGuests = Math.max(expectedGuests - respondedGuests, 0);
  const rsvpCompletion = expectedGuests ? Math.round((respondedGuests / expectedGuests) * 100) : 0;
  const totalBudget = expenses.reduce((total, item) => total + (Number(item.budget) || 0), 0);
  const totalSpent = expenses.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const budgetProgress = totalBudget ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const giftTotal = gifts.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const isPublished = Boolean(currentDraft?.publishedAt && currentDraft?.slug);
  const planHealth = Math.round((rsvpCompletion * 0.55) + (budgetProgress * 0.25) + (isPublished ? 20 : 0));
  const recentGuests = manualGuests.slice(0, 5);
  const rsvpGraphData = [
    { label: text("accepted"), value: acceptedGuests, tone: "is-accepted" },
    { label: text("pending"), value: pendingGuests, tone: "is-pending" },
    { label: text("maybe"), value: maybeGuests, tone: "is-maybe" },
    { label: text("declined"), value: declinedGuests, tone: "is-declined" },
  ];

  const handleSwitchEvent = (eventId) => {
    setActiveEvent(eventId);
    setActiveEventId(eventId);
  };

  if (!currentDraft) {
    return (
      <main className="dash-main">
        <section className="dash-empty-state">
          <span className="dash-empty-mark">{text("brand")}</span>
          <h1>{text("emptyTitle")}</h1>
          <p>{text("emptyText")}</p>
          <div className="dash-actions">
            <Link to="/create/wedding" className="dash-btn dash-btn-primary">
              {text("createInvitation")}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dash-main">
      {/* Event Switcher */}
      {drafts.length > 1 && (
        <section className="dash-event-switcher" aria-label={text("eventSwitcherAria")}>
          <div className="dash-event-switcher-header">
            <h3 className="dash-event-switcher-title">{text("eventSwitcherTitle", { count: drafts.length })}</h3>
            {drafts.length > 2 && (
              <button
                type="button"
                className="dash-event-clear-btn"
                onClick={() => {
                  if (!window.confirm(text("keepTwoConfirm"))) return;
                  const keep = drafts.slice(0, 2);
                  const all = JSON.parse(localStorage.getItem("koupreng.wedding.drafts") || "{}");
                  const keepIds = new Set(keep.map((d) => d.id));
                  Object.keys(all).forEach((id) => { if (!keepIds.has(id)) delete all[id]; });
                  localStorage.setItem("koupreng.wedding.drafts", JSON.stringify(all));
                  window.location.reload();
                }}
              >
                {text("keepTwo")}
              </button>
            )}
          </div>
          <div className="dash-event-switcher-list">
            {drafts.map((draft) => {
              const tpl = getTemplateById(draft.templateId);
              const tplCover = tpl.phoneCoverImage || tpl.mainImage || tpl.image;
              const isActive = draft.id === currentDraft?.id;
              return (
                <button
                  key={draft.id}
                  type="button"
                  className={`dash-event-switcher-card${isActive ? " active" : ""}`}
                  onClick={() => handleSwitchEvent(draft.id)}
                >
                  <img src={tplCover} alt={tpl.name} className="dash-event-switcher-img" />
                  <div className="dash-event-switcher-info">
                    <span className="dash-event-switcher-name">{getInvitationTitle(draft)}</span>
                    <span className="dash-event-switcher-meta">
                      {draft.extras?.eventType || text("wedding")} • {draft.event?.date || text("noDate")}
                    </span>
                  </div>
                  {isActive && <span className="dash-event-switcher-active-badge">{text("active")}</span>}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="dash-sample2" aria-label={text("title")}>
        <div className="dash-sample2-main">
          <div className="dash-sample2-copy">
            <span className="dash-sample-badge">
              <IoSparklesOutline aria-hidden="true" />
              {text("overview")}
            </span>
            <h1>{text("title")}</h1>
            <p>
              {text("description")}
            </p>
          </div>
          <div className="dash-sample-actions">
            <Link to="/guests" className="dash-sample-action">
              <IoPeopleOutline aria-hidden="true" />
              {text("guests")}
            </Link>
            <Link
              to={`/create/wedding/${currentDraft.id}`}
              state={{ backTo: "/dashboard" }}
              className="dash-sample-action is-primary"
            >
              <IoCalendarClearOutline aria-hidden="true" />
              {text("editInvitation")}
            </Link>
          </div>
        </div>

        <div className="dash-sample2-grid">
          <SampleMetricCard
            icon={IoPeopleOutline}
            label={text("invitedGuests")}
            value={expectedGuests}
            note={text("responses", { count: respondedGuests })}
            tone="is-teal"
          />
          <SampleMetricCard
            icon={IoCheckmarkCircleOutline}
            label={text("rsvpReady")}
            value={`${rsvpCompletion}%`}
            note={text("attending", { count: acceptedGuests })}
            tone="is-green"
          />
          <SampleMetricCard
            icon={IoCashOutline}
            label={text("budgetUsed")}
            value={`${budgetProgress}%`}
            note={text("spent", { amount: totalSpent.toLocaleString() })}
            tone="is-gold"
          />
          <SampleMetricCard
            icon={IoGiftOutline}
            label={text("giftTotal")}
            value={`$${giftTotal.toLocaleString()}`}
            note={text("records", { count: gifts.length })}
            tone="is-violet"
          />
        </div>

        <div className="dash-sample2-footer">
          <ProgressRing value={planHealth} label={text("planHealth")} />
          <div className="dash-sample-checklist">
            <div>
              <IoTrendingUpOutline aria-hidden="true" />
              <span>{text("rsvpCompletion")}</span>
              <strong>{rsvpCompletion}%</strong>
            </div>
            <div>
              <IoCalendarClearOutline aria-hidden="true" />
              <span>{text("weddingDate")}</span>
              <strong>{formatDisplayDate(currentDraft.event?.date, lang, text)}</strong>
            </div>
            <div>
              <IoGiftOutline aria-hidden="true" />
              <span>{text("giftRecords")}</span>
              <strong>{gifts.length}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dash-current-card">
        <div className="dash-current-media">
          {coverImage ? (
            <img src={coverImage} alt={template?.name || text("template")} />
          ) : (
            <span>{text("brand")}</span>
          )}
        </div>

        <div className="dash-current-info">
          <span className={`dash-status${isPublished ? " is-published" : ""}`}>
            {isPublished ? text("published") : text("draft")}
          </span>
          <h2>{getInvitationTitle(currentDraft)}</h2>
          <p>{template?.name || currentDraft.templateId} / {template?.style || text("weddingTemplate")}</p>
          <dl className="dash-current-meta">
            <div>
              <dt>{text("eventDate")}</dt>
              <dd>{currentDraft.event?.date || text("notCompleted")}</dd>
            </div>
            <div>
              <dt>{text("venue")}</dt>
              <dd>{currentDraft.event?.venueName || text("notCompleted")}</dd>
            </div>
            <div>
              <dt>{text("rsvp")}</dt>
              <dd>{currentDraft.rsvp?.enabled ? text("open") : text("closed")}</dd>
            </div>
          </dl>
        </div>

        <div className="dash-current-actions">
          <Link
            to={`/create/wedding/${currentDraft.id}`}
            state={{ backTo: "/dashboard" }}
            className="dash-btn dash-btn-primary"
          >
            {text("editInvitation")}
          </Link>
          <Link
            to={`/preview/${currentDraft.id}`}
            state={{ backTo: "/dashboard" }}
            className="dash-btn"
          >
            {text("preview")}
          </Link>
        </div>
      </section>

      <section className="dash-summary-grid" aria-label="Dashboard summary">
        <SummaryCard
          label={text("totalGuests")}
          value={expectedGuests}
          note={text("invitedResponded", { invited: manualGuestCount, responded: respondedGuests })}
          tone="is-primary"
        />
        <SummaryCard
          label={text("rsvpProgress")}
          value={`${rsvpCompletion}%`}
          note={text("rsvpProgressNote", {
            attending: acceptedGuests,
            pending: pendingGuests,
            declined: declinedGuests,
          })}
          tone="is-success"
        />
        <SummaryCard
          label={text("budgetProgress")}
          value={`${budgetProgress}%`}
          note={text("budgetProgressNote", {
            spent: totalSpent.toLocaleString(),
            budget: totalBudget.toLocaleString(),
          })}
          tone="is-warm"
        />
        <SummaryCard
          label={text("giftSummary")}
          value={`$${giftTotal.toLocaleString()}`}
          note={text("giftSummaryNote", { count: gifts.length })}
          tone="is-soft"
        />
      </section>

      <section className="dash-analytics-grid" aria-label={text("summary")}>
        <article className="dash-analytics-panel dash-rsvp-panel">
          <div className="dash-panel-head">
            <div>
              <span className="dash-kicker">{text("graph")}</span>
              <h2>{text("rsvpGuests")}</h2>
            </div>
            <strong>{rsvpCompletion}%</strong>
          </div>
          <RsvpGraph data={rsvpGraphData} total={expectedGuests} />
          <div className="dash-graph-legend">
            {rsvpGraphData.map((item) => (
              <span key={item.label}>
                <i className={item.tone} />
                {item.label}
              </span>
            ))}
          </div>
        </article>

        <article className="dash-analytics-panel">
          <div className="dash-panel-head">
            <div>
              <span className="dash-kicker">{text("recentGuests")}</span>
              <h2>{text("newGuests")}</h2>
            </div>
            <Link to="/guests">{text("viewAll")}</Link>
          </div>
          <div className="dash-guest-list">
            {recentGuests.length > 0 ? (
              recentGuests.map((guest) => (
                <div className="dash-guest-row" key={guest.id}>
                  <span>{(guest.name || guest.guestName || "?").charAt(0).toUpperCase()}</span>
                  <div>
                    <strong>{guest.name || guest.guestName || "Guest"}</strong>
                    <small>{guest.group || guest.guestGroup || text("noGroup")}</small>
                  </div>
                  <em>{guest.sendStatus || text("pending")}</em>
                </div>
              ))
            ) : (
              <div className="dash-panel-empty">{text("noGuests")}</div>
            )}
          </div>
        </article>

        <article className="dash-analytics-panel">
          <div className="dash-panel-head">
            <div>
              <span className="dash-kicker">{text("event")}</span>
              <h2>{text("summary")}</h2>
            </div>
            <Link to={`/create/wedding/${currentDraft.id}`}>{text("edit")}</Link>
          </div>
          <dl className="dash-event-details">
            <div>
              <dt>{text("eventDate")}</dt>
              <dd>{formatDisplayDate(currentDraft.event?.date, lang, text)}</dd>
            </div>
            <div>
              <dt>{text("venue")}</dt>
              <dd>{currentDraft.event?.venueName || text("notCompleted")}</dd>
            </div>
            <div>
              <dt>{text("template")}</dt>
              <dd>{template?.name || currentDraft.templateId}</dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  );
}

// ── Helper Functions & Components ──

function formatDisplayDate(dateStr, lang, text) {
  if (!dateStr) return text("notCompleted");
  try {
    return new Date(dateStr).toLocaleDateString(lang === "km" ? "km-KH" : "en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
}

function countGuests(list) {
  if (!list) return 0;
  return list.reduce((sum, item) => sum + (Math.max(1, Number(item.count) || 1)), 0);
}

function getResponseStatus(rsvp) {
  if (rsvp.status) return rsvp.status.toLowerCase();
  if (rsvp.attending === false) return "declined";
  if (rsvp.attending === true) return "accepted";
  return "pending";
}

function getDraftResponses(draft) {
  if (!draft) return [];
  const rsvps = listRsvps(draft.id || "");
  if (draft.slug) {
    const slugRsvps = listRsvps(draft.slug);
    const map = new Map();
    rsvps.forEach(r => map.set(r.id, r));
    slugRsvps.forEach(r => map.set(r.id, r));
    return Array.from(map.values());
  }
  return rsvps;
}

function getInvitationTitle(draft) {
  if (draft?.title) return draft.title;
  if (draft?.event?.groomName && draft?.event?.brideName) {
    return `${draft.event.groomName} & ${draft.event.brideName}`;
  }
  return "My Wedding";
}

function SampleMetricCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className={`dash-metric-card ${tone}`}>
      <div className="dash-metric-icon"><Icon aria-hidden="true" /></div>
      <div className="dash-metric-content">
        <h3>{label}</h3>
        <strong>{value}</strong>
        <p>{note}</p>
      </div>
    </div>
  );
}

function ProgressRing({ value, label }) {
  return (
    <div className="dash-progress-ring">
      <div className="dash-ring-circle">
         <span>{value}%</span>
      </div>
      <p>{label}</p>
    </div>
  );
}

function SummaryCard({ label, value, note, tone }) {
  return (
    <div className={`dash-summary-card ${tone}`}>
      <h3>{label}</h3>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  );
}

function RsvpGraph({ data, total }) {
  return (
    <div className="dash-rsvp-graph">
      <div className="dash-graph-bars" style={{ display: "flex", height: "10px", width: "100%", background: "#eee", borderRadius: "5px", overflow: "hidden", marginBottom: "16px" }}>
        {data.map(item => (
          <div key={item.label} className={item.tone} style={{ width: `${total ? (item.value / total) * 100 : 0}%`, height: "100%" }} />
        ))}
      </div>
    </div>
  );
}
