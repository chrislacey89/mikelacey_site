import { defineMiddleware } from 'astro:middleware';
import { prefersMarkdown } from './utils/accept';
import { findSitePage, markdownPathFor } from './utils/site-pages';

/**
 * Content negotiation between the HTML pages and their `.md` companions.
 *
 * Two jobs, both scoped to the five inventory paths and nothing else:
 *
 * 1. A client that asks for `text/markdown` in preference to HTML is served the
 *    markdown route, at the HTML URL, without a redirect. `prefersMarkdown` is
 *    where the "in preference to" is enforced — browsers accept markdown at
 *    q=0.8 via `*​/*` and must keep getting HTML.
 * 2. Everyone else gets the HTML page plus a `Link:` header advertising the
 *    markdown address. The same advertisement is in `<head>`; carrying it in
 *    both is cheap, and neither carrier has an observed consumer, so this is a
 *    convenience rather than a claim.
 *
 * The rewrite cannot loop. Its target (`/story.md`) is not itself an inventory
 * path, so a second pass through this function finds no page and falls straight
 * through — true whether or not the Astro version re-runs middleware on rewrite.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const page = findSitePage(context.url.pathname);
  if (!page) return next();

  const markdownPath = markdownPathFor(page.path);

  if (prefersMarkdown(context.request.headers.get('accept'))) {
    const negotiated = await context.rewrite(markdownPath);
    // Without this a shared cache could store the markdown body against the
    // HTML URL and hand it to the next browser that asks. RFC 9110 calls Vary a
    // SHOULD; here the response genuinely varies, so it is not optional.
    negotiated.headers.set('vary', 'Accept');
    return negotiated;
  }

  const response = await next();
  response.headers.append('link', `<${markdownPath}>; rel="alternate"; type="text/markdown"`);
  response.headers.append('vary', 'Accept');
  return response;
});
