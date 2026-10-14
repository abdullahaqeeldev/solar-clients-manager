// Date picker ke helpers. Dates hamesha "YYYY-MM-DD" text mein save hoti hain (purane data jaisi).

// true = DD/MM/YYYY (Pakistan), false = MM/DD/YYYY
export const DAY_FIRST = true;

const pad = (n) => String(n).padStart(2, "0");

// month 0 se shuru hota hai (0 = January)
export const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function parseISO(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) };
}

function isRealDate(y, m, d) {
  if (y < 1900 || y > 2100) return false;
  const date = new Date(y, m, d);
  return (
    date.getFullYear() === y && date.getMonth() === m && date.getDate() === d
  );
}

export function todayISO() {
  const now = new Date();
  return toISO(now.getFullYear(), now.getMonth(), now.getDate());
}

// "2026-10-12" -> "12 Oct 2026"
export function displayDate(iso) {
  const p = parseISO(iso);
  if (!p) return "";
  return new Date(p.y, p.m, p.d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Screen/print par dikhane ke liye: sahi ISO date ho to "12 Oct 2026", warna jaisi thi waisi
export function showDate(iso) {
  return displayDate(iso) || iso || "";
}

// "2026-10-12" -> "12/10/2026" (typing box ke liye)
export function isoToText(iso) {
  const p = parseISO(iso);
  if (!p) return "";
  const a = pad(p.d);
  const b = pad(p.m + 1);
  return DAY_FIRST ? `${a}/${b}/${p.y}` : `${b}/${a}/${p.y}`;
}

// Sirf digits rakho aur apne aap "/" laga do: 12102026 -> 12/10/2026
export function maskDigits(raw) {
  const digits = String(raw).replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join("/");
}

// "12/10/2026" -> "2026-10-12", galat date (jaise 31/02/2026) ho to null
export function textToISO(text) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text || "");
  if (!match) return null;
  const first = Number(match[1]);
  const second = Number(match[2]);
  const y = Number(match[3]);
  const d = DAY_FIRST ? first : second;
  const m = (DAY_FIRST ? second : first) - 1;
  return isRealDate(y, m, d) ? toISO(y, m, d) : null;
}

// Calendar ka grid: poore hafte (Sun se Sat), pichle/agle mahine ke din bhi
export function buildMonthGrid(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = Math.ceil((firstWeekday + daysInMonth) / 7);

  return Array.from({ length: rows * 7 }, (_, i) => {
    const date = new Date(year, month, 1 - firstWeekday + i);
    return {
      iso: toISO(date.getFullYear(), date.getMonth(), date.getDate()),
      day: date.getDate(),
      outside: date.getMonth() !== month,
    };
  });
}
