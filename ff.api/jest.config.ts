export default {
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  preset: "ts-jest",
  testEnvironment: "node",
  // testMatch: ["**/routes.test.ts"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
};
