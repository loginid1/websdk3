// Copyright (C) LoginID

module.exports = {
  testMatch: ["<rootDir>/packages/**/*.test.ts"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  projects: [
    "<rootDir>/packages/core",
    "<rootDir>/packages/checkout",
    "<rootDir>/packages/websdk3",
  ],
};
