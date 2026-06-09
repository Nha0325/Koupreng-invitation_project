/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { TimePickerDropdown } from "./TimePickerDropdown";
import "./TimePicker.css";

/**
 * TimePicker — 12h time picker that emits a 24h "HH:MM" string.
 * Defaults to Khmer labels; pass `labels` prop to override.
 *
 * labels: { placeholder, period: { morning, evening } }
 */
export function TimePicker({ value, onChange, placeholder = "ជ្រើសម៉ោង", labels = {} }) {
    const [open, setOpen] = useState(false);
    const [hour, setHour] = useState("05");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("ល្ងាច");
    const ref = useRef();

    useClickOutside(ref, () => setOpen(false));

    const morningLabel = labels.morning ?? "ព្រឹក";
    const eveningLabel = labels.evening ?? "ល្ងាច";

    useEffect(() => {
        if (!value) return;
        const [h, m] = value.split(":");
        const hNum = parseInt(h, 10);
        setPeriod(hNum >= 12 ? eveningLabel : morningLabel);
        const h12 = hNum % 12 || 12;
        setHour(String(h12).padStart(2, "0"));
        setMinute(m || "00");
    }, [value, morningLabel, eveningLabel]);

    const displayValue = value ? `${hour}:${minute} ${period}` : "";

    const handleConfirm = () => {
        let h = parseInt(hour, 10);
        if (period === eveningLabel && h !== 12) h += 12;
        if (period === morningLabel && h === 12) h = 0;
        const val24 = `${String(h).padStart(2, "0")}:${minute}`;
        onChange(val24);
        setOpen(false);
    };

    return (
        <div className="tp-wrap" ref={ref}>
            <button type="button" className={`tp-trigger${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
                <svg className="tp-clock-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={displayValue ? "tp-value" : "tp-placeholder"}>
                    {displayValue || (labels.placeholder ?? placeholder)}
                </span>
            </button>

            {open && <TimePickerDropdown
                hour={hour} setHour={setHour}
                minute={minute} setMinute={setMinute}
                period={period} setPeriod={setPeriod}
                morningLabel={morningLabel} eveningLabel={eveningLabel}
                labels={labels}
                onConfirm={handleConfirm} onCancel={() => setOpen(false)} />}
        </div>
    );
}

export default TimePicker;
