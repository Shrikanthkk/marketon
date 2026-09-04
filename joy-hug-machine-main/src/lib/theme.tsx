import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "brown-gold";

interface ThemeContextType {
  theme: Theme;
  isLight: boolean;
  isDark: boolean;
  isBrownGold: boolean;
  isGalaxy: boolean; // true if dark or brown-gold for canvas backgrounds
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "markethon_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("marketon_theme") || localStorage.getItem("theme");
      if (stored === "brown-gold") {
        setThemeState("brown-gold");
        applyThemeClass("brown-gold");
      } else if (stored === "dark" || stored === "galaxy") {
        setThemeState("dark");
        applyThemeClass("dark");
      } else {
        setThemeState("light");
        applyThemeClass("light");
      }
    } catch {
      setThemeState("light");
      applyThemeClass("light");
    }
    setMounted(true);
  }, []);

  const applyThemeClass = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.classList.remove("dark", "galaxy", "brown-gold", "light");

    if (newTheme === "brown-gold") {
      root.classList.add("dark", "brown-gold");
      root.setAttribute("data-theme", "brown-gold");
      root.style.colorScheme = "dark";
    } else if (newTheme === "dark") {
      root.classList.add("dark", "galaxy");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }

    const timer = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 450);

    return () => clearTimeout(timer);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      localStorage.setItem("theme", newTheme);
    } catch {}
    applyThemeClass(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("brown-gold");
    } else {
      setTheme("light");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLight: theme === "light",
        isDark: theme === "dark",
        isBrownGold: theme === "brown-gold",
        isGalaxy: theme === "dark" || theme === "brown-gold",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as Theme,
      isLight: true,
      isDark: false,
      isBrownGold: false,
      isGalaxy: false,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
