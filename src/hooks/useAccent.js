import { useEffect, useState } from "react";

export const ACCENT_KEY = "solar-accent";
export const BG_LIGHT_KEY = "solar-bg-light";
export const BG_DARK_KEY = "solar-bg-dark";

export const DEFAULT_ACCENT = "#2563eb";
export const DEFAULT_BG_LIGHT = "#f8fafc"; // slate-50
export const DEFAULT_BG_DARK = "#020617"; // slate-950

const isHex = (value) => /^#[0-9a-f]{6}$/i.test(value || "");

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return isHex(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked: color sirf is session tak rahega
  }
}

// a aur b ko mila kar naya color (amount = b ka hissa, 0 se 1)
function mix(a, b, amount) {
  const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const part = (x, y) => Math.round(x + (y - x) * amount);
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(part(r1, r2))}${toHex(part(g1, g2))}${toHex(part(b1, b2))}`;
}

// Background se topbar / cards / inputs ke rang nikalna.
// Default background par asli (pehle wale) rang hi rehte hain.
function lightSurface(bg) {
  return bg.toLowerCase() === DEFAULT_BG_LIGHT ? "#ffffff" : mix(bg, "#ffffff", 0.6);
}
function darkSurface(bg) {
  return bg.toLowerCase() === DEFAULT_BG_DARK ? "#0f172a" : mix(bg, "#ffffff", 0.065);
}
function darkRaised(bg) {
  return bg.toLowerCase() === DEFAULT_BG_DARK ? "#1e293b" : mix(bg, "#ffffff", 0.135);
}

// darkMode batata hai ke background picker kaun sa (light ya dark) badal raha hai
export default function useAccent(darkMode) {
  const [accent, setAccent] = useState(() => read(ACCENT_KEY, DEFAULT_ACCENT));
  const [bgLight, setBgLight] = useState(() =>
    read(BG_LIGHT_KEY, DEFAULT_BG_LIGHT),
  );
  const [bgDark, setBgDark] = useState(() =>
    read(BG_DARK_KEY, DEFAULT_BG_DARK),
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    write(ACCENT_KEY, accent);
  }, [accent]);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--bg-light", bgLight);
    root.setProperty("--surface-light", lightSurface(bgLight));
    write(BG_LIGHT_KEY, bgLight);
  }, [bgLight]);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--bg-dark", bgDark);
    root.setProperty("--surface-dark", darkSurface(bgDark));
    root.setProperty("--raised-dark", darkRaised(bgDark));
    write(BG_DARK_KEY, bgDark);
  }, [bgDark]);

  return {
    accent,
    setAccent,
    resetAccent: () => setAccent(DEFAULT_ACCENT),

    // Abhi jo mode chal raha hai uska background
    background: darkMode ? bgDark : bgLight,
    setBackground: darkMode ? setBgDark : setBgLight,
    defaultBackground: darkMode ? DEFAULT_BG_DARK : DEFAULT_BG_LIGHT,
    resetBackground: () =>
      darkMode ? setBgDark(DEFAULT_BG_DARK) : setBgLight(DEFAULT_BG_LIGHT),
  };
}
