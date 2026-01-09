# Spec Requirements: Sanity CMS Integration

## Initial Description
Migrate the Mike Lacey portfolio site from static JSON files to Sanity CMS as the headless content management system. This will enable easy content updates without code changes, provide a visual editing interface through Sanity Studio, and leverage Sanity's CDN for optimized image delivery.

## Requirements Discussion

### First Round Questions

**Q1:** Should all content types be migrated to Sanity, or should some remain as static JSON?
**Answer:** Migrate all content to Sanity (credits, photos, interviews, timeline, testimonials, home, connect)

**Q2:** Where should Sanity Studio be hosted?
**Answer:** Embedded in site - access studio at /studio route on themikelacey.com

**Q3:** How should images be handled after migration?
**Answer:** Upload all images to Sanity CDN with automatic optimization

### Existing Code to Reference

**Similar Features Identified:**
- Current data loading from `src/data/*.json` files
- Components that consume this data (pages and components)
- Astro Content Collections pattern (if used)

**Components to potentially reuse:**
- Existing page layouts and components - only data fetching needs to change
- Current image optimization pipeline can be replaced by Sanity's CDN

**Backend logic to reference:**
- `src/pages/api/og.png.ts` - dynamic OG image generation (may need to fetch data from Sanity)

### Follow-up Questions
None required - requirements are clear.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A - this is a backend/data migration with no UI changes required.

## Requirements Summary

### Functional Requirements
- Install and configure Sanity CMS for Astro
- Create Sanity schemas for all content types:
  - Credit (name, network, id)
  - Photo (src/image, alt, caption, id)
  - Interview (title, description, youtubeUrl, id)
  - TimelineEvent (year, title, narrative, photo, id)
  - Testimonial (image, alt, caption, id)
  - HomeContent (hero, profile, ctas)
  - ConnectContent (contactInfo, professionalLinks, formFields, sectionContent)
- Embed Sanity Studio at /studio route
- Create content migration script to transfer JSON data to Sanity
- Upload all images to Sanity CDN
- Update Astro pages to fetch content from Sanity instead of JSON
- Configure Vercel webhook for automatic rebuilds on content publish

### Reusability Opportunities
- Existing page components can remain unchanged - only data fetching layer changes
- Tailwind styling remains identical
- No UI/UX changes required

### Scope Boundaries
**In Scope:**
- Sanity project setup and configuration
- Schema creation for all content types
- Sanity Studio embedded at /studio
- Content migration from JSON to Sanity
- Image upload to Sanity CDN
- Astro pages updated to fetch from Sanity
- Vercel webhook for rebuilds

**Out of Scope:**
- UI/design changes
- New features or pages
- User authentication for the main site
- Comments or user-generated content
- Real-time preview (basic preview is fine)
- Internationalization/translations
- Version history UI beyond Sanity defaults

### Technical Considerations
- Integration uses @sanity/astro official package
- GROQ queries for data fetching
- Sanity CLI for project initialization
- Environment variables needed for project ID and dataset
- Build-time data fetching (static generation)
