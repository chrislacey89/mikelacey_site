# Task Breakdown: Sanity CMS Integration

## Overview
Total Tasks: 6 Task Groups

> **Context7 Audit:** This tasks list has been validated against current Sanity and @sanity/astro documentation via Context7 (2026-01-08). See `planning/context7-audit.md` for details.

## Task List

### Sanity Setup Layer

#### Task Group 1: Sanity Project Initialization
**Dependencies:** None

- [ ] 1.0 Complete Sanity project setup
  - [ ] 1.1 Initialize Sanity with Astro integration
    - Run `npx astro add @sanity/astro @astrojs/react`
    - This installs packages and updates astro.config.mjs automatically
  - [ ] 1.2 Create Sanity project (if not exists)
    - Run `npx sanity init` or create project at sanity.io/manage
    - Note project ID and dataset name
  - [ ] 1.3 Create `.env` file with Sanity credentials
    - `PUBLIC_SANITY_PROJECT_ID=<your-project-id>`
    - `PUBLIC_SANITY_DATASET=production`
  - [ ] 1.4 Configure `astro.config.mjs` with Sanity settings
    ```javascript
    sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET,
      useCdn: false,  // REQUIRED for static builds
      studioBasePath: '/studio'
    })
    ```
  - [ ] 1.5 Verify Sanity Studio loads at localhost:4321/studio
    - Run `npm run dev`
    - Navigate to `/studio`
    - Confirm login and empty studio appears

**Acceptance Criteria:**
- Sanity project initialized with valid credentials
- @sanity/astro installed and configured with `useCdn: false`
- Studio accessible at /studio route
- No build or runtime errors

### Schema Layer

#### Task Group 2: Sanity Schema Definitions
**Dependencies:** Task Group 1

- [ ] 2.0 Complete all schema definitions
  - [ ] 2.1 Create `sanity/schemaTypes/credit.ts`
    ```typescript
    import { defineType, defineField } from 'sanity'
    export const creditType = defineType({
      name: 'credit',
      title: 'Credit',
      type: 'document',
      fields: [
        defineField({ name: 'name', type: 'string', title: 'Name' }),
        defineField({ name: 'network', type: 'string', title: 'Network' })
      ]
    })
    ```
  - [ ] 2.2 Create `sanity/schemaTypes/photo.ts`
    - Fields: image (image with hotspot + alt/caption fields)
    - Use `options: { hotspot: true }` for image field
    - Add inline fields for alt and caption on image
  - [ ] 2.3 Create `sanity/schemaTypes/interview.ts`
    - Fields: title (string), description (text), youtubeUrl (url)
  - [ ] 2.4 Create `sanity/schemaTypes/timelineEvent.ts`
    - Fields: year (string), title (string), narrative (text), photo (image, optional)
  - [ ] 2.5 Create `sanity/schemaTypes/testimonial.ts`
    - Fields: image (image with hotspot + alt/caption), caption (string)
  - [ ] 2.6 Create `sanity/schemaTypes/siteSettings.ts`
    - Singleton document for hero, profile, ctas, contactInfo
  - [ ] 2.7 Update `sanity/schemaTypes/index.ts` to export all schemas
  - [ ] 2.8 Verify schemas appear in Sanity Studio
    - Restart dev server if needed
    - Confirm all document types visible in Studio

**Acceptance Criteria:**
- All 6 schema types created and exported
- Schemas visible in Sanity Studio
- Field types match existing JSON data structure
- Image fields support hotspot cropping

### Data Migration Layer

#### Task Group 3: Content Migration
**Dependencies:** Task Group 2

- [ ] 3.0 Complete content migration
  - [ ] 3.1 Create `scripts/migrate-to-sanity.ts` migration script
    - Use `@sanity/client` with write token
    - Read all JSON files from `src/data/`
    ```typescript
    import { createClient } from '@sanity/client'
    import { createReadStream } from 'fs'
    import { basename } from 'path'

    const client = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: 'production',
      apiVersion: '2024-01-01',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false
    })
    ```
  - [ ] 3.2 Implement image upload function
    ```typescript
    async function uploadImage(filePath: string) {
      const asset = await client.assets.upload(
        'image',
        createReadStream(filePath),
        { filename: basename(filePath) }
      )
      return {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
      }
    }
    ```
  - [ ] 3.3 Migrate credits data (15 documents)
  - [ ] 3.4 Migrate photos data with images (13 documents)
  - [ ] 3.5 Migrate interviews data (2 documents)
  - [ ] 3.6 Migrate timeline events (7 documents)
  - [ ] 3.7 Migrate testimonials with images (20 documents)
  - [ ] 3.8 Migrate site settings (1 singleton document)
  - [ ] 3.9 Run and verify migration
    - Execute: `npx tsx scripts/migrate-to-sanity.ts`
    - Verify all documents created in Studio
    - Verify images uploaded to CDN

**Acceptance Criteria:**
- All 57+ documents created in Sanity
- All images uploaded to Sanity CDN
- Data matches original JSON content exactly
- Migration script is idempotent

### Astro Integration Layer

#### Task Group 4: Sanity Client Setup
**Dependencies:** Task Group 3

> **Context7 Note:** Use the virtual module `sanity:client` provided by @sanity/astro. No custom client file needed.

- [ ] 4.0 Complete Sanity client integration
  - [ ] 4.1 Verify virtual module works
    - In any Astro file: `import { sanityClient } from 'sanity:client'`
    - This auto-configures based on astro.config.mjs settings
  - [ ] 4.2 Document GROQ queries for each content type
    ```groq
    // Credits
    *[_type == "credit"] | order(name asc)

    // Photos with resolved image URLs
    *[_type == "photo"] {
      _id,
      "src": image.asset->url,
      "alt": image.alt,
      caption
    }

    // Timeline events
    *[_type == "timelineEvent"] | order(year asc)

    // Site settings singleton
    *[_type == "siteSettings"][0]
    ```
  - [ ] 4.3 Create TypeScript types for Sanity responses
    - Update or create types in `src/types/`
    - Types should match Sanity document structure with resolved images
  - [ ] 4.4 Test queries in Sanity Vision tool
    - Access via Studio > Vision tab
    - Verify each query returns expected data

**Acceptance Criteria:**
- Virtual module `sanity:client` imports work
- GROQ queries documented and tested
- TypeScript types match Sanity response shapes
- Queries return correct data in Vision tool

### Page Updates Layer

#### Task Group 5: Astro Page Migration
**Dependencies:** Task Group 4

- [ ] 5.0 Complete page migrations
  - [ ] 5.1 Update `src/pages/index.astro`
    ```astro
    ---
    import { sanityClient } from 'sanity:client'
    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]`)
    ---
    ```
  - [ ] 5.2 Update `src/pages/story.astro`
    ```astro
    ---
    import { sanityClient } from 'sanity:client'
    const events = await sanityClient.fetch(
      `*[_type == "timelineEvent"] | order(year asc)`
    )
    ---
    ```
  - [ ] 5.3 Update `src/pages/work.astro`
    - Fetch credits, photos, interviews
    - Use GROQ to resolve image URLs: `"src": image.asset->url`
    - Remove old `import.meta.glob` image optimization (Sanity CDN handles it)
  - [ ] 5.4 Update `src/pages/connect.astro`
    - Fetch from siteSettings for contactInfo
  - [ ] 5.5 Update `src/pages/attaboys.astro`
    - Fetch testimonials with resolved image URLs
  - [ ] 5.6 Verify all pages render correctly
    - Run dev server
    - Check each page displays content
    - Verify images load from Sanity CDN
  - [ ] 5.7 Run production build
    - Execute `npm run build`
    - Verify no build errors
    - Test preview with `npm run preview`

**Acceptance Criteria:**
- All 5 pages fetch data from Sanity using `sanityClient`
- Pages render identical to current site
- Images load from Sanity CDN
- Production build succeeds

### Deployment Layer

#### Task Group 6: Vercel Integration
**Dependencies:** Task Group 5

- [ ] 6.0 Complete deployment integration
  - [ ] 6.1 Add Sanity environment variables to Vercel
    - `PUBLIC_SANITY_PROJECT_ID`
    - `PUBLIC_SANITY_DATASET`
  - [ ] 6.2 Deploy to Vercel and verify
    - Push changes to trigger deploy
    - Verify production site works
  - [ ] 6.3 Configure Sanity webhook for automatic rebuilds
    - Create Vercel Deploy Hook in project settings
    - Add webhook URL to Sanity: Settings > API > Webhooks
    - Trigger on: Create, Update, Delete
  - [ ] 6.4 Test end-to-end content update flow
    - Edit content in Sanity Studio
    - Publish changes
    - Verify webhook triggers rebuild
    - Verify changes appear on production site
  - [ ] 6.5 Optional cleanup
    - Delete `src/data/*.json` files
    - Remove unused imports

**Acceptance Criteria:**
- Production site works with Sanity data
- Environment variables configured in Vercel
- Webhook triggers rebuild on content publish
- Content changes flow from Studio to live site

## Execution Order

Recommended implementation sequence:
1. Sanity Setup (Task Group 1)
2. Schema Definitions (Task Group 2)
3. Content Migration (Task Group 3)
4. Astro Client Setup (Task Group 4)
5. Page Migrations (Task Group 5)
6. Deployment Integration (Task Group 6)

## Reference Documentation

Query Context7 during implementation:
- **Schemas**: `/websites/sanity_io` - "defineType defineField schema"
- **GROQ**: `/websites/sanity_io` - "GROQ query filter order projection"
- **Astro**: `/sanity-io/sanity-astro` - "sanityClient fetch astro"
- **Migration**: `/websites/sanity_io` - "client assets upload image"
