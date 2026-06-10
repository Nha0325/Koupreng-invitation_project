import { invitationService } from "../../../shared/services/invitationService";

function positiveNumber(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function emptyToNull(value) {
    if (value === undefined || value === null) {
        return null;
    }
    const text = String(value).trim();
    return text || null;
}

function normalizeTime(value) {
    const text = emptyToNull(value);
    if (!text) {
        return null;
    }
    const match = text.match(/^(\d{1,2}):(\d{2})/);
    if (!match) {
        return null;
    }
    return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function titleForDraft(draft) {
    const eventTitle = emptyToNull(draft?.event?.title);
    if (eventTitle) {
        return eventTitle;
    }
    const groom = emptyToNull(draft?.couple?.groom);
    const bride = emptyToNull(draft?.couple?.bride);
    if (groom && bride) {
        return `${groom} & ${bride}`;
    }
    return "Wedding invitation draft";
}

export function draftToInvitationPayload(draft) {
    const event = draft?.event || {};
    const couple = draft?.couple || {};
    const templateId = positiveNumber(draft?.templateBackendId || draft?.backendTemplateId);
    const hasStory = Boolean((draft?.story || "").trim())
        || (Array.isArray(draft?.storyChapters) && draft.storyChapters.length > 0);
    const content = {
        couple,
        event,
        contact: draft?.contact || {},
        message: draft?.message || "",
        story: draft?.story || "",
        storyChapters: draft?.storyChapters || [],
        schedule: draft?.schedule || [],
        party: draft?.party || [],
        gift: draft?.gift || [],
        faq: draft?.faq || [],
        gallery: draft?.gallery || [],
        rsvp: draft?.rsvp || {},
        extras: draft?.extras || {},
        templateId: draft?.templateId || null,
    };

    return {
        ...(templateId ? { templateId } : {}),
        title: titleForDraft(draft),
        eventType: "WEDDING",
        eventDate: emptyToNull(event.date),
        eventTime: normalizeTime(event.receptionTime || event.ceremonyTime),
        venueName: emptyToNull(event.venueName),
        venueAddress: emptyToNull(event.venueAddress),
        googleMapUrl: emptyToNull(event.mapLink),
        groomName: emptyToNull(couple.groom),
        brideName: emptyToNull(couple.bride),
        storyText: emptyToNull(draft?.story || draft?.message),
        languageMode: "km",
        designJson: JSON.stringify({
            templateId: draft?.templateId || null,
            gallery: draft?.gallery || [],
            openingVideo: draft?.openingVideo || null,
            openingVideoEnabled: Boolean(draft?.openingVideoEnabled),
        }),
        contentJson: JSON.stringify(content),
        enabledSections: JSON.stringify({
            story: hasStory,
            schedule: Array.isArray(draft?.schedule) && draft.schedule.length > 0,
            party: Array.isArray(draft?.party) && draft.party.length > 0,
            gift: Array.isArray(draft?.gift) && draft.gift.length > 0,
            faq: Array.isArray(draft?.faq) && draft.faq.length > 0,
            rsvp: draft?.rsvp?.enabled !== false,
        }),
        visibility: "PUBLIC",
        rsvpDeadline: emptyToNull(draft?.rsvp?.deadline),
    };
}

export function syncKeyForDraft(draft) {
    return JSON.stringify({
        backendInvitationId: draft?.backendInvitationId || null,
        payload: draftToInvitationPayload(draft),
    });
}

export async function saveWeddingDraftToBackend(draft) {
    const payload = draftToInvitationPayload(draft);
    const backendInvitationId = positiveNumber(draft?.backendInvitationId);
    return backendInvitationId
        ? invitationService.update(backendInvitationId, payload)
        : invitationService.create(payload);
}

export async function publishWeddingDraftToBackend(draft) {
    const saved = await saveWeddingDraftToBackend(draft);
    return invitationService.publish(saved.id);
}
