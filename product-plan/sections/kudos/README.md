# Kudos Section

## Overview

A gallery showcasing photos of "attaboys" — actual thank-you notes, letters, and documents from colleagues and industry professionals. Photos are displayed in a masonry grid with lightbox viewing. Ends with a CTA to get in touch.

## User Flows

- Visitor browses the grid of attaboy photos
- Visitor clicks a photo to view it enlarged (lightbox)
- Visitor clicks "Get in Touch" → navigates to Connect section

## Design Decisions

- Masonry layout for visual interest with varied document sizes
- Caption overlay on hover reveals document source
- Lightbox for reading documents in detail
- Simple section focused on letting the praise speak for itself

## Components Provided

- `Kudos` — Main kudos component with masonry gallery
- `DocumentLightbox` — Lightbox modal for viewing documents

## Callback Props

| Callback | Description |
|----------|-------------|
| `onDocumentClick(id)` | Called when user clicks a document |
| `onNavigateToConnect()` | Called when user clicks "Get in Touch" |

## Visual Reference

See `screenshot.png` for the target UI design.
