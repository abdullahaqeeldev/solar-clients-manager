import { useEffect, useRef } from "react";

// Yahan se feel badal sakte ho
const DOT_SIZE = 8; // andar ka chhota dot (pixels)
const RING_SIZE = 36; // bahar ka ring (pixels)
const DOT_EASE = 0.4; // dot cursor ke bohat qareeb rehta hai
const RING_EASE = 0.14; // ring zyada peeche rehta hai, is se "chase" ka mazaa aata hai
const SCALE_EASE = 0.2; // size badalne ki raftaar
const HOVER_RING = 1.6; // button / link par ring kitna bara ho
const HOVER_DOT = 0.4; // button / link par dot kitna chhota ho
const PRESS_RING = 0.75; // click dabane par ring kitna sikure
const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

// Mouse ke peeche chalne wala dot + ring. Rang accent color se milta hai (palette ke saath badalta hai).
// Button par ring phail kar halka bhar jata hai, click par sikurta hai.
// Touch devices aur "reduce motion" walon par ye nahi chalta.
export default function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    // "any-" ka matlab: kam az kam ek input mouse jaisa ho (touchscreen wale laptops par bhi chalega)
    const canHover = window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!dot || !ring || !canHover || reduceMotion) return;

    let targetX = 0;
    let targetY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let ringScale = 1;
    let dotScale = 1;
    let targetRingScale = 1;
    let targetDotScale = 1;
    let hovering = false;
    let pressed = false;
    let started = false;
    let frame = 0;

    const render = () => {
      dot.style.transform = `translate3d(${dotX - DOT_SIZE / 2}px, ${dotY - DOT_SIZE / 2}px, 0) scale(${dotScale})`;
      ring.style.transform = `translate3d(${ringX - RING_SIZE / 2}px, ${ringY - RING_SIZE / 2}px, 0) scale(${ringScale})`;
    };

    // Jab sab kuch mouse tak pahunch jaye to loop ruk jata hai (battery bachti hai)
    const tick = () => {
      dotX += (targetX - dotX) * DOT_EASE;
      dotY += (targetY - dotY) * DOT_EASE;
      ringX += (targetX - ringX) * RING_EASE;
      ringY += (targetY - ringY) * RING_EASE;
      ringScale += (targetRingScale - ringScale) * SCALE_EASE;
      dotScale += (targetDotScale - dotScale) * SCALE_EASE;
      render();

      const settled =
        Math.abs(targetX - dotX) < 0.1 &&
        Math.abs(targetY - dotY) < 0.1 &&
        Math.abs(targetX - ringX) < 0.1 &&
        Math.abs(targetY - ringY) < 0.1 &&
        Math.abs(targetRingScale - ringScale) < 0.01 &&
        Math.abs(targetDotScale - dotScale) < 0.01;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Hover / press ki halat se targets aur ring ka halka rang set karna
    const applyState = () => {
      targetRingScale = pressed ? PRESS_RING : hovering ? HOVER_RING : 1;
      targetDotScale = hovering ? HOVER_DOT : 1;
      ring.classList.toggle("bg-blue-600/10", hovering);
      run();
    };

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!started) {
        // Pehli dafa corner se udta hua na aaye
        dotX = ringX = targetX;
        dotY = ringY = targetY;
        started = true;
      }
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      run();
    };

    const onOver = (e) => {
      const el = e.target;
      hovering =
        el instanceof Element &&
        (Boolean(el.closest(INTERACTIVE)) || getComputedStyle(el).cursor === "pointer");
      applyState();
    };

    const onDown = () => {
      pressed = true;
      applyState();
    };

    const onUp = () => {
      pressed = false;
      applyState();
    };

    const onLeaveWindow = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      pressed = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ width: RING_SIZE, height: RING_SIZE }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border-2 border-blue-600/50 opacity-0 transition-[opacity,background-color] duration-200 print:hidden"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ width: DOT_SIZE, height: DOT_SIZE }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-blue-600 opacity-0 transition-opacity duration-200 print:hidden"
      />
    </>
  );
}
