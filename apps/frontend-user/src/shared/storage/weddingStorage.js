const KEY = "koupreng.wedding.drafts";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // localStorage may be full or disabled.
  }
}

function generateId() {
  return `wed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function listDrafts() {
  return Object.values(readAll()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function getDraft(draftId) {
  if (!draftId) return null;
  const all = readAll();
  return all[draftId] || null;
}

export function getDraftBySlug(slug) {
  if (!slug) return null;
  const all = readAll();
  return Object.values(all).find((draft) => draft.slug === slug) || null;
}

export function saveDraft(draft) {
  const all = readAll();
  const id = draft.id || generateId();
  const next = { ...draft, id, updatedAt: Date.now() };
  all[id] = next;
  writeAll(all);
  return next;
}

export function deleteDraft(draftId) {
  const all = readAll();
  delete all[draftId];
  writeAll(all);
}

export function createDraft(initial = {}) {
  return saveDraft({
    templateId: initial.templateId || "garden-royal-khmer-wedding",
    slug: initial.slug || "",
    couple: {
      groom: "",
      bride: "",
      groomNickname: "",
      brideNickname: "",
      groomIntro: "",
      brideIntro: "",
      groomParents: "",
      brideParents: "",
      ...initial.couple,
    },
    event: {
      title: "",
      date: "",
      ceremonyTime: "",
      receptionTime: "",
      venueName: "",
      venueAddress: "",
      mapLink: "",
      ...initial.event,
    },
    contact: { phone: "", telegram: "", email: "", facebook: "", ...initial.contact },
    message: initial.message || "",
    story: initial.story || "",
    storyChapters: initial.storyChapters || [],
    schedule: initial.schedule || [],
    party: initial.party || [],
    gift: initial.gift || [],
    faq: initial.faq || [],
    design: {
      monogramText: "",
      primaryColor: "#6F1D2B",
      accentColor: "#C99A3D",
      openingStyle: "khmer-royal",
      openingOverlayOpacity: 0.48,
      frameStyle: "double-gold",
      ornamentStyle: "khmer-corner-01",
      ornamentTheme: "royal-floral",
      ...initial.design,
    },
    opening: {
      heading: "សិរីមង្គលអាពាហ៍ពិពាហ៍",
      invitationText: "យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ",
      genericGuestText: "លោកអ្នក និងក្រុមគ្រួសារ",
      openButtonText: "បើកសំបុត្រអញ្ជើញ",
      ...initial.opening,
    },
    enabledSections: {
      countdown: true,
      story: true,
      gallery: true,
      schedule: true,
      map: true,
      party: true,
      dressCode: true,
      gift: true,
      wish: true,
      faq: true,
      rsvp: true,
      ...initial.enabledSections,
    },
    coverImage: initial.coverImage || "",
    gallery: initial.gallery || [],
    openingVideo: initial.openingVideo || null,
    openingVideoEnabled: initial.openingVideoEnabled ?? Boolean(initial.openingVideo),
    pendingMedia: initial.pendingMedia || {},
    rsvp: { enabled: true, deadline: "", ...initial.rsvp },
    extras: {
      playlistLink: "",
      videoLink: "",
      giftInfo: "",
      accommodationInfo: "",
      transportationNote: "",
      guestNote: "",
      languageNote: "",
      languageMode: "both",
      storyTextEn: "",
      ...initial.extras,
    },
    ...initial,
  });
}

export default {
  listDrafts,
  getDraft,
  getDraftBySlug,
  saveDraft,
  deleteDraft,
  createDraft,
};
