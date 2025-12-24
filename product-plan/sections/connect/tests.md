# Test Instructions: Connect

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Connect section provides contact form, QR code vCard, and professional links. Key functionality: form validation and submission, vCard download, link navigation.

---

## User Flow Tests

### Flow 1: Submit Contact Form (Success)

**Scenario:** User submits a valid contact form

**Setup:**
- Render Connect component with mock `onFormSubmit` callback

**Steps:**
1. User sees "Let's Connect" heading
2. User fills in "Your Name" field with "John Smith"
3. User fills in "Email Address" field with "john@example.com"
4. User fills in "Message" field with "I'd like to discuss a project"
5. User clicks "Send Message" button

**Expected Results:**
- [ ] Form shows loading state (spinner, "Sending...")
- [ ] `onFormSubmit` is called with form data
- [ ] Success message appears: "Message Sent!"
- [ ] Success text: "Thanks for reaching out. I'll get back to you soon."
- [ ] Form is replaced by success state

### Flow 2: Submit Form with Validation Errors

**Scenario:** User submits form without required fields

**Setup:**
- Render Connect component

**Steps:**
1. User clicks "Send Message" without filling any fields

**Expected Results:**
- [ ] Form does not submit
- [ ] Required fields show validation errors
- [ ] Name field shows required indicator (*)
- [ ] Email field shows required indicator (*)
- [ ] Message field shows required indicator (*)

### Flow 3: Submit Form with Invalid Email

**Scenario:** User enters invalid email format

**Setup:**
- Render Connect component

**Steps:**
1. User fills name: "John"
2. User fills email: "not-an-email"
3. User fills message: "Hello"
4. User clicks "Send Message"

**Expected Results:**
- [ ] Form validation prevents submission
- [ ] Email field shows format error

### Flow 4: Optional Phone Field

**Scenario:** User submits form with optional phone

**Setup:**
- Render Connect component with mock `onFormSubmit`

**Steps:**
1. User fills required fields
2. User fills phone: "(555) 123-4567"
3. User clicks "Send Message"

**Expected Results:**
- [ ] Form submits successfully
- [ ] `onFormSubmit` receives phone in data
- [ ] Phone field is marked as optional (no asterisk)

### Flow 5: Download vCard

**Scenario:** User clicks download contact button

**Setup:**
- Render Connect with mock `onDownloadVCard` callback

**Steps:**
1. User sees "Save My Contact" card
2. User sees QR code image
3. User clicks "Download Contact" button

**Expected Results:**
- [ ] Button displays download icon and "Download Contact" text
- [ ] Clicking calls `onDownloadVCard` callback
- [ ] (Integration test) .vcf file downloads

### Flow 6: Click Professional Links

**Scenario:** User clicks professional links

**Setup:**
- Render Connect with mock `onLinkClick` callback

**Steps:**
1. User sees "Find Me Online" section
2. User sees 4 link buttons (IMDb, LinkedIn, Email, Call)
3. User clicks each link

**Expected Results:**
- [ ] IMDb link visible with film icon
- [ ] LinkedIn link visible with linkedin icon
- [ ] Email link visible with mail icon
- [ ] Call link visible with phone icon
- [ ] Each click calls `onLinkClick` with correct linkId
- [ ] IMDb/LinkedIn open in new tab
- [ ] Email opens mailto link
- [ ] Phone opens tel link

### Flow 7: Direct Contact Info

**Scenario:** User uses direct contact options

**Setup:**
- Render Connect component

**Expected Results:**
- [ ] Blue "Prefer Direct Contact?" card is visible
- [ ] Email address "themikelacey@gmail.com" is displayed
- [ ] Phone number "(407) 257-6132" is displayed
- [ ] Email link has mailto: href
- [ ] Phone link has tel: href

---

## Component Interaction Tests

### Connect Component

**Renders correctly:**
- [ ] Header with "Get in Touch" eyebrow
- [ ] Main heading from `sectionContent.title`
- [ ] Intro text from `sectionContent.intro`
- [ ] Contact form with all fields
- [ ] vCard card with QR code
- [ ] Download button
- [ ] Professional links grid
- [ ] Direct contact card

**Form state management:**
- [ ] Form tracks input values
- [ ] Submit button disabled while submitting
- [ ] Loading spinner shows during submission
- [ ] Success state replaces form after submission

---

## Empty State Tests

### No Professional Links

**Setup:** `professionalLinks: []`

**Expected Results:**
- [ ] "Find Me Online" section still renders
- [ ] No link buttons displayed
- [ ] Other sections unaffected

---

## Edge Cases

- [ ] Very long name input doesn't break layout
- [ ] Very long message wraps in textarea
- [ ] Form can be submitted multiple times (after reset)
- [ ] QR code placeholder displays when no real QR
- [ ] All fields preserve input on validation error

---

## Accessibility Checks

- [ ] Form fields have associated labels
- [ ] Required fields indicated with asterisk
- [ ] Focus moves to first error on validation fail
- [ ] Success message announced to screen readers
- [ ] All buttons keyboard accessible
- [ ] Professional links have descriptive text

---

## Sample Test Data

```typescript
const mockContactInfo = {
  fullName: 'Mike Lacey',
  firstName: 'Mike',
  lastName: 'Lacey',
  title: 'Television Director & Technical Director',
  email: 'themikelacey@gmail.com',
  phone: '+1-407-257-6132',
  phoneDisplay: '(407) 257-6132',
  website: 'https://mikelacey.com',
  linkedin: 'https://www.linkedin.com/in/mike-lacey-35926513/',
  imdb: 'https://m.imdb.com/name/nm0479943/'
}

const mockProfessionalLinks = [
  { id: 'link-imdb', type: 'imdb', label: 'IMDb', url: 'https://m.imdb.com/name/nm0479943/', icon: 'film' },
  { id: 'link-linkedin', type: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/mike-lacey-35926513/', icon: 'linkedin' },
  { id: 'link-email', type: 'email', label: 'Email', url: 'mailto:themikelacey@gmail.com', icon: 'mail' },
  { id: 'link-phone', type: 'phone', label: 'Call', url: 'tel:+1-407-257-6132', icon: 'phone' }
]

const mockFormFields = {
  name: { label: 'Your Name', placeholder: 'John Smith', required: true },
  email: { label: 'Email Address', placeholder: 'john@example.com', required: true },
  phone: { label: 'Phone (Optional)', placeholder: '(555) 123-4567', required: false },
  message: { label: 'Message', placeholder: 'Tell me about your project...', required: true }
}

const mockSectionContent = {
  title: "Let's Connect",
  intro: "Whether you're looking for a seasoned director for your next production or just want to say hello, I'd love to hear from you."
}

const mockFormData = {
  name: 'John Smith',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  message: 'I would like to discuss a project.'
}
```
