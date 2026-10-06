import { useState } from "react";
import { X, Save } from "lucide-react";
import FormField from "./FormField";
import {
  emptyClient,
  getInputClass,
  validateClient,
} from "../utils/clientUtils";

function ClientForm({ editingClient, onSave, onCancel }) {
  const [formData, setFormData] = useState(() =>
    editingClient
      ? {
          name: editingClient.name,
          address: editingClient.address,
          solar: editingClient.solar,
          date: editingClient.date,
          licenseStart: editingClient.licenseStart || "",
          licenseExpiry: editingClient.licenseExpiry || "",
          status: editingClient.status,
          notes: editingClient.notes,
        }
      : emptyClient,
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateClient(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="border-b border-slate-200 bg-slate-50 p-4 md:p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            {editingClient ? "Edit Client" : "Add New Client"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter client installation details
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X size={19} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <FormField label="Client Name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter client name"
            className={getInputClass(errors.name)}
          />
        </FormField>

        <FormField label="Address" name="address" error={errors.address}>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className={getInputClass(errors.address)}
          />
        </FormField>

        <FormField
          label="Solar Capacity (KW)"
          name="solar"
          error={errors.solar}
        >
          <input
            id="solar"
            type="number"
            name="solar"
            value={formData.solar}
            onChange={handleChange}
            placeholder="e.g. 5"
            min="0"
            step="any"
            className={getInputClass(errors.solar)}
          />
        </FormField>

        <FormField label="Installation Date" name="date" error={errors.date}>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={getInputClass(errors.date)}
          />
        </FormField>

        <FormField
          label="Net Meter License Start"
          name="licenseStart"
          error={errors.licenseStart}
        >
          <input
            id="licenseStart"
            type="date"
            name="licenseStart"
            value={formData.licenseStart}
            onChange={handleChange}
            className={getInputClass(errors.licenseStart)}
          />
        </FormField>

        <FormField
          label="Net Meter License Expiry"
          name="licenseExpiry"
          error={errors.licenseExpiry}
        >
          <input
            id="licenseExpiry"
            type="date"
            name="licenseExpiry"
            value={formData.licenseExpiry}
            onChange={handleChange}
            className={getInputClass(errors.licenseExpiry)}
          />
        </FormField>

        <FormField label="Status" name="status">
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={getInputClass(false)}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </FormField>

        <FormField
          label="Notes"
          name="notes"
          className="md:col-span-2 lg:col-span-3"
        >
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
            rows={3}
            className={getInputClass(false)}
          />
        </FormField>

        <div className="flex gap-2 md:col-span-2 lg:col-span-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Save size={17} />
            {editingClient ? "Update Client" : "Save Client"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-surface px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientForm;
