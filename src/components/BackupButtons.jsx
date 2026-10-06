import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Database, Upload } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import {
  LAST_BACKUP_KEY,
  backupFilename,
  buildBackupBlob,
  parseBackup,
  safeRead,
  safeSave,
} from "../utils/backup";

const btn =
  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
const outline =
  "border border-slate-200 bg-surface text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

const REMINDER_DAYS = 7;

function daysSince(iso) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 86400000;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// allClients = poori list (search filter wali nahi), taake backup mein sab kuch jaye
export default function BackupButtons({ allClients, onRestore }) {
  const fileRef = useRef(null);
  const [lastBackup, setLastBackup] = useState(() => safeRead(LAST_BACKUP_KEY));
  const [pendingRestore, setPendingRestore] = useState(null); // parsed backup, confirm ka intezar

  const handleBackup = () => {
    try {
      const blob = buildBackupBlob(allClients);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backupFilename();
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      const now = new Date().toISOString();
      safeSave(LAST_BACKUP_KEY, now);
      setLastBackup(now);
      toast.success(`Backup downloaded (${allClients.length} clients)`);
    } catch {
      toast.error("Could not create the backup file. Please try again.");
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // same file dobara chunne ki ijazat
    if (!file) return;

    try {
      const incoming = parseBackup(await file.text());
      setPendingRestore(incoming); // ab apna alert box dikhega
    } catch (err) {
      toast.error(err.message || "Could not read this backup file.");
    }
  };

  const confirmRestore = () => {
    if (!pendingRestore) return;
    try {
      onRestore(pendingRestore, "merge");
      toast.success(`Restored ${pendingRestore.length} clients`);
    } catch (err) {
      toast.error(err?.message || "Restore failed. Your current data was not changed.");
    }
    setPendingRestore(null);
  };

  const needsReminder =
    allClients.length > 0 && daysSince(lastBackup) > REMINDER_DAYS;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleBackup}
          disabled={allClients.length === 0}
          className={`${btn} ${outline}`}
        >
          <Database size={16} />
          Backup Data
        </button>

        <button onClick={() => fileRef.current?.click()} className={`${btn} ${outline}`}>
          <Upload size={16} />
          Restore
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <p
        className={`text-xs ${
          needsReminder
            ? "font-semibold text-amber-600 dark:text-amber-400"
            : "text-slate-400"
        }`}
      >
        {lastBackup
          ? `Last backup: ${formatDate(lastBackup)}`
          : "No backup downloaded yet."}
        {needsReminder && " — please download a fresh backup."}
      </p>

      <ConfirmModal
        open={Boolean(pendingRestore)}
        title="Restore from backup?"
        message={
          pendingRestore
            ? `Restore ${pendingRestore.length} clients from this backup?\n\nThey will be merged with your current data. Nothing will be deleted; clients with the same ID are updated from the backup.`
            : ""
        }
        confirmText="Restore"
        onConfirm={confirmRestore}
        onCancel={() => setPendingRestore(null)}
      />
    </div>
  );
}
