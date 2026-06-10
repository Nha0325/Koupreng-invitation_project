import { useParams } from "react-router-dom";
import TemplateExperience from "../../features/templates/template-experience/TemplateExperience";
import { getTemplateById } from "../../features/templates/data/templatesData";
import {
    resolveVariant,
    VARIANT_ROUTE_ALIASES,
} from "../../features/templates/template-experience/templateExperienceThemes";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * TemplateDemoPage — public template detail / demo page.
 *
 * Every template (Royal included) renders the single shared TemplateExperience
 * engine. Each one gets its own visual identity through a theme variant:
 *   royal | classic | luxury | modern-khmer | royal-khmer | vintage-gold
 *
 * Routing:
 *  - /templates/:id            → resolved template + its mapped variant
 *  - /templates/<style-alias>  → style names (luxury, modern-khmer,
 *                                royal-khmer, vintage-gold) resolve to a
 *                                representative template + that variant.
 */
export default function TemplateDemoPage() {
    const { id } = useParams();
    // Style-name routes (e.g. /templates/luxury) map to a representative
    // template id; the variant is forced so the page reads with that identity.
    const aliasTargetId = VARIANT_ROUTE_ALIASES[id];
    const tpl = getTemplateById(aliasTargetId || id);
    const forcedVariant = aliasTargetId ? id : undefined;
    const { isAuthenticated } = useAuth();

    const createTemplatePath = `/create/wedding?template=${tpl.id}`;
    const useTemplateLink = isAuthenticated
        ? createTemplatePath
        : `/login?next=${encodeURIComponent(createTemplatePath)}`;

    const variant = resolveVariant(tpl, forcedVariant);

    return (
        <TemplateExperience
            tpl={tpl}
            useTemplateLink={useTemplateLink}
            variant={variant}
        />
    );
}
