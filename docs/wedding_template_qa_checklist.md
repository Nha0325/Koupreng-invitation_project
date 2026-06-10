# Garden Royal Khmer Wedding QA Checklist

Template: `garden-royal-khmer-wedding`

## Template Catalog

- [ ] Open the template catalog.
- [ ] Confirm the Garden Royal Khmer Wedding card appears with the garden cover image.
- [ ] Open the template detail/demo page.
- [ ] Confirm the demo renders through `TemplateExperience` with the Garden Royal variant.

## Wedding Builder Draft Flow

- [ ] Click "Use this template".
- [ ] Fill groom and bride names.
- [ ] Fill groom and bride nicknames.
- [ ] Fill groom and bride parent names.
- [ ] Fill Khmer story text.
- [ ] Fill English story text and switch language mode to Khmer + English.
- [ ] Fill event date, ceremony time, and reception time.
- [ ] Fill venue name, venue address, and Google Maps link.
- [ ] Upload a cover image.
- [ ] Upload gallery images.
- [ ] Choose background music.
- [ ] Add schedule/timeline items.
- [ ] Add gift bank account fields.
- [ ] Toggle countdown, story, gallery, timeline, venue/map, gift, FAQ, and RSVP sections.
- [ ] Preview in the phone frame and verify the preview uses the same shared `TemplateExperience` renderer.
- [ ] Save draft and reload it from the dashboard.
- [ ] Publish the local draft.
- [ ] Copy the public slug link.

## Backend Invitation Flow

- [ ] Create an invitation from the backend-backed invitation form using the Garden Royal template row.
- [ ] Fill event type, event date/time, venue, Google Maps URL, groom/bride names, story, RSVP deadline, language mode, and visibility.
- [ ] Save as draft.
- [ ] Preview the invitation.
- [ ] Publish the invitation.
- [ ] Open `/w/{slug}` and confirm Garden Royal backend invitations render through `TemplateExperience`.
- [ ] Submit RSVP.
- [ ] Confirm a submitted message appears in the wishes wall.
- [ ] Test duplicate RSVP behavior with the same email or phone.
- [ ] Test private/token/password-protected access according to the existing backend visibility behavior.

## Visual QA

- [ ] Compare page 1 source PDF: leaf canopy, side floral color, monogram crest, name ribbon, blue CTA, bottom garden mood.
- [ ] Compare page 2 source PDF: formal Khmer wording, schedule, venue/map, story, gift, RSVP, footer.
- [ ] Test mobile width `360px`.
- [ ] Confirm there is no horizontal overflow.
- [ ] Test desktop width and confirm cards stay centered and readable.
- [ ] Confirm Khmer text renders without clipping.
- [ ] Confirm optional empty story, gallery, schedule, map, gift, and FAQ sections hide cleanly.
