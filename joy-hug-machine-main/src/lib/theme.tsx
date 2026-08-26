import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "galaxy";

interface ThemeContextType {
  theme: Theme;
  isGalaxy: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "marketon_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored theme or system preference
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("theme");
      if (stored === "galaxy" || stored === "dark") {
        setThemeState("galaxy");
        applyThemeClass("galaxy");
      } else if (stored === "light") {
        setThemeState("light");
        applyThemeClass("light");
      } else {
        // Default is light as requested
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
    
    if (newTheme === "galaxy") {
      root.classList.add("dark", "galaxy");
      root.setAttribute("data-theme", "galaxy");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark", "galaxy");
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
    const next = theme === "galaxy" ? "light" : "galaxy";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isGalaxy: theme === "galaxy",
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
      isGalaxy: false,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
