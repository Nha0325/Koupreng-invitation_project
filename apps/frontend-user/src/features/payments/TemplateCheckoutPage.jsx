import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTemplateById, KEEP_TEMPLATE_CODE } from "../templates/data/templatesData";
import { templateCatalogService } from "@/features/templates/api/templateCatalogApi";
import { paymentService } from "./paymentService";
import "./PaymentPages.css";

const ABA_STATIC_LINK = "https://link.payway.com.kh/ABAPAYrD450560q";

export default function TemplateCheckoutPage() {
    const { templateId = KEEP_TEMPLATE_CODE } = useParams();
    const template = getTemplateById(KEEP_TEMPLATE_CODE);
    const [catalogTemplateId, setCatalogTemplateId] = useState(null);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const checkout = useMemo(() => ({
        templateId: catalogTemplateId,
        templateName: template?.name || "Khmer Wedding Gold",
        packageName: "Premium",
        amount: "0.01",
        currency: "USD",
    }), [catalogTemplateId, template]);
    const [lastOrder, setLastOrder] = useState(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setCatalogLoading(true);
        templateCatalogService.list()
            .then((templates) => {
                if (!active) {
                    return;
                }
                const keptTemplate = (templates || []).find((item) => item?.code === KEEP_TEMPLATE_CODE) || templates?.[0];
                setCatalogTemplateId(keptTemplate?.id || null);
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load template catalog");
                }
            })
            .finally(() => {
                if (active) {
                    setCatalogLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    const createOrder = async () => {
        if (!checkout.templateId) {
            setError("Template catalog is not available yet. Please refresh and try again.");
            return;
        }
        setCreating(true);
        setError("");
        setLastOrder(null);

        try {
            const response = await paymentService.createStaticPaymentOrder(checkout);
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
            <Link className="payment-back-link" to={`/templates/${KEEP_TEMPLATE_CODE}`}>
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
                <button type="button" className="payment-primary-btn" disabled={creating || catalogLoading || !checkout.templateId} onClick={createOrder}>
                    {creating ? "Creating Order..." : catalogLoading ? "Loading Template..." : "Buy Template"}
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
