import { IoQrCode } from "react-icons/io5";

import TemplateReveal from "../TemplateReveal";

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
                <header className="tx-section__head">
                    <TemplateReveal>
                        <p className="tx-kicker">ចងដៃមង្គល</p>
                        <h2 id="tx-gift-title" className="tx-section__title">ការគាំទ្រពីបេះដូង</h2>
                        <p className="tx-section__lead">
                            វត្តមានរបស់អ្នកគឺជាអំណោយដ៏ល្អបំផុត។ ប្រសិនបើអ្នកចង់ចែករំលែកពរជ័យបន្ថែម
                        </p>
                    </TemplateReveal>
                </header>

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
