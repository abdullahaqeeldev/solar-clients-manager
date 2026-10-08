export const STORAGE_KEY = "solar-clients";
export const THEME_KEY = "solar-theme";

export const emptyClient = {
  name: "",
  address: "",
  location: "",
  solar: "",
  date: "",
  licenseStart: "",
  licenseExpiry: "",
  status: "Active",
  notes: "",
};

export const emptyExtension = {
  name: "",
  kw: "",
  date: "",
  notes: "",
};

export const inputClass =
  "w-full rounded-lg border border-slate-200 bg-surface px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900";

export function getStatusClass(status) {
  if (status === "Active") {
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400";
  }
  if (status === "Pending") {
    return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400";
  }
  return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400";
}

export function getExtensionsKW(client) {
  return (client.extensions || []).reduce(
    (sum, extension) => sum + Number(extension.kw || 0),
    0,
  );
}

export function getClientTotalKW(client) {
  return Number(client.solar || 0) + getExtensionsKW(client);
}

export function getTotalKW(clients) {
  return clients.reduce((total, client) => total + getClientTotalKW(client), 0);
}

export function getTotalExtensions(clients) {
  return clients.reduce(
    (total, client) => total + (client.extensions?.length || 0),
    0,
  );
}

export function getInputClass(hasError) {
  if (!hasError) return inputClass;
  return inputClass
    .replace("border-slate-200", "border-red-500")
    .replace("dark:border-slate-700", "dark:border-red-500");
}

export function validateClient(data) {
  const errors = {};

  if (!data.name.trim()) errors.name = "Name is required.";

  if (!data.address.trim()) errors.address = "Address is required.";

  if (!String(data.solar).trim()) {
    errors.solar = "Capacity is required.";
  } else if (Number(data.solar) <= 0) {
    errors.solar = "Capacity must be greater than 0.";
  }

  if (!data.date) errors.date = "Installation date is required.";

  if (!data.licenseStart) {
    errors.licenseStart = "License start date is required.";
  }

  if (!data.licenseExpiry) {
    errors.licenseExpiry = "License expiry date is required.";
  } else if (data.licenseStart && data.licenseExpiry <= data.licenseStart) {
    errors.licenseExpiry = "Expiry must be after the start date.";
  }

  return errors;
}

export function validateExtension(data) {
  if (!data.name.trim()) return "Extension name is required.";
  if (!String(data.kw).trim() || Number(data.kw) <= 0) {
    return "KW must be greater than 0.";
  }
  if (!data.date) return "Extension date is required.";
  return "";
}

// Location text/link se Google Maps ka link banata hai (khali ho to "")
export function getMapUrl(location) {
  const value = String(location || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}
