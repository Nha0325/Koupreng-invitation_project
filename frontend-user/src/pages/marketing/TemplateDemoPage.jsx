import { useParams } from "react-router-dom";
import TemplateExperience from "../../features/templates/template-experience/TemplateExperience";
import { getTemplateById } from "../../features/templates/data/templatesData";
import {
    resolveVariant,
    VARIANT_ROUTE_ALIASES,
} from "../../features/templates/template-experience/templateExperienceThemes";
import { useAuth } from "../auth/context/useAuth";

/**
 * TemplateDemoPage — public template detail / demo page.
 *
 * Every template/demo route renders the kept Garden Royal Khmer Wedding
 * experience.
 *
 * Routing:
 *  - /templates/:id            → kept template
 *  - /templates/<style-alias>  → old aliases redirect to the kept template
 */
export default function TemplateDemoPage() {
    const { id } = useParams();
    // Old style-name routes map to the kept template for backward-compatible URLs.
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
