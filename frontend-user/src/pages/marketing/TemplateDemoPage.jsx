import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateExperience from "../../features/templates/template-experience/TemplateExperience";
import { getTemplateById, isTemplatePremium } from "../../features/templates/data/templatesData";
import {
    resolveVariant,
    VARIANT_ROUTE_ALIASES,
} from "../../features/templates/template-experience/templateExperienceThemes";
import { useAuth } from "../auth/context/useAuth";
import templateService from "../../features/templates/templateService";
import { mergeBackendTemplate } from "../../features/templates/templateCatalogAdapter";

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
    const fallbackTpl = getTemplateById(aliasTargetId || id);
    const forcedVariant = aliasTargetId ? id : undefined;
    const { isAuthenticated } = useAuth();
    const [remoteTemplate, setRemoteTemplate] = useState(null);

    useEffect(() => {
        let mounted = true;
        if (aliasTargetId) {
            setRemoteTemplate(null);
            return () => {
                mounted = false;
            };
        }
        const numericId = Number(id);
        const request = Number.isInteger(numericId) && numericId > 0
            ? templateService.getPublic(numericId)
            : templateService.getPublicBySlug(id);
        request
            .then((template) => {
                if (mounted) {
                    setRemoteTemplate(template || null);
                }
            })
            .catch(() => {
                if (mounted) {
                    setRemoteTemplate(null);
                }
            });
        return () => {
            mounted = false;
        };
    }, [aliasTargetId, id]);

    const tpl = useMemo(
        () => remoteTemplate ? mergeBackendTemplate(remoteTemplate, fallbackTpl.id) : fallbackTpl,
        [fallbackTpl, remoteTemplate]
    );

    const premium = tpl.backendId ? Boolean(tpl.isPremium ?? tpl.premium) : isTemplatePremium(tpl.id);
    const builderTemplateId = tpl.localTemplateId || tpl.id;
    const builderPath = `/create/wedding?template=${encodeURIComponent(builderTemplateId)}${tpl.backendId ? `&templateId=${encodeURIComponent(tpl.backendId)}` : ""}`;
    const createTemplatePath = premium
        ? `/templates/${tpl.id}/checkout`
        : builderPath;
    const useTemplateLink = isAuthenticated
        ? createTemplatePath
        : `/login?next=${encodeURIComponent(createTemplatePath)}`;

    const variant = resolveVariant(tpl, forcedVariant);

    return (
        <TemplateExperience
            tpl={tpl}
            useTemplateLink={useTemplateLink}
            variant={variant}
            primaryCtaLabel={premium ? "ទិញគំរូ" : "ប្រើគំរូនេះ"}
        />
    );
}
