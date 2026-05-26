import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../features/wedding-site/wedding-site.css";
import RoyalInvitation from "../features/wedding-site/RoyalInvitation";
import { getTemplateById } from "../features/templates/data/templatesData";
import BuyTemplateButton from "../features/payments/BuyTemplateButton";
import useCountdown from "../features/wedding-site/hooks/useCountdown";
import heroPhoneVideo from "../assets/music/hero-phone.webm";

/**
 * TemplateDemoPage — public template detail / demo page.
 * Shows a phone-style preview on the left and template details on the right.
 * Mounted on /templates/:id and /templates/:id/demo
 */
export default function TemplateDemoPage() {
    const { id } = useParams();
    const tpl = getTemplateById(id);
    const countdown = useCountdown(tpl.targetDate);
    const phoneRef = useRef(null);
    const autoScrollRef = useRef({ frame: null, timeout: null, last: 0 });
    const dragRef = useRef({ active: false, pointerId: null, startY: 0, scrollTop: 0, moved: false });
    const suppressClickRef = useRef(false);
    const [openedState, setOpenedState] = useState({ templateId: tpl.id, value: false });
    const isOpened = openedState.templateId === tpl.id && openedState.value;

    const stopAutoScroll = useCallback(() => {
        const { frame, timeout } = autoScrollRef.current;
        if (frame) window.cancelAnimationFrame(frame);
        if (timeout) window.clearTimeout(timeout);
        autoScrollRef.current = { frame: null, timeout: null, last: 0 };
    }, []);

    const startAutoScroll = useCallback(() => {
        stopAutoScroll();

        autoScrollRef.current.timeout = window.setTimeout(() => {
            const step = (time) => {
                const node = phoneRef.current;
                if (!node) return;

                const maxScroll = node.scrollHeight - node.clientHeight;
                if (maxScroll <= 0 || node.scrollTop >= maxScroll - 2) {
                    autoScrollRef.current = { frame: null, timeout: null, last: 0 };
                    return;
                }

                const previous = autoScrollRef.current.last || time;
                const elapsed = Math.min(time - previous, 48);
                autoScrollRef.current.last = time;
                node.scrollTop = Math.min(maxScroll, node.scrollTop + elapsed * 0.035);
                autoScrollRef.current.frame = window.requestAnimationFrame(step);
            };

            autoScrollRef.current.frame = window.requestAnimationFrame(step);
        }, 900);
    }, [stopAutoScroll]);

    const openInvitation = useCallback(() => {
        const node = phoneRef.current;
        setOpenedState({ templateId: tpl.id, value: true });
        if (node) {
            node.scrollTo({ top: 0, behavior: "auto" });
        }
        startAutoScroll();
    }, [startAutoScroll, tpl.id]);

    useEffect(() => {
        const node = phoneRef.current;
        if (node) node.scrollTo({ top: 0, behavior: "auto" });
        stopAutoScroll();
    }, [stopAutoScroll, tpl.id]);

    useEffect(() => stopAutoScroll, [stopAutoScroll]);

    const handlePhoneWheel = useCallback((event) => {
        const node = phoneRef.current;
        if (!isOpened || !node || node.scrollHeight <= node.clientHeight) return;

        event.preventDefault();
        stopAutoScroll();
        node.scrollTop += event.deltaY;
    }, [isOpened, stopAutoScroll]);

    const handlePhonePointerDown = useCallback((event) => {
        if (!isOpened) return;
        if (event.pointerType === "touch") return;
        if (event.target.closest("button, input, select, textarea, a, label")) return;

        const node = phoneRef.current;
        if (!node) return;

        stopAutoScroll();
        dragRef.current = {
            active: true,
            pointerId: event.pointerId,
            startY: event.clientY,
            scrollTop: node.scrollTop,
            moved: false,
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
    }, [isOpened, stopAutoScroll]);

    const handlePhonePointerMove = useCallback((event) => {
        const node = phoneRef.current;
        const drag = dragRef.current;
        if (!node || !drag.active || drag.pointerId !== event.pointerId) return;

        const delta = event.clientY - drag.startY;
        if (Math.abs(delta) > 3) {
            drag.moved = true;
            suppressClickRef.current = true;
            event.preventDefault();
        }
        node.scrollTop = drag.scrollTop - delta;
    }, []);

    const handlePhonePointerEnd = useCallback((event) => {
        const drag = dragRef.current;
        if (drag.active && drag.pointerId === event.pointerId) {
            event.currentTarget.releasePointerCapture?.(event.pointerId);
        }
        dragRef.current = { active: false, pointerId: null, startY: 0, scrollTop: 0, moved: false };
    }, []);

    const handlePhoneTap = (event) => {
        if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
        }
        if (!isOpened) {
            openInvitation();
            return;
        }
        const interactive = event.target.closest("button, input, select, textarea, a, label");
        if (interactive) return;
        const node = phoneRef.current;
        if (!node) return;

        stopAutoScroll();
        const nearBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 12;
        node.scrollTo({
            top: nearBottom ? 0 : node.scrollTop + node.clientHeight * 0.88,
            behavior: "smooth",
        });
    };

    return (
        <div className="tpl-demo-root">
            <Link to="/templates" className="tpl-demo-back">
                ← ត្រឡប់ទៅគ្រោងសន្លឹកការណ៍
            </Link>

            <div className="tpl-demo-layout">
                <div className="tpl-demo-phone-wrap">
                    <div className={`tpl-demo-phone${isOpened ? " is-opened" : ""}`} aria-label="scrollable wedding invitation preview">
                        <button
                            type="button"
                            className={`tpl-phone-gate${isOpened ? " is-opened" : ""}`}
                            onClick={openInvitation}
                            aria-label="Open wedding invitation"
                            tabIndex={isOpened ? -1 : 0}
                        >
                            <video
                                className="tpl-gate-video"
                                src={heroPhoneVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                                aria-hidden="true"
                            />
                            <span className="tpl-gate-tap-hint">ចុចដើម្បីបើក</span>
                        </button>
                        <div
                            key={tpl.id}
                            className="tpl-phone-scroll"
                            ref={phoneRef}
                            aria-hidden={!isOpened}
                            onWheel={handlePhoneWheel}
                            onPointerDown={handlePhonePointerDown}
                            onPointerMove={handlePhonePointerMove}
                            onPointerUp={handlePhonePointerEnd}
                            onPointerCancel={handlePhonePointerEnd}
                            onClick={handlePhoneTap}
                        >
                            <RoyalInvitation tpl={tpl} countdown={countdown} mode="phone" autoPlay={isOpened} />
                        </div>
                    </div>
                </div>

                <div className="tpl-demo-info">
                    <div className="tpl-demo-style-label">{tpl.style}</div>
                    <h1 className="tpl-demo-title">{tpl.name}</h1>
                    <p className="tpl-demo-style-name">{tpl.description}</p>
                    <div className="tpl-demo-meta">
                        <div className="tpl-demo-meta-item">
                            <div className="tpl-demo-meta-label">កូនកំលោះ</div>
                            <div className="tpl-demo-meta-value">{tpl.groom}</div>
                        </div>
                        <div className="tpl-demo-meta-item">
                            <div className="tpl-demo-meta-label">កូនក្រមុំ</div>
                            <div className="tpl-demo-meta-value">{tpl.bride}</div>
                        </div>
                        <div className="tpl-demo-meta-item wide">
                            <div className="tpl-demo-meta-label">ទីកន្លែង</div>
                            <div className="tpl-demo-meta-value">{tpl.venueName}</div>
                        </div>
                        <div className="tpl-demo-meta-item wide">
                            <div className="tpl-demo-meta-label">កាលបរិច្ឆេទ</div>
                            <div className="tpl-demo-meta-value">{tpl.dateText}</div>
                        </div>
                    </div>

                    <div className="tpl-demo-actions">
                        <BuyTemplateButton templateId={tpl.id} />
                        <Link to={`/templates/${tpl.id}/preview`} className="tpl-btn-outline">
                            មើលការអញ្ជើញពេញលេញ →
                        </Link>
                        <Link to={`/create/wedding?template=${tpl.id}`} className="tpl-btn-outline">
                            ប្រើគំរូនេះ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
