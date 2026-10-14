import ClientRow from "./ClientRow";

const headers = [
  { label: "Client", width: "w-[16%] print:w-[28%]", align: "text-left" },
  { label: "Address", width: "w-[13%] print:hidden", align: "text-left" },
  { label: "Solar", width: "w-[10%] print:w-[10%]", align: "text-left" },
  { label: "Install", width: "w-[11%] print:w-[16%]", align: "text-left" },
  { label: "License", width: "w-[20%] print:w-[28%]", align: "text-left" },
  { label: "Ext.", width: "w-[6%] print:w-[8%]", align: "text-left" },
  { label: "Status", width: "w-[10%] print:w-[10%]", align: "text-left" },
  { label: "Actions", width: "w-[14%] print:hidden", align: "text-center" },
];

function ClientTable({
  clients,
  expandedId,
  onToggle,
  onEdit,
  onDelete,
  onAddExtension,
  onDeleteExtension,
  onUpdateExtension,
  onPrint,
  editingClient,
  onSave,
  onCancel,
}) {
  return (
    <div className="hidden md:block print:block">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
            {headers.map((header) => (
              <th
                key={header.label}
                className={`${header.width} ${header.align} px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {clients.map((client, index) => (
            <ClientRow
              key={client.id}
              index={index}
              client={client}
              isExpanded={expandedId === client.id}
              onToggle={() => onToggle(client.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddExtension={onAddExtension}
              onDeleteExtension={onDeleteExtension}
              onUpdateExtension={onUpdateExtension}
              onPrint={onPrint}
              editingClient={editingClient}
              onSave={onSave}
              onCancel={onCancel}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientTable;
