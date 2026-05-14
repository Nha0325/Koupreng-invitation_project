import { useState, useRef, useEffect } from "react";
import "./TimePicker.css";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const periods = ["ព្រឹក", "ល្ងាច"];

const parseTimeValue = (value) => {
    if (!value) {
        return { hour: "05", minute: "00", period: "ល្ងាច" };
    }

    const [h, m] = value.split(":");
    const hNum = parseInt(h, 10);
    const safeHour = Number.isNaN(hNum) ? 17 : hNum;
    const h12 = safeHour % 12 || 12;
    return {
        hour: String(h12).padStart(2, "0"),
        minute: m || "00",
        period: safeHour >= 12 ? "ល្ងាច" : "ព្រឹក",
    };
};

const TimePicker = ({ value, onChange, placeholder = "ជ្រើសម៉ោង" }) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(() => parseTimeValue(value));
    const ref = useRef();

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selectedTime = open ? draft : parseTimeValue(value);
    const displayValue = value
        ? `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`
        : "";

    const handleConfirm = () => {
        // Convert to 24h for the value
        let h = parseInt(draft.hour, 10);
        if (draft.period === "ល្ងាច" && h !== 12) h += 12;
        if (draft.period === "ព្រឹក" && h === 12) h = 0;
        const val24 = `${String(h).padStart(2, "0")}:${draft.minute}`;
        onChange(val24);
        setOpen(false);
    };

    const handleCancel = () => setOpen(false);
    const handleToggle = () => {
        if (!open) {
            setDraft(parseTimeValue(value));
        }
        setOpen((currentOpen) => !currentOpen);
    };

    return (
        <div className="tp-wrap" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                className={`tp-trigger${open ? " open" : ""}`}
                onClick={handleToggle}
            >
                <svg className="tp-clock-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={displayValue ? "tp-value" : "tp-placeholder"}>
                    {displayValue || placeholder}
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="tp-dropdown">
                    <p className="tp-dropdown-title">ជ្រើសម៉ោង</p>

                    <div className="tp-row-labels">
                        <span>ម៉ោង</span>
                        <span>នាទី</span>
                        <span>ពេល</span>
                    </div>

                    <div className="tp-selects-row">
                        {/* Hour */}
                        <div className="tp-select-wrap">
                            <select
                                className="tp-select"
                                value={draft.hour}
                                onChange={(e) => setDraft((current) => ({ ...current, hour: e.target.value }))}
                            >
                                {hours.map((h) => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                            <svg className="tp-chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <span className="tp-colon">:</span>

                        {/* Minute */}
                        <div className="tp-select-wrap">
                            <select
                                className="tp-select"
                                value={draft.minute}
                                onChange={(e) => setDraft((current) => ({ ...current, minute: e.target.value }))}
                            >
                                {minutes.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <svg className="tp-chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Period */}
                        <div className="tp-select-wrap">
                            <select
                                className="tp-select"
                                value={draft.period}
                                onChange={(e) => setDraft((current) => ({ ...current, period: e.target.value }))}
                            >
                                {periods.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <svg className="tp-chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="tp-actions">
                        <button type="button" className="tp-btn-cancel" onClick={handleCancel}>
                            បោះបង់
                        </button>
                        <button type="button" className="tp-btn-confirm" onClick={handleConfirm}>
                            កំណត់ម៉ោង
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TimePicker;
