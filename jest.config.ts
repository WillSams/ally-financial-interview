import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testTimeout: 30000,
  testPathIgnorePatterns: ['/node_modules/', '/.claude/'],
  // File-based state (addresses.json) is not safe for concurrent writes — run suites sequentially.
  maxWorkers: 1,
};
export default config;
