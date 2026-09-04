import { loadRenderers } from 'astro:container';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getContainerRenderer } from '@astrojs/react';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import { SITE_PAGES } from '../utils/site-pages';
import BaseLayout from './BaseLayout.astro';

const DEFAULT_DESCRIPTION =
  'Television director specializing in sports and entertainment production.';

// The three sinks the description feeds. A refactor that drops one of them
// regresses social previews while the visible page and `astro check` stay
// green — docs/solutions/integration-issues/astro-jsonld-emission-and-escaping
// is explicit that the whole <head> is the unit under test, not one element.
const SINKS = [
  { label: 'meta description', pattern: /<meta name="description" content="([^"]*)"/ },
  { label: 'og:description', pattern: /<meta property="og:description" content="([^"]*)"/ },
  { label: 'twitter:description', pattern: /<meta name="twitter:description" content="([^"]*)"/ },
];

// BaseLayout renders MainNav, a .tsx island, so the container needs the React
// renderer registered or it throws NoMatchingRenderer before reaching the head.
const render = async (props: Record<string, unknown>, request?: Request) => {
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  return container.renderToString(BaseLayout, { props, request });
};

describe('BaseLayout.astro description', () => {
  it('threads a supplied description into all three head sinks', async () => {
    const html = await render({ title: 'T', description: 'A page-specific description.' });

    for (const { label, pattern } of SINKS) {
      const match = html.match(pattern);
      expect(match, `${label} tag is missing`).not.toBeNull();
      expect(match?.[1], `${label} did not receive the prop`).toBe('A page-specific description.');
    }
  });

  it('falls back to the shared default when no description is passed', async () => {
    const html = await render({ title: 'T' });

    // The fallback is intentional — it is what made issue #8 silent rather than
    // visibly broken. Pinned so its removal is a deliberate decision.
    expect(html.match(SINKS[0].pattern)?.[1]).toBe(DEFAULT_DESCRIPTION);
  });

  it('escapes quotes so copy cannot break out of the attribute', async () => {
    const html = await render({ title: 'T', description: 'He said "hello" & left' });

    const raw = html.match(SINKS[0].pattern)?.[1] ?? '';
    expect(raw).not.toContain('"');
    expect(html.match(/<meta name="description"/g)).toHaveLength(1);
  });
});

// Rendered rather than source-level, and asserted on the whole head: the unit
// under test is what ships in <head>, not what canonicalUrl returns — that is
// already covered in src/utils/canonical.test.ts. The regression this guards is
// the layout ceasing to emit the tag, or emitting it from the wrong origin.
describe('BaseLayout.astro canonical link', () => {
  const CANONICAL = /<link rel="canonical" href="([^"]*)"/;

  it('emits exactly one canonical link at the production origin', async () => {
    const html = await render({ title: 'T' }, new Request('https://www.themikelacey.com/story'));

    expect(html.match(/rel="canonical"/g), 'canonical link is missing').toHaveLength(1);
    expect(html.match(CANONICAL)?.[1]).toBe('https://www.themikelacey.com/story');
  });

  // The trap named in issue #9. og:url legitimately follows the request, so
  // asserting both in one test pins the distinction rather than the mechanism —
  // a refactor that collapsed the two values would go green on canonical alone.
  it('nominates production even when served from a preview deploy', async () => {
    const html = await render(
      { title: 'T' },
      new Request('https://mikelacey-git-abc123.vercel.app/story'),
    );

    expect(html.match(CANONICAL)?.[1]).toBe('https://www.themikelacey.com/story');
    // og:url follows the canonical, not the request. It used to echo
    // Astro.url.href, which meant a preview deploy — and any real URL carrying
    // a query string — published itself as the address to share.
    expect(html).toContain('<meta property="og:url" content="https://www.themikelacey.com/story"');
    expect(html).not.toContain('mikelacey-git-abc123.vercel.app');
  });

  it('normalises request variants onto one address', async () => {
    const html = await render(
      { title: 'T' },
      new Request('https://www.themikelacey.com/story/?preview=1'),
    );

    expect(html.match(CANONICAL)?.[1]).toBe('https://www.themikelacey.com/story');
  });
});

// Source-level rather than rendered: every page fetches from Sanity at request
// time, so rendering them in a container would need the network stubbed. The
// regression this guards is a page *ceasing to pass the prop* — which is a fact
// about the call site, and is exactly what issue #8 was.
//
// Pages now thread their metadata from SITE_PAGES rather than repeating string
// literals, so resolving a call site means following that reference. The check
// is the same one; a page that stopped passing a description, or whose
// inventory entry went missing, still fails here.
describe('every page passes its own description', () => {
  const pagesDir = join(import.meta.dirname, '..', 'pages');
  const pages = readdirSync(pagesDir).filter((f) => f.endsWith('.astro'));

  const pathForFile = (file: string) =>
    file === 'index.astro' ? '/' : `/${file.replace(/\.astro$/, '')}`;

  const descriptionOf = (file: string) => {
    const source = readFileSync(join(pagesDir, file), 'utf-8');

    const literal = source.match(/description="([^"]+)"/)?.[1];
    if (literal) return literal;

    if (!/description=\{page\.description\}/.test(source)) return undefined;
    return SITE_PAGES.find((entry) => entry.path === pathForFile(file))?.description;
  };

  it.each(pages)('%s declares a non-default description', (file) => {
    const description = descriptionOf(file);

    expect(description, `${file} passes no description to BaseLayout`).toBeDefined();
    expect(description).not.toBe(DEFAULT_DESCRIPTION);
  });

  it('gives every page a distinct description', () => {
    const found = pages.map(descriptionOf).filter(Boolean);

    expect(new Set(found).size).toBe(found.length);
  });
});

describe('BaseLayout.astro indexing directives', () => {
  // A canonical is a nomination for indexing. Emitted next to noindex it states
  // two contradictory things about one URL, and the 404 handler is the one
  // route that must not nominate itself — it answers for every unknown path on
  // the site, so a self-canonical there is a canonical for infinitely many URLs.
  it('swaps the canonical for a robots directive when noindex is set', async () => {
    const html = await render({ title: 'T', noindex: true });

    expect(html).toContain('<meta name="robots" content="noindex, follow"');
    expect(html).not.toContain('rel="canonical"');
  });

  it('emits a canonical and no robots directive by default', async () => {
    const html = await render({ title: 'T' });

    expect(html).toContain('rel="canonical"');
    expect(html).not.toContain('name="robots"');
  });
});

describe('BaseLayout.astro markdown alternate', () => {
  it('advertises the markdown companion of an inventory page', async () => {
    const html = await render({ title: 'T' }, new Request('https://www.themikelacey.com/story'));

    expect(html).toContain('<link rel="alternate" type="text/markdown" href="/story.md"');
  });

  it('advertises /index.md for the homepage', async () => {
    const html = await render({ title: 'T' }, new Request('https://www.themikelacey.com/'));

    expect(html).toContain('href="/index.md"');
  });

  // Pointing at a `.md` address that 404s is worse than staying quiet: it looks
  // like a working route to anything that reads the head without fetching it.
  it('stays quiet on a page with no markdown companion', async () => {
    const html = await render({ title: 'T' }, new Request('https://www.themikelacey.com/nope'));

    expect(html).not.toContain('type="text/markdown"');
  });
});
