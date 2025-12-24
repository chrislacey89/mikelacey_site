# Milestone 3: Story

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
- Routing callbacks for CTA buttons

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing
- **DO** replace sample data with real content
- The components are props-based and ready to integrate

---

## Goal

Implement the Story section — Mike's career journey told as a scrolling narrative with year markers.

## Overview

The Story section tells Mike's 44-year career journey from 1981 to present. Visitors scroll through eras of his career, each marked with the year and a title, reading the narrative of his progression from shipping department to director's chair.

**Key Functionality:**
- Display scrolling narrative with year markers on the side
- Show each era with year, title, and narrative text
- Support optional photos per era (can be added later)
- Provide CTA buttons at the end to navigate to Work or Connect
- Responsive layout (year markers stack on mobile)

## What to Implement

### Components

Copy the section components from `product-plan/sections/story/components/`:

- `Story.tsx` — Main story component with header and footer CTAs
- `TimelineEra.tsx` — Individual era display with year marker
- `index.ts` — Exports

### Data Layer

The component expects this data shape:

```typescript
interface StoryProps {
  timelineEvents: Array<{
    id: string
    year: string
    title: string
    narrative: string
    photo: string | null
  }>
  onNavigateToWork?: () => void
  onNavigateToConnect?: () => void
}
```

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onNavigateToWork()` | Called when user clicks "See My Work" — route to `/work` |
| `onNavigateToConnect()` | Called when user clicks "Get in Touch" — route to `/connect` |

## Files to Reference

- `product-plan/sections/story/README.md` — Feature overview
- `product-plan/sections/story/tests.md` — Test-writing instructions
- `product-plan/sections/story/components/` — React components
- `product-plan/sections/story/types.ts` — TypeScript interfaces
- `product-plan/sections/story/sample-data.json` — Test data with 7 career eras
- `product-plan/sections/story/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Read Career Journey

1. User navigates to Story section
2. User sees header with "44 Years Behind the Camera"
3. User scrolls through timeline eras (1981, 1981-1987, 1987, 1991, Late 1990s, 2000s, Present)
4. **Outcome:** User understands Mike's career progression and philosophy

### Flow 2: Navigate to Work

1. User scrolls to bottom of Story section
2. User clicks "See My Work" button
3. **Outcome:** User is routed to Work section

### Flow 3: Navigate to Connect

1. User scrolls to bottom of Story section
2. User clicks "Get in Touch" button
3. **Outcome:** User is routed to Connect section

## Done When

- [ ] Header displays with title and intro
- [ ] All 7 timeline eras display with year markers and titles
- [ ] Narrative text displays correctly with proper formatting
- [ ] Timeline line and dots show on desktop
- [ ] Both CTA buttons work at the bottom
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (year markers stack above content)
