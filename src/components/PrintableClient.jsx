import { QRCodeSVG } from "qrcode.react";
import { getClientTotalKW, getMapUrl } from "../utils/clientUtils";

// Pehla letter capital, baqi sab small
const cap = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Ye sirf print mein dikhta hai (screen pe chhupa rehta hai)
function PrintableClient({ client }) {
  const mapUrl = getMapUrl(client.location);
  const installations = client.extensions || [];

  const rows = [
    ["Client name", cap(client.name)],
    ["Client ID", `#${client.id}`],
    ["Address", cap(client.address)],
    ["Installation date", client.date],
    ["Net meter license start", client.licenseStart || "-"],
    ["Net meter license expiry", client.licenseExpiry || "-"],
    ["Status", cap(client.status)],
    ["Solar capacity", `${client.solar} KW`],
    ["Total capacity", `${getClientTotalKW(client)} KW`],
  ];

  return (
    <div className="hidden text-xs print:block">
      <h1 className="text-xl font-bold">Solar client details</h1>
      <p className="mb-3 text-[10px]">Printed on {new Date().toLocaleDateString()}</p>

      {/* Section 1: client details, boxed grid */}
      <h2 className="mb-1 text-sm font-bold">Client details</h2>
      <div className="grid grid-cols-3 border-l border-t border-black">
        {rows.map(([label, value, wide]) => (
          <div
            key={label}
            className={`border-b border-r border-black px-2 py-1.5 ${wide ? "col-span-3" : ""}`}
          >
            <p className="text-[10px] font-semibold">{label}</p>
            <p className="mt-0.5 text-xs font-medium">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-2 mt-5 text-sm font-bold">
        Installation ({installations.length})
      </h2>
      {installations.length === 0 ? (
        <p>No installations added.</p>
      ) : (
        <table className="w-full border-collapse border border-black text-left">
          <thead>
            <tr className="border-b border-black">
              <th className="border border-black px-2 py-1.5">KW</th>
              <th className="border border-black px-2 py-1.5">Date</th>
              <th className="border border-black px-2 py-1.5">Notes</th>
            </tr>
          </thead>
          <tbody>
            {installations.map((ext) => (
              <tr key={ext.id} className="border-b border-black">
                <td className="border border-black px-2 py-1.5">+{ext.kw}</td>
                <td className="border border-black px-2 py-1.5">{ext.date}</td>
                <td className="border border-black px-2 py-1.5">{cap(ext.notes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Section 3: Google Maps location + QR */}
      {mapUrl && (
        <>
          <h2 className="mb-2 mt-5 text-sm font-bold">Location</h2>
          <div className="flex items-center justify-between gap-4 border border-black px-2 py-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold">Google Maps</p>
              <p className="mt-0.5 break-all text-[10px]">{mapUrl}</p>
              <p className="mt-1 text-[10px]">Scan the QR code to open in Google Maps</p>
            </div>
            <QRCodeSVG value={mapUrl} size={90} level="L" className="shrink-0" />
          </div>
        </>
      )}
    </div>
  );
}

export default PrintableClient;
