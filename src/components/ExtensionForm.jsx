import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  emptyExtension,
  getInputClass,
  validateExtension,
} from "../utils/clientUtils";

function ExtensionForm({ onAdd }) {
  const [data, setData] = useState(emptyExtension);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleAdd = () => {
    const validationError = validateExtension(data);

    if (validationError) {
      setError(validationError);
      return;
    }

    onAdd(data);
    setData(emptyExtension);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setData(emptyExtension);
    setError("");
  };

  const inputClass = getInputClass(Boolean(error));

  // Band hone par sirf ek button, click par input section khulta hai
  if (!open) {
    return (
      <div className="mb-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          <Plus size={17} />
          Add Extension
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-down mb-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <input
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Extension name"
          aria-label="Extension name"
          className={inputClass}
        />

        <input
          type="number"
          name="kw"
          value={data.kw}
          onChange={handleChange}
          placeholder="KW"
          aria-label="Extension KW"
          min="0"
          step="any"
          className={inputClass}
        />

        <input
          type="date"
          name="date"
          value={data.date}
          onChange={handleChange}
          aria-label="Extension date"
          className={inputClass}
        />

        <div className="flex gap-2">
          <input
            name="notes"
            value={data.notes}
            onChange={handleChange}
            placeholder="Notes"
            aria-label="Extension notes"
            className={getInputClass(false)}
          />

          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add extension"
            className="flex shrink-0 items-center justify-center rounded-lg bg-purple-600 px-3 text-white transition hover:bg-purple-700"
            title="Add Extension"
          >
            <Plus size={18} />
          </button>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close extension form"
            title="Close"
            className="flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-surface px-3 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default ExtensionForm;
