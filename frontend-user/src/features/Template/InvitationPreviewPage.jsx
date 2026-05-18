import { useNavigate, useParams } from "react-router-dom";
import "./TemplateDetailPage.css";
import RoyalInvitation from "../../components/RoyalInvitation";
import { getTemplateById } from "../../data/templatesData";
import useCountdown from "../../hooks/useCountdown";

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
