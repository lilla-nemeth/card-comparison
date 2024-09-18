import type { Decorator, Preview } from "@storybook/react";
import React from 'react';
import {ThemeProvider} from '../src/context/ThemeContext';

const CustomDecorator: Decorator = (Story, context) => {
  const selectedTheme = context.globals.theme;
  // console.log("from custom decorator", selectedTheme);
  return <ThemeProvider initialTheme={selectedTheme}>
    <Story />;
  </ThemeProvider>
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light-theme",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light-theme", icon: "circlehollow", title: "Light" },
          { value: "dark-theme", icon: "circle", title: "Dark" },
          // { value: "wireframe", icon: "component", title: "wireframe" },
        ],
        showName: true,
      },
    },
  },
  decorators: [CustomDecorator],
  parameters: {
    options: {
      storySort: {
        order: [
          "Vuo Design System",
          "Atoms",
          "Molecules",
          "Organisms",
          "Templates",
          "Pages",
          "Configure your project",
          "*",
        ],
      },
    },
    controls: {
      controls: { expanded: true },
      // matchers: {
      //   color: /(background|color)$/i,
      //   date: /Date$/i,
      // },
    },
  },
  tags: ["autodocs"],
};

export default preview;
