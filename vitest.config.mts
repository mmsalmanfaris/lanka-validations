import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'lcov', 'json-summary'],
      // Floors sit just below current coverage; raise them as tests are added, never lower them.
      thresholds: {
        statements: 95,
        branches: 91,
        functions: 100,
        lines: 97,
      },
    },
  },
});
