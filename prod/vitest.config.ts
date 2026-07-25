import { defineConfig } from 'vitest/config';

// Deliberately not using `getViteConfig` from 'astro/config'. That helper loads
// astro.config.mjs, which pulls in the Sanity integration and expects its
// environment — unnecessary weight for testing pure helpers in src/utils.
// Switch to it only if a test needs to render .astro components.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
