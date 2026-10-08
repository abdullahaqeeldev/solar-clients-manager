import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Topbar from "./components/Topbar";
import StatsCards from "./components/StatsCards";
import ClientPanel from "./components/ClientPanel";
import PrintableClient from "./components/PrintableClient";
import useClients from "./hooks/useClients";
import useTheme from "./hooks/useTheme";
import useAccent from "./hooks/useAccent";

function App() {
  const { darkMode, toggleTheme } = useTheme();
  const colors = useAccent(darkMode);

  const {
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
  } = useClients();

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [printClient, setPrintClient] = useState(null);

  // Ek client print karna: pehle uska sheet render hota hai, phir print dialog khulta hai
  useEffect(() => {
    if (!printClient) return;
    const reset = () => setPrintClient(null);
    window.addEventListener("afterprint", reset, { once: true });
    window.print();
    return () => window.removeEventListener("afterprint", reset);
  }, [printClient]);

  const handleAdd = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleSave = (formData) => {
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData);
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    deleteClient(id);
    if (expandedId === id) setExpandedId(null);
  };

  const handleToggle = (id) => {
    setExpandedId((previous) => (previous === id ? null : id));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Toaster position="top-center" />
      <main className={`min-h-screen ${printClient ? "print:hidden" : ""}`}>
        <div className="print:hidden">
          <Topbar
            darkMode={darkMode}
            onToggleTheme={toggleTheme}
            colors={colors}
          />
        </div>

        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">
              Solar Clients
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track clients, solar capacity and system extensions.
            </p>
            <p className="mt-1 hidden text-xs print:block">
              Printed on {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="print:hidden">
            <StatsCards {...stats} />
          </div>

          <ClientPanel
            clients={clients}
            filteredClients={filteredClients}
            search={search}
            onSearchChange={setSearch}
            showForm={showForm}
            editingClient={editingClient}
            onAdd={handleAdd}
            onSave={handleSave}
            onCancel={handleCancel}
            expandedId={expandedId}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddExtension={addExtension}
            onDeleteExtension={deleteExtension}
            onUpdateExtension={updateExtension}
            onPrint={setPrintClient}
            onRestore={restoreClients}
          />
        </div>
      </main>

      {printClient && <PrintableClient client={printClient} />}
    </div>
  );
}

export default App;
