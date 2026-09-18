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

export interface SanityImageSrcSetOptions {
  /** Height as a fraction of width. Only meaningful with `fit: 'crop'`. */
  aspectRatio?: number;
  quality?: number;
  fit?: 'crop' | 'max';
}

/**
 * A `srcset` of Sanity derivatives, one per candidate width.
 *
 * A single sized URL is right for exactly one screen. The gallery column that
 * is 360px wide on a laptop is the full 390px width of a phone at 3x, and a
 * fixed 800px request overserves the first and underserves neither — the
 * browser can only pick the smallest adequate file if it is offered a choice.
 *
 * Widths beyond the source's own are dropped, and the source width is offered
 * in their place. `fit=max` never upscales, so a 2560w candidate on a 1600px
 * scan would be the 1600px file mislabelled — the browser would then believe
 * it is sharper than it is and pick it on screens that do not need it.
 *
 * Returns `undefined` for non-Sanity URLs: there is nothing to vary, and a
 * one-entry srcset adds bytes without adding a choice.
 */
export function sanityImageSrcSet(
  url: string | undefined | null,
  widths: readonly number[],
  { aspectRatio, quality, fit }: SanityImageSrcSetOptions = {},
): string | undefined {
  const clean = stegaClean(url);
  if (!clean) return undefined;
  const first = sanityImageUrl(clean, { width: 1 });
  if (!first || first === clean) return undefined;

  const intrinsic = sanityImageDimensions(clean)?.width;
  const candidates = intrinsic
    ? [...new Set(widths.map((width) => Math.min(width, intrinsic)))]
    : [...widths];

  return candidates
    .sort((a, b) => a - b)
    .map((width) => {
      const height = aspectRatio ? Math.round(width * aspectRatio) : undefined;
      return `${sanityImageUrl(clean, { width, height, quality, fit })} ${width}w`;
    })
    .join(', ');
}

/**
 * Lightbox derivatives, shared by both galleries.
 *
 * The lightbox used to open the raw upload — up to a 5 MB JPEG — to fill a box
 * no wider than 1024 CSS px. 2048 covers that box at 2x, and `fit=max` means
 * no candidate is ever larger than the source. Quality 90 is deliberately above
 * the grid's 80: this is the zoomed view, where letters must stay legible and
 * compression artefacts would be visible. What changes is the pixels nobody's
 * screen can show, not the quality of the ones it can. The matching `sizes`
 * is `LIGHTBOX_SIZES` in gallery-sizes.ts.
 */
export function sanityLightboxImage(url: string | undefined | null) {
  return {
    lightboxSrc: sanityImageUrl(url, { width: 1920, quality: 90 }),
    lightboxSrcSet: sanityImageSrcSet(url, [1024, 1600, 2048], { quality: 90 }),
  };
}
