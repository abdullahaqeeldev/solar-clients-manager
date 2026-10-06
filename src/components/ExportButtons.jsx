import toast from "react-hot-toast";
import { Download, FileText, Share2, Printer } from "lucide-react";
import {
  downloadCSV,
  downloadPDF,
  buildPDFBlob,
  shareFile,
} from "../utils/exportClients";

const btn =
  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
const outline =
  "border border-slate-200 bg-surface text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

export default function ExportButtons({ clients }) {
  const disabled = clients.length === 0;

  const handleShare = async () => {
    try {
      const shared = await shareFile(
        buildPDFBlob(clients),
        "clients.pdf",
        "application/pdf"
      );
      if (!shared) {
        downloadPDF(clients);
        toast("Share isn't supported on this device. The PDF was downloaded instead.");
      }
    } catch (err) {
      // User ne share menu band kar diya to error ignore karo
      if (err.name !== "AbortError") toast.error("Sharing failed. Try downloading the PDF.");
    }
  };

  const handleCSV = () => {
    try {
      downloadCSV(clients);
      toast.success("CSV downloaded");
    } catch {
      toast.error("Could not create the CSV file. Please try again.");
    }
  };

  const handlePDF = () => {
    try {
      downloadPDF(clients);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Could not create the PDF file. Please try again.");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        disabled={disabled}
        onClick={handleCSV}
        className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}
      >
        <Download size={16} />
        Export CSV
      </button>

      <button
        disabled={disabled}
        onClick={handlePDF}
        className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}
      >
        <FileText size={16} />
        Export PDF
      </button>

      <button disabled={disabled} onClick={handleShare} className={`${btn} ${outline}`}>
        <Share2 size={16} />
        Share
      </button>

      <button disabled={disabled} onClick={() => window.print()} className={`${btn} ${outline}`}>
        <Printer size={16} />
        Print
      </button>
    </div>
  );
}
