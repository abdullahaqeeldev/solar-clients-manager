import { useEffect, useState } from "react";
import { Palette, RotateCcw } from "lucide-react";

const ACCENT_PRESETS = [
  "#2563eb", // blue
  "#7c3aed", // purple
  "#db2777", // pink
  "#dc2626", // red
  "#ea580c", // orange
  "#16a34a", // green
  "#0d9488", // teal
  "#334155", // slate
];

const BG_PRESETS_LIGHT = [
  "#f8fafc", // default
  "#eff6ff", // blue tint
  "#faf5ff", // purple tint
  "#fdf2f8", // pink tint
  "#fffbeb", // amber tint
  "#f0fdf4", // green tint
  "#ecfeff", // cyan tint
  "#f5f5f4", // stone
];

const BG_PRESETS_DARK = [
  "#020617", // default
  "#0c1a2b", // navy
  "#160b2a", // plum
  "#1f0a14", // wine
  "#1a1206", // brown
  "#071a12", // forest
  "#042f2e", // deep teal
  "#0a0a0a", // black
];

const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-surface text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";

const resetButton =
  "rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-slate-200";

const colorInput =
  "h-9 w-12 cursor-pointer rounded border border-slate-200 bg-transparent p-0.5 dark:border-slate-700";

function Swatches({ presets, value, onPick }) {
  return (
    <div className="mb-3 grid grid-cols-8 gap-2">
      {presets.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onPick(color)}
          aria-label={`Use ${color}`}
          style={{ backgroundColor: color }}
          className={`h-6 w-6 rounded-full border border-slate-300 ring-offset-2 ring-offset-white transition dark:border-slate-600 dark:ring-offset-slate-900 ${
            value.toLowerCase() === color ? "ring-2 ring-slate-400" : "hover:scale-110"
          }`}
        />
      ))}
    </div>
  );
}

function ColorRow({ value, onChange, onReset, isDefault, label }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Pick a custom ${label} color`}
        className={colorInput}
      />
      <span className="flex-1 font-mono text-xs uppercase text-slate-500 dark:text-slate-400">
        {value}
      </span>
      <button
        type="button"
        onClick={onReset}
        disabled={isDefault}
        title="Reset to default"
        aria-label={`Reset ${label} color`}
        className={resetButton}
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}

function AccentPicker({ colors, darkMode }) {
  const [open, setOpen] = useState(false);

  // Escape dabane se band ho jaye
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const {
    accent,
    setAccent,
    resetAccent,
    background,
    setBackground,
    resetBackground,
    defaultBackground,
  } = colors;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((previous) => !previous)}
        className={iconButton}
        title="Change theme colors"
        aria-label="Change theme colors"
        aria-expanded={open}
      >
        <Palette size={19} />
      </button>

      {open && (
        <>
          {/* Bahar click karne se band ho jaye */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-slate-200 bg-surface p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Buttons & highlights
            </p>
            <Swatches presets={ACCENT_PRESETS} value={accent} onPick={setAccent} />
            <ColorRow
              label="accent"
              value={accent}
              onChange={setAccent}
              onReset={resetAccent}
              isDefault={accent.toLowerCase() === "#2563eb"}
            />

            <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Background
            </p>
            <p className="mb-3 text-xs text-slate-400">
              Saved separately for {darkMode ? "dark" : "light"} mode
            </p>
            <Swatches
              presets={darkMode ? BG_PRESETS_DARK : BG_PRESETS_LIGHT}
              value={background}
              onPick={setBackground}
            />
            <ColorRow
              label="background"
              value={background}
              onChange={setBackground}
              onReset={resetBackground}
              isDefault={background.toLowerCase() === defaultBackground}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AccentPicker;
