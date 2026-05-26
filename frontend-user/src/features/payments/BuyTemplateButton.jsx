import { Link } from "react-router-dom";

export default function BuyTemplateButton({ templateId, className = "tpl-btn-primary" }) {
    return (
        <Link to={`/templates/${templateId}/checkout`} className={className}>
            Buy Template
        </Link>
    );
}
