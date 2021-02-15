process.env.TZ = 'UTC';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/setup.ts'],
};
