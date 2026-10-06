import { getExtensionsKW, getClientTotalKW } from "../utils/clientUtils";

// Ye sirf print mein dikhta hai (screen pe chhupa rehta hai)
function PrintableClient({ client }) {
  const extensions = client.extensions || [];

  const rows = [
    ["Client Name", client.name],
    ["Client ID", `#${client.id}`],
    ["Address", client.address],
    ["Installation Date", client.date],
    ["Net Meter License Start", client.licenseStart || "-"],
    ["Net Meter License Expiry", client.licenseExpiry || "-"],
    ["Status", client.status],
    ["Solar Capacity", `${client.solar} KW`],
    ["Extensions Capacity", `${getExtensionsKW(client)} KW`],
    ["Total Capacity", `${getClientTotalKW(client)} KW`],
  ];

  return (
    <div className="hidden print:block">
      <h1 className="text-2xl font-bold">Solar Client Details</h1>
      <p className="mb-4 text-xs">Printed on {new Date().toLocaleDateString()}</p>

      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-black">
              <td className="w-1/3 py-2 font-semibold">{label}</td>
              <td className="py-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mb-1 mt-6 text-lg font-bold">Notes</h2>
      <p className="text-sm">{client.notes || "No notes available."}</p>

      <h2 className="mb-2 mt-6 text-lg font-bold">
        Extensions ({extensions.length})
      </h2>
      {extensions.length === 0 ? (
        <p className="text-sm">No extensions added.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2">Name</th>
              <th className="py-2">KW</th>
              <th className="py-2">Date</th>
              <th className="py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {extensions.map((ext) => (
              <tr key={ext.id} className="border-b border-black">
                <td className="py-2">{ext.name}</td>
                <td className="py-2">+{ext.kw}</td>
                <td className="py-2">{ext.date}</td>
                <td className="py-2">{ext.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PrintableClient;
