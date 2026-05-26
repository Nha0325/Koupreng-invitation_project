export function buildInvitationData(draft) {
  return {
    templateId: draft?.templateId || "royal",
    groom: draft?.couple?.groom || "",
    bride: draft?.couple?.bride || "",
    date: draft?.event?.date || "",
    ceremonyTime: draft?.event?.ceremonyTime || "",
    receptionTime: draft?.event?.receptionTime || "",
    venueName: draft?.event?.venueName || "",
    venueAddress: draft?.event?.venueAddress || "",
    mapLink: draft?.event?.mapLink || "",
    contactPhone: draft?.contact?.phone || "",
    story: draft?.story || "",
    gallery: draft?.gallery || [],
    rsvp: draft?.rsvp || {
      enabled: true,
      deadline: "",
    },
    extras: draft?.extras || {},
  };
}
