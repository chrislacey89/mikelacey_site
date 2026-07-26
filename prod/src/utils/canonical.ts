/**
 * The one address this site wants indexed.
 *
 * Deliberately a constant rather than anything derived at request time.
 * `BaseLayout` also computes a preview-aware `siteUrl` for OG images, which
 * becomes the Vercel deploy host off production — correct there, and wrong
 * for any identity assertion. Keeping the production origin in one named
 * place is what stops the two being confused.
 */
export const PRODUCTION_ORIGIN = 'https://www.themikelacey.com';

/**
 * Builds the self-referential canonical URL for a page.
 *
 * `requestUrl` supplies only the path — its origin is discarded, so every
 * variant that resolves to a page (bare domain, http, preview deploy) points
 * back at the same address. `site` comes from `Astro.site`, which is
 * `undefined` unless `site` is set in astro.config; the fallback is the
 * production origin rather than the request's, because falling back to the
 * request would reintroduce exactly the bug this function exists to prevent.
 */
export function canonicalUrl(requestUrl: URL, site: URL | undefined): string {
  // A path is only ever one of these, so the trailing separator carries no
  // meaning — but `/` is the homepage's path, not a separator, hence `|| '/'`.
  const path = requestUrl.pathname.replace(/\/+$/, '') || '/';

  return new URL(path, site?.origin ?? PRODUCTION_ORIGIN).href;
}
