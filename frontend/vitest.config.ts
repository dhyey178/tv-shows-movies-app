import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: [
      '**/*.test.{ts,js,mjs,cjs,tsx,jsx}',
      '**/*.spec.{ts,js,mjs,cjs,tsx,jsx}',
    ],
    coverage: {
      enabled: true,
      reporter: ['text', 'json-summary', 'html'],
      exclude: ['node_modules', '.nuxt', 'dist', '**/build/**', '**/coverage/**'],
    },
  },
});