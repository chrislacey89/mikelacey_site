# Test Instructions: Work

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Work section displays Mike's portfolio through credits grid, photo gallery with lightbox, and YouTube video embeds. Key functionality: all three content types render, lightbox opens/closes, videos embed correctly, CTA navigation works.

---

## User Flow Tests

### Flow 1: Browse Credits

**Scenario:** User views production credits

**Setup:**
- Provide 15 credits from sample data
- Render the Work component

**Expected Results:**
- [ ] Header displays "The Work" heading
- [ ] Section heading "Production Credits" is visible
- [ ] All 15 credits are displayed in a grid
- [ ] Each credit shows name (e.g., "PGA Tour Live")
- [ ] Each credit shows network (e.g., "Golf Channel")
- [ ] Grid is 3 columns on desktop, 2 on tablet, 1 on mobile

### Flow 2: View Photo in Lightbox

**Scenario:** User clicks a photo to view it enlarged

**Setup:**
- Provide photos from sample data
- Render Work component

**Steps:**
1. User scrolls to "Behind the Scenes" section
2. User sees masonry grid of photos
3. User clicks on a photo
4. Lightbox opens with enlarged photo
5. Caption displays below photo

**Expected Results:**
- [ ] Photos display in masonry grid
- [ ] Clicking photo opens lightbox overlay
- [ ] Lightbox shows enlarged photo
- [ ] Caption displays below photo in lightbox
- [ ] Close button (X) is visible

### Flow 3: Close Lightbox

**Scenario:** User closes the photo lightbox

**Setup:**
- Lightbox is open with a photo

**Steps (multiple paths):**
1. User clicks the X button
2. OR User presses Escape key
3. OR User clicks outside the photo

**Expected Results:**
- [ ] Clicking X closes lightbox
- [ ] Pressing Escape closes lightbox
- [ ] Clicking backdrop closes lightbox
- [ ] Body scroll is restored after closing

### Flow 4: Watch Video Interview

**Scenario:** User watches an embedded video

**Setup:**
- Provide 2 interviews from sample data
- Render Work component

**Expected Results:**
- [ ] Section heading "Video Interviews" is visible
- [ ] 2 video embeds are displayed
- [ ] Each video shows title and description
- [ ] YouTube iframe is embedded and playable
- [ ] Videos are side by side on desktop, stacked on mobile

### Flow 5: Navigate to Connect

**Scenario:** User clicks CTA to get in touch

**Setup:**
- Render Work with mock `onNavigateToConnect` callback

**Steps:**
1. User scrolls to bottom
2. User sees "Interested in working together?" text
3. User clicks "Get in Touch" button

**Expected Results:**
- [ ] CTA text and button are visible
- [ ] Clicking button calls `onNavigateToConnect`

---

## Component Interaction Tests

### Work Component

**Renders correctly:**
- [ ] Header with title and intro
- [ ] Credits section with grid
- [ ] Photo gallery section with masonry layout
- [ ] Video interviews section with embeds
- [ ] Footer with CTA

### PhotoLightbox Component

**Behavior:**
- [ ] Returns null when `photo` is null
- [ ] Renders overlay when `photo` is provided
- [ ] Displays photo image with correct src and alt
- [ ] Displays caption text
- [ ] Prevents body scroll when open
- [ ] Restores body scroll on close

**Keyboard:**
- [ ] Escape key calls `onClose`

---

## Empty State Tests

### No Credits

**Setup:** `credits: []`

**Expected Results:**
- [ ] Credits section renders without errors
- [ ] No credit cards displayed
- [ ] Other sections still render

### No Photos

**Setup:** `photos: []`

**Expected Results:**
- [ ] Photo gallery section renders without errors
- [ ] No photos displayed
- [ ] Other sections still render

### No Interviews

**Setup:** `interviews: []`

**Expected Results:**
- [ ] Video section renders without errors
- [ ] No video embeds displayed
- [ ] Other sections still render

---

## Edge Cases

- [ ] YouTube URL parsing works with various URL formats
- [ ] Long credit names truncate or wrap properly
- [ ] Very large images scale within lightbox bounds
- [ ] Long captions wrap properly in lightbox
- [ ] Handles missing photo src gracefully

---

## Accessibility Checks

- [ ] Lightbox close button has aria-label
- [ ] Photo buttons are keyboard accessible
- [ ] Focus is trapped in lightbox when open
- [ ] YouTube iframes have title attribute
- [ ] Sufficient color contrast

---

## Sample Test Data

```typescript
const mockCredits = [
  { id: 'credit-pga', name: 'PGA Tour Live', network: 'Golf Channel' },
  { id: 'credit-nascar', name: 'NASCAR Media Days', network: 'NASCAR' }
]

const mockPhotos = [
  { id: 'photo-golf', src: '/images/golf.png', alt: 'Golf Channel', caption: 'On set at Golf Channel' },
  { id: 'photo-nick', src: '/images/nick.jpg', alt: 'Nickelodeon', caption: 'Nickelodeon Studios' }
]

const mockInterviews = [
  { id: 'interview-1', title: 'On To Something Interview', description: 'Mike discusses his career journey.', youtubeUrl: 'https://www.youtube.com/watch?v=fQ9yuk4y7Qk' }
]
```
