export function Loading({ label = "កំពុងផ្ទុក..." }) {
    return (
        <div className="state" role="status" aria-live="polite">
            <div>
                <div className="spinner" />
                <span>{label}</span>
            </div>
        </div>
    );
}

export function ErrorState({ message = "មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ", onRetry }) {
    return (
        <div className="state state-error" role="alert">
            <div>
                <p>{message}</p>
                {onRetry && (
                    <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={onRetry}>
                        ព្យាយាមម្តងទៀត
                    </button>
                )}
            </div>
        </div>
    );
}

export function Empty({ label = "មិនមានទិន្នន័យ" }) {
    return <div className="state">{label}</div>;
}
