# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or import in CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap');
```

## Font Usage

| Purpose | Font | Weights |
|---------|------|---------|
| Headings | Outfit | 600 (semibold), 700 (bold) |
| Body text | Outfit | 400 (regular), 500 (medium) |
| Code/technical | IBM Plex Mono | 400, 500 |

## CSS Configuration

```css
:root {
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}

body {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

code, pre {
  font-family: var(--font-mono);
}
```

## Tailwind Configuration (Optional)

If using Tailwind, extend the theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
}
```
