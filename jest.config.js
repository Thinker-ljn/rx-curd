module.exports = {
  collectCoverageFrom: ['src/**'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testMatch: ['**/*.spec.ts'],
  testEnvironment: 'node'
}