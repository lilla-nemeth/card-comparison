import type { Preview } from "@storybook/react";
import React from 'react';
// import "../src/scss/app.scss";
import { ThemeProvider } from "../src/context/ThemeContext";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        {Story()}
      </ThemeProvider>
    ),
  ],
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
