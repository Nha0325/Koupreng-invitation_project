import { useParams } from "react-router-dom";
import TemplateExperience from "../../../features/templates/template-experience/TemplateExperience";
import { getTemplateById, isTemplatePremium } from "../../../features/templates/data/templatesData";
import {
    resolveVariant,
    VARIANT_ROUTE_ALIASES,
} from "../../../features/templates/template-experience/templateExperienceThemes";

/**
 * HostTemplateDemoPage — dashboard-context template detail / demo page.
 *
 * Same immersive TemplateExperience engine as the public TemplateDemoPage, but
 * rendered inside HostShell so the dashboard navigation (កម្មវិធី /
 * ផ្ទាំងគ្រប់គ្រង / បញ្ជីភ្ញៀវ ...) stays visible. Reached from the dashboard
 * "បន្ថែមគម្រូ" page (/templates/browse) when the user clicks "មើល", keeping
 * them in the logged-in experience instead of bouncing to the public homepage
 * layout.
 *
 * Routing: /templates/browse/:id
 */
export default function HostTemplateDemoPage() {
    const { id } = useParams();
    // Style-name routes (e.g. luxury) map to a representative template id.
    const aliasTargetId = VARIANT_ROUTE_ALIASES[id];
    const tpl = getTemplateById(aliasTargetId || id);
    const forcedVariant = aliasTargetId ? id : undefined;

    // Logged-in host: premium templates go to checkout, free go to builder.
    const premium = isTemplatePremium(tpl.id);
    const useTemplateLink = premium
        ? `/templates/${tpl.id}/checkout`
        : `/create/wedding?template=${tpl.id}`;
    const variant = resolveVariant(tpl, forcedVariant);

    return (
        // Cancel HostShell's .dash-main-scroll top padding (120px) so the hero
        // renders full-screen, with the fixed HostNav floating over it — same
        // immersive look as the public template demo page.
        <div style={{ marginTop: -120 }}>
            <TemplateExperience
                tpl={tpl}
                useTemplateLink={useTemplateLink}
                variant={variant}
                primaryCtaLabel={premium ? "ទិញគំរូ" : "ប្រើគំរូ"}
                breadcrumbItems={[
                    { label: "ផ្ទាំងគ្រប់គ្រង", to: "/dashboard" },
                    { label: "បន្ថែមគម្រូ", to: "/templates/browse" },
                    { label: tpl.name },
                ]}
                backLink="/templates/browse"
                backLabel="ត្រឡប់ទៅបន្ថែមគម្រូ"
            />
        </div>
    );
}

