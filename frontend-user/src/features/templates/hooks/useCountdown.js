/**
 * កំណត់ចំណាំ: countdown
 * ឯកសារ: src/features/templates/hooks/useCountdown.js
 * ចាស់: ./hooks/useCountdown.js
 */
import { useEffect, useMemo, useState } from "react";

const DEFAULT_TARGET = "2026-12-19T17:00:00+07:00";

function getRemaining(targetDate) {
    const target = new Date(targetDate || DEFAULT_TARGET).getTime();
    const distance = Math.max(0, target - Date.now());

    return {
        d: String(Math.floor(distance / 86400000)).padStart(2, "0"),
        h: String(Math.floor((distance / 3600000) % 24)).padStart(2, "0"),
        m: String(Math.floor((distance / 60000) % 60)).padStart(2, "0"),
        s: String(Math.floor((distance / 1000) % 60)).padStart(2, "0"),
    };
}

export default function useCountdown(targetDate = DEFAULT_TARGET) {
    const stableTarget = useMemo(() => targetDate || DEFAULT_TARGET, [targetDate]);
    const [remaining, setRemaining] = useState(() => getRemaining(stableTarget));

    useEffect(() => {
        const refreshTimer = window.setTimeout(() => {
            setRemaining(getRemaining(stableTarget));
        }, 0);
        const timer = window.setInterval(() => {
            setRemaining(getRemaining(stableTarget));
        }, 1000);

        return () => {
            window.clearTimeout(refreshTimer);
            window.clearInterval(timer);
        };
    }, [stableTarget]);

    return remaining;
}
