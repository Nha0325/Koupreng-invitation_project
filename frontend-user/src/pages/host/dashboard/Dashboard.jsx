import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTemplateById } from "../../../features/templates/data/templatesData";
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
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const drafts = listDrafts();
  const currentDraft = drafts[0];
  const template = currentDraft ? getTemplateById(currentDraft.templateId) : null;
  const responses = getDraftResponses(currentDraft);
  const accepted = responses.filter((item) => item.attending === "yes").length;
  const declined = responses.filter((item) => item.attending === "no").length;
  const respondedGuests = responses.reduce((total, item) => total + (Number(item.count) || 1), 0);
  const isPublished = Boolean(currentDraft?.publishedAt && currentDraft?.slug);

  const handleCopy = async () => {
    if (!currentDraft?.slug) return;

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/w/${currentDraft.slug}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }

    navigate(`/w/${currentDraft.slug}`, { state: { backTo: "/dashboard" } });
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
          បង្កើតសន្លឹកការ
        </Link>
      </header>

      <section className="dash-current-card">
        <div className="dash-current-media">
          {template?.image ? (
            <img src={template.image} alt={template.name} />
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
          <button
            type="button"
            className="dash-btn"
            onClick={handleCopy}
            disabled={!currentDraft.slug}
          >
            {copied ? "បានចម្លង" : "ចម្លងតំណភ្ជាប់"}
          </button>
        </div>
      </section>

      <section className="dash-summary-grid" aria-label="Dashboard summary">
        <SummaryCard
          label="ភ្ញៀវ / បានឆ្លើយតប"
          value={`${respondedGuests} / ${responses.length}`}
          note="ផ្អែកលើ RSVP ដែលបានរក្សាទុក"
        />
        <SummaryCard
          label="RSVP accepted / pending / declined"
          value={`${accepted} / 0 / ${declined}`}
          note="មិនមានប្រភព invited list ដាច់ដោយឡែកក្នុង storage បច្ចុប្បន្ន"
        />
        <SummaryCard
          label="Budget progress"
          value="0%"
          note="គម្រោងថវិកាមិនទាន់ភ្ជាប់ storage"
        />
        <SummaryCard
          label="Gift summary"
          value="0"
          note="ចងដៃមង្គលមិនទាន់មានទិន្នន័យរក្សាទុក"
        />
      </section>

      <section className="dash-quick-actions">
        <h2>Quick actions</h2>
        <div className="dash-action-grid">
          <Link to="/create/wedding" className="dash-action-card">បង្កើតសន្លឹកការ</Link>
          <Link
            to={`/preview/${currentDraft.id}`}
            state={{ backTo: "/dashboard" }}
            className="dash-action-card"
          >
            មើលជាមុន
          </Link>
          <button type="button" className="dash-action-card" onClick={handleCopy} disabled={!currentDraft.slug}>
            ចម្លងតំណភ្ជាប់
          </button>
          <Link to="/guests" className="dash-action-card">បញ្ជីភ្ញៀវ</Link>
          <Link to="/expenses" className="dash-action-card">គម្រោងថវិកា</Link>
        </div>
      </section>
    </main>
  );
}
