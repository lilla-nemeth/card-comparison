import '../scss/app.scss';

interface ThemeContextProps {
  theme: 'light-theme' | 'dark-theme';
  toggleTheme: () => void;
}

import { useGlobals } from '@storybook/addons';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light-theme' | 'dark-theme';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  const [theme, setTheme] = useState<'light-theme' | 'dark-theme'>(initialTheme || 'dark-theme');
  

  // Update theme when initialTheme prop changes
  useEffect(() => {
    if (initialTheme) {
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