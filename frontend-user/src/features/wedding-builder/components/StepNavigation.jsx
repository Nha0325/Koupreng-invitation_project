/**
 * Bottom prev/next buttons.
 */
export default function StepNavigation({ onPrev, onNext, isFirst, isLast }) {
    return (
        <div className="wb-nav">
            <button
                type="button"
                className="wb-btn"
                onClick={onPrev}
                disabled={isFirst}
                style={isFirst ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
                ← មុន
            </button>
            {!isLast && (
                <button type="button" className="wb-btn wb-btn-primary" onClick={onNext}>
                    បន្ត →
                </button>
            )}
        </div>
        // <> </>
    );
}
