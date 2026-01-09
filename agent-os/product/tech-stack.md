# Tech Stack

## Framework & Runtime
- **Application Framework:** Astro 5.x (static site generation with islands architecture)
- **Language/Runtime:** Node.js with TypeScript
- **Package Manager:** npm

## Frontend
- **JavaScript Framework:** React 19 (for interactive islands/components)
- **CSS Framework:** Tailwind CSS 4
- **UI Components:** Custom components (no external UI library)
- **Astro Integrations:** @astrojs/react, @astrojs/vercel

## Content Management
- **Current:** Static JSON files in `src/data/`
- **Target:** Sanity CMS (headless)
- **Content Types:** Credits, Photos, Interviews, Timeline Events, Testimonials, Contact Info

## Database & Storage
- **Database:** None (static site)
- **Image Storage:** Local assets in `public/` directory
- **Future:** Sanity CDN for images

## Image Processing
- **Build-time:** Sharp for image optimization
- **OG Images:** @vercel/og for dynamic social images
- **QR Codes:** qrcode library (build-time generation)

## Testing & Quality
- **Linting/Formatting:** ESLint, Prettier (implicit via Astro)

## Deployment & Infrastructure
- **Hosting:** Vercel
- **Build:** Astro static build with Vercel adapter
- **Domain:** themikelacey.com

## Third-Party Services
- **CMS (Target):** Sanity (sanity.io)
- **Video Embeds:** YouTube
- **Professional Profiles:** IMDb, LinkedIn
