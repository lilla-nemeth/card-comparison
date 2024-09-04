import type { Preview } from "@storybook/react";
// import "../src/scss/app.scss";

const preview: Preview = {
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
