# Garden Royal Khmer Wedding Template QA Checklist

This document provides a manual checklist for validating the **Garden Royal Khmer Wedding** template (`garden-royal-khmer-wedding`) within the Koupreng E-Invitation Platform.

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
