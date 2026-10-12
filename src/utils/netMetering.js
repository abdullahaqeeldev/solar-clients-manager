// Net metering hai ya nahi.
// Purane clients (jin mein netMetering field nahi hai) ke liye dates se andaza lagaya jata hai.
export function hasNetMetering(client) {
  if (client.netMetering === "Yes") return true;
  if (client.netMetering === "No") return false;
  return Boolean(client.licenseStart || client.licenseExpiry);
}
