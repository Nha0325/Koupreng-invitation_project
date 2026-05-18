/**
 * កំណត់ចំណាំ: មើលជាមុន
 * ឯកសារ: src/pages/marketing/InvitationPreviewPage.jsx
 * ចាស់: ./features/Template/InvitationPreviewPage.jsx
 */
import { useNavigate, useParams } from "react-router-dom";
import "../../features/templates/styles/TemplateDetailPage.css";
import RoyalInvitation from "../../features/templates/components/RoyalInvitation";
import { getTemplateById } from "../../features/templates/data/templatesData";
import useCountdown from "../../features/templates/hooks/useCountdown";

export default function InvitationPreview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const tpl = getTemplateById(id);
    const countdown = useCountdown(tpl.targetDate);

    return (
        <div className="tpl-wed-root">
            <button type="button" className="tpl-wed-back" onClick={() => navigate(`/templates/${tpl.id}`)}>
                ← ត្រឡប់
            </button>
            <RoyalInvitation tpl={tpl} countdown={countdown} />
        </div>
    );
}
