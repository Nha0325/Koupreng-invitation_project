import useCountdown from "@/features/wedding-site/hooks/useCountdown";

/**
 * Shared Countdown primitive.
 * Computes days, hours, minutes, seconds from targetDate.
 */
export default function CountdownTimer({
  targetDate,
  className = "",
  labels = { days: "ថ្ងៃ", hours: "ម៉ោង", minutes: "នាទី", seconds: "វិនាទី" },
  renderCustom,
}) {
  const hasValidDate =
    targetDate != null && !Number.isNaN(new Date(targetDate).getTime());

  const countdown = useCountdown(hasValidDate ? targetDate : undefined);

  if (renderCustom) {
    return renderCustom(countdown, hasValidDate);
  }

  const cells = [
    { key: "days", label: labels.days || "ថ្ងៃ", value: countdown.d },
    { key: "hours", label: labels.hours || "ម៉ោង", value: countdown.h },
    { key: "minutes", label: labels.minutes || "នាទី", value: countdown.m },
    { key: "seconds", label: labels.seconds || "វិនាទី", value: countdown.s },
  ];

  return (
    <div className={`countdown-timer-root ${className}`} aria-label="ការរាប់ថយក្រោយ">
      {cells.map(({ key, label, value }) => (
        <div key={key} className="countdown-timer-cell">
          <span className="countdown-timer-val">{value}</span>
          <span className="countdown-timer-lbl">{label}</span>
        </div>
      ))}
    </div>
  );
}
