/**
 * Default values used when starting a brand-new wedding draft.
 */
export const defaultWeddingData = {
    templateId: "royal",
    slug: "",
    couple: {
        groom: "",
        bride: "",
    },
    event: {
        date: "",
        ceremonyTime: "",
        receptionTime: "",
        venueName: "",
        venueAddress: "",
    },
    story: "",
    gallery: [],
    rsvp: {
        enabled: true,
        deadline: "",
    },
};

export default defaultWeddingData;
