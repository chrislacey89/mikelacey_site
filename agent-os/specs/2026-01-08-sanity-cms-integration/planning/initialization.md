# Spec Initialization: Sanity CMS Integration

## Raw Idea
Migrate the Mike Lacey portfolio site from static JSON files to Sanity CMS as the headless content management system. This will enable easy content updates without code changes, provide a visual editing interface through Sanity Studio, and leverage Sanity's CDN for optimized image delivery.

## Context from Previous Research
- Evaluated Builder.io, Sanity, Contentful, and Storyblok
- Sanity was selected as the best option for AI-assisted implementation because:
  - Schemas are TypeScript files (code-based, not UI-created)
  - Official Astro integration is stable and production-ready
  - Generous free tier allows commercial use
  - Everything is programmatic - no UI clicking required

## Current Content Structure
The site currently uses these JSON data files:
- `src/data/work.json`: 15 credits, 13 photos, 2 interviews
- `src/data/story.json`: 7 timeline events with narrative text
- `src/data/attaboys.json`: 20 testimonial document images
- `src/data/home.json`: hero content, profile info, CTAs
- `src/data/connect.json`: contact information, professional links

## Date Initialized
2026-01-08
