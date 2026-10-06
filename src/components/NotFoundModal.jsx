import { useEffect } from "react";

export default function NotFoundModal({ open, onClose, message }) {
  // Escape dabane se band ho jaye
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="not-found-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
          🔍
        </div>
        <h2 id="not-found-title" className="text-lg font-semibold text-gray-800">
          No client found
        </h2>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <button
          autoFocus
          onClick={onClose}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Search again
        </button>
      </div>
    </div>
  );
}
