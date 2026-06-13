/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
import "./DatePicker.css";

const KHMER_MONTHS = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
];

const KHMER_DAYS = ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

/**
 * DatePicker — Khmer-language date picker that emits "YYYY-MM-DD" string.
 * Same UI style as TimePicker.
 */
export function DatePicker({ value, onChange, placeholder = "ជ្រើសកាលបរិច្ឆេទ" }) {
    const today = new Date();
    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!value) return;
        const [y, m] = value.split("-").map(Number);
        setViewYear(y);
        setViewMonth(m - 1);
    }, [value]);

    const selectedDay = value ? parseInt(value.split("-")[2], 10) : null;
    const selectedMonth = value ? parseInt(value.split("-")[1], 10) - 1 : null;
    const selectedYear = value ? parseInt(value.split("-")[0], 10) : null;

    const displayValue = value
        ? `${parseInt(value.split("-")[2], 10)} ${KHMER_MONTHS[parseInt(value.split("-")[1], 10) - 1]} ${value.split("-")[0]}`
        : "";

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const selectDay = (day) => {
        const mm = String(viewMonth + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        onChange(`${viewYear}-${mm}-${dd}`);
        setOpen(false);
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const isSelected = (day) =>
        selectedDay === day && selectedMonth === viewMonth && selectedYear === viewYear;

    const isToday = (day) =>
        day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

    return (
        <div className="dp-wrap" ref={ref}>
            <button type="button" className={`dp-trigger${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
                <svg className="dp-cal-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={displayValue ? "dp-value" : "dp-placeholder"}>
                    {displayValue || placeholder}
                </span>
            </button>

            {open && (
                <div className="dp-dropdown">
                    <div className="dp-header">
                        <button type="button" className="dp-nav-btn" onClick={prevMonth}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="dp-month-year">
                            {KHMER_MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button type="button" className="dp-nav-btn" onClick={nextMonth}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="dp-weekdays">
                        {KHMER_DAYS.map((d) => (
                            <span key={d} className="dp-weekday">{d}</span>
                        ))}
                    </div>

                    <div className="dp-grid">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <span key={`empty-${i}`} className="dp-cell dp-empty" />
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <button
                                key={day}
                                type="button"
                                className={`dp-cell dp-day${isSelected(day) ? " selected" : ""}${isToday(day) ? " today" : ""}`}
                                onClick={() => selectDay(day)}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <div className="dp-actions">
                        <button type="button" className="dp-btn-today" onClick={() => {
                            const mm = String(today.getMonth() + 1).padStart(2, "0");
                            const dd = String(today.getDate()).padStart(2, "0");
                            onChange(`${today.getFullYear()}-${mm}-${dd}`);
                            setOpen(false);
                        }}>
                            ថ្ងៃនេះ
                        </button>
                        <button type="button" className="dp-btn-cancel" onClick={() => setOpen(false)}>
                            បោះបង់
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DatePicker;
