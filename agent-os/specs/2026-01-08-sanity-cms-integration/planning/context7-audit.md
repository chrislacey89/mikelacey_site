# Context7 Documentation Audit

**Date:** 2026-01-08
**Sources Queried:**
- `/sanity-io/sanity-astro` - Official Sanity Astro integration
- `/websites/sanity_io` - Sanity main documentation
- `/withastro/docs` - Astro documentation

---

## Audit Summary

| Area | Plan Status | Notes |
|------|-------------|-------|
| Installation | ✅ Correct | Use `npx astro add @sanity/astro @astrojs/react` |
| Config | ⚠️ Minor update | Add `useCdn: false` for static builds |
| Schemas | ✅ Correct | Use `defineType`/`defineField` from 'sanity' |
| Migration | ✅ Correct | Use `client.assets.upload()` for images |
| Data Fetching | ⚠️ Update | Use `sanityClient` from `sanity:client` virtual module |
| GROQ | ✅ Correct | Standard patterns apply |

---

## Task Group 1: Sanity Project Initialization

### Original Plan
- Run `npm create sanity@latest`
- Install `@sanity/astro`

### Context7 Correction
**Preferred installation method:**
```bash
npx astro add @sanity/astro @astrojs/react
```

This single command:
- Installs `@sanity/astro` and `@astrojs/react`
- Automatically updates `astro.config.mjs`
- Handles peer dependencies

### Updated astro.config.mjs Pattern
```javascript
// astro.config.mjs
import sanity from '@sanity/astro'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [
    sanity({
      projectId: '<YOUR-PROJECT-ID>',
      dataset: 'production',
      // CRITICAL: Set useCdn to false for static builds
      useCdn: false,
      // Embedded studio path
      studioBasePath: '/studio'
    }),
    react()
  ]
})
```

**Key finding:** Must set `useCdn: false` for static site generation.

---

## Task Group 2: Schema Definitions

### Original Plan ✅ Confirmed Correct

Schema pattern from Context7:
```typescript
import { defineType, defineField } from 'sanity'

export const photoType = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true  // Enables crop/hotspot UI
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text'
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption'
        })
      ]
    })
  ]
})
```

**Confirmed:** Image fields support inline `fields` for alt/caption.

---

## Task Group 3: Content Migration

### Original Plan ✅ Confirmed Correct

Image upload pattern from Context7:
```typescript
import { createClient } from '@sanity/client'
import { basename } from 'path'
import { createReadStream } from 'fs'

const client = createClient({
  projectId: 'myProjectId',
  dataset: 'myDatasetName',
  apiVersion: '2021-08-29',
  token: 'myToken'  // Write token required
})

const filePath = '/path/to/image.jpg'

// Upload image and get asset reference
const imageAsset = await client.assets.upload(
  'image',
  createReadStream(filePath),
  { filename: basename(filePath) }
)

// Create document with image reference
await client.create({
  _type: 'photo',
  image: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: imageAsset._id
    }
  }
})
```

**Key findings:**
- Must use write token for uploads
- Image references use `_type: 'reference'` and `_ref: assetId`

---

## Task Group 4: Sanity Client Setup

### Original Plan - NEEDS UPDATE

**Old approach (from our plan):**
```typescript
// src/lib/sanity.ts - custom client
```

**Context7 Correct Approach:**
```typescript
// Use the virtual module provided by @sanity/astro
import { sanityClient } from 'sanity:client'

// Direct fetch in Astro pages
const posts = await sanityClient.fetch(
  `*[_type == "post"] | order(publishedAt desc)`
)
```

**Updated recommendation:**
- DO NOT create custom `src/lib/sanity.ts` client
- USE the virtual module `sanity:client` provided by `@sanity/astro`
- This automatically uses the config from `astro.config.mjs`

### Optional: loadQuery Helper (for visual editing)
Only needed if visual editing is desired:
```typescript
// load-query.ts
import { sanityClient } from 'sanity:client'

export async function loadQuery<T>({ query, params }) {
  const result = await sanityClient.fetch<T>(query, params ?? {})
  return { data: result }
}
```

---

## Task Group 5: Astro Page Migration

### Updated Pattern
```astro
---
// src/pages/work.astro
import { sanityClient } from 'sanity:client'
import BaseLayout from '../layouts/BaseLayout.astro'
import WorkSection from '../components/work/Work.astro'

// Fetch all content types
const credits = await sanityClient.fetch(`*[_type == "credit"] | order(name asc)`)
const photos = await sanityClient.fetch(`
  *[_type == "photo"] {
    _id,
    "id": _id,
    "src": image.asset->url,
    "alt": image.alt,
    caption
  }
`)
const interviews = await sanityClient.fetch(`*[_type == "interview"]`)
---

<BaseLayout title="My Work - Mike Lacey">
  <WorkSection credits={credits} photos={photos} interviews={interviews} />
</BaseLayout>
```

**Key GROQ pattern for images:**
```groq
"src": image.asset->url
```
This dereferences the asset to get the CDN URL.

---

## Updated Tasks.md Recommendations

### Task 1.2 - Change installation command
**Before:** Install `@sanity/astro` separately
**After:** Use `npx astro add @sanity/astro @astrojs/react`

### Task 1.4 - Config update
**Add:** `useCdn: false` to sanity config for static builds

### Task 4.1 - Remove custom client creation
**Before:** Create `src/lib/sanity.ts`
**After:** Use `import { sanityClient } from 'sanity:client'` directly in pages

### Task 4.2 - Simplify
**Before:** Create separate query utility file
**After:** Write GROQ queries directly in pages using `sanityClient.fetch()`

---

## GROQ Query Reference (from Context7)

### Basic fetch all
```groq
*[_type == "credit"]
```

### With ordering
```groq
*[_type == "timelineEvent"] | order(year asc)
```

### With image URL projection
```groq
*[_type == "photo"] {
  _id,
  "src": image.asset->url,
  "alt": image.alt,
  caption
}
```

### Filter and project
```groq
*[_type == "interview" && defined(youtubeUrl)] {
  _id,
  title,
  description,
  youtubeUrl
}
```

---

## Conclusion

Our plan is **largely correct** with these refinements:

1. **Installation**: Use `npx astro add` instead of manual install
2. **Config**: Add `useCdn: false` for static builds
3. **Client**: Use virtual module `sanity:client` instead of custom client
4. **Queries**: Write directly in pages, no utility file needed

These changes simplify the implementation while following current best practices.
