import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load templates for better performance
const ClassicTemplate = lazy(
  () => import("./templates/Classic/ClassicTemplate"),
);
const ModernTemplate = lazy(() => import("./templates/Modern/ModernTemplate"));
const LuxuryTemplate = lazy(() => import("./templates/Luxury/LuxuryTemplate"));
const FloralTemplate = lazy(() => import("./templates/Floral/FloralTemplate"));

// Template registry - core engine of the platform
const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  luxury: LuxuryTemplate,
  floral: FloralTemplate,
};

/**
 * TemplateRenderer
 *
 * Core engine that dynamically renders invitation templates based on event data.
 * This is the MOST IMPORTANT component for the Invitation SaaS Platform.
 *
 * @param {Object} event - Event data from database/API
 * @param {string} event.template - Template key (classic, modern, luxury, floral)
 * @param {string} event.groomName - Groom's name
 * @param {string} event.brideName - Bride's name
 * @param {string} event.date - Wedding date
 * @param {string} event.location - Wedding location
 * @param {string} event.story - Love story
 * @param {Array} event.gallery - Image gallery
 * @param {string} event.music - Background music URL
 * @param {Object} event.colors - Custom color scheme
 * @param {Array} event.schedule - Wedding schedule
 */
export default function TemplateRenderer({ event }) {
  // Get template component based on event.template
  const TemplateComponent = templates[event.template] || ClassicTemplate;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <TemplateComponent data={event} />
    </Suspense>
  );
}

// Export template registry for use in other components
// eslint-disable-next-line react-refresh/only-export-components
export { templates };
