import { useRef, useEffect } from "react";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const PRESETS = [
    { label: "07:00 ព្រឹក", hour: "07", minute: "00", period: "ព្រឹក", desc: "ពិធីពេលព្រឹក" },
    { label: "11:30 ព្រឹក", hour: "11", minute: "30", period: "ព្រឹក", desc: "អាហារថ្ងៃត្រង់" },
    { label: "05:00 ល្ងាច", hour: "05", minute: "00", period: "ល្ងាច", desc: "ទទួលភ្ញៀវពេលល្ងាច" },
    { label: "06:00 ល្ងាច", hour: "06", minute: "00", period: "ល្ងាច", desc: "ពិសារភោជនាហារ" },
];

export function TimePickerDropdown({
    hour,
    setHour,
    minute,
    setMinute,
    period,
    setPeriod,
    onConfirm,
    onCancel,
}) {
    const hourListRef = useRef(null);
    const minuteListRef = useRef(null);

    // Smooth scroll to selected items when dropdown opens
    useEffect(() => {
        const scrollToActive = () => {
            const activeHour = hourListRef.current?.querySelector(".tp-item.active");
            if (activeHour) {
                activeHour.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            const activeMin = minuteListRef.current?.querySelector(".tp-item.active");
            if (activeMin) {
                activeMin.scrollIntoView({ block: "center", behavior: "smooth" });
            }
        };
        const timer = setTimeout(scrollToActive, 60);
        return () => clearTimeout(timer);
    }, []);

    const handlePresetClick = (p) => {
        setHour(p.hour);
        setMinute(p.minute);
        setPeriod(p.period);
        setTimeout(() => {
            const activeHour = hourListRef.current?.querySelector(".tp-item.active");
            activeHour?.scrollIntoView({ block: "center", behavior: "smooth" });
            const activeMin = minuteListRef.current?.querySelector(".tp-item.active");
            activeMin?.scrollIntoView({ block: "center", behavior: "smooth" });
        }, 50);
    };

    return (
        <div className="tp-dropdown" onClick={(e) => e.stopPropagation()}>
            {/* 1. Header: Title & Digital Preview */}
            <div className="tp-header">
                <div className="tp-title-row">
                    <span className="tp-title">ជ្រើសម៉ោង</span>
                    <div className="tp-digital-preview">
                        <span className="tp-preview-num">{hour}:{minute}</span>
                        <span className="tp-preview-period">{period}</span>
                    </div>
                </div>

                {/* 2. Period Toggle Switch (ព្រឹក / ល្ងាច) */}
                <div className="tp-period-segmented">
                    <button
                        type="button"
                        className={`tp-period-btn ${period === "ព្រឹក" ? "active" : ""}`}
                        onClick={() => setPeriod("ព្រឹក")}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                        <span>ព្រឹក (AM)</span>
                    </button>
                    <button
                        type="button"
                        className={`tp-period-btn ${period === "ល្ងាច" ? "active" : ""}`}
                        onClick={() => setPeriod("ល្ងាច")}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        <span>ល្ងាច (PM)</span>
                    </button>
                </div>
            </div>

            {/* 3. Quick Minute Jump Chips */}
            <div className="tp-quick-minutes">
                <span className="tp-quick-label">នាទី:</span>
                {["00", "15", "30", "45"].map((m) => (
                    <button
                        key={m}
                        type="button"
                        className={`tp-quick-chip ${minute === m ? "active" : ""}`}
                        onClick={() => {
                            setMinute(m);
                            setTimeout(() => {
                                const activeMin = minuteListRef.current?.querySelector(".tp-item.active");
                                activeMin?.scrollIntoView({ block: "center", behavior: "smooth" });
                            }, 50);
                        }}
                    >
                        :{m}
                    </button>
                ))}
            </div>

            {/* 4. Two Scrollable Columns: Hour & Minute */}
            <div className="tp-columns-wrap">
                {/* Hours */}
                <div className="tp-col">
                    <div className="tp-col-header">ម៉ោង</div>
                    <div className="tp-col-scroll" ref={hourListRef}>
                        {HOURS.map((h) => (
                            <button
                                key={h}
                                type="button"
                                className={`tp-item ${hour === h ? "active" : ""}`}
                                onClick={() => setHour(h)}
                            >
                                {h}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tp-col-divider">:</div>

                {/* Minutes */}
                <div className="tp-col">
                    <div className="tp-col-header">នាទី</div>
                    <div className="tp-col-scroll" ref={minuteListRef}>
                        {MINUTES.map((m) => (
                            <button
                                key={m}
                                type="button"
                                className={`tp-item ${minute === m ? "active" : ""}`}
                                onClick={() => setMinute(m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Common Event Presets */}
            <div className="tp-presets-section">
                <div className="tp-presets-title">ម៉ោងពេញនិយម</div>
                <div className="tp-presets-grid">
                    {PRESETS.map((p) => {
                        const isSelected = hour === p.hour && minute === p.minute && period === p.period;
                        return (
                            <button
                                key={p.label}
                                type="button"
                                className={`tp-preset-card ${isSelected ? "active" : ""}`}
                                onClick={() => handlePresetClick(p)}
                            >
                                <span className="tp-preset-time">{p.label}</span>
                                <span className="tp-preset-desc">{p.desc}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 6. Action Buttons */}
            <div className="tp-actions">
                <button type="button" className="tp-btn-cancel" onClick={onCancel}>
                    បោះបង់
                </button>
                <button type="button" className="tp-btn-confirm" onClick={onConfirm}>
                    កំណត់ម៉ោង
                </button>
            </div>
        </div>
    );
}

export default TimePickerDropdown;
