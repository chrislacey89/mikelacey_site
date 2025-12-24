# Test Instructions: Story

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Story section displays Mike's career journey as a scrolling timeline with year markers and narrative text for each era. Key functionality: timeline renders all eras, year markers display correctly, CTA buttons trigger navigation.

---

## User Flow Tests

### Flow 1: View Career Timeline

**Scenario:** User reads through Mike's career journey

**Setup:**
- Provide 7 timeline events from sample data
- Render the Story component

**Expected Results:**
- [ ] Header displays "44 Years Behind the Camera" heading
- [ ] Intro text mentions "shipping department" and "PGA Tour golf"
- [ ] All 7 timeline eras are rendered
- [ ] Each era shows year marker (e.g., "1981", "1981–1987", "Present")
- [ ] Each era shows title (e.g., "The Beginning", "NYC Years")
- [ ] Each era shows narrative text

### Flow 2: View Individual Era

**Scenario:** User reads a specific era of the timeline

**Setup:**
- Render TimelineEra component with sample event

**Expected Results:**
- [ ] Year displays in large blue text
- [ ] Title displays below year
- [ ] Narrative text renders with proper paragraph breaks
- [ ] Timeline dot and line appear on desktop (hidden on mobile)

### Flow 3: Navigate to Work

**Scenario:** User clicks the "See My Work" CTA

**Setup:**
- Render Story with mock `onNavigateToWork` callback

**Steps:**
1. User scrolls to bottom of page
2. User sees "Ready to see the work or start a conversation?" text
3. User clicks "See My Work" button

**Expected Results:**
- [ ] "See My Work" button is visible
- [ ] Clicking calls `onNavigateToWork` callback
- [ ] Button has primary styling (blue)

### Flow 4: Navigate to Connect

**Scenario:** User clicks the "Get in Touch" CTA

**Setup:**
- Render Story with mock `onNavigateToConnect` callback

**Steps:**
1. User scrolls to bottom of page
2. User clicks "Get in Touch" button

**Expected Results:**
- [ ] "Get in Touch" button is visible
- [ ] Clicking calls `onNavigateToConnect` callback
- [ ] Button has secondary styling (gray)

---

## Component Interaction Tests

### Story Component

**Renders correctly:**
- [ ] Displays header with eyebrow "The Journey"
- [ ] Displays main heading
- [ ] Displays intro paragraph
- [ ] Renders all timeline events in order
- [ ] Displays footer with both CTA buttons

### TimelineEra Component

**Renders correctly:**
- [ ] Displays `event.year` in year marker
- [ ] Displays `event.title` as era title
- [ ] Splits `event.narrative` by `\n\n` into paragraphs
- [ ] Shows photo if `event.photo` is provided
- [ ] Hides photo if `event.photo` is null

**Timeline decoration:**
- [ ] Shows timeline dot on desktop (md+)
- [ ] Shows timeline line connecting eras (except last one)
- [ ] Hides timeline decoration on mobile

---

## Empty State Tests

### No Timeline Events

**Scenario:** Timeline events array is empty

**Setup:**
- `timelineEvents: []`

**Expected Results:**
- [ ] Header still renders
- [ ] No timeline eras displayed
- [ ] Footer CTAs still display
- [ ] No JavaScript errors

---

## Edge Cases

- [ ] Handles very long narrative text (wraps properly)
- [ ] Handles single timeline event (no connecting line)
- [ ] Handles event with photo (image renders)
- [ ] Handles event without photo (no broken image)
- [ ] Multiple paragraph breaks in narrative render correctly

---

## Accessibility Checks

- [ ] Semantic heading hierarchy (h1 for main title)
- [ ] CTA buttons are keyboard accessible
- [ ] Year markers are readable by screen readers
- [ ] Sufficient color contrast for text

---

## Sample Test Data

```typescript
const mockTimelineEvents = [
  {
    id: 'era-1981-start',
    year: '1981',
    title: 'The Beginning',
    narrative: 'After graduating SUNY New Paltz with a Communications degree, I got a job at National Video Center in New York City working in the shipping department.',
    photo: null
  },
  {
    id: 'era-present',
    year: 'Present',
    title: 'The Director\'s Chair',
    narrative: 'Since working with CCI, I\'ve been able to direct PGA Tour golf—my main client now—the U.S. Martial Arts Championships, U.S. Olympic Judo qualifying, NASCAR Media Days, The Ultra Music Fest, professional wrestling, corporate shows, and more.',
    photo: null
  }
]
```
