import { User, Zap, PlusCircle } from "lucide-react";
import { formatKW } from "../utils/clientUtils";
import useCountUp from "../hooks/useCountUp";

function StatsCards({ totalClients, totalKW, totalExtensions }) {
  const animatedClients = useCountUp(totalClients);
  const animatedKW = useCountUp(totalKW);
  const animatedExtensions = useCountUp(totalExtensions);

  const cards = [
    {
      label: "Total Clients",
      value: Math.round(animatedClients),
      icon: <User size={21} />,
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      label: "Total Solar Capacity",
      value: `${formatKW(animatedKW)} KW`,
      icon: <Zap size={21} />,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      label: "Total Extensions",
      value: Math.round(animatedExtensions),
      icon: <PlusCircle size={21} />,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <div
          key={card.label}
          style={{ animationDelay: `${index * 90}ms` }}
          className="animate-fade-up rounded-xl border border-slate-200 bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              <h3 className="mt-2 break-all text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {card.value}
              </h3>
            </div>

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
