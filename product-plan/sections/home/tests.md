# Test Instructions: Home

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Home section is a hero landing page with background image, headshot, intro text, and three CTA buttons. Key functionality to test: visual elements render correctly, CTA buttons trigger navigation.

---

## User Flow Tests

### Flow 1: View Hero Content

**Scenario:** User lands on the homepage and sees all hero elements

**Setup:**
- Provide sample hero, profile, and CTA data
- Render the HomeHero component

**Expected Results:**
- [ ] Background image is applied (check for backgroundImage style or img element)
- [ ] Headline text "44 Years Behind the Camera" is visible
- [ ] Name "Mike Lacey" is displayed
- [ ] Title "Television Director" is displayed
- [ ] Tagline text is visible
- [ ] Headshot image is rendered
- [ ] "44+ Years" badge is visible

### Flow 2: Click Primary CTA (Learn My Story)

**Scenario:** User clicks the primary CTA button

**Setup:**
- Render component with mock `onNavigate` callback
- CTA data includes `{ id: 'story', label: 'Learn My Story', href: '/story', variant: 'primary' }`

**Steps:**
1. User sees "Learn My Story" button
2. User clicks the button

**Expected Results:**
- [ ] Button with text "Learn My Story" is visible
- [ ] Clicking button calls `onNavigate` with `/story`
- [ ] Button has primary styling (blue background)

### Flow 3: Click Secondary CTAs

**Scenario:** User clicks secondary CTA buttons

**Setup:**
- Render component with mock `onNavigate` callback

**Steps:**
1. User clicks "See My Work" button
2. User clicks "Get in Touch" button

**Expected Results:**
- [ ] "See My Work" button is visible and clickable
- [ ] Clicking "See My Work" calls `onNavigate` with `/work`
- [ ] "Get in Touch" button is visible and clickable
- [ ] Clicking "Get in Touch" calls `onNavigate` with `/connect`
- [ ] Both buttons have secondary styling (transparent/border style)

---

## Component Interaction Tests

### HomeHero Component

**Renders correctly:**
- [ ] Displays headline from `hero.headline`
- [ ] Displays tagline from `hero.tagline`
- [ ] Displays name from `profile.name`
- [ ] Displays title from `profile.title`
- [ ] Displays subtitle from `profile.subtitle`
- [ ] Renders all CTAs from `ctas` array

**User interactions:**
- [ ] Each CTA button calls `onNavigate` with correct `href` when clicked
- [ ] Buttons have hover states (visual test)

---

## Edge Cases

- [ ] Handles missing headshot image gracefully (placeholder or fallback)
- [ ] Works with empty CTA array (renders without buttons)
- [ ] Long headline text doesn't break layout
- [ ] Long tagline text wraps properly

---

## Accessibility Checks

- [ ] All buttons are keyboard accessible
- [ ] Headshot image has alt text
- [ ] Color contrast meets WCAG standards
- [ ] Focus states are visible on buttons

---

## Sample Test Data

```typescript
const mockHero = {
  backgroundImage: '/images/golf-channel-production.png',
  headline: '44 Years Behind the Camera',
  tagline: 'From the shipping room to the director\'s chair — a career built on passion, respect, and making every show the best it can be.'
}

const mockProfile = {
  name: 'Mike Lacey',
  title: 'Television Director',
  headshotImage: '/images/headshot.png',
  subtitle: 'Sports & Entertainment Production'
}

const mockCtas = [
  { id: 'story', label: 'Learn My Story', href: '/story', variant: 'primary' },
  { id: 'work', label: 'See My Work', href: '/work', variant: 'secondary' },
  { id: 'connect', label: 'Get in Touch', href: '/connect', variant: 'secondary' }
]
```
