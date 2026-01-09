# Specification: Sanity CMS Integration

## Goal
Migrate all content from static JSON files to Sanity CMS, enabling non-technical content updates through Sanity Studio while maintaining the existing site design and functionality.

## User Stories
- As the site owner, I want to update my credits, photos, and timeline without editing code so that I can keep my portfolio current
- As the site owner, I want to upload and manage images through a visual interface so that I don't need developer assistance
- As the site owner, I want changes to automatically rebuild the site so that updates go live quickly

## Specific Requirements

**Sanity Project Setup**
- Initialize Sanity project using `npm create sanity@latest` in the prod directory
- Configure project ID and dataset in environment variables
- Install `@sanity/astro` integration package
- Add sanity integration to `astro.config.mjs`

**Schema Definitions**
- Create TypeScript schema files in `sanity/schemaTypes/`
- Schema for `credit`: id (slug), name (string), network (string)
- Schema for `photo`: id (slug), image (image with alt text), caption (string)
- Schema for `interview`: id (slug), title (string), description (text), youtubeUrl (url)
- Schema for `timelineEvent`: id (slug), year (string), title (string), narrative (text), photo (image, optional)
- Schema for `testimonial`: id (slug), image (image with alt text), caption (string)
- Schema for `siteSettings`: hero (object), profile (object), ctas (array), contactInfo (object)

**Sanity Studio Embedding**
- Configure Sanity Studio to be embedded at `/studio` route
- Studio accessible at `themikelacey.com/studio`
- Use Sanity's default desk structure

**Content Migration**
- Create migration script `scripts/migrate-to-sanity.ts`
- Read all JSON files from `src/data/`
- Upload images to Sanity CDN and get asset references
- Create documents in Sanity with proper references
- Script should be idempotent (can run multiple times safely)

**Astro Integration**
- Configure `@sanity/astro` with project credentials
- Create utility file `src/lib/sanity.ts` for GROQ queries
- Replace JSON imports with Sanity fetches in each page
- Use Sanity's image URL builder for responsive images

**Page Updates**
- Update `index.astro` to fetch home/site settings from Sanity
- Update `story.astro` to fetch timeline events from Sanity
- Update `work.astro` to fetch credits, photos, interviews from Sanity
- Update `connect.astro` to fetch contact info from Sanity
- Update `attaboys.astro` to fetch testimonials from Sanity

**Vercel Webhook**
- Configure Sanity webhook to trigger Vercel deploy on publish
- Add webhook URL to Sanity project settings

## Visual Design
No visual assets provided - this is a backend migration with no UI changes.

## Existing Code to Leverage

**Current JSON Data Loading Pattern**
- Pages import data via `import workData from '../data/work.json'`
- Data passed as props to section components
- Pattern to replace: change import to async Sanity fetch

**Image Optimization in work.astro**
- Uses `import.meta.glob` and `getImage` for build-time optimization
- Replace with Sanity image URL builder which handles optimization automatically

**astro.config.mjs**
- Currently has `output: 'static'` and Vercel adapter
- Add `@sanity/astro` to integrations array
- Sanity integration will handle studio route

**Component Architecture**
- Components receive data as props (e.g., `WorkSection`, `StorySection`)
- Components don't need changes - only data source changes at page level

**Type Definitions**
- `src/types/index.ts` likely contains TypeScript interfaces
- Update types to match Sanity document shapes with image references

## Out of Scope
- Changing any visual design or layout
- Adding new features or pages beyond CMS integration
- User authentication for the main site (only Sanity Studio auth)
- Real-time preview beyond Sanity defaults
- Custom Sanity Studio plugins or desk configurations
- Internationalization or translations
- Form submission handling (remains unchanged)
- OG image generation changes (continues using current approach)
