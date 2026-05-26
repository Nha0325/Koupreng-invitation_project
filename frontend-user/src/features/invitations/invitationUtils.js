export const EVENT_TYPE_LABELS = {
    WEDDING: "Wedding",
    ENGAGEMENT: "Engagement",
    BIRTHDAY: "Birthday",
    ANNIVERSARY: "Anniversary",
    CORPORATE: "Corporate",
    OTHER: "Other",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});

export function formatDate(value) {
    if (!value) return "Date to be announced";
    return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export function formatTime(value) {
    if (!value) return "";
    const [hourText, minute = "00"] = value.split(":");
    const hour = Number(hourText);
    if (Number.isNaN(hour)) return value;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.padStart(2, "0")} ${period}`;
}
