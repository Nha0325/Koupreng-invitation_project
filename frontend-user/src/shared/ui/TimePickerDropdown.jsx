const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const Chevron = () => (
    <svg className="tp-chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
);

const Select = ({ value, onChange, options }) => (
    <div className="tp-select-wrap">
        <select className="tp-select" value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <Chevron />
    </div>
);

/**
 * TimePickerDropdown — internal dropdown for TimePicker.
 * Accepts labels: { title, hour, minute, period, morning, evening, cancel, confirm }
 */
export function TimePickerDropdown({
    hour, setHour, minute, setMinute, period, setPeriod,
    morningLabel = "ព្រឹក", eveningLabel = "ល្ងាច",
    labels = {},
    onConfirm, onCancel
}) {
    const periods = [morningLabel, eveningLabel];

    return (
        <div className="tp-dropdown">
            <p className="tp-dropdown-title">{labels.title ?? "ជ្រើសម៉ោង"}</p>
            <div className="tp-row-labels">
                <span>{labels.hour ?? "ម៉ោង"}</span>
                <span>{labels.minute ?? "នាទី"}</span>
                <span>{labels.period ?? "ពេល"}</span>
            </div>
            <div className="tp-selects-row">
                <Select value={hour} onChange={setHour} options={hours} />
                <span className="tp-colon">:</span>
                <Select value={minute} onChange={setMinute} options={minutes} />
                <Select value={period} onChange={setPeriod} options={periods} />
            </div>
            <div className="tp-actions">
                <button type="button" className="tp-btn-cancel" onClick={onCancel}>{labels.cancel ?? "បោះបង់"}</button>
                <button type="button" className="tp-btn-confirm" onClick={onConfirm}>{labels.confirm ?? "កំណត់ម៉ោង"}</button>
            </div>
        </div>
    );
}
