import { describe, expect, it } from 'vitest';
import { sanityImageDimensions, sanityImageUrl } from './sanity-image';

const ASSET =
  'https://cdn.sanity.io/images/yi6f32nh/production/ecc7a671dd838551fb8a6d538910eac9edcd485e-2532x1170.png';

describe('sanityImageUrl', () => {
  it('requests a sized, format-negotiated derivative', () => {
    const url = new URL(sanityImageUrl(ASSET, { width: 768, height: 768, fit: 'crop' }) ?? '');

    expect(url.searchParams.get('w')).toBe('768');
    expect(url.searchParams.get('h')).toBe('768');
    expect(url.searchParams.get('fit')).toBe('crop');
    // The reason this is a helper and not a literal: one URL, and Sanity picks
    // WebP or AVIF from the request's own Accept header.
    expect(url.searchParams.get('auto')).toBe('format');
  });

  it('defaults height away rather than guessing one', () => {
    const url = new URL(sanityImageUrl(ASSET, { width: 800 }) ?? '');

    expect(url.searchParams.has('h')).toBe(false);
    expect(url.searchParams.get('fit')).toBe('max');
  });

  // The CMS field is a plain string with no host validation. Parameters Sanity
  // understands are meaningless to another origin, and appending them could
  // break a signed or query-sensitive URL.
  it('leaves a non-Sanity URL untouched', () => {
    const external = 'https://example.com/photo.jpg?token=abc';
    expect(sanityImageUrl(external, { width: 800 })).toBe(external);
  });

  it('passes through a value that is not a URL at all', () => {
    expect(sanityImageUrl('/images/headshot.jpeg', { width: 800 })).toBe('/images/headshot.jpeg');
  });

  it('returns undefined for an absent asset so callers can branch', () => {
    expect(sanityImageUrl(undefined, { width: 800 })).toBeUndefined();
    expect(sanityImageUrl(null, { width: 800 })).toBeUndefined();
    expect(sanityImageUrl('', { width: 800 })).toBeUndefined();
  });

  it('is idempotent, so a second pass does not stack parameters', () => {
    const once = sanityImageUrl(ASSET, { width: 800 });
    const twice = sanityImageUrl(once, { width: 800 });

    expect(twice).toBe(once);
  });
});

describe('sanityImageDimensions', () => {
  it('reads the intrinsic size out of the asset filename', () => {
    expect(sanityImageDimensions(ASSET)).toEqual({ width: 2532, height: 1170 });
  });

  it('still reads them once the pipeline parameters are appended', () => {
    expect(sanityImageDimensions(sanityImageUrl(ASSET, { width: 800 }))).toEqual({
      width: 2532,
      height: 1170,
    });
  });

  // A guessed aspect ratio reserves the wrong box, which causes the layout
  // shift the width/height attributes exist to prevent.
  it('returns undefined rather than guessing', () => {
    expect(sanityImageDimensions('https://example.com/photo.jpg')).toBeUndefined();
    expect(sanityImageDimensions(undefined)).toBeUndefined();
  });
});
