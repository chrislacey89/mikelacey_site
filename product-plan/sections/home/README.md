# Home Section

## Overview

A full-screen hero landing page featuring the Golf Channel production shot as a darkened background, Mike's headshot prominently displayed, and introductory text that establishes who he is. Three call-to-action buttons guide visitors to explore his story, view his work, or get in touch.

## User Flows

- Visitor lands on page and sees the hero with Mike's photo and intro
- Visitor clicks "Learn My Story" → navigates to Story section
- Visitor clicks "See My Work" → navigates to Work section
- Visitor clicks "Get in Touch" → navigates to Connect section

## Design Decisions

- Full-viewport hero creates immediate impact
- Gradient overlay on background ensures text readability
- Circular headshot with decorative ring adds visual interest
- "44+ Years" badge highlights experience at a glance
- Primary CTA (Story) is visually distinct from secondary CTAs

## Components Provided

- `HomeHero` — The main hero component with background, headshot, and CTAs

## Callback Props

| Callback | Description |
|----------|-------------|
| `onNavigate(href)` | Called when user clicks a CTA button — route to the href |

## Visual Reference

See `screenshot.png` for the target UI design.
