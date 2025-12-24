# Tailwind Color Configuration

## Color Choices

- **Primary:** `blue` — Used for buttons, links, key accents, active states
- **Secondary:** `amber` — Used for eyebrow text, badges, accent buttons
- **Neutral:** `stone` — Used for backgrounds, text, borders (warm gray palette)

## Usage Examples

### Primary (Blue)

```html
<!-- Primary button -->
<button class="bg-blue-600 hover:bg-blue-700 text-white">
  Send Message
</button>

<!-- Primary link/accent -->
<span class="text-blue-600 dark:text-blue-400">Active Nav Item</span>

<!-- Primary focus ring -->
<input class="focus:ring-blue-500 focus:border-blue-500">
```

### Secondary (Amber)

```html
<!-- Eyebrow/label text -->
<p class="text-amber-600 dark:text-amber-400 uppercase text-sm">
  Get in Touch
</p>

<!-- Accent badge -->
<span class="bg-amber-500 text-stone-950 px-4 py-2 rounded-full">
  44+ Years
</span>

<!-- Secondary button -->
<button class="bg-amber-500 hover:bg-amber-600 text-white">
  Download Contact
</button>
```

### Neutral (Stone)

```html
<!-- Page background -->
<div class="bg-stone-50 dark:bg-stone-900">

<!-- Text colors -->
<h1 class="text-stone-900 dark:text-white">Heading</h1>
<p class="text-stone-600 dark:text-stone-400">Body text</p>
<span class="text-stone-500">Secondary text</span>

<!-- Borders -->
<div class="border border-stone-200 dark:border-stone-700">

<!-- Secondary button background -->
<button class="bg-stone-200 dark:bg-stone-800 hover:bg-stone-300">
```

## Dark Mode

All components use Tailwind's `dark:` variant for dark mode support. The site supports both light and dark themes based on system preference.

```html
<!-- Example with dark mode -->
<div class="bg-stone-50 dark:bg-stone-950">
  <p class="text-stone-900 dark:text-white">Adapts to theme</p>
</div>
```
