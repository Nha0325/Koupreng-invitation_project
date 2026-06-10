export function Loading({ label = "កំពុងផ្ទុក..." }) {
    return (
        <div className="state">
            <div className="spinner" />
            {label}
        </div>
    );
}

export function ErrorState({ message = "មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ", onRetry }) {
    return (
        <div className="state state-error">
            <p>⚠️ {message}</p>
            {onRetry && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry} style={{ marginTop: 10 }}>
                    ព្យាយាមម្តងទៀត
                </button>
            )}
        </div>
    );
}

export function Empty({ label = "មិនមានទិន្នន័យ" }) {
    return <div className="state">📭 {label}</div>;
}
