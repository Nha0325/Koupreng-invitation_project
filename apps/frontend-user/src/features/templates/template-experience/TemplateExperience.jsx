import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Breadcrumb } from "../../../shared/ui/Breadcrumb";
import { buildTemplateContent } from "./templateExperienceContent";
import { getVariantTheme, KEEP_TEMPLATE_CODE, resolveVariant } from "./templateExperienceThemes";
import GardenRoyalSambotTemplate from "./sambot/GardenRoyalSambotTemplate";
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
import TemplateRsvp from "./sections/TemplateRsvp";
import TemplateWish from "./sections/TemplateWish";
import TemplateFooter from "./sections/TemplateFooter";
import TemplateMusicControl from "./controls/TemplateMusicControl";
import TemplateQuickNav from "./controls/TemplateQuickNav";
import TemplateSectionHeader from "./TemplateSectionHeader";
import { templateIcons } from "./templateIcons";
import "./template-experience.css";
import "./sambot/garden-royal-sambot.css";

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

    useEffect(() => {
        if (!gateOpen || preview) return undefined;
        const frame = window.requestAnimationFrame(() => {
            scrollToTarget(rootRef.current?.querySelector('[data-tx-section="hero"]'));
        });
        return () => window.cancelAnimationFrame(frame);
    }, [gateOpen, preview, scrollToTarget]);

    const handleHeroOpen = useCallback(() => {
        const next = rootRef.current?.querySelector('[data-tx-section="message"]');
        scrollToTarget(next);
    }, [scrollToTarget]);

    const handleScrollTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const handleNavigate = useCallback(
        (section) => {
            if (section === "hero") {
                handleScrollTop();
                return;
            }
            scrollToTarget(rootRef.current?.querySelector(`[data-tx-section="${section}"]`));
        },
        [handleScrollTop, scrollToTarget]
    );
    const sectionEnabled = useCallback(
        (key) => content.enabledSections?.[key] !== false,
        [content.enabledSections]
    );
    const ornamentTheme = content.design?.ornamentTheme || "royal-floral";

    if (resolvedVariant === KEEP_TEMPLATE_CODE) {
        return (
            <GardenRoyalSambotTemplate
                content={content}
                useTemplateLink={useTemplateLink}
                backLink={backLink}
                backLabel={backLabel}
                primaryCtaLabel={primaryCtaLabel}
                preview={preview}
                showActions={showActions}
                showStickyCta={showStickyCta}
                isHostedInvitation={Boolean(tpl.hostContent)}
            >
                {children}
            </GardenRoyalSambotTemplate>
        );
    }

    return (
        <div className={`tx-stage tx-stage--${resolvedVariant}${preview ? " tx-stage--preview" : ""}`}>
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
                        {sectionEnabled("schedule") && <TemplateSchedule content={content} />}
                        {sectionEnabled("story") && <TemplateStory content={content} />}
                        {sectionEnabled("party") && <TemplateParty content={content} />}
                        {sectionEnabled("gallery") && <TemplateGallery content={content} />}
                        {sectionEnabled("dressCode") && <TemplateDressCode content={content} />}
                        {sectionEnabled("gift") && <TemplateGift content={content} />}
                        {sectionEnabled("map") && <TemplateVenue content={content} />}
                        {sectionEnabled("faq") && <TemplateFaq content={content} />}

                        {sectionEnabled("rsvp") && (
                            children ? (
                                <div className="tx-children" data-tx-section="rsvp">
                                    <TemplateSectionHeader
                                        id="tx-rsvp-title"
                                        icon={templateIcons.invitation}
                                        kicker="ការឆ្លើយតប"
                                        title="សូមបញ្ជាក់ការចូលរួម"
                                        subtitle="RSVP"
                                    />
                                    {children}
                                </div>
                            ) : (
                                <TemplateRsvp useTemplateLink={useTemplateLink} />
                            )
                        )}

                        {sectionEnabled("wish") && (
                            <TemplateWish
                                content={content}
                                onRsvp={() => handleNavigate("rsvp")}
                                showRsvp={sectionEnabled("rsvp")}
                            />
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
            {gateOpen && showStickyCta && (
                <TemplateQuickNav
                    enabledSections={content.enabledSections}
                    onNavigate={handleNavigate}
                />
            )}
            </div>
        </div>
    );
}
