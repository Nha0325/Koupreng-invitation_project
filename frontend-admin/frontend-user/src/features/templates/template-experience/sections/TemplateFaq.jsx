import { useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";

import TemplateReveal from "../TemplateReveal";

/**
 * TemplateFaq — accessible accordion.
 * Buttons toggle panels, aria-expanded reflects state, keyboard usable.
 */
export default function TemplateFaq({ content }) {
    const items = content.faq || [];
    const [openId, setOpenId] = useState(null);

    if (!items.length) return null;

    const toggle = (id) => setOpenId((current) => (current === id ? null : id));

    return (
        <section className="tx-section tx-faq" data-tx-section="faq" aria-labelledby="tx-faq-title">
            <div className="tx-shell tx-shell--narrow">
                <header className="tx-section__head">
                    <TemplateReveal>
                        <p className="tx-kicker">សំណួរ</p>
                        <h2 id="tx-faq-title" className="tx-section__title">សំណួរញឹកញាប់</h2>
                    </TemplateReveal>
                </header>

                <TemplateReveal className="tx-faq__list">
                    {items.map((item) => {
                        const isOpen = openId === item.id;
                        const panelId = `tx-faq-panel-${item.id}`;
                        const buttonId = `tx-faq-button-${item.id}`;
                        return (
                            <div className={`tx-faq__item${isOpen ? " is-open" : ""}`} key={item.id}>
                                <h3 className="tx-faq__heading">
                                    <button
                                        type="button"
                                        id={buttonId}
                                        className="tx-faq__q"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => toggle(item.id)}
                                    >
                                        <span>{item.q}</span>
                                        <span className="tx-faq__icon" aria-hidden="true">
                                            {isOpen ? <IoRemove /> : <IoAdd />}
                                        </span>
                                    </button>
                                </h3>
                                <div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    className="tx-faq__panel"
                                    hidden={!isOpen}
                                >
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </TemplateReveal>
            </div>
        </section>
    );
}
