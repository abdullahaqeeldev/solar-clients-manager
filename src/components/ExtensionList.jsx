import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

function ExtensionList({ extensions = [], onDelete }) {
  const [pending, setPending] = useState(null);

  const confirmDelete = () => {
    if (!pending) return;
    try {
      onDelete(pending.id);
      toast.success("Extension deleted");
    } catch (err) {
      toast.error(err?.message || "Could not delete this extension. Please try again.");
    }
    setPending(null);
  };

  if (extensions.length === 0) {
    return (
      <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-400 dark:bg-slate-800">
        No extensions added yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {extensions.map((extension) => (
        <div
          key={extension.id}
          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {extension.name}
              </p>
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                +{extension.kw} KW
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              {extension.date}
              {extension.notes ? ` • ${extension.notes}` : ""}
            </p>
          </div>

          <button
            onClick={() => setPending(extension)}
            className="self-start rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:self-auto dark:hover:bg-red-950/40 dark:hover:text-red-400"
            title="Delete Extension"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <ConfirmModal
        open={Boolean(pending)}
        danger
        title="Delete extension?"
        message={
          pending
            ? `"${pending.name}" (+${pending.kw} KW) will be removed. This cannot be undone.`
            : ""
        }
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

export default ExtensionList;
