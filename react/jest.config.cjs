module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: { '\\.(png|jpe?g|gif|svg|webp)$': '<rootDir>/test/fileMock.js' },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/**/index.js'],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
};
