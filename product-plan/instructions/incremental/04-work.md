# Milestone 4: Work

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)

**What you need to build:**
- Integration of the provided UI components with real data
- Image hosting/serving for photo gallery
- YouTube embed integration
- Routing callbacks

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing
- **DO** replace sample data with real content
- The components are props-based and ready to integrate

---

## Goal

Implement the Work section — Mike's portfolio showcasing credits, photo gallery, and video interviews.

## Overview

The Work section displays Mike's 44 years of production work through three stacked subsections: a grid of production credits, a masonry photo gallery with lightbox, and embedded YouTube video interviews.

**Key Functionality:**
- Display production credits in a responsive grid
- Show photo gallery in masonry layout
- Open photos in lightbox when clicked
- Embed YouTube video interviews
- Provide CTA button to navigate to Connect
- Responsive layout for all screen sizes

## What to Implement

### Components

Copy the section components from `product-plan/sections/work/components/`:

- `Work.tsx` — Main work component with all three sections
- `PhotoLightbox.tsx` — Lightbox modal for viewing photos
- `index.ts` — Exports

### Data Layer

The component expects this data shape:

```typescript
interface WorkProps {
  credits: Array<{
    id: string
    name: string
    network: string
  }>
  photos: Array<{
    id: string
    src: string
    alt: string
    caption: string
  }>
  interviews: Array<{
    id: string
    title: string
    description: string
    youtubeUrl: string
  }>
  onPhotoClick?: (id: string) => void
  onNavigateToConnect?: () => void
}
```

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onPhotoClick(id)` | Called when user clicks a photo (lightbox handles internally) |
| `onNavigateToConnect()` | Called when user clicks "Get in Touch" — route to `/connect` |

### Images & Videos

You'll need to provide:
- Career photos (12 photos in sample data)
- YouTube video URLs (2 interviews in sample data)

## Files to Reference

- `product-plan/sections/work/README.md` — Feature overview
- `product-plan/sections/work/tests.md` — Test-writing instructions
- `product-plan/sections/work/components/` — React components
- `product-plan/sections/work/types.ts` — TypeScript interfaces
- `product-plan/sections/work/sample-data.json` — Test data
- `product-plan/sections/work/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Browse Credits

1. User navigates to Work section
2. User sees header with "The Work" title
3. User scrolls through production credits grid
4. **Outcome:** User sees the breadth of Mike's experience across networks

### Flow 2: View Photo Gallery

1. User scrolls to photo gallery section
2. User sees photos in masonry layout
3. User clicks a photo
4. Photo opens in lightbox with caption
5. User presses Escape or clicks outside to close
6. **Outcome:** User has viewed the photo in detail

### Flow 3: Watch Video Interview

1. User scrolls to video interviews section
2. User sees YouTube embeds with title and description
3. User clicks play on a video
4. **Outcome:** User watches the interview embedded on the page

### Flow 4: Navigate to Connect

1. User scrolls to bottom of Work section
2. User clicks "Get in Touch" button
3. **Outcome:** User is routed to Connect section

## Done When

- [ ] Header displays with title and intro
- [ ] Credits display in responsive grid (3 columns on desktop)
- [ ] Photos display in masonry layout (3 columns on desktop)
- [ ] Clicking photo opens lightbox with image and caption
- [ ] Escape key and clicking outside closes lightbox
- [ ] YouTube videos embed and play correctly
- [ ] CTA button works at the bottom
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (fewer columns)
