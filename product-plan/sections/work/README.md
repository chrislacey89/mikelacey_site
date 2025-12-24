# Work Section

## Overview

A portfolio page showcasing Mike's career through three stacked sections: a list of production credits, a photo gallery with lightbox viewing, and two embedded YouTube video interviews. Ends with a CTA to get in touch.

## User Flows

- Visitor scrolls through credits to see the breadth of Mike's work
- Visitor browses the photo gallery and clicks to view enlarged (lightbox)
- Visitor watches embedded YouTube video interviews
- Visitor clicks "Get in Touch" → navigates to Connect section

## Design Decisions

- Credits in responsive grid for scannable overview
- Masonry photo gallery for visual interest
- Lightbox for immersive photo viewing
- YouTube embeds for easy video playback
- Stacked sections create clear content hierarchy

## Components Provided

- `Work` — Main work component with all three sections
- `PhotoLightbox` — Lightbox modal for viewing photos

## Callback Props

| Callback | Description |
|----------|-------------|
| `onPhotoClick(id)` | Called when user clicks a photo |
| `onNavigateToConnect()` | Called when user clicks "Get in Touch" |

## Visual Reference

See `screenshot.png` for the target UI design.
