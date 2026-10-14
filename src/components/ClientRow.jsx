import { Fragment } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2, Printer } from "lucide-react";
import ClientDetails from "./ClientDetails";
import ClientForm from "./ClientForm";
import { getStatusClass, formatKW } from "../utils/clientUtils";
import { hasNetMetering } from "../utils/netMetering";
import { showDate } from "../utils/dateUtils";

function ClientRow({
  index = 0,
  client,
  isExpanded,
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
  const isEditing = editingClient?.id === client.id;

  return (
    <Fragment>
      <tr
        onClick={onToggle}
        style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
        className="animate-fade-in cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
      >
        <td className="px-4 py-4 align-top">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              {(client.name || "?").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 print:overflow-visible print:whitespace-normal print:break-words dark:text-slate-100">
                {client.name}
              </p>
              <p className="truncate text-xs text-slate-400">ID #{client.id}</p>
            </div>
          </div>
        </td>

        <td className="truncate px-4 py-4 align-top text-sm text-slate-600 print:hidden dark:text-slate-300">
          {client.address}
        </td>

        <td className="px-4 py-4 align-top">
          <span className="whitespace-nowrap font-bold text-slate-800 dark:text-slate-100">
            {formatKW(client.solar)}{" "}
            <span className="text-xs font-semibold text-slate-400">KW</span>
          </span>
        </td>

        <td className="px-4 py-4 align-top text-sm text-slate-600 dark:text-slate-300">
          {showDate(client.date)}
        </td>

        {hasNetMetering(client) ? (
          <td className="px-4 py-4 align-top">
            <dl className="inline-grid grid-cols-[auto_auto] gap-x-2 gap-y-0.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <dt className="text-slate-400">Start</dt>
              <dd>{showDate(client.licenseStart) || "-"}</dd>
              <dt className="text-slate-400">Expiry</dt>
              <dd>{showDate(client.licenseExpiry) || "-"}</dd>
            </dl>
          </td>
        ) : (
          <td className="px-4 py-4 align-top">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              No net metering
            </span>
          </td>
        )}

        <td className="px-4 py-4 align-top">
          <span className="rounded-md bg-purple-50 px-2 py-1 text-xs font-bold text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
            {client.extensions?.length || 0}
          </span>
        </td>

        <td className="px-4 py-4 align-top">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(client.status)}`}
          >
            {client.status}
          </span>
        </td>

        <td
          className="px-4 py-4 align-top print:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center gap-1">
            <button
              onClick={onToggle}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400"
              title="View Details"
            >
              {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            </button>

            <button
              onClick={() => onPrint(client)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              title="Print Client"
            >
              <Printer size={17} />
            </button>

            <button
              onClick={() => onEdit(client)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
              title="Edit"
            >
              <Pencil size={17} />
            </button>

            <button
              onClick={() => onDelete(client.id)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              title="Delete"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </td>
      </tr>

      {isEditing ? (
        <tr className="border-b border-slate-200 dark:border-slate-800">
          <td colSpan={8} className="p-0">
            <ClientForm
              editingClient={client}
              onSave={onSave}
              onCancel={onCancel}
            />
          </td>
        </tr>
      ) : (
        isExpanded && (
          <tr className="animate-fade-in border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <td colSpan={8} className="p-5">
              <ClientDetails
                client={client}
                onAddExtension={onAddExtension}
                onDeleteExtension={onDeleteExtension}
                onUpdateExtension={onUpdateExtension}
              />
            </td>
          </tr>
        )
      )}
    </Fragment>
  );
}

export default ClientRow;
