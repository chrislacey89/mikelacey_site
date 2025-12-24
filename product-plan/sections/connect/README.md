# Connect Section

## Overview

Contact section with an inquiry form for booking requests, a QR code vCard for easy contact sharing, and professional links (IMDb, LinkedIn, email, phone).

## User Flows

- Visitor fills out contact form and submits inquiry
- Visitor scans QR code to save Mike's contact info
- Visitor clicks "Download Contact" to download vCard
- Visitor clicks professional links to access profiles or initiate contact

## Design Decisions

- Two-column layout puts form and vCard side by side
- Form includes validation with clear error states
- QR code provides instant mobile contact saving
- Professional links use recognizable icons
- Direct contact card provides quick access to email/phone

## Components Provided

- `Connect` — Main connect component with form, vCard, and links

## Callback Props

| Callback | Description |
|----------|-------------|
| `onFormSubmit(data)` | Called when user submits contact form |
| `onDownloadVCard()` | Called when user clicks download button |
| `onLinkClick(linkId)` | Called when user clicks a professional link |

## Backend Requirements

- Form submission handling (email notification or database)
- vCard file generation (.vcf format)
- QR code generation (encode vCard or link to vCard URL)

## Visual Reference

See `screenshot.png` for the target UI design.
