const INVITATION_UPDATE_FIELDS = [
  "templateId",
  "organizationId",
  "title",
  "eventType",
  "eventDate",
  "eventTime",
  "venueName",
  "venueAddress",
  "googleMapUrl",
  "hostName",
  "partnerName",
  "groomName",
  "brideName",
  "languageMode",
  "designJson",
  "contentJson",
  "customColors",
  "customFonts",
  "enabledSections",
  "layoutSettings",
  "visibility",
  "rsvpDeadline",
];

export function toInvitationStoryUpdate(invitation, storyText) {
  const payload = {};

  INVITATION_UPDATE_FIELDS.forEach((field) => {
    if (invitation?.[field] !== undefined) {
      payload[field] = invitation[field];
    }
  });

  return {
    ...payload,
    storyText: storyText.trim(),
  };
}
