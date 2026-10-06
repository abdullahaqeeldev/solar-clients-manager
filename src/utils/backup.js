// Safe storage + backup helpers (src/utils/backup.js)

export const BACKUP_COPY_KEY = "solar-clients-backup"; // pichla achha save (rolling copy)
export const LAST_BACKUP_KEY = "solar-last-backup"; // aakhri file backup ki date

// localStorage mein likhna, error aaye to crash nahi, {ok, error} wapas
export function safeSave(key, value) {
  try {
    localStorage.setItem(key, value);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function safeRead(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

// Browser ko kehna ke ye data automatically delete na kare (storage pressure mein)
export async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch {
    // ignore
  }
  return false;
}

export function parseClientList(text) {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function buildBackupBlob(clients) {
  const payload = {
    app: "solar-clients",
    version: 1,
    exportedAt: new Date().toISOString(),
    count: clients.length,
    clients,
  };
  return new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
}

export function backupFilename() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `solar-clients-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
}

// Backup file parhna aur check karna. Galat file ho to error throw.
export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("This file is not a valid backup (not JSON).");
  }

  const list = Array.isArray(data) ? data : data?.clients;
  if (!Array.isArray(list)) {
    throw new Error("This file does not contain a clients list.");
  }

  const clean = list
    .filter((c) => c && typeof c === "object" && String(c.name || "").trim())
    .map((c) => ({
      id: c.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(c.name || ""),
      address: String(c.address || ""),
      solar: c.solar ?? "",
      date: String(c.date || ""),
      licenseStart: String(c.licenseStart || ""),
      licenseExpiry: String(c.licenseExpiry || ""),
      status: c.status || "Active",
      notes: String(c.notes || ""),
      extensions: Array.isArray(c.extensions) ? c.extensions : [],
    }));

  if (clean.length === 0) throw new Error("No valid clients found in this file.");
  return clean;
}

// Restore ka tareeqa: "merge" = mojooda + backup (same id par backup jeetay), "replace" = sab badal do
export function mergeClients(current, incoming) {
  const map = new Map(current.map((c) => [String(c.id), c]));
  incoming.forEach((c) => map.set(String(c.id), c));
  return Array.from(map.values());
}
