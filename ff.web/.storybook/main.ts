import remarkGfm from "remark-gfm";
import type { StorybookConfig } from "@storybook/react-vite";
import dotenv from "dotenv";
dotenv.config();

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: ["../public"],

  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "storybook-addon-deep-controls",
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
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    defaultName: "Documentation",
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
