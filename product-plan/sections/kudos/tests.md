# Test Instructions: Kudos

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Kudos section displays photos of thank-you notes and letters in a masonry gallery with lightbox viewing. Key functionality: documents render in grid, lightbox opens/closes, CTA navigation works.

---

## User Flow Tests

### Flow 1: Browse Documents

**Scenario:** User browses the attaboy gallery

**Setup:**
- Provide 22 testimonials from sample data
- Render the Kudos component

**Expected Results:**
- [ ] Header displays "Kudos" heading
- [ ] Intro text mentions "Thank-you notes, letters, and recognition"
- [ ] All 22 documents display in masonry grid
- [ ] Each document shows image
- [ ] Hover reveals caption and "View Document" overlay

### Flow 2: View Document in Lightbox

**Scenario:** User clicks a document to view enlarged

**Setup:**
- Provide testimonials from sample data
- Render Kudos component

**Steps:**
1. User sees masonry grid of documents
2. User hovers over a document (sees caption)
3. User clicks the document
4. Lightbox opens with enlarged document
5. Caption displays below document

**Expected Results:**
- [ ] Clicking document opens lightbox overlay
- [ ] Lightbox shows enlarged document image
- [ ] Caption displays below image
- [ ] Close button (X) is visible

### Flow 3: Close Lightbox

**Scenario:** User closes the document lightbox

**Setup:**
- Lightbox is open with a document

**Steps (multiple paths):**
1. User clicks the X button
2. OR User presses Escape key
3. OR User clicks outside the document

**Expected Results:**
- [ ] Clicking X closes lightbox
- [ ] Pressing Escape closes lightbox
- [ ] Clicking backdrop closes lightbox
- [ ] Body scroll is restored after closing

### Flow 4: Navigate to Connect

**Scenario:** User clicks CTA to get in touch

**Setup:**
- Render Kudos with mock `onNavigateToConnect` callback

**Steps:**
1. User scrolls to bottom
2. User sees "Want to work together?" text
3. User clicks "Get in Touch" button

**Expected Results:**
- [ ] CTA text and button are visible
- [ ] Clicking button calls `onNavigateToConnect`

---

## Component Interaction Tests

### Kudos Component

**Renders correctly:**
- [ ] Header with eyebrow "Recognition"
- [ ] Main heading "Kudos"
- [ ] Intro paragraph
- [ ] Masonry gallery of documents
- [ ] Footer with CTA

### DocumentLightbox Component

**Behavior:**
- [ ] Returns null when `testimonial` is null
- [ ] Renders overlay when `testimonial` is provided
- [ ] Displays document image with correct src and alt
- [ ] Displays caption text
- [ ] Prevents body scroll when open
- [ ] Restores body scroll on close

**Keyboard:**
- [ ] Escape key calls `onClose`

---

## Empty State Tests

### No Documents

**Setup:** `testimonials: []`

**Expected Results:**
- [ ] Header and intro still render
- [ ] No documents displayed
- [ ] Footer CTA still renders
- [ ] No JavaScript errors

---

## Edge Cases

- [ ] Very tall document images scale properly
- [ ] Very wide document images scale properly
- [ ] Long captions wrap properly
- [ ] Handles missing image src gracefully
- [ ] Masonry reflows properly on window resize

---

## Accessibility Checks

- [ ] All document buttons are keyboard accessible
- [ ] Lightbox close button has aria-label
- [ ] Focus is managed when lightbox opens/closes
- [ ] Images have descriptive alt text
- [ ] Sufficient color contrast on hover overlay

---

## Sample Test Data

```typescript
const mockTestimonials = [
  {
    id: 'attaboy-pga',
    src: '/images/pga-letter.jpg',
    alt: 'PGA Tour thank you letter',
    caption: 'PGA Tour Live'
  },
  {
    id: 'attaboy-nickelodeon',
    src: '/images/nick-letter.jpg',
    alt: 'Nickelodeon thank you letter',
    caption: 'Nickelodeon Productions'
  }
]
```
