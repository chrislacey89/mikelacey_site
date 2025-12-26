# Project: Mike Lacey Portfolio

## Site Information
- **URL**: https://www.themikelacey.com
- **Owner**: Mike Lacey
- **Role**: Television Director
- **Experience**: Decades in sports and entertainment production

## Tech Stack
- Astro 5.x
- React 19
- Tailwind CSS 4
- Deployed on Vercel

## Key Files
- `src/layouts/BaseLayout.astro` - Main layout with OG meta tags
- `src/pages/api/og.png.ts` - Dynamic OG image generation endpoint
- `astro.config.mjs` - Astro configuration with Vercel adapter

## OG Image
Dynamic OG images are generated at `/api/og.png` using `@vercel/og`.
Accepts query params: `?title=` and `?subtitle=`
