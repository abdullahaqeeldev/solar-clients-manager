import { useState } from "react";
import toast from "react-hot-toast";
import ExportButtons from "./ExportButtons";
import NotFoundModal from "./NotFoundModal";

// true = toast, false = modal. Jo pasand aaye wo rakh lo.
const USE_TOAST = true;

// Apna real data yahan se replace kar lena
const SAMPLE_CLIENTS = [
  { id: 1, name: "Ali Raza", email: "ali@example.com", phone: "0300-1234567" },
  { id: 2, name: "Sara Khan", email: "sara@example.com", phone: "0321-7654321" },
  { id: 3, name: "Ahmed Noor", email: "ahmed@example.com", phone: "0333-1112223" },
];

export default function ClientSearch({ clients = SAMPLE_CLIENTS }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(clients);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();

    if (!q) {
      setFiltered(clients);
      return;
    }

    const result = clients.filter((c) => c.name.toLowerCase().includes(q));

    if (result.length === 0) {
      if (USE_TOAST) toast.error("No client found. Check the spelling or try another name.");
      else setShowModal(true);
      return;
    }
    setFiltered(result);
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search client by name"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Search
        </button>
      </form>

      <div className="mb-4">
        <ExportButtons clients={filtered} />
      </div>

      <ul className="divide-y rounded-lg border">
        {filtered.map((c) => (
          <li key={c.id} className="p-3">
            <p className="font-medium text-gray-800">{c.name}</p>
            <p className="text-sm text-gray-500">
              {c.email} · {c.phone}
            </p>
          </li>
        ))}
      </ul>

      <NotFoundModal
        open={showModal}
        onClose={() => setShowModal(false)}
        message="We couldn't find a client with that name. Check the spelling or try another name."
      />
    </div>
  );
}
