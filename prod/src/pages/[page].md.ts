import type { APIRoute } from 'astro';
import { loadQuery } from '../lib/loadQuery';
import { PRODUCTION_ORIGIN } from '../utils/canonical';
import {
  buildAttaboysBody,
  buildConnectBody,
  buildHomeBody,
  buildStoryBody,
  buildWorkBody,
  type HomeMarkdownInput,
  renderMarkdownDocument,
} from '../utils/markdown';
import { findSitePage, type SitePage } from '../utils/site-pages';

export const prerender = false;

/**
 * Markdown representations of each page: `/index.md`, `/story.md`, `/work.md`,
 * `/attaboys.md`, `/connect.md`.
 *
 * Reachable two ways — directly at these addresses, and by sending
 * `Accept: text/markdown` to the HTML URL, which `src/middleware.ts` rewrites
 * here. Both must return 2xx with `content-type: text/markdown` and neither may
 * depend on a redirect: a `301 /about.md -> /about` is not a markdown route, and
 * a 404 body typed `text/markdown` is a measured real-world failure this shape
 * avoids.
 *
 * Always fetches the published perspective. These are machine representations
 * of the live page; the Presentation tool has no use for them, and drafts have
 * no business leaving the CMS.
 */

/** Markdown route segment to inventory entry. `index` is the homepage — the
 *  convention picked here — and anything else maps by path. */
function resolvePage(segment: string | undefined): SitePage | undefined {
  if (!segment) return undefined;
  return findSitePage(segment === 'index' ? '/' : `/${segment}`);
}

const bodyFor = async (page: SitePage, origin: string): Promise<string> => {
  switch (page.path) {
    case '/': {
      const [settings, credits] = await Promise.all([
        loadQuery<HomeMarkdownInput>({
          query:
            '*[_type == "siteSettings"][0]{hero{headline, tagline}, profile{name, title, subtitle}}',
        }),
        loadQuery<{ name?: string; network?: string }[]>({
          query: '*[_type == "credit"] | order(name asc) {name, network}',
        }),
      ]);
      return buildHomeBody({ ...settings, credits }, origin);
    }

    case '/story': {
      const [pageContent, events] = await Promise.all([
        loadQuery<{ intro?: string }>({ query: '*[_type == "siteSettings"][0].storyPage{intro}' }),
        loadQuery<{ year?: string; showYear?: boolean; title?: string; narrative?: string }[]>({
          query:
            '*[_type == "timelineEvent"] | order(orderRank asc, _createdAt asc) {year, showYear, title, narrative}',
        }),
      ]);
      return buildStoryBody({ pageContent, events });
    }

    case '/work': {
      const [pageContent, credits, photos, interviews] = await Promise.all([
        loadQuery<{ intro?: string }>({ query: '*[_type == "siteSettings"][0].workPage{intro}' }),
        loadQuery<{ name?: string; network?: string }[]>({
          query: '*[_type == "credit"] | order(name asc) {name, network}',
        }),
        loadQuery<{ alt?: string; caption?: string }[]>({
          query: '*[_type == "photo"]{"alt": image.alt, "caption": image.caption}',
        }),
        loadQuery<{ title?: string; description?: string; youtubeUrl?: string }[]>({
          query: '*[_type == "interview"]{title, description, youtubeUrl}',
        }),
      ]);
      return buildWorkBody({ pageContent, credits, photos, interviews });
    }

    case '/attaboys': {
      const [pageContent, testimonials] = await Promise.all([
        loadQuery<{ intro?: string }>({
          query: '*[_type == "siteSettings"][0].attaboysPage{intro}',
        }),
        loadQuery<{ caption?: string; alt?: string }[]>({
          query: '*[_type == "testimonial"]{caption, "alt": image.alt}',
        }),
      ]);
      return buildAttaboysBody({ pageContent, testimonials });
    }

    case '/connect': {
      const settings = await loadQuery<{
        sectionContent?: { intro?: string };
        contactInfo?: { email?: string; phoneDisplay?: string; linkedin?: string; imdb?: string };
      }>({
        query:
          '*[_type == "siteSettings"][0]{sectionContent{intro}, contactInfo{email, phoneDisplay, linkedin, imdb}}',
      });
      return buildConnectBody(settings ?? {});
    }

    default:
      return '';
  }
};

export const GET: APIRoute = async ({ params }) => {
  const page = resolvePage(params.page);

  // A 404 typed `text/markdown` is worse than an honest HTML 404: it looks like
  // a working route to anything checking the content type. Plain text, and the
  // status is the answer.
  if (!page) {
    return new Response('Not found\n', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const origin = PRODUCTION_ORIGIN;

  let body: string;
  try {
    body = await bodyFor(page, origin);
  } catch {
    // The title, description and canonical link need no CMS. A representation
    // that is thin because Sanity was unreachable still identifies the page
    // correctly, which a 500 does not.
    body = '';
  }

  return new Response(renderMarkdownDocument(page, origin, body), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  });
};
