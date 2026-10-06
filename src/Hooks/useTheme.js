import { useEffect, useState } from "react";
import { THEME_KEY } from "../utils/clientUtils";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(THEME_KEY) === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((previous) => !previous);

  return { darkMode, toggleTheme };
}
