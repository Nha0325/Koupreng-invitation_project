export function WishCard({ wish, onDelete, isDeleting }) {
  return (
    <div className="wish-card">
      <div className="wish-card-header">
        <div className="wish-author-info">
          <div className="wish-avatar">
            {wish.guestName?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div>
            <h4 className="wish-name">{wish.guestName || "ភ្ញៀវកិត្តិយស"}</h4>
            {wish.createdAt && (
              <span className="wish-date">
                {new Date(wish.createdAt).toLocaleDateString("km-KH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            className="wish-delete-btn"
            disabled={isDeleting}
            onClick={() => onDelete(wish.id)}
            title="លុបពាក្យជូនពរ"
          >
            {isDeleting ? "..." : "លុប"}
          </button>
        )}
      </div>

      <p className="wish-message">{wish.message || wish.content}</p>
    </div>
  );
}

export default WishCard;
