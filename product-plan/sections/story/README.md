# Story Section

## Overview

A scrolling narrative page that tells Mike's career journey from 1981 to present. Year markers appear alongside the text as visitors scroll, creating a sense of progression through the eras. The page ends with calls-to-action to explore his work or get in touch.

## User Flows

- Visitor scrolls through the narrative, seeing year markers as the story progresses
- Visitor reads Mike's philosophy naturally woven into the narrative
- Visitor clicks "See My Work" → navigates to Work section
- Visitor clicks "Get in Touch" → navigates to Connect section

## Design Decisions

- Timeline layout with year markers creates visual progression
- Long-form narrative allows Mike's voice to come through
- Subtle decorative elements (line, dots) add polish without distraction
- Dual CTAs at bottom provide clear next steps
- Optional photo slots per era for future content

## Components Provided

- `Story` — Main story component with header and footer CTAs
- `TimelineEra` — Individual era display with year marker

## Callback Props

| Callback | Description |
|----------|-------------|
| `onNavigateToWork()` | Called when user clicks "See My Work" |
| `onNavigateToConnect()` | Called when user clicks "Get in Touch" |

## Visual Reference

See `screenshot.png` for the target UI design.
