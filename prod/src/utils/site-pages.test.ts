import { describe, expect, it } from 'vitest';
import { findSitePage, markdownPathFor, SITE_PAGES } from './site-pages';

describe('SITE_PAGES', () => {
  // Duplicate titles and descriptions are the classic templated-metadata
  // defect, and per-page inspection cannot see them — only a check across the
  // whole set can. This is that check.
  it('gives every page a unique title and description', () => {
    const titles = SITE_PAGES.map((page) => page.title);
    const descriptions = SITE_PAGES.map((page) => page.description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('leaves no page without metadata', () => {
    for (const page of SITE_PAGES) {
      expect(page.title.trim(), `${page.path} title`).not.toBe('');
      expect(page.description.trim(), `${page.path} description`).not.toBe('');
      expect(page.sourceTypes.length, `${page.path} sourceTypes`).toBeGreaterThan(0);
    }
  });

  // The sitemap and the canonical tag both build URLs by concatenating origin
  // and path. A path stored with a trailing slash, or without a leading one,
  // would produce a URL that disagrees with the canonical the page emits.
  it('stores paths in canonical form', () => {
    for (const page of SITE_PAGES) {
      expect(page.path.startsWith('/'), page.path).toBe(true);
      expect(page.path === '/' || !page.path.endsWith('/'), page.path).toBe(true);
    }
  });

  it('starts at the homepage, which supplies the site-level summary', () => {
    expect(SITE_PAGES[0].path).toBe('/');
  });
});

describe('findSitePage', () => {
  it('resolves a known path', () => {
    expect(findSitePage('/work')?.navLabel).toBe('Production Credits');
  });

  // Both spellings resolve to the same page, so both must find the same entry —
  // otherwise `/story/` would get no markdown alternate and no `Link:` header
  // while `/story` did.
  it('treats the trailing-slash variant as the same page', () => {
    expect(findSitePage('/story/')).toBe(findSitePage('/story'));
  });

  it('resolves the homepage', () => {
    expect(findSitePage('/')?.path).toBe('/');
  });

  // The middleware keys off this returning undefined. If /studio or an API
  // route ever matched, those responses would grow a markdown alternate that
  // does not exist.
  it('returns undefined for anything outside the inventory', () => {
    expect(findSitePage('/studio')).toBeUndefined();
    expect(findSitePage('/api/og.png')).toBeUndefined();
    expect(findSitePage('/story.md')).toBeUndefined();
  });
});

describe('markdownPathFor', () => {
  it('uses /index.md for the homepage', () => {
    expect(markdownPathFor('/')).toBe('/index.md');
  });

  it('appends .md to every other path', () => {
    expect(markdownPathFor('/connect')).toBe('/connect.md');
  });

  // The rewrite target must not itself be an inventory path, or a middleware
  // that re-runs on rewrite would loop forever.
  it('never produces a path that findSitePage resolves', () => {
    for (const page of SITE_PAGES) {
      expect(findSitePage(markdownPathFor(page.path))).toBeUndefined();
    }
  });
});
