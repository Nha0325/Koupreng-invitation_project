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
export default function WeddingSite({ tpl: tplProp, showBack = true }) {
    const { id } = useParams();
    const tpl = tplProp || getTemplateById(id);
    const countdown = useCountdown(tpl.targetDate);

    return (
        <div className="tpl-wed-root">
            {showBack && (
                <Link to={`/templates/${tpl.id}`} className="tpl-wed-back">
                    ← ត្រឡប់
                </Link>
            )}
            <RoyalInvitation tpl={tpl} countdown={countdown} />
        </div>
    );
}
