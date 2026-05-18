import { useNavigate, useParams } from "react-router-dom";
import "./DemoPage.css";
import RoyalInvitation from "./RoyalInvitation";
import { getTemplateById } from "./templatesData";
import useCountdown from "./useCountdown";

export default function PreviewWedding() {
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
