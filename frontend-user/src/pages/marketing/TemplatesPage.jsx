import TemplateGrid from "../../features/templates/components/TemplateGrid";

/**
 * Public templates gallery page.
 * Rendered inside MarketingShell, so <Header /> and <Footer /> are
 * already provided by the layout — this page only renders the grid.
 */
export default function TemplatesPage() {
    return <TemplateGrid />;
}
