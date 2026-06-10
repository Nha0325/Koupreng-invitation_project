import SelectTemplateStep from "../steps/SelectTemplateStep";
import CoupleEventStep from "../steps/CoupleEventStep";
import VenueRsvpStep from "../steps/VenueRsvpStep";
import EnhancementsStep from "../steps/EnhancementsStep";
import ReviewPublishStep from "../steps/ReviewPublishStep";

/**
 * Builder steps — Flower-style 5-step flow (visual labels only; the step
 * components and store behavior are unchanged).
 *
 * Stepper:  01 Style · 02 Couple · 03 Place & RSVP · 04 Note · 05 Publish
 *
 * Mapping to existing steps (closest safe mapping — schedule fields live
 * inside the Couple step, which already collects couple + date/time):
 *   01 Style        → SelectTemplateStep
 *   02 Couple       → CoupleEventStep   (couple + schedule)
 *   03 Place & RSVP → VenueRsvpStep
 *   04 Note         → EnhancementsStep  (story / media / gift)
 *   05 Publish      → ReviewPublishStep
 */
export const BUILDER_STEPS = [
  {
    id: "template",
    label: "រចនា",
    labelEn: "Style",
    Component: SelectTemplateStep,
  },
  {
    id: "couple-event",
    label: "គូ & កាលបរិច្ឆេទ",
    labelEn: "Couple",
    Component: CoupleEventStep,
  },
  {
    id: "venue-rsvp",
    label: "ទីកន្លែង & RSVP",
    labelEn: "Place & RSVP",
    Component: VenueRsvpStep,
  },
  {
    id: "enhancements",
    label: "រូបភាព & ព័ត៌មាន",
    labelEn: "Note",
    Component: EnhancementsStep,
  },
  {
    id: "review",
    label: "បោះផ្សាយ",
    labelEn: "Publish",
    Component: ReviewPublishStep,
  },
];
