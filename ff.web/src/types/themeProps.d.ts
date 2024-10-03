import { ReactNode } from "react";

interface ThemeContextProps {
  theme: "light-theme" | "dark-theme";
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: "light-theme" | "dark-theme";
}

export type { ThemeContextProps, ThemeProviderProps };
