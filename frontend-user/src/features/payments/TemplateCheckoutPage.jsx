import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTemplateById, TEMPLATES } from "../templates/data/templatesData";
import PaymentCheckoutCard from "./PaymentCheckoutCard";
import { paymentService } from "./paymentService";
import "./PaymentPages.css";

function numericTemplateId(templateId) {
    const parsed = Number(templateId);
    if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
    }
    const index = TEMPLATES.findIndex((template) => template.id === templateId);
    return index >= 0 ? index + 10 : 10;
}

export default function TemplateCheckoutPage() {
    const { templateId } = useParams();
    const template = getTemplateById(templateId);
    const checkout = useMemo(() => ({
        templateId: numericTemplateId(templateId),
        templateName: template?.name || "Khmer Wedding Gold",
        packageName: "Premium",
        amount: "5.00",
        currency: "USD",
    }), [template, templateId]);
    const [order, setOrder] = useState(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const createOrder = async () => {
        setCreating(true);
        setError("");
        try {
            const response = await paymentService.createPaywayCheckout(checkout);
            setOrder(response);
        } catch (err) {
            setError(err.message || "Could not create payment order");
        } finally {
            setCreating(false);
        }
    };

    return (
        <main className="payment-page">
            <Link className="payment-back-link" to={`/templates/${templateId}`}>
                Back to template
            </Link>
            <section className="payment-hero">
                <span className="payment-eyebrow">Template checkout</span>
                <h1>Buy Template</h1>
                <p>Complete payment with ABA PayWay Sandbox. Template access unlocks after backend verification.</p>
            </section>

            <section className="payment-card payment-product-card">
                <img src={template?.image || "/image/a1.png"} alt={checkout.templateName} />
                <div>
                    <h2>{checkout.templateName}</h2>
                    <p>{checkout.packageName}</p>
                    <strong>{checkout.currency} {checkout.amount}</strong>
                </div>
                <button type="button" className="payment-primary-btn" disabled={creating} onClick={createOrder}>
                    {creating ? "Creating checkout..." : "Pay with ABA PayWay Sandbox"}
                </button>
            </section>

            {error && <div className="payment-error">{error}</div>}
            {order && <PaymentCheckoutCard order={order} onStatusChange={setOrder} />}
        </main>
    );
}
