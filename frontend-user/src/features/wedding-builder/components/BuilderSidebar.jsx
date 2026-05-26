/**
 * Step navigation sidebar.
 */
export default function BuilderSidebar({ steps, currentStep, onSelect }) {
    return (
        <aside className="wb-sidebar">
            <h3>ដំណាក់កាល</h3>
            <ol>
                {steps.map((step, index) => (
                    <li key={step.id || step.label || index}>
                        <button
                            type="button"
                            className={`wb-step-btn${index === currentStep ? " is-active" : ""}`}
                            onClick={() => onSelect(index)}
                        >
                            <span className="wb-step-num">{index + 1}</span>
                            {step.label || step}
                        </button>
                    </li>
                ))}
            </ol>
        </aside>
    );
}
