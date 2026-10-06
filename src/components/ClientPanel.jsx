import { useState } from "react";
import toast from "react-hot-toast";
import { Search, Plus } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import ClientForm from "./ClientForm";
import ClientTable from "./ClientTable";
import MobileClientCard from "./MobileClientCard";
import ExportButtons from "./ExportButtons";
import BackupButtons from "./BackupButtons";

function ClientPanel({
  clients,
  filteredClients,
  search,
  onSearchChange,
  showForm,
  editingClient,
  onAdd,
  onSave,
  onCancel,
  expandedId,
  onToggle,
  onEdit,
  onDelete,
  onAddExtension,
  onDeleteExtension,
  onPrint,
  onRestore,
}) {
  // Delete par pehle puchho, phir hi delete karo
  const [deleteTarget, setDeleteTarget] = useState(null);

  const requestDelete = (id) => {
    const client = clients.find((c) => c.id === id);
    if (client) setDeleteTarget(client);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    try {
      onDelete(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch (err) {
      toast.error(err?.message || "Could not delete this client. Please try again.");
    }
    setDeleteTarget(null);
  };

  const rowProps = {
    expandedId,
    onToggle,
    onEdit,
    onDelete: requestDelete,
    onAddExtension,
    onDeleteExtension,
    onPrint,
  };

  return (
    <section className="relative rounded-xl border border-slate-200 bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5 dark:border-slate-800">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">
            Client List
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All registered solar clients
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row print:hidden">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-surface py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-[230px] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-blue-900"
            />
          </div>

          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>
      </div>

      {/* EXPORT / PRINT */}
      <div className="border-b border-slate-200 px-4 py-3 md:px-5 dark:border-slate-800 print:hidden">
        <ExportButtons clients={filteredClients} />
      </div>

      {/* BACKUP / RESTORE (poori list, search filter ke baghair) */}
      <div className="border-b border-slate-200 px-4 py-3 md:px-5 dark:border-slate-800 print:hidden">
        <BackupButtons allClients={clients} onRestore={onRestore} />
      </div>

      {/* FORM (key resets the form when switching between add / edit) */}
      {showForm && (
        <ClientForm
          key={editingClient?.id ?? "new"}
          editingClient={editingClient}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}

      {/* LIST */}
      {filteredClients.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-400">No clients found.</p>
        </div>
      ) : (
        <>
          <ClientTable clients={filteredClients} {...rowProps} />

          <div className="space-y-3 p-4 md:hidden print:hidden">
            {filteredClients.map((client) => (
              <MobileClientCard
                key={client.id}
                client={client}
                isExpanded={expandedId === client.id}
                onToggle={() => onToggle(client.id)}
                onEdit={onEdit}
                onDelete={requestDelete}
                onAddExtension={onAddExtension}
                onDeleteExtension={onDeleteExtension}
                onPrint={onPrint}
              />
            ))}
          </div>
        </>
      )}

      {/* FOOTER */}
      <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-400 dark:border-slate-800">
        Showing {filteredClients.length} of {clients.length} clients
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        danger
        title="Delete client?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" and its ${deleteTarget.extensions?.length || 0} extension(s) will be permanently deleted. This cannot be undone.\n\nTip: download a backup first if you are unsure.`
            : ""
        }
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}

export default ClientPanel;
