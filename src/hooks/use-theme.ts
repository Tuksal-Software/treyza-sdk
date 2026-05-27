import { useState, useEffect } from "react";
import type { ThemeVars } from "../types";

function readThemeFromRoot(): ThemeVars {
  const style = getComputedStyle(document.documentElement);
  return {
    primary: style.getPropertyValue("--primary").trim(),
    secondary: style.getPropertyValue("--secondary").trim(),
    background: style.getPropertyValue("--background").trim(),
    foreground: style.getPropertyValue("--foreground").trim(),
    radius: style.getPropertyValue("--theme-radius").trim(),
    font: style.getPropertyValue("--font-sans").trim(),
  };
}

export function useTheme(): ThemeVars {
  const [theme, setTheme] = useState<ThemeVars>(readThemeFromRoot);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "THEME_VARS_UPDATE") {
        setTheme(readThemeFromRoot());
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return theme;
}
