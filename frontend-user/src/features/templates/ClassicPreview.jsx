import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DemoPage.css";
import RoyalInvitation from "./RoyalInvitation";
import { getTemplateById } from "./templatesData";
import useCountdown from "./useCountdown";
// click view details show this page
export default function ClassicPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tpl = getTemplateById(id);
  const countdown = useCountdown(tpl.targetDate);
  const phoneRef = useRef(null);
  const autoScrollRef = useRef({ frame: null, timeout: null, last: 0 });
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    scrollTop: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);
  const [openedState, setOpenedState] = useState({
    templateId: tpl.id,
    value: false,
  });
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

  const handlePhoneWheel = useCallback(
    (event) => {
      const node = phoneRef.current;
      if (!isOpened || !node || node.scrollHeight <= node.clientHeight) return;

      event.preventDefault();
      stopAutoScroll();
      node.scrollTop += event.deltaY;
    },
    [isOpened, stopAutoScroll],
  );

  const handlePhonePointerDown = useCallback(
    (event) => {
      if (!isOpened) return;
      if (event.pointerType === "touch") return;
      if (event.target.closest("button, input, select, textarea, a, label"))
        return;

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
    },
    [isOpened, stopAutoScroll],
  );

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
    dragRef.current = {
      active: false,
      pointerId: null,
      startY: 0,
      scrollTop: 0,
      moved: false,
    };
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
    const interactive = event.target.closest(
      "button, input, select, textarea, a, label",
    );
    if (interactive) return;
    const node = phoneRef.current;
    if (!node) return;

    stopAutoScroll();
    const nearBottom =
      node.scrollTop + node.clientHeight >= node.scrollHeight - 12;
    node.scrollTo({
      top: nearBottom ? 0 : node.scrollTop + node.clientHeight * 0.88,
      behavior: "smooth",
    });
  };

  return (
    <div className="tpl-demo-root">
      <button
        type="button"
        className="tpl-demo-back"
        onClick={() => navigate("/templates")}
      >
        ← ត្រឡប់ទៅគ្រោងសន្លឹកការណ៍
      </button>

      <div className="tpl-demo-layout">
        <div className="tpl-demo-phone-wrap">
          <div
            className={`tpl-demo-phone${isOpened ? " is-opened" : ""}`}
            aria-label="scrollable wedding invitation preview"
          >
            <button
              type="button"
              className={`tpl-phone-gate${isOpened ? " is-opened" : ""}`}
              onClick={openInvitation}
              aria-label="Open wedding invitation"
              tabIndex={isOpened ? -1 : 0}
            >
              <span className="tpl-envelope-grain" />
              <span className="tpl-envelope-fold left" />
              <span className="tpl-envelope-fold right" />
              <span className="tpl-wax-seal">
                <span>K</span>
              </span>
              <span className="tpl-gate-mark">Koupreng</span>
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
              <RoyalInvitation tpl={tpl} countdown={countdown} mode="phone" />
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
            <button
              type="button"
              className="tpl-btn-primary"
              onClick={() => navigate(`/templates/${tpl.id}/preview`)}
            >
              មើលការអញ្ជើញពេញលេញ →
            </button>
            <button
              type="button"
              className="tpl-btn-outline"
              onClick={() => navigate(`/events/create?template=${tpl.id}`)}
            >
              ប្រើគំរូនេះ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
