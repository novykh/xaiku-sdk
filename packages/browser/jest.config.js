module.exports = {
  // this is the package root, even when tests are being run at the repo level
  rootDir: process.cwd(),
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: 'https://xaiku.com/' },
  moduleFileExtensions: ['js'],
  moduleDirectories: [
    '<rootDir>/node_modules',
    './node_modules',
    '<rootDir>/../../node_modules',
    '<rootDir>/jest',
  ],
  moduleNameMapper: {
    '@xaiku/(.*)': '<rootDir>/../$1/src',
  },
  testMatch: ['<rootDir>/**/*.test.js'],
  globals: {},
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  // On CI, we do not need the pretty CLI output, as it makes logs harder to parse
  ...(process.env.CI
    ? {
        coverageReporters: ['json', 'lcov', 'clover'],
      }
    : {}),
}
