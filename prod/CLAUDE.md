# Project: Mike Lacey Portfolio

## Site Information
- **URL**: https://www.themikelacey.com
- **Owner**: Mike Lacey
- **Role**: Television Director
- **Experience**: Decades in sports and entertainment production

## Tech Stack
- Astro 5.x
- React 19
- Tailwind CSS 4
- Deployed on Vercel

## Key Files
- `src/layouts/BaseLayout.astro` - Main layout with OG meta tags
- `src/pages/api/og.png.ts` - Dynamic OG image generation endpoint
- `astro.config.mjs` - Astro configuration with Vercel adapter

## OG Image
Dynamic OG images are generated at `/api/og.png` using `@vercel/og`.
Accepts query params: `?title=` and `?subtitle=`

## Before implementing from an external specification

When the spec for a piece of work comes from outside this repo — an attached
checklist, a pasted audit, a vendor report, a scanner's findings — reconcile it
against what this repo has already decided, **before writing code**:

```bash
gh issue list --state all --search "<area keywords>" --json number,title,body
rg -n "Follow-up|Prevention|Do not|must not" docs/solutions/
```

Read the issue *bodies*, not just their titles — the constraints live in the
prose ("do not mark this up as X", "this value must be E.164", "preview deploys
must not serve Y"). Then say in the PR body which recorded constraints you
honoured and which you are deliberately reversing, and why.

An external spec that raises and answers every question it poses reads as
sufficient. It is not: nothing in it knows what this repo already decided. A
stated reversal is a decision; a silent one is a defect.

See `docs/solutions/patterns/external-spec-overrides-recorded-decisions-2026-09-04.md`
— four of nine review Concerns on PR #24 were this, all preventable by the two
commands above.
