/**
 * កំណត់ចំណាំ: ម៉ូឌុល
 * ឯកសារ: src/shared/ui/Spinner.jsx
 */
/**
 * Spinner — minimal loading indicator.
 */
export function Spinner({ size = 24, className = "" }) {
    return (
        <span
            className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
            style={{ width: size, height: size }}
            role="status"
            aria-label="Loading"
        />
    );
}

export default Spinner;
