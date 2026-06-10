# Koupreng Wedding Template QA Checklists

This document contains manual QA checklists for validating both the **Garden Royal Khmer Wedding** and the **Royal Khmer Wedding** templates.

---

# Garden Royal Khmer Wedding Template QA Checklist

Manual checklist for validating the **Garden Royal Khmer Wedding** template (`garden-royal-khmer-wedding`).

## 1. Builder & Customization Flow
- [ ] **Open Template Detail**:
  - [ ] Navigate to the template selection catalog.
  - [ ] Find the "Garden Royal Khmer Wedding" template card (labeled "សួនរាជហង្សខ្មែរ").
  - [ ] Click "Use this template" or preview option.
- [ ] **Fill Khmer Event Data**:
  - [ ] Set Groom: វណ្ណដា, Bride: ស្រីពេជ្រ.
  - [ ] Fill parent names (Groom parents: លោក សាន រឿន & លោកស្រី យ៉េន សុផា; Bride mother: លោកស្រី ប៊ូ សុផា).
  - [ ] Set location details to "ដឹប្រីមៀលែនដ៍ សែនសុខ (អគារ A)".
- [ ] **Fill English Story**:
  - [ ] In the Story section, add the English story text: "Our journey began at university in Australia, where destiny brought us together...".
- [ ] **Upload Cover Image & Gallery Images**:
  - [ ] Upload a custom watercolor cover photo.
  - [ ] Upload at least two gallery images.
- [ ] **Preview**:
  - [ ] Click the "Preview" button.
  - [ ] Verify that the mobile device frame renders the exact watercolor landscape, leaf canopy, side flower borders, and bottom flowers with the peacock accent.
  - [ ] Verify that the center monogram crest display is showing initials "V & P" dynamically derived from the names or entered custom text, overlaying the blue name ribbon.
- [ ] **Save Draft**:
  - [ ] Click "Save Draft".
  - [ ] Verify that navigating away and reloading preserves all inputs.
- [ ] **Publish**:
  - [ ] Click "Publish".
  - [ ] Verify database status shifts to `PUBLISHED`.
- [ ] **Copy Link**:
  - [ ] Copy the generated link and verify that it contains the invitation slug rather than a raw database ID.

## 2. Public Invitation Page
- [ ] **Open Public Link**:
  - [ ] Open the copied slug link in an incognito window.
  - [ ] Verify the page loads the customized **Garden Royal Khmer Wedding** layout.
- [ ] **Mobile 360px Test**:
  - [ ] Inspect the page and set the responsive width to 360px.
  - [ ] Verify that there is no horizontal overflow.
- [ ] **Desktop Test**:
  - [ ] Verify that cards center correctly and look balanced on desktop screens.
- [ ] **Map Link**:
  - [ ] Click the "Direction" button in the bottom quick actions bar or venue section.
  - [ ] Verify it opens Google Maps with the correct location.
- [ ] **RSVP Submit**:
  - [ ] Submit an RSVP response.
  - [ ] Verify that the blessing message is saved.
- [ ] **Duplicate RSVP Prevention**:
  - [ ] Try submitting another RSVP with the same name.
  - [ ] Verify that duplicate submissions are handled cleanly or updated instead of creating duplicate records.
- [ ] **Wishes Wall**:
  - [ ] Verify the submitted blessing message immediately renders in the Wishes Wall list.
- [ ] **Music Button**:
  - [ ] Verify background music is paused initially.
  - [ ] Click the toggle button to play and verify that audio starts loop playing.
- [ ] **Gift Section**:
  - [ ] Verify the gift panel renders bank details (ABA, Account Name, Account Number) and a QR code overlay properly.
  - [ ] Verify clicking "ចុចផ្ញើចំណងដៃ" operates correctly.
- [ ] **Private Invitation Access**:
  - [ ] Restrict invitation access to PRIVATE and set a password.
  - [ ] Verify that the public link prompts for a password and unlocks the page successfully when input.
- [ ] **Missing Optional Data Empty States**:
  - [ ] Save an invitation without story chapters or maps.
  - [ ] Verify these optional sections are hidden without layout breaks.

---

# Royal Khmer Wedding Template QA Checklist

Manual checklist for validating the **Royal Khmer Wedding** template (`royal-khmer-wedding`).

## 1. Builder & Customization Flow
- [ ] **Open Template Detail**:
  - [ ] Navigate to the template selection grid.
  - [ ] Locate the "Royal Khmer Wedding" template card (labeled "រាជហង្សខ្មែរ").
  - [ ] Click "Use this template" or preview option.
- [ ] **Fill Form**:
  - [ ] Modify couple details (Groom: សុវណ្ណ, Bride: បុប្ផា).
  - [ ] Set Event Date & times.
  - [ ] Set Venue name & address.
  - [ ] Add Google Maps URL.
  - [ ] Upload at least one cover image & gallery image.
  - [ ] Toggle sections (Story, Gallery, Timeline).
  - [ ] Choose primary color `#FFF8F0` and accent `#C8A24A`.
- [ ] **Preview**:
  - [ ] Click the "Preview" button.
  - [ ] Verify that the preview loads a mobile device frame rendering the exact template design.
  - [ ] Verify that typography (Playfair Display for English, Noto Sans Khmer or Hanuman for Khmer) is correctly applied.
- [ ] **Save Draft**:
  - [ ] Click "Save Draft".
  - [ ] Verify success notification.
- [ ] **Reload Draft**:
  - [ ] Refresh the page or navigate away and back to the draft builder.
  - [ ] Verify all customized inputs are preserved.
- [ ] **Publish**:
  - [ ] Click "Publish".
  - [ ] Verify database state changes from `DRAFT` to `PUBLISHED` (via visual check or public page access).
- [ ] **Copy Link**:
  - [ ] Click "Copy Invitation Link".
  - [ ] Verify clipboard receives the slug-based URL (e.g. `http://.../invitation/wedding-of-sovann-bopha`).

## 2. Public Invitation Page
- [ ] **Open Public Link**:
  - [ ] Open the copied URL in an incognito window or separate browser session.
  - [ ] Verify it loads the **Royal Khmer Wedding** layout instead of the default layout.
- [ ] **Mobile 360px Test**:
  - [ ] Open developer tools, select responsive mode, and resize to 360px width.
  - [ ] Verify there is no horizontal scroll or layout break.
- [ ] **Khmer Text Test**:
  - [ ] Verify Khmer fonts render beautifully without glyph truncation.
  - [ ] Verify localized text content (កូនក្រមុំ, កូនកំលោះ, ទីតាំង, ឆ្លើយតប) aligns correctly.
- [ ] **English Text Test**:
  - [ ] Toggle language to English (EN).
  - [ ] Verify Playfair Display / Cormorant Garamond is applied to English couple names.
- [ ] **Map Link Test**:
  - [ ] Locate the venue details card and bottom sticky bar.
  - [ ] Click the "Direction" button.
  - [ ] Verify it opens Google Maps with the correct coordinates/search query.
- [ ] **Gallery Empty State**:
  - [ ] Create an invitation without uploading any gallery images.
  - [ ] Verify that the gallery section handles this case gracefully (empty state placeholder in Khmer/English).
- [ ] **Music Button Test**:
  - [ ] Verify background music does NOT autoplay on page load.
  - [ ] Click the music play button.
  - [ ] Verify music starts playing, and clicking it again pauses it.

## 3. RSVP & Interactions
- [ ] **RSVP Submission**:
  - [ ] Fill the public RSVP form (Name, Attending status, count, and blessing message).
  - [ ] Click "Submit RSVP".
  - [ ] Verify the success panel is displayed.
- [ ] **Wishes Wall / Blessings**:
  - [ ] Verify that the blessing message submitted in the RSVP form is immediately displayed on the Wishes Wall section.
  - [ ] Verify duplicate RSVP attempts are handled or prevented gracefully.
- [ ] **Private Invitation Access**:
  - [ ] Set invitation visibility to PRIVATE and set an access password.
  - [ ] Open the public URL.
  - [ ] Verify the "Protected Gate" login card is shown.
  - [ ] Input wrong password and verify error is shown.
  - [ ] Input correct password and verify the invitation renders successfully.
