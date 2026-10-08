import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

// Default browser confirm() ki jagah apna alert box
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  // Escape dabane se band ho jaye
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass = danger
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 print:hidden"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="animate-pop w-full max-w-sm rounded-2xl bg-surface p-6 text-center shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            danger
              ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          }`}
        >
          <AlertTriangle size={26} />
        </div>

        <h2
          id="confirm-title"
          className="text-lg font-semibold text-slate-800 dark:text-slate-100"
        >
          {title}
        </h2>

        <p className="mt-2 whitespace-pre-line text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-200 bg-surface px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
