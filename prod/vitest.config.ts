/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// getViteConfig loads astro.config.mjs so .astro files can be imported and
// rendered in tests via experimental_AstroContainer. That is required for
// JsonLd.astro's emission test — the highest-risk regression in this area is
// how the script tag is written, which a pure-function test cannot reach.
//
// This file is excluded from `astro check` in tsconfig.json. getViteConfig is
// typed against vite 6 (astro's), while vitest/config's types extend vite 7,
// and both majors are in the tree independently of this change. The conflict is
// type-level only — the runtime config is correct and all tests pass. See the
// tsconfig exclude comment.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
