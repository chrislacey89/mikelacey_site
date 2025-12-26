# Mike Lacey Portfolio — Complete Implementation Guide

> **Provide alongside:** `product-overview.md`

This document combines all milestones for implementing the complete portfolio site in a single session.

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (Astro components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Project setup and configuration
- Routing structure
- Data fetching and state management
- Integration of the provided UI components with real data
- Contact form submission handling
- vCard generation and QR code

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

### 3. Routing Structure

Create routes for each section:

- `/` — Home (hero landing page)
- `/story` — Story (career timeline)
- `/work` — Work (portfolio)
- `/kudos` — Kudos (testimonials gallery)
- `/connect` — Connect (contact form)

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.astro` — Main layout wrapper
- `MainNav.astro` — Navigation component with mobile menu
- `index.ts` — Exports

**Wire Up Navigation:**

Connect navigation to your routing:

| Nav Item | Route |
|----------|-------|
| Mike Lacey (brand) | `/` |
| Home | `/` |
| Story | `/story` |
| Work | `/work` |
| Kudos | `/kudos` |
| Connect | `/connect` |

**Note:** This is a public portfolio site with no user authentication or user menu.

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] Active state shows on current route
- [ ] Mobile menu works on small screens
- [ ] Responsive on mobile

---

# Milestone 2: Home

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

- `HomeHero.astro` — The main hero component
- `index.ts` — Exports

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
- `product-plan/sections/home/components/` — Astro components
- `product-plan/sections/home/types.ts` — TypeScript interfaces
- `product-plan/sections/home/sample-data.json` — Test data
- `product-plan/sections/home/screenshot.png` — Visual reference

## Done When

- [ ] Hero displays with background image
- [ ] Headshot displays in circular frame with "44+ Years" badge
- [ ] Headline, name, title, and tagline display correctly
- [ ] All three CTA buttons are visible and styled correctly
- [ ] Clicking CTAs navigates to correct routes
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (stacked layout)

---

# Milestone 3: Story

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

- `Story.astro` — Main story component with header and footer CTAs
- `TimelineEra.astro` — Individual era display with year marker
- `index.ts` — Exports

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onNavigateToWork()` | Called when user clicks "See My Work" — route to `/work` |
| `onNavigateToConnect()` | Called when user clicks "Get in Touch" — route to `/connect` |

## Files to Reference

- `product-plan/sections/story/README.md` — Feature overview
- `product-plan/sections/story/tests.md` — Test-writing instructions
- `product-plan/sections/story/components/` — Astro components
- `product-plan/sections/story/types.ts` — TypeScript interfaces
- `product-plan/sections/story/sample-data.json` — Test data with 7 career eras
- `product-plan/sections/story/screenshot.png` — Visual reference

## Done When

- [ ] Header displays with title and intro
- [ ] All 7 timeline eras display with year markers and titles
- [ ] Narrative text displays correctly with proper formatting
- [ ] Timeline line and dots show on desktop
- [ ] Both CTA buttons work at the bottom
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (year markers stack above content)

---

# Milestone 4: Work

## Goal

Implement the Work section — Mike's portfolio showcasing credits, photo gallery, and video interviews.

## Overview

The Work section displays Mike's production work through three stacked subsections: a grid of production credits, a masonry photo gallery with lightbox, and embedded YouTube video interviews.

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

- `Work.astro` — Main work component with all three sections
- `PhotoLightbox.astro` — Lightbox modal for viewing photos
- `index.ts` — Exports

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
- `product-plan/sections/work/components/` — Astro components
- `product-plan/sections/work/types.ts` — TypeScript interfaces
- `product-plan/sections/work/sample-data.json` — Test data
- `product-plan/sections/work/screenshot.png` — Visual reference

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

---

# Milestone 5: Kudos

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

- `Kudos.astro` — Main kudos component with masonry gallery
- `DocumentLightbox.astro` — Lightbox modal for viewing documents
- `index.ts` — Exports

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
- `product-plan/sections/kudos/components/` — Astro components
- `product-plan/sections/kudos/types.ts` — TypeScript interfaces
- `product-plan/sections/kudos/sample-data.json` — Test data
- `product-plan/sections/kudos/screenshot.png` — Visual reference

## Done When

- [ ] Header displays with title and intro
- [ ] Documents display in masonry layout (3 columns on desktop)
- [ ] Captions show on hover
- [ ] Clicking document opens lightbox with image and caption
- [ ] Escape key and clicking outside closes lightbox
- [ ] CTA button works at the bottom
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (fewer columns)

---

# Milestone 6: Connect

## Goal

Implement the Connect section — contact form, QR code vCard, and professional links.

## Overview

The Connect section provides multiple ways for visitors to get in touch with Mike. It includes a contact form for booking inquiries, a scannable QR code that saves Mike's contact info, a download button for the vCard file, and links to his professional profiles.

**Key Functionality:**
- Display contact form with name, email, phone (optional), and message
- Validate form fields and show errors
- Handle form submission (email notification or database storage)
- Display QR code that encodes Mike's vCard
- Allow downloading vCard as .vcf file
- Show professional links (IMDb, LinkedIn, email, phone)
- Responsive layout (stacked on mobile, side-by-side on desktop)

## What to Implement

### Components

Copy the section components from `product-plan/sections/connect/components/`:

- `Connect.astro` — Main connect component with form and vCard
- `index.ts` — Exports

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onFormSubmit(data)` | Called when user submits the form — handle email/database |
| `onDownloadVCard()` | Called when user clicks "Download Contact" — generate and download .vcf |
| `onLinkClick(linkId)` | Called when user clicks a professional link (optional tracking) |

### Backend Requirements

**Contact Form:**
- Validate required fields (name, email, message)
- Validate email format
- Store submission or send notification email
- Show success message after submission

**vCard Generation:**
- Generate vCard (.vcf) file with Mike's contact info
- Include: name, title, phone, email, website, LinkedIn, IMDb
- Trigger file download when button is clicked

**QR Code:**
- Generate QR code that encodes the vCard data
- Or generate QR code linking to a URL that returns the vCard
- Display as image in the component

## Files to Reference

- `product-plan/sections/connect/README.md` — Feature overview
- `product-plan/sections/connect/tests.md` — Test-writing instructions
- `product-plan/sections/connect/components/` — Astro components
- `product-plan/sections/connect/types.ts` — TypeScript interfaces
- `product-plan/sections/connect/sample-data.json` — Test data with real contact info
- `product-plan/sections/connect/screenshot.png` — Visual reference

## Done When

- [ ] Header displays with title and intro
- [ ] Contact form displays with all fields
- [ ] Required field indicators show on form
- [ ] Form validation works (client-side)
- [ ] Form submission works with loading and success states
- [ ] QR code displays and is scannable
- [ ] Download vCard button downloads .vcf file
- [ ] All professional links work correctly
- [ ] Direct contact card shows email and phone
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile (stacked layout)

---

# Summary Checklist

## Foundation
- [ ] Design tokens configured
- [ ] Data model types defined
- [ ] Routing structure in place
- [ ] Shell rendering with navigation

## Home
- [ ] Hero with background and headshot
- [ ] CTA buttons navigating correctly

## Story
- [ ] Timeline with all 7 eras
- [ ] Year markers and narrative text
- [ ] CTA buttons at bottom

## Work
- [ ] Credits grid
- [ ] Photo gallery with lightbox
- [ ] Video embeds working
- [ ] CTA button at bottom

## Kudos
- [ ] Document masonry gallery
- [ ] Lightbox for document viewing
- [ ] CTA button at bottom

## Connect
- [ ] Contact form with validation
- [ ] QR code displaying
- [ ] vCard download working
- [ ] Professional links working

## Cross-Cutting
- [ ] All pages responsive on mobile
- [ ] Dark mode support (using `dark:` variants)
- [ ] All navigation working
- [ ] Active states showing on current route
