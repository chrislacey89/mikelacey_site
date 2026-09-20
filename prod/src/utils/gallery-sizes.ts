// `sizes` values for the gallery islands. Kept apart from sanity-image.ts so the
// islands can import them without pulling stega into the browser bundle.

/** One column on a phone, two from `sm`, three ~352px columns from `lg`. */
export const GALLERY_GRID_SIZES = '(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw';

/** Both lightboxes cap at 1024 CSS px and otherwise fill the viewport less
 *  their `p-4` padding. */
export const LIGHTBOX_SIZES = '(min-width: 1056px) 1024px, calc(100vw - 2rem)';
