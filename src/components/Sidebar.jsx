import { Zap, User, FileText } from "lucide-react";

const linkBase =
  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] flex-col border-r border-slate-200 bg-white md:flex dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Solar<span className="text-blue-600">Manager</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Installation Dashboard
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <Zap size={19} />
          Dashboard
        </button>
        <button className={linkBase}>
          <User size={19} />
          Clients
        </button>
        <button className={linkBase}>
          <FileText size={19} />
          Reports
        </button>
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <p className="text-xs text-slate-400">Solar Manager v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
