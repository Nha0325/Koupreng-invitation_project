import { Link, useParams } from "react-router-dom";
import "./wedding-site.css";
import RoyalInvitation from "./RoyalInvitation";
import { getTemplateById } from "../templates/data/templatesData";
import useCountdown from "./hooks/useCountdown";

/**
 * WeddingSite — full-page public wedding invitation viewer.
 * Used by /templates/:id/preview and /w/:slug routes.
 *
 * Accepts either:
 *  - tpl (from props) when a parent already loaded the template
 *  - or falls back to looking up by :id route param
 */
export default function WeddingSite({
    tpl: tplProp,
    showBack = true,
    skipIntro = false,
    backTo,
    backLabel = "← ត្រឡប់",
}) {
    const { id } = useParams();
    const tpl = tplProp || getTemplateById(id);
    const countdown = useCountdown(tpl.targetDate);
    const isTemplatePreview = Boolean(id);
    const openingVideoUrl = typeof tpl.openingVideo === "string" ? tpl.openingVideo : tpl.openingVideo?.url;
    const shouldSkipIntro = skipIntro || isTemplatePreview || !showBack;
    const shouldShowGate = isTemplatePreview || Boolean(openingVideoUrl);
    const backPath = backTo || `/templates/${tpl.id}`;

    return (
        <div className="tpl-wed-root">
            {showBack && (
                <Link to={backPath} className="tpl-wed-back">
                    {backLabel}
                </Link>
            )}
            <RoyalInvitation tpl={tpl} countdown={countdown} skipIntro={shouldSkipIntro} flowerGate={shouldShowGate} />
        </div>
    );
}
