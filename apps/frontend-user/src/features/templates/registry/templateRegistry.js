import DigitalYesLayout from "../layouts/DigitalYes/DigitalYesLayout";
import RoyalKhmerLayout from "../layouts/RoyalKhmer/RoyalKhmerLayout";
import EmeraldLuxeLayout from "../layouts/EmeraldLuxe/EmeraldLuxeLayout";
import WithJoyPortalLayout from "../layouts/WithJoyPortalLayout";
import BlissEditorialLayout from "../layouts/BlissEditorialLayout";
import DefaultTemplateLayout from "../layouts/DefaultTemplate/DefaultTemplateLayout";
import CanvaKhmerWeddingTemplate from "../experience/components/canva-khmer/CanvaKhmerWeddingTemplate";

/**
 * 1 Template = 1 Dedicated UI Component Registry
 * Maps template slugs, IDs, and codes to their bespoke UI layout components.
 */
export const templateRegistry = {
  // 1. The Digital Yes (Luxury Cinematic Digital Invitation - 3D Wax Seal Envelope + Falling Petals)
  "the-digital-yes-wedding": DigitalYesLayout,
  "7": DigitalYesLayout,
  "digital-yes": DigitalYesLayout,

  // 2. Royal Khmer (Cambodian Traditional Wedding - Golden Palace Gate + 8 Steps + Kbach)
  "royal-khmer-wedding": RoyalKhmerLayout,
  "1": RoyalKhmerLayout,
  "royal-khmer": RoyalKhmerLayout,

  // 3. Emerald Luxe (Luxury Modern Evening Wedding - Velvet Curtain + 3D Card Flip)
  "emerald-canva-luxe-wedding": EmeraldLuxeLayout,
  "emerald-luxe-wedding": EmeraldLuxeLayout,
  "2": EmeraldLuxeLayout,
  "emerald-luxe": EmeraldLuxeLayout,

  // 4. WithJoy Modern App Portal (Sticky Glassmorphism Nav + Love Story Timeline + Lightbox Gallery)
  "withjoy-modern-portal": WithJoyPortalLayout,
  "3": WithJoyPortalLayout,

  // 5. Bliss & Bone High-Fashion Editorial (Vogue Magazine Spread + Asymmetrical Gallery + Slide-out RSVP Drawer)
  "bliss-editorial-wedding": BlissEditorialLayout,
  "4": BlissEditorialLayout,

  // 6. Canva Golden Khmer Luxury (Traditional Kbach Frames + Golden Card)
  "khmer-golden-canva-inspired-wedding": CanvaKhmerWeddingTemplate,
  "5": CanvaKhmerWeddingTemplate,
};

// Alias for backward compatibility
export const TEMPLATE_UI_REGISTRY = templateRegistry;

// Export safe fallback layout
export { DefaultTemplateLayout };

/**
 * Resolves the dedicated UI component for a given template.
 * Checks slug, code, templateCode, templateId, id, and variant.
 * Returns null if no custom layout is mapped, allowing fallback to default layout engine.
 */
export function getDedicatedTemplateComponent(tpl, variant, useFallback = false) {
  const keysToCheck = [
    variant,
    tpl?.slug,
    tpl?.code,
    tpl?.templateCode,
    tpl?.templateId,
    tpl?.id ? String(tpl.id) : null,
    tpl?.variant,
  ].filter(Boolean);

  for (const key of keysToCheck) {
    if (templateRegistry[key]) {
      return templateRegistry[key];
    }
  }

  return useFallback ? DefaultTemplateLayout : null;
}

export default templateRegistry;
