import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";
import dotenv from "dotenv";
import "../src/scss/app.scss";
dotenv.config();

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: ["../public"],

  addons: [
    "@storybook/addon-interactions",
    "storybook-addon-deep-controls",
    "@chromatic-com/storybook",
    "@storybook/addon-actions",
    "@storybook/addon-viewport",
    "@storybook/addon-controls",
    "@storybook/addon-backgrounds",
    "@storybook/addon-toolbars",
    "@storybook/addon-measure",
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    {
      name: "@storybook/addon-storysource",
      options: {
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
          injectStoryParameters: false,
        },
      },
    },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    defaultName: "Docs",
    autodocs: true,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import("vite");
    if (configType === "DEVELOPMENT") {
      // Your development configuration goes here
    }
    if (configType === "PRODUCTION") {
      // Your production configuration goes here.
    }
    return mergeConfig(config, {
      base: process.env.STORYBOOK_BASE_PATH || "/",
    });
  },
};
export default config;
