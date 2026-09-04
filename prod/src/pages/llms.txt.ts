import type { APIRoute } from 'astro';
import { PRODUCTION_ORIGIN } from '../utils/canonical';
import { markdownPathFor, SITE_PAGES } from '../utils/site-pages';

// Static for the same reason as robots.txt: it depends on nothing per-request,
// and the page inventory it renders is a compile-time constant.
export const prerender = true;

/**
 * `/llms.txt` — a proposed convention, published because it is nearly free.
 *
 * No ranking claim attaches to this file. Google has publicly dismissed the
 * convention and no major engine has adopted it. It exists here as a signpost
 * to the `.md` representations, which is the part of this lane with observed
 * consumers, and it should not be cited as an optimisation.
 *
 * Deliberately not `/llms-full.txt`: full-text variants have been measured at
 * tens of megabytes on other origins, and an unfetchable file helps nobody.
 */
export const GET: APIRoute = () => {
  // The site-level summary is the homepage's own description, so the two can
  // never disagree about what this site is.
  const summary = SITE_PAGES[0].description;

  const body = [
    '# Mike Lacey',
    '',
    `> ${summary}`,
    '',
    'Every page below is also available as markdown at the linked `.md` address,',
    'and by sending `Accept: text/markdown` to the HTML URL.',
    '',
    '## Pages',
    '',
    ...SITE_PAGES.map(
      (page) =>
        `- [${page.navLabel}](${PRODUCTION_ORIGIN}${markdownPathFor(page.path)}): ${page.description}`,
    ),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
