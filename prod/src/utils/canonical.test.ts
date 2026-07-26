import { describe, expect, it } from 'vitest';
import { canonicalUrl, PRODUCTION_ORIGIN } from './canonical';

const PROD = new URL('https://www.themikelacey.com');

describe('canonicalUrl', () => {
  // The whole point of the tag. BaseLayout sits next to `siteUrl`, which
  // deliberately becomes the Vercel preview host off production — reusing it
  // here would have every preview deploy declare itself canonical and invite
  // indexing of preview URLs. The request origin is never an input.
  it('builds from the configured site origin, not the requested origin', () => {
    const requested = new URL('https://mikelacey-git-abc123.vercel.app/story');

    expect(canonicalUrl(requested, PROD)).toBe('https://www.themikelacey.com/story');
  });

  // A canonical that echoed whichever variant was requested would collapse to
  // a no-op. Both spellings resolve, so both must nominate the same one.
  it('normalises the trailing-slash variant onto the slashless form', () => {
    const withSlash = canonicalUrl(new URL('https://www.themikelacey.com/story/'), PROD);
    const without = canonicalUrl(new URL('https://www.themikelacey.com/story'), PROD);

    expect(withSlash).toBe('https://www.themikelacey.com/story');
    expect(withSlash).toBe(without);
  });

  // The boundary of the rule above: the homepage's slash is the path, not a
  // trailing separator, and stripping it would emit a bare origin.
  it('keeps the homepage as a single slash', () => {
    expect(canonicalUrl(new URL('https://www.themikelacey.com/'), PROD)).toBe(
      'https://www.themikelacey.com/',
    );
  });

  // Not hypothetical: index.astro enters Sanity Presentation mode on
  // `?preview` / `?sanity-preview`, so a canonical built from the full href
  // would nominate the CMS preview URL as the indexable one.
  it('drops the query string and fragment', () => {
    const requested = new URL('https://www.themikelacey.com/story?preview=1#era-2');

    expect(canonicalUrl(requested, PROD)).toBe('https://www.themikelacey.com/story');
  });

  // `Astro.site` is `URL | undefined` — it is only populated when `site` is set
  // in astro.config. Falling back to the request origin would reintroduce the
  // preview-nominates-itself bug through the back door, so the fallback is a
  // hardcoded production origin instead.
  it('falls back to the production origin when the site is unconfigured', () => {
    const requested = new URL('https://mikelacey-git-abc123.vercel.app/work');

    expect(canonicalUrl(requested, undefined)).toBe('https://www.themikelacey.com/work');
    expect(PRODUCTION_ORIGIN).toBe('https://www.themikelacey.com');
  });
});
