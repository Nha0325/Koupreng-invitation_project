import SelectTemplateStep from "../steps/SelectTemplateStep";
import CoupleEventStep from "../steps/CoupleEventStep";
import VenueRsvpStep from "../steps/VenueRsvpStep";
import EnhancementsStep from "../steps/EnhancementsStep";
import ReviewPublishStep from "../steps/ReviewPublishStep";

export const BUILDER_STEPS = [
  {
    id: "template",
    label: "ជ្រើសរើសគំរូ",
    Component: SelectTemplateStep,
  },
  {
    id: "couple-event",
    label: "ព័ត៌មានគូ និងថ្ងៃកម្មវិធី",
    Component: CoupleEventStep,
  },
  {
    id: "venue-rsvp",
    label: "ទីកន្លែង និង RSVP",
    Component: VenueRsvpStep,
  },
  {
    id: "enhancements",
    label: "រូបភាព និងព័ត៌មានបន្ថែម",
    Component: EnhancementsStep,
  },
  {
    id: "review",
    label: "ត្រួតពិនិត្យ និងបោះផ្សាយ",
    Component: ReviewPublishStep,
  },
];
