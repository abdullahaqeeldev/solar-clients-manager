import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Number ko 0 se (ya pichli value se) nayi value tak smoothly ginta hai.
// Naya client add ho to number purani value se naye tak chalta hai.
// "Reduce motion" walon ko seedha final number milta hai.
export default function useCountUp(target, duration = 900) {
  const end = Number(target) || 0;
  const reduce = prefersReducedMotion();
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const begin = from.current;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // shuru mein tez, aakhir mein narm
      const next = begin + (end - begin) * eased;
      from.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, reduce]);

  return reduce ? end : value;
}
