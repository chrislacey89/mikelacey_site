# Milestone 2: Home

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)

**What you need to build:**
- Integration of the provided UI components with real data
- Routing callbacks for CTA buttons

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing
- **DO** replace sample data with real data/content
- The components are props-based and ready to integrate

---

## Goal

Implement the Home section — the hero landing page that creates the first impression.

## Overview

The Home section is a full-screen hero landing page featuring Mike's production background image, headshot, intro text, and call-to-action buttons that guide visitors to explore the site.

**Key Functionality:**
- Display full-viewport hero with background image
- Show Mike's headshot prominently
- Display headline, name, title, and tagline
- Provide three CTA buttons linking to Story, Work, and Connect
- Responsive layout for all screen sizes

## What to Implement

### Components

Copy the section components from `product-plan/sections/home/components/`:

- `HomeHero.tsx` — The main hero component
- `index.ts` — Exports

### Data Layer

The component expects this data shape:

```typescript
interface HomeProps {
  hero: {
    backgroundImage: string
    headline: string
    tagline: string
  }
  profile: {
    name: string
    title: string
    headshotImage: string
    subtitle: string
  }
  ctas: Array<{
    id: string
    label: string
    href: string
    variant: 'primary' | 'secondary'
  }>
  onNavigate?: (href: string) => void
}
```

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onNavigate(href)` | Called when user clicks a CTA button — route to the href |

### Images

You'll need to provide:
- Background image (Golf Channel production shot)
- Headshot image (Mike's professional photo)

## Files to Reference

- `product-plan/sections/home/README.md` — Feature overview
- `product-plan/sections/home/tests.md` — Test-writing instructions
- `product-plan/sections/home/components/` — React components
- `product-plan/sections/home/types.ts` — TypeScript interfaces
- `product-plan/sections/home/sample-data.json` — Test data
- `product-plan/sections/home/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Land on Homepage

1. User navigates to the site
2. User sees the full-screen hero with background image
3. User sees Mike's headshot, name, title, and tagline
4. **Outcome:** User understands who Mike is and what the site offers

### Flow 2: Navigate to Section

1. User clicks one of the three CTA buttons
2. **Outcome:** User is routed to the corresponding section (Story, Work, or Connect)

## Done When

- [ ] Hero displays with background image
- [ ] Headshot displays in circular frame with "44+ Years" badge
- [ ] Headline, name, title, and tagline display correctly
- [ ] All three CTA buttons are visible and styled correctly
- [ ] Clicking CTAs navigates to correct routes
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (stacked layout)
