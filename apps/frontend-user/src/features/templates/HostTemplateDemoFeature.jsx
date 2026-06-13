import { useParams } from "react-router-dom";
import TemplateExperience from "../templates/template-experience/TemplateExperience";
import { getTemplateById } from "../templates/data/templatesData";
import {
    resolveVariant,
    VARIANT_ROUTE_ALIASES,
} from "../templates/template-experience/templateExperienceThemes";

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
    // Old style-name routes map to the kept template for backward-compatible URLs.
    const aliasTargetId = VARIANT_ROUTE_ALIASES[id];
    const tpl = getTemplateById(aliasTargetId || id);
    const forcedVariant = aliasTargetId ? id : undefined;

    // Logged-in host: go straight to the wedding builder.
    const useTemplateLink = `/create/wedding?template=${tpl.id}`;
    const variant = resolveVariant(tpl, forcedVariant);

    return (
        // Cancel HostShell's .dash-main-scroll top padding so the hero
        // renders full-screen, with the fixed HostNav floating over it — same
        // immersive look as the public template demo page.
        <div style={{ marginTop: "calc(var(--host-nav-offset, 120px) * -1)" }}>
            <TemplateExperience
                tpl={tpl}
                useTemplateLink={useTemplateLink}
                variant={variant}
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
