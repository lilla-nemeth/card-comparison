module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  plugins: ["react-refresh", "@typescript-eslint", "prettier"],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
    "react/require-default-props": [
      "warn",
      {
        forbidDefaultForRequired: true,
        classes: "defaultProps",
        functions: "ignore", //or "defaultArguments",
        ignoreFunctionalComponents: true,
      },
    ],
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/lines-between-class-members": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "function-declaration",
      },
    ],
  },
};
