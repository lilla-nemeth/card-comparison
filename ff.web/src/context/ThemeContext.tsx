import '../scss/app.scss';

interface ThemeContextProps {
  theme: 'light-theme' | 'dark-theme';
  toggleTheme: () => void;
}

import { createContext, ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light-theme' | 'dark-theme';
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  console.log("initialTheme", initialTheme)
  const [theme, setTheme] = useState<'light-theme' | 'dark-theme'>(initialTheme || 'dark-theme');
  
  // Update theme when initialTheme prop changes, only can be changed through storybook
  useEffect(() => {
    if (initialTheme != theme) {
      console.log("CHANGING THEME")
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light-theme' ? 'dark-theme' : 'light-theme'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};