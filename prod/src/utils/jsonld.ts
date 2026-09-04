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
    Object.entries(node).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
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
  // as sanityImageUrl in ./sanity-image.ts. Safe to call unguarded here: the
  // input is plain GROQ output, so the circular-ref and BigInt throws cannot
  // occur.
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
  const sameAs = [input.contactInfo?.linkedin, canonicalImdbUrl(input.contactInfo?.imdb)].filter(
    (url): url is string => Boolean(url),
  );

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

// -----------------------------------------------------------------------------
// Inner pages
//
// The homepage graph above is the entity definition: it is where the Person is
// spelled out in full, and where the `@id` other pages point at is minted. What
// follows never redefines that Person — each inner page describes *itself* and
// refers back by `@id`. Two pages asserting two different descriptions of one
// `@id` is how a knowledge-graph entity gets muddied, and it is silent.
// -----------------------------------------------------------------------------

export interface PageGraph {
  '@context': string;
  '@graph': JsonLdNode[];
}

/** Schema.org subtypes of WebPage this site actually has a page for. Narrowed
 *  rather than `string` so a typo becomes a type error, not a silently
 *  unrecognised `@type`. */
export type PageType = 'AboutPage' | 'CollectionPage' | 'ContactPage' | 'WebPage';

export interface PageGraphInput {
  /** Canonical path, slashless except the homepage. */
  path: string;
  name: string;
  description: string;
  type: PageType;
  /** Visitor-facing label for the breadcrumb, which is the nav's word for the
   *  page rather than its `<title>`. */
  breadcrumbLabel: string;
  /** Nodes describing what the page lists — an ItemList, a fuller Person.
   *  Emitted as `@graph` siblings. */
  extraNodes?: JsonLdNode[];
}

/**
 * Builds the shared skeleton for an inner page: the page node itself, its
 * membership in the WebSite, its subject (the Person), and a two-level
 * breadcrumb.
 *
 * The breadcrumb is genuinely two levels — this is a flat site, and every page
 * really does sit one hop from the homepage. It is not padded to look deeper.
 */
export function buildPageGraph(input: PageGraphInput, origin: string): PageGraph {
  const pageUrl = `${origin}${input.path}`;
  const personId = `${origin}/#person`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      compact({
        '@type': input.type,
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: input.name,
        description: input.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': personId },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      }),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: input.breadcrumbLabel, item: pageUrl },
        ],
      },
      ...(input.extraNodes ?? []),
    ],
  };
}

/**
 * An `ItemList` of named things the page enumerates.
 *
 * Returns `undefined` for an empty list rather than an `ItemList` with no
 * items. An empty list is not a smaller claim than a full one — it is the
 * assertion "this page lists nothing", which is false whenever the CMS query
 * simply came back empty.
 */
export function buildItemList(
  id: string,
  name: string,
  items: { name?: string; description?: string }[],
): JsonLdNode | undefined {
  const named = items.filter((item) => item.name?.trim());
  if (named.length === 0) return undefined;

  return {
    '@type': 'ItemList',
    '@id': id,
    name,
    numberOfItems: named.length,
    itemListElement: named.map((item, index) =>
      compact({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.description?.trim() || undefined,
      }),
    ),
  };
}

export interface ContactPersonInput {
  name?: string;
  jobTitle?: string;
  email?: string;
  /** E.164 where the CMS has it; this is the dialable value, not the display
   *  one. */
  phone?: string;
  linkedin?: string;
  imdb?: string;
}

/**
 * The Person node for `/connect`, carrying the two properties the homepage
 * deliberately withholds.
 *
 * Google requires marked-up content to be visible to readers, and email and
 * telephone are visible here and nowhere else — which is exactly why they are
 * added on this page rather than moved into the homepage graph. Same `@id`, so
 * consumers merge it onto the one entity.
 */
export function buildContactPerson(
  rawInput: ContactPersonInput,
  origin: string,
): JsonLdNode | null {
  const input = stegaClean(rawInput);
  if (!input.name) return null;

  const sameAs = [input.linkedin, canonicalImdbUrl(input.imdb)].filter((url): url is string =>
    Boolean(url),
  );

  return compact({
    '@type': 'Person',
    '@id': `${origin}/#person`,
    name: input.name,
    jobTitle: input.jobTitle,
    url: `${origin}/`,
    email: input.email,
    telephone: input.phone,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  });
}
