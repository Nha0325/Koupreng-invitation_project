import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

function getInvitationTitle(draft) {
  const groom = draft?.couple?.groom;
  const bride = draft?.couple?.bride;

  if (groom || bride) {
    return `${groom || "កូនកំលោះ"} & ${bride || "កូនក្រមុំ"}`;
  }

  return "សន្លឹកការថ្មី";
}

function getDraftResponses(draft) {
  if (!draft?.id) return [];

  const byId = listRsvps(draft.id);
  const bySlug = draft.slug ? listRsvps(draft.slug) : [];
  const merged = new Map();

  [...byId, ...bySlug].forEach((response) => {
    merged.set(response.id, response);
  });

  return Array.from(merged.values());
}

function SummaryCard({ label, value, note }) {
  return (
    <article className="dash-summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

export default function Dashboard() {
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
  const accepted = responses.filter((item) => item.attending === "yes").length;
  const declined = responses.filter((item) => item.attending === "no").length;
  const respondedGuests = responses.reduce((total, item) => total + (Number(item.count) || 1), 0);
  const manualGuests = listManualGuests(currentDraft?.id);
  const expenses = listBudgetExpenses([], currentDraft?.id);
  const gifts = listWeddingGifts([], currentDraft?.id);
  const manualGuestCount = manualGuests.reduce((total, item) => total + (Number(item.count) || 1), 0);
  const totalBudget = expenses.reduce((total, item) => total + (Number(item.budget) || 0), 0);
  const totalSpent = expenses.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const budgetProgress = totalBudget ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const giftTotal = gifts.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const isPublished = Boolean(currentDraft?.publishedAt && currentDraft?.slug);

  const handleSwitchEvent = (eventId) => {
    setActiveEvent(eventId);
    setActiveEventId(eventId);
  };

  if (!currentDraft) {
    return (
      <main className="dash-main">
        <section className="dash-empty-state">
          <span className="dash-empty-mark">គូព្រេង</span>
          <h1>មិនទាន់មានសន្លឹកការនៅឡើយ</h1>
          <p>ចាប់ផ្តើមបង្កើតសន្លឹកការឌីជីថល និង RSVP សម្រាប់ភ្ញៀវ។</p>
          <div className="dash-actions">
            <Link to="/create/wedding" className="dash-btn dash-btn-primary">
              បង្កើតសន្លឹកការ
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dash-main">
      <header className="dash-page-header">
        <div>
          <span className="dash-kicker">Wedding invitation dashboard</span>
          <h1>ផ្ទាំងគ្រប់គ្រងសន្លឹកការ</h1>
          <p>គ្រប់គ្រងសន្លឹកការ RSVP ភ្ញៀវ ថវិកា និងចងដៃមង្គលពីកន្លែងតែមួយ។</p>
        </div>
        <Link to="/create/wedding" className="dash-btn dash-btn-primary">
          + បង្កើតកម្មវិធីថ្មី
        </Link>
      </header>

      {/* Event Switcher */}
      {drafts.length > 1 && (
        <section className="dash-event-switcher" aria-label="ជ្រើសរើសកម្មវិធី">
          <div className="dash-event-switcher-header">
            <h3 className="dash-event-switcher-title">កម្មវិធីរបស់អ្នក ({drafts.length})</h3>
            {drafts.length > 2 && (
              <button
                type="button"
                className="dash-event-clear-btn"
                onClick={() => {
                  if (!window.confirm("លុបកម្មវិធីចាស់ៗ រក្សាទុកតែ ២ ចុងក្រោយ?")) return;
                  const keep = drafts.slice(0, 2);
                  const all = JSON.parse(localStorage.getItem("koupreng.wedding.drafts") || "{}");
                  const keepIds = new Set(keep.map((d) => d.id));
                  Object.keys(all).forEach((id) => { if (!keepIds.has(id)) delete all[id]; });
                  localStorage.setItem("koupreng.wedding.drafts", JSON.stringify(all));
                  window.location.reload();
                }}
              >
                រក្សាទុកតែ ២
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
                      {draft.extras?.eventType || "អាពាហ៍ពិពាហ៍"} • {draft.event?.date || "មិនទាន់កំណត់"}
                    </span>
                  </div>
                  {isActive && <span className="dash-event-switcher-active-badge">Active</span>}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="dash-current-card">
        <div className="dash-current-media">
          {coverImage ? (
            <img src={coverImage} alt={template.name} />
          ) : (
            <span>គូព្រេង</span>
          )}
        </div>

        <div className="dash-current-info">
          <span className={`dash-status${isPublished ? " is-published" : ""}`}>
            {isPublished ? "Published" : "Draft"}
          </span>
          <h2>{getInvitationTitle(currentDraft)}</h2>
          <p>{template?.name || currentDraft.templateId} / {template?.style || "Wedding template"}</p>
          <dl className="dash-current-meta">
            <div>
              <dt>ថ្ងៃកម្មវិធី</dt>
              <dd>{currentDraft.event?.date || "មិនទាន់បំពេញ"}</dd>
            </div>
            <div>
              <dt>ទីកន្លែង</dt>
              <dd>{currentDraft.event?.venueName || "មិនទាន់បំពេញ"}</dd>
            </div>
            <div>
              <dt>RSVP</dt>
              <dd>{currentDraft.rsvp?.enabled ? "បើក" : "បិទ"}</dd>
            </div>
          </dl>
        </div>

        <div className="dash-current-actions">
          <Link
            to={`/create/wedding/${currentDraft.id}`}
            state={{ backTo: "/dashboard" }}
            className="dash-btn dash-btn-primary"
          >
            កែសន្លឹកការ
          </Link>
          <Link
            to={`/preview/${currentDraft.id}`}
            state={{ backTo: "/dashboard" }}
            className="dash-btn"
          >
            មើលជាមុន
          </Link>
        </div>
      </section>

      <section className="dash-summary-grid" aria-label="Dashboard summary">
        <SummaryCard
          label="ភ្ញៀវសរុប / RSVP"
          value={`${manualGuestCount + respondedGuests} / ${responses.length}`}
          note="ផ្អែកលើបញ្ជីភ្ញៀវ និង RSVP ដែលបានរក្សាទុក"
        />
        <SummaryCard
          label="RSVP accepted / pending / declined"
          value={`${accepted} / 0 / ${declined}`}
          note="មិនមានប្រភព invited list ដាច់ដោយឡែកក្នុង storage បច្ចុប្បន្ន"
        />
        <SummaryCard
          label="Budget progress"
          value={`${budgetProgress}%`}
          note={`បានចំណាយ $${totalSpent.toLocaleString()} / $${totalBudget.toLocaleString()}`}
        />
        <SummaryCard
          label="Gift summary"
          value={`$${giftTotal.toLocaleString()}`}
          note={`${gifts.length} កំណត់ត្រាចងដៃមង្គល`}
        />
      </section>
      {/* 
      <section className="dash-quick-actions">
        <h2>Quick actions</h2>
        <div className="dash-action-grid">
          <Link to="/create/wedding" className="dash-action-card">បង្កើតកម្មវិធីថ្មី</Link>
          <Link
            to={`/preview/${currentDraft.id}`}
            state={{ backTo: "/dashboard" }}
            className="dash-action-card"
          >
            មើលជាមុន
          </Link>
          <Link to="/guests" className="dash-action-card">បញ្ជីភ្ញៀវ</Link>
          <Link to="/expenses" className="dash-action-card">គម្រោងថវិកា</Link>
          <Link to="/gifts" className="dash-action-card">ចងដៃមង្គល</Link>
        </div>
      </section> */}
    </main>
  );
}
