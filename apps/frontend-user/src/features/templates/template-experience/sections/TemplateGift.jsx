import { IoQrCode } from "react-icons/io5";

import TemplateReveal from "../TemplateReveal";
import TemplateSectionHeader from "../TemplateSectionHeader";
import { templateIcons } from "../templateIcons";

/**
 * TemplateGift — Cambodia-specific gift section (ABA / ACLEDA / Wing).
 * Demo placeholder cards for the template page only — no real account numbers.
 */
export default function TemplateGift({ content }) {
    const accounts = content.gift || [];
    if (!accounts.length) return null;

    return (
        <section className="tx-section tx-gift" data-tx-section="gift" aria-labelledby="tx-gift-title">
            <div className="tx-shell">
                <TemplateSectionHeader
                    id="tx-gift-title"
                    icon={templateIcons.gift}
                    kicker="ចងដៃមង្គល"
                    title="ការគាំទ្រពីបេះដូង"
                    subtitle="WEDDING GIFT"
                    lead="វត្តមានរបស់អ្នកគឺជាអំណោយដ៏ល្អបំផុត។ ប្រសិនបើអ្នកចង់ចែករំលែកពរជ័យបន្ថែម"
                />

                <div className="tx-gift__grid">
                    {accounts.map((acc, index) => (
                        <TemplateReveal as="article" key={acc.id} className="tx-gift__card" delay={index * 0.05}>
                            <div className="tx-gift__head">
                                <span className="tx-gift__bank">{acc.bank}</span>
                                {acc.note && <span className="tx-gift__tag">{acc.note}</span>}
                            </div>
                            <div className="tx-gift__qr" aria-hidden="true">
                                <IoQrCode />
                                <span>QR</span>
                            </div>
                            <p className="tx-gift__account">{acc.account}</p>
                            <p className="tx-gift__number">{acc.number}</p>
                        </TemplateReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
