// Browser tab ka icon: loading screen jaisa ghoomta hua sun.
// SVG favicon ko Chrome animate nahi karta, is liye canvas pe sun bana kar icon baar baar badalte hain.

const SIZE = 48; // icon ka size (pixels)
const SCALE = SIZE / 24; // favicon.svg 24x24 ke hisaab se bana hai
const ORANGE = "#f97316";
const SECONDS_PER_TURN = 6; // loading screen ki speed (6s mein ek chakkar)
const FRAME_MS = 100; // har 100ms par naya frame

export function startSpinningFavicon() {
  // Jin logon ne device mein animation band ki hai unke liye sun sakit rahega
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/png";

  let angle = 0;
  const step = (Math.PI * 2) / ((SECONDS_PER_TURN * 1000) / FRAME_MS);

  const draw = () => {
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(SIZE / 2, SIZE / 2);
    ctx.rotate(angle);

    ctx.fillStyle = ORANGE;
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2.4 * SCALE;
    ctx.lineCap = "round";

    // Sun ka gol hissa
    ctx.beginPath();
    ctx.arc(0, 0, 4.6 * SCALE, 0, Math.PI * 2);
    ctx.fill();

    // 8 kirnein
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      const inner = 7.4 * SCALE;
      const outer = 10 * SCALE;
      ctx.beginPath();
      ctx.moveTo(Math.sin(a) * inner, -Math.cos(a) * inner);
      ctx.lineTo(Math.sin(a) * outer, -Math.cos(a) * outer);
      ctx.stroke();
    }

    ctx.restore();
    link.href = canvas.toDataURL("image/png");
    angle += step;
  };

  draw();
  const timer = setInterval(draw, FRAME_MS);
  return () => clearInterval(timer);
}
