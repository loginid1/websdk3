// eslint-disable-next-line no-undef
module.exports = {
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
}

