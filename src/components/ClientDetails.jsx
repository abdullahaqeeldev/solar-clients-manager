import { User, MapPin, CalendarDays, FileText } from "lucide-react";
import { getMapUrl } from "../utils/clientUtils";
import ExtensionForm from "./ExtensionForm";
import ExtensionList from "./ExtensionList";

const boxClass =
  "rounded-lg border border-slate-200 bg-surface p-4 dark:border-slate-700 dark:bg-slate-900";
const boxLabel =
  "mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400";
const boxValue = "font-semibold text-slate-800 dark:text-slate-100";

function ClientDetails({
  client,
  onAddExtension,
  onDeleteExtension,
  onUpdateExtension,
}) {
  const infoBoxes = [
    { label: "Client", value: client.name, icon: <User size={15} /> },
    { label: "Address", value: client.address, icon: <MapPin size={15} /> },
    {
      label: "Location",
      value: client.location ? (
        <a
          href={getMapUrl(client.location)}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Open in Google Maps
        </a>
      ) : (
        "-"
      ),
      icon: <MapPin size={15} />,
    },
    {
      label: "Installation",
      value: client.date,
      icon: <CalendarDays size={15} />,
    },
    {
      label: "License Start",
      value: client.licenseStart || "-",
      icon: <CalendarDays size={15} />,
    },
    {
      label: "License Expiry",
      value: client.licenseExpiry || "-",
      icon: <CalendarDays size={15} />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {infoBoxes.map((box) => (
          <div key={box.label} className={boxClass}>
            <div className={boxLabel}>
              {box.icon}
              {box.label}
            </div>
            <div className={boxValue}>{box.value}</div>
          </div>
        ))}
      </div>

      <div className={boxClass}>
        <div className={boxLabel}>
          <FileText size={15} />
          Notes
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {client.notes || "No notes available."}
        </p>
      </div>

      <div className={boxClass}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100">
              Extensions
            </h4>
            <p className="text-xs text-slate-400">
              Add additional solar system extensions
            </p>
          </div>

          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
            {client.extensions?.length || 0}
          </span>
        </div>

        <ExtensionForm onAdd={(data) => onAddExtension(client.id, data)} />

        <ExtensionList
          extensions={client.extensions}
          onDelete={(extensionId) => onDeleteExtension(client.id, extensionId)}
          onUpdate={(extensionId, data) =>
            onUpdateExtension(client.id, extensionId, data)
          }
        />
      </div>
    </div>
  );
}

export default ClientDetails;
