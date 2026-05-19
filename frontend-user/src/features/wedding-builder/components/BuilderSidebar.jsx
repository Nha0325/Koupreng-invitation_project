import { Link } from "react-router-dom";

/**
 * Step navigation sidebar.
 */
export default function BuilderSidebar({ steps, currentStep, onSelect }) {
    return (
        <aside className="wb-sidebar">
            <Link to="/templates" className="wb-back-btn">
                ← ត្រឡប់ក្រោយ
            </Link>
            <h3>ដំណាក់កាល</h3>
            <ol>
                {steps.map((label, index) => (
                    <li key={label}>
                        <button
                            type="button"
                            className={`wb-step-btn${index === currentStep ? " is-active" : ""}`}
                            onClick={() => onSelect(index)}
                        >
                            <span className="wb-step-num">{index + 1}</span>
                            {label}
                        </button>
                    </li>
                ))}
            </ol>
        </aside>
    );
}
