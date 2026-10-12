import { useState } from "react";
import { X, Save, LocateFixed, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import FormField from "./FormField";
import DatePicker from "./DatePicker";
import { hasNetMetering } from "../utils/netMetering";
import {
  emptyClient,
  getInputClass,
  getMapUrl,
  validateClient,
} from "../utils/clientUtils";

function ClientForm({ editingClient, onSave, onCancel }) {
  const [formData, setFormData] = useState(() =>
    editingClient
      ? {
          name: editingClient.name,
          address: editingClient.address,
          location: editingClient.location || "",
          solar: editingClient.solar,
          date: editingClient.date,
          netMetering: hasNetMetering(editingClient) ? "Yes" : "No",
          licenseStart: editingClient.licenseStart || "",
          licenseExpiry: editingClient.licenseExpiry || "",
          status: editingClient.status,
          notes: editingClient.notes,
        }
      : { ...emptyClient, netMetering: "Yes" },
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleNetMeteringChange = (value) => {
    setFormData((previous) => ({ ...previous, netMetering: value }));
    setErrors((previous) => ({
      ...previous,
      licenseStart: undefined,
      licenseExpiry: undefined,
    }));
  };

  // Browser se abhi ki location le kar Google Maps ka link bana do
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const link = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
        setFormData((previous) => ({ ...previous, location: link }));
        toast.success("Current location added");
      },
      () => toast.error("Could not get location. Allow location access or paste a Google Maps link."),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const mapUrl = getMapUrl(formData.location);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateClient(formData);
    const usesNetMetering = formData.netMetering === "Yes";

    // Net metering nahi hai to license dates ki zaroorat nahi
    if (!usesNetMetering) {
      delete validationErrors.licenseStart;
      delete validationErrors.licenseExpiry;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // No ho to purani dates bhi saaf kar do
    onSave(
      usesNetMetering
        ? formData
        : { ...formData, licenseStart: "", licenseExpiry: "" },
    );
  };

  return (
    <div className="animate-slide-down border-b border-slate-200 bg-slate-50 p-4 md:p-6 dark:border-slate-800 dark:bg-slate-950">
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

        <FormField label="Google Maps location" name="location">
          <div className="flex gap-2">
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Paste Google Maps link"
              className={getInputClass(false)}
            />
            <button
              type="button"
              onClick={handleCurrentLocation}
              title="Use my current location"
              aria-label="Use my current location"
              className="flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-surface px-3 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <LocateFixed size={18} />
            </button>
          </div>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              <ExternalLink size={12} />
              Check on Google Maps
            </a>
          )}
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
          <DatePicker
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                hasError={Boolean(errors.date)}
              />
        </FormField>

        <FormField label="Net Metering" name="netMetering">
          <div className="flex gap-2" role="group" aria-label="Net metering">
            {["Yes", "No"].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={formData.netMetering === option}
                onClick={() => handleNetMeteringChange(option)}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                  formData.netMetering === option
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-surface text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </FormField>

        {formData.netMetering === "Yes" && (
          <>
            <FormField
              label="Net Meter License Start"
              name="licenseStart"
              error={errors.licenseStart}
            >
              <DatePicker
                id="licenseStart"
                name="licenseStart"
                value={formData.licenseStart}
                onChange={handleChange}
                hasError={Boolean(errors.licenseStart)}
              />
            </FormField>

            <FormField
              label="Net Meter License Expiry"
              name="licenseExpiry"
              error={errors.licenseExpiry}
            >
              <DatePicker
                id="licenseExpiry"
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleChange}
                hasError={Boolean(errors.licenseExpiry)}
              />
            </FormField>
          </>
        )}

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
