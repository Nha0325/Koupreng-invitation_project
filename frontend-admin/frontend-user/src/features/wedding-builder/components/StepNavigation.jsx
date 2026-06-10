/**
 * Bottom prev/next buttons.
 * Back = cream outline, Next = gold primary. Publish on the last step is
 * handled inside ReviewPublishStep, so Next is hidden there.
 */
export default function StepNavigation({ onPrev, onNext, isFirst, isLast }) {
    return (
        <div className="wb-nav">
            <button
                type="button"
                className="wb-btn"
                onClick={onPrev}
                disabled={isFirst}
            >
                ← ត្រឡប់ក្រោយ
            </button>
            {!isLast && (
                <button type="button" className="wb-btn wb-btn-primary" onClick={onNext}>
                    បន្ត →
                </button>
            )}
        </div>
    );
}
