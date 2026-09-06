import { EmptyState, StatusBadge } from "@/shared/ui";
import { IoTimeOutline, IoArrowBackOutline } from "react-icons/io5";

export function RsvpWishesWall({ wishesList = [], setViewMode }) {
  return (
    <section className="rsvp-board">
      <div className="rsvp-wishes-head">
        <div>
          <h2>ផ្ទាំងសារជូនពរមង្គលការ (Guest Wishes Wall)</h2>
          <p>សារជូនពរដែលបានផ្ញើតាមរយៈទំព័រធៀបឌីជីថល</p>
        </div>
        <button
          type="button"
          className="rsvp-return-btn"
          onClick={() => setViewMode("TABLE")}
        >
          <IoArrowBackOutline aria-hidden="true" />
          <span>ត្រឡប់ទៅតារាង RSVP</span>
        </button>
      </div>

      {wishesList.length === 0 ? (
        <div className="rsvp-empty-box">
          <EmptyState
            title="មិនទាន់មានសារជូនពរនៅឡើយទេ"
            description="នៅពេលភ្ញៀវឆ្លើយតប RSVP រួចផ្ញើសារជូនពរ វានឹងបង្ហាញនៅទីនេះ។"
          />
        </div>
      ) : (
        <div className="rsvp-wishes-grid">
          {wishesList.map((item) => {
            const author = item.guestName || item.name || "ភ្ញៀវកិត្តិយស";
            const initial = author.trim().charAt(0).toUpperCase();
            const dateVal = item.createdAt || item.updatedAt;

            return (
              <article
                key={item.id || item.guestId || Math.random()}
                className="rsvp-wish-card"
              >
                <div className="rsvp-wish-header">
                  <div className="rsvp-wish-author">
                    <div className="rsvp-wish-avatar" aria-hidden="true">
                      {initial}
                    </div>
                    <strong>{author}</strong>
                  </div>
                  <StatusBadge status={(item.status || "PENDING").toUpperCase()} />
                </div>

                <p className="rsvp-wish-quote">
                  “{item.wish || item.message}”
                </p>

                {dateVal && (
                  <div className="rsvp-wish-footer">
                    <IoTimeOutline aria-hidden="true" />
                    <span>
                      {new Intl.DateTimeFormat("km-KH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(dateVal))}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RsvpWishesWall;
