import ClientRow from "./ClientRow";

const headers = [
  { label: "Client", width: "w-[15%]", align: "text-left" },
  { label: "Address", width: "w-[15%]", align: "text-left" },
  { label: "Solar", width: "w-[8%]", align: "text-left" },
  { label: "Install", width: "w-[11%]", align: "text-left" },
  { label: "License Start", width: "w-[11%]", align: "text-left" },
  { label: "License Expiry", width: "w-[11%]", align: "text-left" },
  { label: "Ext.", width: "w-[6%]", align: "text-left" },
  { label: "Status", width: "w-[9%]", align: "text-left" },
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
  onPrint,
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
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              isExpanded={expandedId === client.id}
              onToggle={() => onToggle(client.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddExtension={onAddExtension}
              onDeleteExtension={onDeleteExtension}
              onPrint={onPrint}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientTable;
