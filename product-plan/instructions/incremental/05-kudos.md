# Milestone 5: Kudos

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
- Image hosting/serving for document photos
- Routing callbacks

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing
- **DO** replace sample data with real content
- The components are props-based and ready to integrate

---

## Goal

Implement the Kudos section — a gallery of "attaboy" documents showing thank-you notes and letters from colleagues.

## Overview

The Kudos section displays photos of actual thank-you notes, letters, and recognition documents Mike has received over his career. These are displayed in a masonry gallery with lightbox viewing, demonstrating his reputation through the words of people he's worked with.

**Key Functionality:**
- Display document photos in masonry layout
- Show caption on hover
- Open documents in lightbox when clicked
- Provide CTA button to navigate to Connect
- Responsive layout for all screen sizes

## What to Implement

### Components

Copy the section components from `product-plan/sections/kudos/components/`:

- `Kudos.tsx` — Main kudos component with masonry gallery
- `DocumentLightbox.tsx` — Lightbox modal for viewing documents
- `index.ts` — Exports

### Data Layer

The component expects this data shape:

```typescript
interface KudosProps {
  testimonials: Array<{
    id: string
    src: string
    alt: string
    caption: string
  }>
  onDocumentClick?: (id: string) => void
  onNavigateToConnect?: () => void
}
```

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onDocumentClick(id)` | Called when user clicks a document (lightbox handles internally) |
| `onNavigateToConnect()` | Called when user clicks "Get in Touch" — route to `/connect` |

### Images

You'll need to provide:
- Document photos (22 attaboy documents in sample data)
- These are JPG images of physical letters, notes, and certificates

## Files to Reference

- `product-plan/sections/kudos/README.md` — Feature overview
- `product-plan/sections/kudos/tests.md` — Test-writing instructions
- `product-plan/sections/kudos/components/` — React components
- `product-plan/sections/kudos/types.ts` — TypeScript interfaces
- `product-plan/sections/kudos/sample-data.json` — Test data
- `product-plan/sections/kudos/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Browse Attaboys

1. User navigates to Kudos section
2. User sees header with "Kudos" title
3. User scrolls through masonry gallery of document photos
4. User sees caption appear on hover
5. **Outcome:** User sees the breadth of recognition Mike has received

### Flow 2: View Document Detail

1. User clicks on a document photo
2. Document opens in lightbox at larger size
3. Caption displays below the document
4. User presses Escape or clicks outside to close
5. **Outcome:** User has read the document in detail

### Flow 3: Navigate to Connect

1. User scrolls to bottom of Kudos section
2. User clicks "Get in Touch" button
3. **Outcome:** User is routed to Connect section

## Done When

- [ ] Header displays with title and intro
- [ ] Documents display in masonry layout (3 columns on desktop)
- [ ] Captions show on hover
- [ ] Clicking document opens lightbox with image and caption
- [ ] Escape key and clicking outside closes lightbox
- [ ] CTA button works at the bottom
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (fewer columns)
