// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.themikelacey.com',
  output: 'server',
  adapter: vercel(),
  prefetch: {
    prefetchAll: true
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sanity({
      projectId: 'yi6f32nh',
      dataset: 'production',
      useCdn: false, // Required for static builds
      studioBasePath: '/studio',
      stega: {
        studioUrl: 'https://www.themikelacey.com/studio'
      }
    }),
    react()
  ]
});