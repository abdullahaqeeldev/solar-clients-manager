import { useEffect, useState } from "react";
import { THEME_KEY } from "../utils/clientUtils";
import { safeRead, safeSave } from "../utils/backup";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(
    () => safeRead(THEME_KEY) === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    safeSave(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((previous) => !previous);

  return { darkMode, toggleTheme };
}
