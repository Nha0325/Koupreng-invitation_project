import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoHeartOutline,
} from "react-icons/io5";

export function RsvpKpiCards({
  attendingCount = 0,
  declinedCount = 0,
  pendingCount = 0,
  wishesCount = 0,
  viewMode = "TABLE",
  setViewMode,
}) {
  const isWishesActive = viewMode === "WISHES";

  return (
    <section className="rsvp-kpi-grid" aria-label="RSVP KPI Summary">
      <article className="rsvp-kpi-card is-attending">
        <div className="rsvp-kpi-top">
          <span className="rsvp-kpi-label">ចូលរួម / Attending</span>
          <span className="rsvp-kpi-icon-pill" aria-hidden="true">
            <IoCheckmarkCircleOutline />
          </span>
        </div>
        <strong className="rsvp-kpi-value">{attendingCount}</strong>
        <small className="rsvp-kpi-note">ភ្ញៀវបានបញ្ជាក់ / Confirmed guests</small>
      </article>

      <article className="rsvp-kpi-card is-declined">
        <div className="rsvp-kpi-top">
          <span className="rsvp-kpi-label">អវត្តមាន / Declined</span>
          <span className="rsvp-kpi-icon-pill" aria-hidden="true">
            <IoCloseCircleOutline />
          </span>
        </div>
        <strong className="rsvp-kpi-value">{declinedCount}</strong>
        <small className="rsvp-kpi-note">មិនបានចូលរួម / Not attending</small>
      </article>

      <article className="rsvp-kpi-card is-pending">
        <div className="rsvp-kpi-top">
          <span className="rsvp-kpi-label">រង់ចាំ / Pending</span>
          <span className="rsvp-kpi-icon-pill" aria-hidden="true">
            <IoTimeOutline />
          </span>
        </div>
        <strong className="rsvp-kpi-value">{pendingCount}</strong>
        <small className="rsvp-kpi-note">រង់ចាំការឆ្លើយតប / Awaiting reply</small>
      </article>

      <article
        className={`rsvp-kpi-card is-wishes ${isWishesActive ? "is-active" : ""}`}
        onClick={() => setViewMode(isWishesActive ? "TABLE" : "WISHES")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setViewMode(isWishesActive ? "TABLE" : "WISHES");
          }
        }}
        aria-label="Wishes Wall Card"
      >
        <div className="rsvp-kpi-top">
          <span className="rsvp-kpi-label">សារជូនពរ / Wishes Wall</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="rsvp-wishes-tag">
              {isWishesActive ? "ចុចបិទ" : "ចុចមើល"}
            </span>
            <span className="rsvp-kpi-icon-pill" aria-hidden="true">
              <IoHeartOutline />
            </span>
          </div>
        </div>
        <strong className="rsvp-kpi-value">{wishesCount}</strong>
        <small className="rsvp-kpi-note">ពាក្យជូនពរពីភ្ញៀវ / Guest wishes</small>
      </article>
    </section>
  );
}

export default RsvpKpiCards;
