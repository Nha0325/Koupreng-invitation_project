import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../features/wedding-site/wedding-site.css";
import RoyalInvitation from "../../features/wedding-site/RoyalInvitation";
import { getTemplateById } from "../../features/templates/data/templatesData";
import useCountdown from "../../features/wedding-site/hooks/useCountdown";
import { Breadcrumb } from "../../shared/ui/Breadcrumb";
import { useAuth } from "../auth/context/useAuth";
import templateHallBg from "../../assets/icons/background.png";

/**
 * TemplateDemoPage — public template detail / demo page.
 * Shows a focused phone-style template preview.
 * Mounted on /templates/:id and /templates/:id/demo
 */
export default function TemplateDemoPage() {
    const { id } = useParams();
    const tpl = getTemplateById(id);
    const { isAuthenticated } = useAuth();
    const countdown = useCountdown(tpl.targetDate);
    const createTemplatePath = `/create/wedding?template=${tpl.id}`;
    const useTemplateLink = isAuthenticated
        ? createTemplatePath
        : `/login?next=${encodeURIComponent(createTemplatePath)}`;
    const phoneCoverImage = tpl.phoneCoverImage || tpl.mainImage || tpl.image;
    const detailBackgroundImage = tpl.detailBackgroundImage || templateHallBg;
    const phoneRef = useRef(null);
    const openTimerRef = useRef(null);
    const dragRef = useRef({ active: false, pointerId: null, startY: 0, scrollTop: 0, moved: false });
    const suppressClickRef = useRef(false);
    const [openedState, setOpenedState] = useState({ templateId: tpl.id, value: false });
    const [openingState, setOpeningState] = useState({ templateId: tpl.id, value: false });
    const isOpened = openedState.templateId === tpl.id && openedState.value;
    const isOpening = openingState.templateId === tpl.id && openingState.value;

    const openInvitation = useCallback(() => {
        if (isOpened || isOpening) return;
        const node = phoneRef.current;
        if (node) {
            node.scrollTo({ top: 0, behavior: "auto" });
        }
        setOpeningState({ templateId: tpl.id, value: true });
        openTimerRef.current = window.setTimeout(() => {
            setOpenedState({ templateId: tpl.id, value: true });
            setOpeningState({ templateId: tpl.id, value: false });
            openTimerRef.current = null;
        }, 950);
    }, [isOpened, isOpening, tpl.id]);

    useEffect(() => {
        const node = phoneRef.current;
        if (node) node.scrollTo({ top: 0, behavior: "auto" });
        if (openTimerRef.current) {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
    }, [tpl.id]);

    useEffect(() => () => {
        if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    }, []);

    const handlePhoneWheel = useCallback((event) => {
        const node = phoneRef.current;
        if (!isOpened || !node || node.scrollHeight <= node.clientHeight) return;

        event.preventDefault();
        node.scrollTop += event.deltaY;
    }, [isOpened]);

    useEffect(() => {
        const node = phoneRef.current;
        if (!node) return;

        node.addEventListener("wheel", handlePhoneWheel, { passive: false });
        return () => node.removeEventListener("wheel", handlePhoneWheel);
    }, [handlePhoneWheel, tpl.id]);

    const handlePhonePointerDown = useCallback((event) => {
        if (!isOpened) return;
        if (event.pointerType === "touch") return;
        if (event.target.closest("button, input, select, textarea, a, label")) return;

        const node = phoneRef.current;
        if (!node) return;

        dragRef.current = {
            active: true,
            pointerId: event.pointerId,
            startY: event.clientY,
            scrollTop: node.scrollTop,
            moved: false,
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
    }, [isOpened]);

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

        const nearBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 12;
        node.scrollTo({
            top: nearBottom ? 0 : node.scrollTop + node.clientHeight * 0.88,
            behavior: "smooth",
        });
    };

    return (
        <div
            className="tpl-demo-root"
            style={{ "--tpl-demo-bg-image": `url("${detailBackgroundImage}")` }}
        >
            <Breadcrumb
                items={[
                    { label: "ទំព័រដើម", to: "/" },
                    { label: "គំរូសន្លឹកការ", to: "/templates" },
                    { label: tpl.name },
                ]}
            />

            <div className="tpl-demo-layout tpl-demo-layout-phone-only">
                <div className="tpl-demo-phone-wrap">
                    <div className={`tpl-demo-phone${isOpened ? " is-opened" : ""}`} aria-label="scrollable wedding invitation preview">
                        <button
                            type="button"
                            className={`tpl-phone-gate${isOpening ? " is-opening" : ""}${isOpened ? " is-opened" : ""}`}
                            onClick={openInvitation}
                            aria-label="Open wedding invitation"
                            tabIndex={isOpened || isOpening ? -1 : 0}
                            disabled={isOpened || isOpening}
                        >
                            <img
                                className="tpl-gate-image"
                                src={phoneCoverImage}
                                alt={`${tpl.name} wedding preview`}
                            />
                            <span className="tpl-gate-flower-stage is-paper" aria-hidden="true">
                                <span className="tpl-gate-flower tpl-gate-flower-main" />
                            </span>
                            <span className="tpl-gate-mark-copy" aria-hidden="true">
                                <strong>{tpl.groom}</strong>
                                <span>{tpl.bride}</span>
                            </span>
                            <span className="tpl-gate-tap-hint">ចុចដើម្បីបើក</span>
                        </button>
                        <div
                            key={tpl.id}
                            className="tpl-phone-scroll"
                            ref={phoneRef}
                            aria-hidden={!isOpened}
                            onPointerDown={handlePhonePointerDown}
                            onPointerMove={handlePhonePointerMove}
                            onPointerUp={handlePhonePointerEnd}
                            onPointerCancel={handlePhonePointerEnd}
                            onClick={handlePhoneTap}
                        >
                            <RoyalInvitation tpl={tpl} countdown={countdown} mode="phone" autoPlay={isOpened} />
                        </div>
                    </div>

                    <div className="tpl-demo-phone-actions">
                        <Link to={useTemplateLink} className="tpl-btn-primary">
                            ប្រើគំរូនេះ
                        </Link>
                        <Link to={`/templates/${tpl.id}/preview`} className="tpl-btn-outline">
                            មើលជាមុន
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
