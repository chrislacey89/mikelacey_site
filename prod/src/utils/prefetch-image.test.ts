import { beforeEach, describe, expect, it } from 'vitest';
import { prefetchImage, resetPrefetchCacheForTests } from './prefetch-image';

interface FakeImage {
  src?: string;
  srcset?: string;
  sizes?: string;
  fetchPriority?: string;
}

const fakes: FakeImage[] = [];
const createFake = () => {
  const image: FakeImage = {};
  fakes.push(image);
  return image as unknown as HTMLImageElement;
};

beforeEach(() => {
  fakes.length = 0;
  resetPrefetchCacheForTests();
});

describe('prefetchImage', () => {
  // The whole point is to warm the file the lightbox will ask for. Assigning
  // src before srcset/sizes would have the browser commit to the wrong
  // candidate, and the warmed bytes would go unused.
  it('carries the same candidate list and sizes the lightbox will use', () => {
    prefetchImage('https://cdn.sanity.io/a.jpg?w=1920', 'a-1024.jpg 1024w', '1024px', createFake);

    expect(fakes).toHaveLength(1);
    expect(fakes[0]).toMatchObject({
      src: 'https://cdn.sanity.io/a.jpg?w=1920',
      srcset: 'a-1024.jpg 1024w',
      sizes: '1024px',
    });
  });

  // Hover, focus and touchstart all fire for one tile, and a visitor sweeping
  // the grid re-enters tiles constantly.
  it('requests a given image only once', () => {
    prefetchImage('https://cdn.sanity.io/a.jpg', undefined, undefined, createFake);
    prefetchImage('https://cdn.sanity.io/a.jpg', undefined, undefined, createFake);
    prefetchImage('https://cdn.sanity.io/b.jpg', undefined, undefined, createFake);

    expect(fakes).toHaveLength(2);
  });

  // A speculative fetch must never outrank what is already on screen.
  it('asks for low priority', () => {
    prefetchImage('https://cdn.sanity.io/a.jpg', undefined, undefined, createFake);

    expect(fakes[0].fetchPriority).toBe('low');
  });

  it('does nothing without a URL, so callers need not branch', () => {
    prefetchImage(undefined, 'a.jpg 100w', '100px', createFake);

    expect(fakes).toHaveLength(0);
  });
});
