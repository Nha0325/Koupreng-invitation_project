import { useState, useRef, useEffect } from "react";
import "./TimePicker.css";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const periods = ["ព្រឹក", "ល្ងាច"];

function TimePicker({ value, onChange, placeholder = "ជ្រើសម៉ោង" }) {
    const [open, setOpen] = useState(false);
    const [hour, setHour] = useState("05");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("ល្ងាច");
    const ref = useRef();

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Parse incoming value "HH:MM" 24h
    useEffect(() => {
        if (!value) return;
        const [h, m] = value.split(":");
        const hNum = parseInt(h, 10);
        setPeriod(hNum >= 12 ? "ល្ងាច" : "ព្រឹក");
        const h12 = hNum % 12 || 12;
        setHour(String(h12).padStart(2, "0"));
        setMinute(m || "00");
    }, [value]);

    const displayValue = value
        ? `${hour}:${minute} ${period}`
        : "";

    const handleConfirm = () => {
        // Convert to 24h for the value
        let h = parseInt(hour, 10);
        if (period === "ល្ងាច" && h !== 12) h += 12;
        if (period === "ព្រឹក" && h === 12) h = 0;
        const val24 = `${String(h).padStart(2, "0")}:${minute}`;
        onChange(val24);
        setOpen(false);
    };

    const handleCancel = () => setOpen(false);

    return (
        <div className="tp-wrap" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                className={`tp-trigger${open ? " open" : ""}`}
                onClick={() => setOpen((o) => !o)}
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
                                value={hour}
                                onChange={(e) => setHour(e.target.value)}
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
                                value={minute}
                                onChange={(e) => setMinute(e.target.value)}
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
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
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
