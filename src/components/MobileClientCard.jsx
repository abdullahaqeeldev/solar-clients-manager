import { ChevronDown, ChevronUp, Pencil, Trash2, Printer } from "lucide-react";
import ClientDetails from "./ClientDetails";
import { getStatusClass } from "../utils/clientUtils";

const labelClass = "text-[11px] font-semibold uppercase text-slate-400";

function MobileClientCard({
  client,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddExtension,
  onDeleteExtension,
  onPrint,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface dark:border-slate-800 dark:bg-slate-900">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              {client.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-bold text-slate-800 dark:text-slate-100">
                {client.name}
              </h3>
              <p className="text-xs text-slate-400">ID #{client.id}</p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(client.status)}`}
          >
            {client.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className={labelClass}>Solar</p>
            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
              {client.solar} KW
            </p>
          </div>

          <div>
            <p className={labelClass}>Date</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {client.date}
            </p>
          </div>

          <div>
            <p className={labelClass}>License Start</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {client.licenseStart || "-"}
            </p>
          </div>

          <div>
            <p className={labelClass}>License Expiry</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {client.licenseExpiry || "-"}
            </p>
          </div>

          <div className="col-span-2">
            <p className={labelClass}>Extensions</p>
            <p className="mt-1 text-sm font-bold text-purple-600 dark:text-purple-400">
              {client.extensions?.length || 0}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <p className={labelClass}>Address</p>
          <p className="mt-1 truncate text-sm text-slate-700 dark:text-slate-300">
            {client.address}
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            onClick={onToggle}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={() => onDelete(client.id)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <ClientDetails
            client={client}
            onAddExtension={onAddExtension}
            onDeleteExtension={onDeleteExtension}
          />
        </div>
      )}
    </div>
  );
}

export default MobileClientCard;
