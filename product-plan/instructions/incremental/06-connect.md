# Milestone 6: Connect

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)

**What you need to build:**
- Contact form submission handling (email, database, or third-party service)
- vCard generation and download functionality
- QR code generation for the vCard
- Integration of the provided UI components

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your form handling
- **DO** implement proper form validation and error handling
- **DO** implement the vCard download functionality
- The components are props-based and ready to integrate

---

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

- `Connect.tsx` — Main connect component with form and vCard
- `index.ts` — Exports

### Data Layer

The component expects this data shape:

```typescript
interface ConnectProps {
  contactInfo: {
    fullName: string
    firstName: string
    lastName: string
    title: string
    email: string
    phone: string
    phoneDisplay: string
    website: string
    linkedin: string
    imdb: string
  }
  professionalLinks: Array<{
    id: string
    type: 'imdb' | 'linkedin' | 'email' | 'phone'
    label: string
    url: string
    icon: 'film' | 'linkedin' | 'mail' | 'phone'
  }>
  formFields: {
    name: { label: string; placeholder: string; required: boolean }
    email: { label: string; placeholder: string; required: boolean }
    phone: { label: string; placeholder: string; required: boolean }
    message: { label: string; placeholder: string; required: boolean }
  }
  sectionContent: {
    title: string
    intro: string
  }
  onFormSubmit?: (data: ContactFormData) => void
  onDownloadVCard?: () => void
  onLinkClick?: (linkId: string) => void
}
```

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
- `product-plan/sections/connect/components/` — React components
- `product-plan/sections/connect/types.ts` — TypeScript interfaces
- `product-plan/sections/connect/sample-data.json` — Test data with real contact info
- `product-plan/sections/connect/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Submit Contact Form

1. User navigates to Connect section
2. User fills in name, email, and message (phone is optional)
3. User clicks "Send Message" button
4. Form shows loading state
5. Form shows success message: "Message Sent!"
6. **Outcome:** Submission is processed, user sees confirmation

### Flow 2: Submit Form with Errors

1. User clicks "Send Message" without filling required fields
2. Form shows validation errors on required fields
3. **Outcome:** User corrects errors and resubmits

### Flow 3: Scan QR Code

1. User sees QR code on the page
2. User opens phone camera and scans QR code
3. Phone prompts to add contact
4. **Outcome:** Mike's contact info is saved to user's phone

### Flow 4: Download vCard

1. User clicks "Download Contact" button
2. Browser downloads .vcf file
3. **Outcome:** User has vCard file to import into contacts

### Flow 5: Click Professional Link

1. User clicks IMDb, LinkedIn, email, or phone link
2. Link opens in new tab (IMDb, LinkedIn) or initiates action (email, phone)
3. **Outcome:** User accesses Mike's profile or initiates contact

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
