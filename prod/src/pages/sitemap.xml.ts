import type { APIRoute } from 'astro';
import { loadQuery } from '../lib/loadQuery';
import { PRODUCTION_ORIGIN } from '../utils/canonical';
import { SITE_PAGES } from '../utils/site-pages';

// Rendered per request rather than prerendered, so `<lastmod>` reflects the CMS
// rather than the last deploy. Sanity content changes without a rebuild; a
// prerendered sitemap would freeze every date at build time and slowly become
// the kind of unreliable lastmod Google's documentation says it ignores.
export const prerender = false;

/** Every type any page in the inventory is built from, deduplicated. */
const SOURCE_TYPES = [...new Set(SITE_PAGES.flatMap((page) => page.sourceTypes))];

interface DocumentStamp {
  _type: string;
  _updatedAt: string;
}

/**
 * Latest `_updatedAt` per document type.
 *
 * One query for every stamp rather than one per page: the document set is a few
 * dozen rows, and the alternative is five round trips to compute five dates.
 */
async function latestUpdatePerType(): Promise<Map<string, string>> {
  const documents = await loadQuery<DocumentStamp[]>({
    query: '*[_type in $types]{_type, _updatedAt}',
    params: { types: SOURCE_TYPES },
  });

  const latest = new Map<string, string>();
  for (const doc of documents ?? []) {
    const current = latest.get(doc._type);
    // ISO-8601 UTC strings from Sanity sort lexicographically the same way they
    // sort chronologically, so no Date construction is needed here.
    if (!current || doc._updatedAt > current) latest.set(doc._type, doc._updatedAt);
  }
  return latest;
}

/** W3C Datetime (`YYYY-MM-DD`), which is what the sitemap protocol asks for. */
const toW3CDate = (iso: string): string => iso.slice(0, 10);

export const GET: APIRoute = async () => {
  // A sitemap listing the right URLs with no dates is useful. A sitemap that
  // 500s because the CMS is unreachable is not, and the URL list needs no CMS
  // at all — so an outage degrades the extra rather than removing the file.
  let latest = new Map<string, string>();
  try {
    latest = await latestUpdatePerType();
  } catch {
    latest = new Map();
  }

  const entries = SITE_PAGES.map((page) => {
    const stamps = page.sourceTypes
      .map((type) => latest.get(type))
      .filter((stamp): stamp is string => Boolean(stamp));
    const lastmod = stamps.length > 0 ? toW3CDate(stamps.reduce((a, b) => (a > b ? a : b))) : null;

    return [
      '  <url>',
      `    <loc>${PRODUCTION_ORIGIN}${page.path}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n');
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  });
};
