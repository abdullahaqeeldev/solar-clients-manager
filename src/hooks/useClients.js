import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  STORAGE_KEY,
  getTotalKW,
  getTotalExtensions,
} from "../utils/clientUtils";
import {
  BACKUP_COPY_KEY,
  safeRead,
  safeSave,
  parseClientList,
  requestPersistentStorage,
  mergeClients,
} from "../utils/backup";

// Start par data load: pehle main copy, na mile/kharab ho to rolling backup copy
function loadClients() {
  const main = safeRead(STORAGE_KEY);
  if (main === null) return { clients: [], recovered: false };

  const list = parseClientList(main);
  if (list) return { clients: list, recovered: false };

  // Main data kharab hai: kharab text alag rakh lo (overwrite na ho) aur backup copy try karo
  safeSave(`${STORAGE_KEY}-corrupt`, main);
  const fallback = parseClientList(safeRead(BACKUP_COPY_KEY) || "");
  return { clients: fallback || [], recovered: Boolean(fallback) };
}

export default function useClients() {
  const [initial] = useState(loadClients);
  const [clients, setClients] = useState(initial.clients);
  const [search, setSearch] = useState("");
  const saveErrorShown = useRef(false);

  useEffect(() => {
    requestPersistentStorage();
    if (initial.recovered) {
      toast.success("Data was recovered from the automatic backup copy.");
    }
  }, [initial.recovered]);

  useEffect(() => {
    // Naya save karne se pehle pichla achha data rolling copy mein rakh lo
    const previous = safeRead(STORAGE_KEY);
    if (previous && parseClientList(previous)?.length) {
      safeSave(BACKUP_COPY_KEY, previous);
    }

    const result = safeSave(STORAGE_KEY, JSON.stringify(clients));
    if (!result.ok && !saveErrorShown.current) {
      saveErrorShown.current = true;
      toast.error(
        "Could not save data in this browser (storage full or blocked). Download a backup now!",
        { duration: 8000 },
      );
    }
    if (result.ok) saveErrorShown.current = false;
  }, [clients]);

  // Backup file se restore: "merge" ya "replace"
  const restoreClients = (incoming, mode = "merge") => {
    setClients((current) =>
      mode === "replace" ? incoming : mergeClients(current, incoming),
    );
  };

  const addClient = (data) => {
    const newClient = { id: Date.now(), ...data, extensions: [] };
    setClients((previous) => [newClient, ...previous]);
  };

  const updateClient = (id, data) => {
    setClients((previous) =>
      previous.map((client) =>
        client.id === id ? { ...client, ...data } : client,
      ),
    );
  };

  const deleteClient = (id) => {
    setClients((previous) => previous.filter((client) => client.id !== id));
  };

  const addExtension = (clientId, extensionData) => {
    const newExtension = { id: Date.now(), ...extensionData };

    setClients((previous) =>
      previous.map((client) =>
        client.id === clientId
          ? {
              ...client,
              extensions: [...(client.extensions || []), newExtension],
            }
          : client,
      ),
    );
  };

  const deleteExtension = (clientId, extensionId) => {
    setClients((previous) =>
      previous.map((client) =>
        client.id === clientId
          ? {
              ...client,
              extensions: (client.extensions || []).filter(
                (extension) => extension.id !== extensionId,
              ),
            }
          : client,
      ),
    );
  };

  const updateExtension = (clientId, extensionId, data) => {
    setClients((previous) =>
      previous.map((client) =>
        client.id === clientId
          ? {
              ...client,
              extensions: (client.extensions || []).map((extension) =>
                extension.id === extensionId
                  ? { ...extension, ...data }
                  : extension,
              ),
            }
          : client,
      ),
    );
  };

  const filteredClients = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return clients;

    return clients.filter(
      (client) =>
        (client.name || "").toLowerCase().includes(query) ||
        (client.address || "").toLowerCase().includes(query),
    );
  }, [clients, search]);

  const stats = {
    totalClients: clients.length,
    totalKW: getTotalKW(clients),
    totalExtensions: getTotalExtensions(clients),
  };

  return {
    clients,
    filteredClients,
    search,
    setSearch,
    stats,
    addClient,
    updateClient,
    deleteClient,
    addExtension,
    deleteExtension,
    updateExtension,
    restoreClients,
  };
}