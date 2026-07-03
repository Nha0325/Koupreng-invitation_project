import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Breadcrumb } from "../../../shared/ui/Breadcrumb";
import { buildTemplateContent } from "./templateExperienceContent";
import { getVariantTheme, resolveVariant } from "./templateExperienceThemes";
import TemplateOpeningGate from "./sections/TemplateOpeningGate";
import TemplateHero from "./sections/TemplateHero";
import TemplateMessage from "./sections/TemplateMessage";
import TemplateCouple from "./sections/TemplateCouple";
import TemplateCountdown from "./sections/TemplateCountdown";
import TemplateStory from "./sections/TemplateStory";
import TemplateSchedule from "./sections/TemplateSchedule";
import TemplateVenue from "./sections/TemplateVenue";
import TemplateGallery from "./sections/TemplateGallery";
import TemplateParty from "./sections/TemplateParty";
import TemplateDressCode from "./sections/TemplateDressCode";
import TemplateGift from "./sections/TemplateGift";
import TemplateFaq from "./sections/TemplateFaq";
import TemplateFooter from "./sections/TemplateFooter";
import TemplateMusicControl from "./controls/TemplateMusicControl";
import TemplateStickyCta from "./controls/TemplateStickyCta";
import TemplateSectionHeader from "./TemplateSectionHeader";
import { templateIcons } from "./templateIcons";
import "./template-experience.css";

/**
 * TemplateExperience — shared, themeable full-page wedding experience.
 *
 * The single engine behind every template detail page. All templates share the
 * same UX structure, section completeness, responsive quality and button/card
 * consistency — each gets its own visual identity driven entirely by a variant
 * CSS modifier + CSS variables.
 *
 * DEMO surface only. Reads real values from `tpl` where available, fills the
 * rest with tasteful demo content. Never writes back to a user's invitation.
 *
 * Props:
 *  - tpl              resolved template object (from getTemplateById)
 *  - useTemplateLink  route for the "use this template" CTA
 *  - variant          optional explicit variant override
 *  - content          optional pre-built content override
 *  - breadcrumbItems  optional breadcrumb override (defaults to the public
 *                     marketing trail). Pass dashboard-context items when the
 *                     experience is rendered inside the host shell.
 *  - backLink         optional "back to all templates" destination
 *  - backLabel        optional label for the back button
 *  - preview          when true, renders an embeddable preview: the marketing
 *                     chrome (breadcrumb, CTA row, sticky bar) is hidden so the
 *                     experience fits inside the wedding-builder phone frame.
 *                     The floating music control stays so the host can hear the
 *                     chosen track; it anchors to the phone frame.
 */
export default function TemplateExperience({
    tpl,
    useTemplateLink,
    variant,
    content: contentProp,
    breadcrumbItems,
    backLink = "/templates",
    backLabel = "ត្រឡប់ទៅគំរូទាំងអស់",
    primaryCtaLabel = "ប្រើគំរូនេះ",
    preview = false,
    showBreadcrumb = true,
    showActions = true,
    showStickyCta = true,
    children,
}) {
    const resolvedVariant = useMemo(() => resolveVariant(tpl, variant), [tpl, variant]);
    const theme = useMemo(() => getVariantTheme(resolvedVariant), [resolvedVariant]);
    const content = useMemo(
        () => contentProp || buildTemplateContent(tpl, resolvedVariant),
        [contentProp, tpl, resolvedVariant]
    );

    const crumbs = useMemo(
        () =>
            breadcrumbItems || [
                { label: "ទំព័រដើម", to: "/" },
                { label: "គំរូសន្លឹកការ", to: "/templates" },
                { label: tpl.name },
            ],
        [breadcrumbItems, tpl.name]
    );

    const rootRef = useRef(null);
    const [gateOpen, setGateOpen] = useState(preview);

    const scrollToTarget = useCallback((node) => {
        if (!node) return;
        node.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    const handleOpen = useCallback(() => {
        setGateOpen(true);
    }, []);

    const handleHeroOpen = useCallback(() => {
        const next = rootRef.current?.querySelector('[data-tx-section="message"]');
        scrollToTarget(next);
    }, [scrollToTarget]);

    const handleScrollTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const sectionEnabled = useCallback(
        (key) => content.enabledSections?.[key] !== false,
        [content.enabledSections]
    );
    const ornamentTheme = content.design?.ornamentTheme || "royal-floral";

    return (
        <div
            className={`tx-root ${theme.className} tx-ornament--${ornamentTheme}${preview ? " tx-root--preview" : ""}`}
            data-theme="wed"
            data-variant={resolvedVariant}
            ref={rootRef}
        >
            {!preview && showBreadcrumb && (
                <div className="tx-breadcrumb">
                    <Breadcrumb items={crumbs} />
                </div>
            )}

            <AnimatePresence mode="wait">
                {!gateOpen ? (
                    <TemplateOpeningGate key="opening-gate" content={content} onOpen={handleOpen} />
                ) : (
                    <motion.div
                        key="invitation-content"
                        className="tx-experience"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                    <TemplateHero content={content} onOpen={handleHeroOpen} />
                    <TemplateMessage content={content} />
                    <TemplateCouple content={content} />
                    {sectionEnabled("countdown") && <TemplateCountdown content={content} />}
                    {sectionEnabled("story") && <TemplateStory content={content} />}
                    {sectionEnabled("schedule") && <TemplateSchedule content={content} />}
                    {sectionEnabled("party") && <TemplateParty content={content} />}
                    {sectionEnabled("dressCode") && <TemplateDressCode content={content} />}
                    {sectionEnabled("map") && <TemplateVenue content={content} />}
                    {sectionEnabled("gallery") && <TemplateGallery content={content} />}
                    {sectionEnabled("gift") && <TemplateGift content={content} />}
                    {sectionEnabled("faq") && <TemplateFaq content={content} />}

                    {children && sectionEnabled("rsvp") && (
                        <div className="tx-children">
                            <TemplateSectionHeader
                                id="tx-rsvp-title"
                                icon={templateIcons.invitation}
                                kicker="ការឆ្លើយតប"
                                title="សូមបញ្ជាក់ការចូលរួម"
                                subtitle="RSVP"
                            />
                            {children}
                        </div>
                    )}

                    <TemplateFooter content={content} />
                    </motion.div>
                )}
            </AnimatePresence>

            {gateOpen && !preview && showActions && useTemplateLink && (
                <div className="tx-template-actions">
                    <Link to={useTemplateLink} className="tx-btn tx-btn--solid">{primaryCtaLabel}</Link>
                    <Link to={backLink} className="tx-btn tx-btn--ghost">{backLabel}</Link>
                </div>
            )}

            <TemplateMusicControl src={content.music} />
            {!preview && gateOpen && showStickyCta && (
                <TemplateStickyCta
                    onTop={handleScrollTop}
                    mapLink={content.venue.mapLink}
                    useTemplateLink={useTemplateLink}
                    primaryCtaLabel={primaryCtaLabel}
                />
            )}
        </div>
    );
}
