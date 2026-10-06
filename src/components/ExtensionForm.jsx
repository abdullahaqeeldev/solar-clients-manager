import { useState } from "react";
import { Plus } from "lucide-react";
import {
  emptyExtension,
  getInputClass,
  validateExtension,
} from "../utils/clientUtils";

function ExtensionForm({ onAdd }) {
  const [data, setData] = useState(emptyExtension);
  const [error, setError] = useState("");

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
  };

  const inputClass = getInputClass(Boolean(error));

  return (
    <div className="mb-5">
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
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default ExtensionForm;
