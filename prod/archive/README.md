# Archive — not deployed

Nothing in this folder is served by the site. It sits outside `public/`, and no
page imports from it, so a deploy publishes none of it.

- `artifacts/` — scanned photos and testimonial letters (JPG and PDF) that used
  to live in `public/artifacts/`. No page linked to them: the site has served
  these images from Sanity since the CMS migration. Keeping them in `public/`
  put ~47 MB on the CDN with every deploy (#14).
- `data/` — the JSON that `scripts/migrate-to-sanity.ts` seeded Sanity from.
  Moved here from `src/data/` so nobody takes their `/artifacts/...` paths as
  evidence the scans are still in use.

**Do not delete `artifacts/` without a backup.** A provenance check on
2026-09-18 found 34 of the 49 images byte-identical to their Sanity
counterparts. The other 15 have no Sanity copy: the six CREDENTIALS scans,
Commander USA, Good Morning LA, Double Dare 2000 (photo and letter), the SUNY
New Paltz award, and older duplicate copies of photos that Sanity does have.
Some Sanity copies are web-downsized derivatives, too. The full-resolution
originals of those photos are in the repo-root `artifacts/` folder, not here.
Deleting this folder is a separate decision. It needs a confirmed backup first.
