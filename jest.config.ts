import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // to let jest understand ts
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // where to find tests files
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'], // after jest sets up the testing env,, run this file before running any of my tests
  //? connect to test db - db-memory-server / set up things / clean db after each test / disconnect everything at the end
  verbose: true, // to print detailed inforation 
};

export default config;

// collectCoverage - set to true to collect test coverage
// coverageDirectory - where jest saves the coverage reports
// moduleNameMapper - moce non-code imports(css, images) useful in fe projects
// globalSetup/ globalTeardown - used to run setup/cleanup code once for all test 
// transform - custom transormation config, use babel instead of ts-jest
// roots - specify the root directories jest should scan for tests and modules 
