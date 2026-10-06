import { Sun, Moon, Bell } from "lucide-react";
import AccentPicker from "./AccentPicker";

const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-surface text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";

function Topbar({ darkMode, onToggleTheme, colors }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-surface/95 px-4 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-900/95">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Dashboard
        </h2>
        <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
          Manage your solar installation clients
        </p>
      </div>

      <div className="flex items-center gap-2">
        <AccentPicker colors={colors} darkMode={darkMode} />

        <button
          onClick={onToggleTheme}
          className={iconButton}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button className={iconButton}>
          <Bell size={19} />
        </button>

        <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}

export default Topbar;
