const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const periods = ["ព្រឹក", "ល្ងាច"];

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

export function TimePickerDropdown({ hour, setHour, minute, setMinute, period, setPeriod, onConfirm, onCancel }) {
    return (
        <div className="tp-dropdown">
            <p className="tp-dropdown-title">ជ្រើសម៉ោង</p>
            <div className="tp-row-labels">
                <span>ម៉ោង</span><span>នាទី</span><span>ពេល</span>
            </div>
            <div className="tp-selects-row">
                <Select value={hour} onChange={setHour} options={hours} />
                <span className="tp-colon">:</span>
                <Select value={minute} onChange={setMinute} options={minutes} />
                <Select value={period} onChange={setPeriod} options={periods} />
            </div>
            <div className="tp-actions">
                <button type="button" className="tp-btn-cancel" onClick={onCancel}>បោះបង់</button>
                <button type="button" className="tp-btn-confirm" onClick={onConfirm}>កំណត់ម៉ោង</button>
            </div>
        </div>
    );
}

// Re-export within TimePicker via barrel — but easier: import from this module.
