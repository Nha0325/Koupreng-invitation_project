import { useMemo } from "react";
import { SEND_STATUS } from "../model/guestConstants";

export default function GuestStats({ guests = [], t }) {
  const stats = useMemo(() => {
    let totalCount = 0;
    let totalSeats = 0;
    let sentCount = 0;
    let respondedCount = 0;

    for (const g of guests) {
      const normalizedSendStatus = String(g.sendStatus || "").toUpperCase();
      totalCount += 1;
      totalSeats += Math.max(1, Number(g.count) || 1);
      if (
        g.sendStatus === SEND_STATUS.sent
        || g.sendStatus === SEND_STATUS.opened
        || normalizedSendStatus === "SENT"
        || normalizedSendStatus === "OPENED"
      ) {
        sentCount += 1;
      }
      if (g.rsvpStatus || g.sendStatus === SEND_STATUS.responded) {
        respondedCount += 1;
      }
    }

    return { totalCount, totalSeats, sentCount, respondedCount };
  }, [guests]);

  return (
    <section className="pe-summary-grid">
      <article className="pe-summary-card">
        <span>{t ? t("statTotalGuests") : "ភ្ញៀវសរុប"}</span>
        <strong>{stats.totalCount}</strong>
      </article>
      <article className="pe-summary-card">
        <span>{t ? t("statTotalSeats") : "ចំនួនកៅអី/មនុស្ស"}</span>
        <strong>{stats.totalSeats}</strong>
      </article>
      <article className="pe-summary-card">
        <span>{t ? t("statSent") : "បានផ្ញើ"}</span>
        <strong>{stats.sentCount}</strong>
      </article>
      <article className="pe-summary-card">
        <span>{t ? t("statResponded") : "បានឆ្លើយតប"}</span>
        <strong>{stats.respondedCount}</strong>
      </article>
    </section>
  );
}
