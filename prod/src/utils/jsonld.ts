import { stegaClean } from '@sanity/client/stega';

type JsonLdNode = Record<string, unknown>;

export interface HomeGraph {
  '@context': string;
  '@graph': JsonLdNode[];
}

export interface HomeGraphInput {
  profile?: { name?: string; title?: string; headshotImage?: string } | null;
  hero?: { tagline?: string } | null;
  contactInfo?: { linkedin?: string; imdb?: string } | null;
}

/**
 * Drops keys whose value is absent so optional schema.org properties are
 * omitted rather than emitted as null. An absent recommended property is
 * valid; a null or unresolvable one is not.
 */
const compact = (node: JsonLdNode): JsonLdNode =>
  Object.fromEntries(
    Object.entries(node).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );

/**
 * Rewrites IMDb's mobile host to the canonical one, preserving the path.
 *
 * Sanity holds the m.imdb.com URL, which is correct for the visible link on
 * /connect but weak as a `sameAs` identity assertion. Scoped to the IMDb host
 * rather than a general mobile-subdomain rule so no other CMS URL is silently
 * rewritten.
 */
const canonicalImdbUrl = (url: string | undefined): string | undefined =>
  url?.replace(/^https?:\/\/m\.imdb\.com\//i, 'https://www.imdb.com/');

/**
 * Builds the homepage JSON-LD graph: a WebSite, a ProfilePage, and the Person
 * nested inline as the ProfilePage's `mainEntity`.
 *
 * The nesting is not stylistic. Google lists `mainEntity` as required on
 * ProfilePage with `name` required inside it, and Rich Results Test does not
 * resolve `@id` references across `@graph` siblings when checking required
 * properties — an `@id` stub there reports "No items detected". The Person
 * still carries its own `@id` so other pages can reference it by stub.
 */
export function buildHomeGraph(rawInput: HomeGraphInput, origin: string): HomeGraph | null {
  // Strip stega before anything else. In preview mode Sanity appends invisible
  // zero-width characters to string values, and its docs are explicit that
  // stega inside <head> or a JSON-LD block always causes bugs. Same precedent
  // as generateVCardQR in ./qrcode.ts. Safe to call unguarded here: the input
  // is plain GROQ output, so the circular-ref and BigInt throws cannot occur.
  const input = stegaClean(rawInput);

  // `name` is required on the mainEntity. Without it the block would fail
  // validation and assert nothing, so emit no block at all.
  if (!input.profile?.name) return null;

  const homeUrl = `${origin}/`;
  const personId = `${origin}/#person`;
  const websiteId = `${origin}/#website`;

  // sameAs is an identity assertion — "these URLs unambiguously identify the
  // same entity" — so it carries only canonical profile URLs, never the site's
  // own homepage (that is `url`).
  const sameAs = [
    input.contactInfo?.linkedin,
    canonicalImdbUrl(input.contactInfo?.imdb),
  ].filter((url): url is string => Boolean(url));

  // No email or telephone here: neither is visible on the homepage, and Google
  // requires marked-up content be visible to readers. They belong on /connect,
  // added to this same @id as strictly additive properties.
  const person = compact({
    '@type': 'Person',
    '@id': personId,
    name: input.profile.name,
    jobTitle: input.profile?.title,
    description: input.hero?.tagline,
    url: homeUrl,
    image: input.profile?.headshotImage,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: input.profile.name,
        inLanguage: 'en-US',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${origin}/#webpage`,
        url: homeUrl,
        isPartOf: { '@id': websiteId },
        mainEntity: person,
      },
    ],
  };
}

/**
 * Serializes a JSON-LD graph for embedding via Astro's `set:html`.
 *
 * `set:html` injects raw and performs no escaping, so `JSON.stringify` alone
 * is not enough: a string containing `</script>` closes the block early and
 * the remainder lands in live DOM. Escaping `<` to its native JSON `<`
 * form makes `</` impossible to produce while still round-tripping through
 * `JSON.parse` — unlike HTML-entity escaping, which would hand consumers
 * `Mike &amp; Co`.
 */
export function serializeJsonLd(graph: object): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
