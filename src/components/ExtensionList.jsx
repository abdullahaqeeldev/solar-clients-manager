import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Pencil, Check, X } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { getInputClass, validateExtension } from "../utils/clientUtils";

const iconBtn =
  "rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-700";

function ExtensionList({ extensions = [], onDelete, onUpdate }) {
  const [pending, setPending] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editError, setEditError] = useState("");

  const startEdit = (extension) => {
    setEditingId(extension.id);
    setEditData({
      name: extension.name || "",
      kw: extension.kw ?? "",
      date: extension.date || "",
      notes: extension.notes || "",
    });
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
    setEditError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((previous) => ({ ...previous, [name]: value }));
    setEditError("");
  };

  const saveEdit = () => {
    const validationError = validateExtension(editData);
    if (validationError) {
      setEditError(validationError);
      return;
    }
    try {
      onUpdate(editingId, editData);
      toast.success("Extension updated");
      cancelEdit();
    } catch (err) {
      toast.error(err?.message || "Could not update this extension. Please try again.");
    }
  };

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

  const editInput = getInputClass(Boolean(editError));

  return (
    <div className="space-y-2">
      {extensions.map((extension) =>
        editingId === extension.id ? (
          <div
            key={extension.id}
            className="animate-fade-in rounded-lg border border-blue-500 bg-slate-50 p-3 dark:bg-slate-800"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <input
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                placeholder="Extension name"
                aria-label="Extension name"
                className={editInput}
              />
              <input
                type="number"
                name="kw"
                value={editData.kw}
                onChange={handleEditChange}
                placeholder="KW"
                aria-label="Extension KW"
                min="0"
                step="any"
                className={editInput}
              />
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleEditChange}
                aria-label="Extension date"
                className={editInput}
              />
              <input
                name="notes"
                value={editData.notes}
                onChange={handleEditChange}
                placeholder="Notes"
                aria-label="Extension notes"
                className={getInputClass(false)}
              />
            </div>

            {editError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                {editError}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={saveEdit}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Check size={16} />
                Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-surface px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
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

            <div className="flex items-center gap-1 self-start sm:self-auto">
              <button
                onClick={() => startEdit(extension)}
                className={`${iconBtn} hover:text-blue-600 dark:hover:text-blue-400`}
                title="Edit Extension"
                aria-label="Edit extension"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => setPending(extension)}
                className={`${iconBtn} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400`}
                title="Delete Extension"
                aria-label="Delete extension"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ),
      )}

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
