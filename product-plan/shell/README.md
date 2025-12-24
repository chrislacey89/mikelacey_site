# Application Shell

## Overview

A clean, top navigation shell for Mike Lacey's portfolio website. The shell provides persistent navigation across all sections while keeping the focus on content. Designed for a public-facing portfolio site with no authentication.

## Components

### AppShell

The main layout wrapper that includes navigation and renders page content.

**Props:**
- `children` — Page content to render
- `navigationItems` — Array of nav items with label, href, and isActive
- `brandName` — Brand text (defaults to "Mike Lacey")
- `onNavigate` — Callback when nav item is clicked

### MainNav

The navigation bar with responsive mobile menu.

**Features:**
- Brand name on left (links to home)
- Nav items on right (desktop)
- Hamburger menu on mobile
- Active state styling
- Sticky positioning

## Navigation Structure

| Item | Route |
|------|-------|
| Mike Lacey (brand) | `/` |
| Home | `/` |
| Story | `/story` |
| Work | `/work` |
| Kudos | `/kudos` |
| Connect | `/connect` |

## Design Notes

- Uses blue primary color for active nav items and hover states
- Uses stone neutral palette for backgrounds and text
- Outfit font for all navigation text
- Supports light and dark mode
- Navigation is sticky/fixed at top on scroll
- Subtle border separates nav from content
- Mobile menu slides down on hamburger click

## Dependencies

The MainNav component uses `lucide-react` for icons:
- `Menu` — Hamburger menu icon
- `X` — Close icon

Install with: `npm install lucide-react`
