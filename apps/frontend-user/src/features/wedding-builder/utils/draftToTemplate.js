import { getTemplateById } from "../../templates/data/templatesData";
import { resolveVariant } from "../../templates/template-experience/templateExperienceThemes";

function displayDate(date) {
    if (!date) return "";
    try {
        return new Intl.DateTimeFormat("km-KH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(`${date}T00:00:00`));
    } catch {
        return date;
    }
}

function initials(couple = {}) {
    const groom = couple.groomNickname || couple.groom || "";
    const bride = couple.brideNickname || couple.bride || "";
    if (!groom && !bride) return "";
    return [groom.trim().charAt(0), bride.trim().charAt(0)].filter(Boolean).join(" & ");
}

/**
 * draftToTemplate — merge a host's wedding draft (+ uploaded gallery) onto the
 * chosen base template, producing the `tpl` object the shared
 * TemplateExperience engine reads.
 *
 * This is the single source of truth for the draft → preview mapping so every
 * surface that previews a draft (builder phone frame, dashboard "មើលជាមុន",
 * full-page preview) renders identically through TemplateExperience.
 *
 * @param {object} draft   wedding draft (see services/weddingStorage shape)
 * @param {Array}  gallery uploaded gallery items ({ preview, type, ... })
 * @returns {{ tpl: object, variant: string } | null} null when draft/template missing
 */
export function draftToTemplate(draft, gallery = []) {
    if (!draft?.templateId) return null;

    const baseTpl = getTemplateById(draft.templateId);
    if (!baseTpl) return null;

    // Prefer the host's uploaded photos; fall back to the template's own images.
    const uploadedImages = (gallery || [])
        .filter((item) => item?.preview && item.type !== "video")
        .map((item) => item.preview);

    const targetDate = draft.event?.date
        ? new Date(`${draft.event.date}T${draft.event.ceremonyTime || "17:00"}:00`).toISOString()
        : baseTpl.targetDate;

    const tpl = {
        ...baseTpl,
        groom: draft.couple?.groom || baseTpl.groom,
        bride: draft.couple?.bride || baseTpl.bride,
        monogramText: draft.design?.monogramText || draft.monogramText || initials(draft.couple) || baseTpl.monogramText,
        dateText: displayDate(draft.event?.date) || baseTpl.dateText,
        targetDate,
        ceremonyTime: draft.event?.ceremonyTime || baseTpl.ceremonyTime,
        receptionTime: draft.event?.receptionTime || baseTpl.receptionTime,
        venueName: draft.event?.venueName || baseTpl.venueName,
        venueAddress: draft.event?.venueAddress || baseTpl.venueAddress,
        mapQuery: draft.event?.mapLink || baseTpl.mapQuery,
        customMainImage: draft.coverImage || baseTpl.customMainImage,
        message: draft.message || draft.story || baseTpl.message,
        storyText: draft.story || "",
        dressCode: draft.dressCode || baseTpl.dressCode,
        design: draft.design || {},
        music: draft.music || baseTpl.music,
        openingVideo: draft.openingVideoEnabled === false ? null : draft.openingVideo,
        // Host-authored rich sections. Passed straight through so the content
        // builder can prefer them over its demo fallbacks (see hostContent).
        hostContent: {
            couple: draft.couple || {},
            contact: draft.contact || {},
            storyText: draft.story || "",
            storyTextEn: draft.extras?.storyTextEn || "",
            languageMode: draft.extras?.languageMode || "both",
            storyChapters: draft.storyChapters || [],
            schedule: draft.schedule || [],
            party: draft.party || [],
            gift: draft.gift || [],
            wishMessage: draft.extras?.guestNote || "",
            faq: draft.faq || [],
            enabledSections: {
                ...(draft.enabledSections || {}),
                rsvp: draft.rsvp?.enabled !== false && draft.enabledSections?.rsvp !== false,
            },
            eventTitle: draft.event?.title || "",
        },
        // When the host has uploaded photos, drive gallery + story from them.
        storyImages: uploadedImages.length ? uploadedImages : baseTpl.storyImages,
        storyCards: uploadedImages.length
            ? [{ id: `${draft.id}-uploads`, title: "Our Photos", images: uploadedImages }]
            : baseTpl.storyCards,
    };

    return { tpl, variant: resolveVariant(baseTpl) };
}
