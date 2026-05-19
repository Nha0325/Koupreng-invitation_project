import { Link } from "react-router-dom";

/**
 * Right-side preview/publish call-to-action box.
 */
export default function PublishBox({ draft }) {
    const canPreview = !!draft.id;

    return (
        <div className="wb-publish-box">
            <div>រក្សាទុកដោយស្វ័យប្រវត្តិ</div>
            {canPreview ? (
                <Link to={`/preview/${draft.id}`} className="wb-btn wb-btn-primary">
                    មើលជាមុន
                </Link>
            ) : (
                <span className="wb-btn wb-btn-primary" aria-disabled="true" style={{ pointerEvents: "none", opacity: 0.5 }}>
                    មើលជាមុន
                </span>
            )}
        </div>
    );
}
