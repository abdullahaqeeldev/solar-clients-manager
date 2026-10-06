import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getExtensionsKW, getClientTotalKW } from "./clientUtils";

// Export mein jo columns aayenge (apne client ke asli fields)
const COLUMNS = [
  { label: "Name", get: (c) => c.name },
  { label: "Address", get: (c) => c.address },
  { label: "Solar (KW)", get: (c) => c.solar },
  { label: "Installation Date", get: (c) => c.date },
  { label: "License Start", get: (c) => c.licenseStart },
  { label: "License Expiry", get: (c) => c.licenseExpiry },
  { label: "Status", get: (c) => c.status },
  { label: "Extensions", get: (c) => c.extensions?.length || 0 },
  { label: "Extensions (KW)", get: (c) => getExtensionsKW(c) },
  { label: "Total (KW)", get: (c) => getClientTotalKW(c) },
  { label: "Notes", get: (c) => c.notes },
];

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildCSVBlob(clients) {
  const rows = clients.map((c) =>
    Object.fromEntries(COLUMNS.map(({ label, get }) => [label, get(c) ?? ""]))
  );
  const csv = Papa.unparse(rows);
  // \uFEFF taake Excel mein Urdu/special characters theek dikhein
  return new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
}

export function buildPDFBlob(clients, title = "Solar Clients Report") {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.text(title, 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [COLUMNS.map((c) => c.label)],
    body: clients.map((c) => COLUMNS.map(({ get }) => get(c) ?? "")),
    styles: { fontSize: 7 },
  });
  return doc.output("blob");
}

export function downloadCSV(clients, filename = "clients.csv") {
  triggerDownload(buildCSVBlob(clients), filename);
}

export function downloadPDF(clients, filename = "clients.pdf") {
  triggerDownload(buildPDFBlob(clients), filename);
}

// Mobile pe native share menu (WhatsApp, email...). Return false agar support nahi.
export async function shareFile(blob, filename, mimeType, title = "Client Report") {
  const file = new File([blob], filename, { type: mimeType });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title });
    return true;
  }
  return false;
}
