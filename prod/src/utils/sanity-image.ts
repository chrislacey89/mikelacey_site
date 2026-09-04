import { stegaClean } from '@sanity/client/stega';

const SANITY_CDN_HOST = 'cdn.sanity.io';

export interface SanityImageOptions {
  width: number;
  height?: number;
  /** 1-100. Sanity's own default is 75. */
  quality?: number;
  /** `crop` needs both dimensions; `max` keeps the source aspect ratio. */
  fit?: 'crop' | 'max';
}

/**
 * Appends Sanity's image-pipeline parameters to an asset URL.
 *
 * Without this the site hands the browser whatever was uploaded. The homepage
 * headshot is one measured example: a 2532x1170 PNG delivered at full size into
 * a 384px circle. That is the LCP element on the most important page, so the
 * cost lands on the metric that is hardest to recover elsewhere.
 *
 * `auto=format` is the reason this is worth a helper rather than a literal —
 * it makes Sanity negotiate WebP/AVIF from the request's `Accept` header, so
 * one URL serves the modern format without the site branching on support.
 *
 * Non-Sanity URLs pass through untouched. The CMS field is a plain string and
 * nothing validates its host, so a hand-entered URL must not gain parameters
 * its origin will not understand.
 */
export function sanityImageUrl(
  url: string | undefined | null,
  { width, height, quality = 80, fit = 'max' }: SanityImageOptions,
): string | undefined {
  // Preview responses carry stega's zero-width characters inside string values.
  // They survive `new URL()` in the pathname and would be sent to the CDN as
  // percent-encoded garbage, so strip before parsing rather than after.
  const clean = stegaClean(url);
  if (!clean) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(clean);
  } catch {
    return clean;
  }
  if (parsed.hostname !== SANITY_CDN_HOST) return clean;

  parsed.searchParams.set('w', String(width));
  if (height !== undefined) parsed.searchParams.set('h', String(height));
  parsed.searchParams.set('fit', fit);
  parsed.searchParams.set('auto', 'format');
  parsed.searchParams.set('q', String(quality));

  return parsed.href;
}

/**
 * Intrinsic pixel dimensions of a Sanity asset, read from its filename.
 *
 * Sanity encodes the source dimensions into the asset path
 * (`...-2532x1170.png`), which makes them available without a second query or a
 * network round trip. That matters because the gallery grids render images of
 * unknown aspect ratio with `h-auto`: with no `width`/`height` the browser
 * reserves no space and every image that loads shifts the ones below it.
 *
 * Returns `undefined` rather than a guess when the pattern is absent — a wrong
 * aspect ratio reserves the wrong box and causes the shift it was meant to
 * prevent.
 */
export function sanityImageDimensions(
  url: string | undefined | null,
): { width: number; height: number } | undefined {
  const clean = stegaClean(url);
  if (!clean) return undefined;

  const match = clean.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:$|\?)/i);
  if (!match) return undefined;

  return { width: Number(match[1]), height: Number(match[2]) };
}
