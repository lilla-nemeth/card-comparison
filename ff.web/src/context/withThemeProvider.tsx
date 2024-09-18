import { useEffect } from 'react';
import { useGlobals } from '@storybook/api';
import { ThemeProvider } from './ThemeContext';

const withThemeProvider = (Story, context) => {
  const [{ theme }] = useGlobals(); // This hook gives you access to global variables set in Storybook's toolbar.

  useEffect(() => {
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(`${theme}`);
  }, [theme]);

  return (
    <ThemeProvider initialTheme={theme}>
      <Story />
    </ThemeProvider>
  );
};

export default withThemeProvider;
