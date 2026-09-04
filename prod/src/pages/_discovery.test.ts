// Underscore-prefixed so Astro's router ignores it. Any other name in
// src/pages/ would publish this file as a route at /discovery.test.
import type { APIContext } from 'astro';
import { describe, expect, it } from 'vitest';
import { PRODUCTION_ORIGIN } from '../utils/canonical';
import { markdownPathFor, SITE_PAGES } from '../utils/site-pages';
import { GET as llms } from './llms.txt';
import { GET as robots } from './robots.txt';

// Neither handler reads its context; both render compile-time constants. The
// cast keeps that explicit rather than building a fake request that says
// nothing.
const context = {} as APIContext;

const bodyOf = async (response: Response) => await response.text();

describe('/robots.txt', () => {
  it('is served as plain text, not as an HTML error page', async () => {
    const response = await robots(context);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
  });

  // The single most damaging entry on any crawl checklist. `Disallow: /` under
  // the wildcard group, or under any named AI agent, takes the whole site out
  // of both search and answer engines — and it is one character away from the
  // `Disallow: /studio` this file legitimately contains.
  it('never disallows the whole origin', async () => {
    const lines = (await bodyOf(await robots(context)))
      .split('\n')
      .map((line) => line.trim().toLowerCase());

    expect(lines).not.toContain('disallow: /');
    expect(lines).not.toContain('disallow: /*');
  });

  it('names every AI crawler the site has taken a position on', async () => {
    const body = await bodyOf(await robots(context));

    for (const agent of [
      'ClaudeBot',
      'Claude-User',
      'Claude-SearchBot',
      'GPTBot',
      'OAI-SearchBot',
      'ChatGPT-User',
      'Google-Extended',
      'PerplexityBot',
      'Perplexity-User',
      'CCBot',
      'Applebot-Extended',
    ]) {
      expect(body, `${agent} is unlisted`).toContain(`User-agent: ${agent}`);
    }
  });

  // Under RFC 9309 a bot's own group fully replaces the wildcard group, so the
  // housekeeping rules have to be repeated inside it rather than inherited.
  it('repeats the housekeeping rules in every group', async () => {
    const body = await bodyOf(await robots(context));
    const groups = body.split(/\n\s*\n/).filter((block) => block.includes('User-agent:'));

    expect(groups.length).toBeGreaterThanOrEqual(2);
    for (const group of groups) {
      expect(group).toContain('Disallow: /studio');
      expect(group).toContain('Allow: /');
    }
  });

  // Facebook's and X's unfurlers honour robots.txt, so a blanket /api block
  // would silently stop every social preview from resolving its image. Longest
  // match wins, so the Allow has to be the more specific of the two.
  it('keeps the OG image reachable despite the /api block', async () => {
    const body = await bodyOf(await robots(context));

    expect(body).toContain('Disallow: /api/');
    expect(body).toContain('Allow: /api/og.png');
    expect('/api/og.png'.length).toBeGreaterThan('/api/'.length);
  });

  it('declares an absolute sitemap URL', async () => {
    expect(await bodyOf(await robots(context))).toContain(
      `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`,
    );
  });
});

describe('/llms.txt', () => {
  it('is served as plain text', async () => {
    const response = await llms(context);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
  });

  // The file's only job is to be a signpost. A page missing from it is a page
  // the signpost does not point at.
  it('lists every page, at its markdown address', async () => {
    const body = await bodyOf(await llms(context));

    for (const page of SITE_PAGES) {
      expect(body, `${page.path} is missing`).toContain(
        `${PRODUCTION_ORIGIN}${markdownPathFor(page.path)}`,
      );
    }
  });

  it('opens with an ATX heading and a summary line', async () => {
    const body = await bodyOf(await llms(context));

    expect(body.startsWith('# Mike Lacey\n')).toBe(true);
    expect(body).toContain(`> ${SITE_PAGES[0].description}`);
  });
});
