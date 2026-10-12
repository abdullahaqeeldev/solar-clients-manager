import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { getInputClass } from "../utils/clientUtils";
import {
  DAY_FIRST,
  buildMonthGrid,
  displayDate,
  isoToText,
  maskDigits,
  parseISO,
  textToISO,
  todayISO,
} from "../utils/dateUtils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const navButton =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200";

function CalendarPopup({ value, today, onApply, onClose }) {
  const start = parseISO(value) || parseISO(today);

  const [draft, setDraft] = useState(value || "");
  const [view, setView] = useState({ y: start.y, m: start.m });
  const [text, setText] = useState(isoToText(value));
  const [textError, setTextError] = useState(false);

  // Escape dabane se band ho jaye
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const shiftMonth = (delta) =>
    setView(({ y, m }) => {
      const total = y * 12 + m + delta;
      return { y: Math.floor(total / 12), m: total % 12 };
    });

  const pick = (iso) => {
    const p = parseISO(iso);
    setDraft(iso);
    setText(isoToText(iso));
    setTextError(false);
    setView({ y: p.y, m: p.m });
  };

  const handleText = (e) => {
    const masked = maskDigits(e.target.value);
    setText(masked);

    if (masked.length < 10) {
      setDraft("");
      setTextError(false);
      return;
    }

    const iso = textToISO(masked);
    if (iso) {
      pick(iso);
    } else {
      setDraft("");
      setTextError(true);
    }
  };

  const cells = buildMonthGrid(view.y, view.m);
  const title = new Date(view.y, view.m, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Bahar click karne se band ho jaye */}
      <div
        className="fixed inset-0 z-40 bg-black/30 md:bg-transparent print:hidden"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose date"
        className="animate-fade-in fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-surface p-4 shadow-xl md:absolute md:left-0 md:top-full md:mt-2 md:w-[320px] md:translate-x-0 md:translate-y-0 dark:border-slate-700 dark:bg-slate-900 print:hidden"
      >
        {/* Mahina aur arrows */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className={navButton}
          >
            <ChevronLeft size={18} />
          </button>

          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {title}
          </p>

          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className={navButton}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Date likhne ka box aur Today button */}
        <div className="mb-3 flex gap-2">
          <input
            value={text}
            onChange={handleText}
            inputMode="numeric"
            placeholder={DAY_FIRST ? "DD/MM/YYYY" : "MM/DD/YYYY"}
            aria-label="Type a date"
            aria-invalid={textError}
            className={getInputClass(textError)}
          />
          <button
            type="button"
            onClick={() => pick(today)}
            className="shrink-0 rounded-lg border border-slate-200 bg-surface px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Today
          </button>
        </div>

        {/* Hafte ke din */}
        <div className="grid grid-cols-7 text-center">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Tarikhein */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {cells.map((cell) => {
            const selected = cell.iso === draft;
            const isToday = cell.iso === today;

            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => pick(cell.iso)}
                aria-label={displayDate(cell.iso)}
                aria-pressed={selected}
                className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition ${
                  selected
                    ? "bg-blue-600 font-semibold text-white"
                    : cell.outside
                      ? "text-slate-300 hover:bg-slate-100 dark:text-slate-600 dark:hover:bg-slate-800"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {cell.day}
                {isToday && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${
                      selected ? "bg-white" : "bg-blue-600"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Cancel / Apply */}
        <div className="mt-3 flex gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 bg-surface px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!draft}
            onClick={() => onApply(draft)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

// <input type="date"> ki jagah seedha lagao. onChange ko wahi {target:{name,value}} milta hai,
// is liye purane handleChange mein koi tabdeeli nahi chahiye.
export default function DatePicker({
  id,
  name,
  value,
  onChange,
  hasError = false,
  placeholder = "Select date",
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [today] = useState(todayISO);

  const handleApply = (iso) => {
    onChange({ target: { name, value: iso } });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`${getInputClass(hasError)} flex items-center justify-between gap-2 text-left`}
      >
        <span className={value ? "" : "text-slate-400 dark:text-slate-500"}>
          {value ? displayDate(value) : placeholder}
        </span>
        <CalendarDays size={17} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <CalendarPopup
          value={value}
          today={today}
          onApply={handleApply}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
