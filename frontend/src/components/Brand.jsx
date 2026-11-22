import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Brand() {
  return <span className="bn-brand"><img className="bn-mark" src="/bachelorsnest-icon.svg" width="36" height="36" alt="" />BachelorsNest</span>;
}

export function ThemeButton() {
  const { darkMode, toggleDarkMode } = useTheme();
  const label = darkMode ? "Switch to light theme" : "Switch to dark theme";
  return <button type="button" className="bn-icon" onClick={toggleDarkMode} title={label} aria-label={label}>
    {darkMode ? <Sun size={19} /> : <Moon size={19} />}
  </button>;
}
