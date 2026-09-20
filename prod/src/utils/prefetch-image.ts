// Kept apart from sanity-image.ts for the same reason as gallery-sizes.ts: the
// galleries are client islands, and stega has no business in a browser bundle.

let started = new Set<string>();

/** Test seam. The module-level cache would otherwise leak between cases. */
export function resetPrefetchCacheForTests(): void {
  started = new Set();
}

/**
 * Starts downloading a gallery image before the click that needs it.
 *
 * The lightbox only requests its file when it mounts, so on a 4G connection a
 * visitor watched an empty overlay for about 700ms after clicking. Hover, focus
 * and the touch that precedes a tap all happen first — usually by a few hundred
 * milliseconds — so the request is in flight, and often finished, by the time
 * the lightbox asks for it.
 *
 * Deliberately not triggered when a thumbnail scrolls into view: that would
 * fetch every full-size image on the page whether or not anyone opens one,
 * which across these galleries is several megabytes nobody asked for. Intent is
 * the trigger, not visibility.
 *
 * `srcSet` and `sizes` must match what the lightbox renders, or the browser
 * picks a different candidate and this warms the wrong file — hence both are
 * set before `src`. `fetchPriority` stays low so a speculative fetch never
 * competes with what is already on screen.
 */
export function prefetchImage(
  src?: string,
  srcSet?: string,
  sizes?: string,
  createImage: () => HTMLImageElement = () => new Image(),
): void {
  if (!src || started.has(src)) return;
  started.add(src);

  const image = createImage();
  image.fetchPriority = 'low';
  image.decoding = 'async';
  if (sizes) image.sizes = sizes;
  if (srcSet) image.srcset = srcSet;
  image.src = src;
}
