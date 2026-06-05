import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTemplateById, TEMPLATES } from "../templates/data/templatesData";
import { paymentService } from "./paymentService";
import "./PaymentPages.css";

const ABA_STATIC_LINK = "https://link.payway.com.kh/ABAPAYrD450560q";

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
        amount: "0.01",
        currency: "USD",
    }), [template, templateId]);
    const [lastOrder, setLastOrder] = useState(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const createOrder = async () => {
        setCreating(true);
        setError("");
        setLastOrder(null);

        try {
            const response = await paymentService.createStaticPaymentOrder(checkout);
            if (!response?.paymentLink) {
                console.warn(
                    "Static ABA payment response did not include paymentLink; using configured fallback link.",
                    { orderCode: response?.orderCode }
                );
            }
            const paymentLink = response?.paymentLink || ABA_STATIC_LINK;

            const orderSnapshot = {
                orderCode: response?.orderCode,
                templateId: response?.templateId || checkout.templateId,
                templateName: response?.templateName || checkout.templateName,
                packageName: response?.packageName || checkout.packageName,
                amount: response?.amount || checkout.amount,
                currency: response?.currency || checkout.currency,
                paymentLink,
                status: response?.status || "PENDING",
            };

            setLastOrder(orderSnapshot);
            sessionStorage.setItem("lastTemplatePaymentOrder", JSON.stringify(orderSnapshot));
            window.location.href = paymentLink;
        } catch (err) {
            console.error("Create static ABA payment order failed:", err);
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
                <p>After clicking Buy Template, your order will be created and you will be redirected to the ABA KHQR payment page. This static ABA link is already configured with USD 0.01.</p>
                <p>បន្ទាប់ពីចុច Buy Template ប្រព័ន្ធនឹងបង្កើត order ហើយបញ្ជូនអ្នកទៅទំព័រ ABA KHQR។ Static link នេះបានកំណត់តម្លៃ USD 0.01 រួចហើយ។</p>
            </section>

            <section className="payment-card payment-product-card">
                <img src={template?.image || "/image/a1.png"} alt={checkout.templateName} />
                <div>
                    <h2>{checkout.templateName}</h2>
                    <p>{checkout.packageName}</p>
                    <strong>{checkout.currency} {checkout.amount}</strong>
                </div>
                <button type="button" className="payment-primary-btn" disabled={creating} onClick={createOrder}>
                    {creating ? "Creating Order..." : "Buy Template"}
                </button>
            </section>

            {error && <div className="payment-error">{error}</div>}
            {lastOrder && !error && (
                <div className="payment-status-note">
                    Order {lastOrder.orderCode} created. Redirecting to ABA KHQR...
                </div>
            )}
        </main>
    );
}
