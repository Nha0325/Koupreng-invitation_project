import { useEffect, useState } from "react";

/**
 * Returns days/hours/minutes/seconds until the given target date.
 * Defaults to 13 September 2026 16:00 (Asia/Phnom_Penh ~ UTC+7).
 */
export default function useCountdown(target = new Date("2026-09-13T16:00:00+07:00")) {
    // Ensure target is a valid Date object (handles string, number, undefined, etc.)
    const targetDate = target instanceof Date ? target : new Date(target || "2026-09-13T16:00:00+07:00");
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const diff = Math.max(0, targetDate.getTime() - now.getTime());
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);

    const pad = (n) => String(n).padStart(2, "0");
    return { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
}
