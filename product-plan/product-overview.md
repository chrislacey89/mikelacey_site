# The Mike Lacey — Product Overview

## Summary

A portfolio and career showcase for Mike Lacey, a television director with decades of experience in sports and entertainment production. The site tells his story from the ground up—literally starting in shipping at National Video Center—to directing PGA Tour Live, and invites future clients to book him for their next project.

## Planned Sections

1. **Home** — The hero landing page featuring the Golf Channel production shot as background, Mike's headshot, and a compelling introduction that makes visitors want to learn more.

2. **Story** — The full career journey from 1981 to present, including the bio narrative, visual timeline, and his philosophy on the craft.

3. **Work** — Portfolio showcasing sports and entertainment credits, photo gallery of career moments, and embedded video interviews from YouTube.

4. **Kudos** — The "attaboys" and testimonials from industry colleagues, proving his reputation through the words of people he's worked with.

5. **Connect** — Contact form for booking inquiries, the QR code contact card (vCard), and any relevant social or professional links.

## Data Model

**Entities:**
- **TimelineEvent** — Milestones in Mike's career journey
- **Credit** — Productions, shows, or projects Mike worked on
- **Testimonial** — "Attaboys" from colleagues and industry professionals
- **Interview** — Video interviews hosted on YouTube
- **Photo** — Career moments captured in images
- **ContactInfo** — Mike's contact details for vCard and contact page

All entities are standalone with no cross-references, keeping the data simple to manage.

## Design System

**Colors:**
- Primary: `blue` — Buttons, links, key accents
- Secondary: `amber` — Tags, highlights, secondary elements
- Neutral: `stone` — Backgrounds, text, borders

**Typography:**
- Heading: Outfit
- Body: Outfit
- Mono: IBM Plex Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing structure, and application shell
2. **Home** — Hero landing page with background image, headshot, and CTAs
3. **Story** — Scrolling narrative with year markers and career timeline
4. **Work** — Credits list, photo gallery with lightbox, YouTube video embeds
5. **Kudos** — Masonry gallery of attaboy document photos with lightbox
6. **Connect** — Contact form, QR code vCard, professional links

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
