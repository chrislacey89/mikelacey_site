import { describe, expect, it } from 'vitest';
import {
  buildContactPerson,
  buildHomeGraph,
  buildItemList,
  buildPageGraph,
  type HomeGraphInput,
  serializeJsonLd,
} from './jsonld';

const ORIGIN = 'https://www.themikelacey.com';

type JsonLdNode = Record<string, unknown>;

const fullInput: HomeGraphInput = {
  profile: {
    name: 'Mike Lacey',
    title: 'Television Director',
    headshotImage: 'https://cdn.sanity.io/images/yi6f32nh/production/headshot.jpg',
  },
  hero: {
    tagline: 'A career built on passion, respect, and making every show the best it can be.',
  },
  contactInfo: {
    linkedin: 'https://www.linkedin.com/in/mike-lacey-35926513/',
    imdb: 'https://www.imdb.com/name/nm0479943/',
  },
};

const nodeOfType = (graph: ReturnType<typeof buildHomeGraph>, type: string) =>
  graph?.['@graph'].find((node) => node['@type'] === type);

describe('serializeJsonLd', () => {
  it('produces a string that parses back to the original graph', () => {
    const graph = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mike Lacey',
    };

    expect(JSON.parse(serializeJsonLd(graph))).toEqual(graph);
  });

  // Regression guard. `set:html` injects raw and does not escape, so a CMS
  // string containing `</script>` terminates the block early and everything
  // after it lands in live DOM. Verified exploitable on astro@5.16.6 before
  // this escaping existed. Asserting "no raw `<` survives" rather than
  // checking for a specific escape sequence keeps this test about the
  // invariant, not the mechanism.
  it('leaves no raw < in the output, so CMS content cannot break out of the script block', () => {
    const hostile = 'Mike </script><img src=x onerror=alert(1)>';

    const serialized = serializeJsonLd({ '@type': 'Person', name: hostile });

    expect(serialized).not.toContain('<');
    expect(JSON.parse(serialized).name).toBe(hostile);
  });
});

describe('buildHomeGraph', () => {
  // Load-bearing shape check. Google lists mainEntity as required on
  // ProfilePage with name required inside it, and Rich Results Test does not
  // resolve @id references across @graph siblings when checking required
  // properties. Verified live 2026-07-25: an @id stub here yields
  // "No items detected"; nesting yields "Profile page". Both shapes look
  // reasonable in review, so only this test stands between us and a silent
  // regression back to the undetectable form.
  it('nests Person inside ProfilePage.mainEntity instead of referencing it by @id', () => {
    const graph = buildHomeGraph(fullInput, ORIGIN);

    const profilePage = nodeOfType(graph, 'ProfilePage');
    const mainEntity = profilePage?.mainEntity as Record<string, unknown>;

    expect(mainEntity['@type']).toBe('Person');
    expect(mainEntity.name).toBe('Mike Lacey');
    expect(mainEntity.jobTitle).toBe('Television Director');
    // The Person keeps its own @id so other pages can reference it by stub...
    expect(mainEntity['@id']).toBe(`${ORIGIN}/#person`);
    // ...but must not also appear as a sibling node, which would declare the
    // entity twice and risk conflicting properties.
    expect(graph?.['@graph'].some((node) => node['@type'] === 'Person')).toBe(false);
  });

  // HomeHero falls back to a bundled local asset when Sanity has no headshot,
  // so a naive passthrough would emit a relative or hash-named path. Google
  // requires image URLs be absolute and crawlable, so omitting the key is
  // correct — an absent recommended property beats an unresolvable one.
  it('includes image only when headshotImage is present', () => {
    const withImage = buildHomeGraph(fullInput, ORIGIN);
    const withoutImage = buildHomeGraph(
      { ...fullInput, profile: { ...fullInput.profile, headshotImage: undefined } },
      ORIGIN,
    );

    const withImagePage = nodeOfType(withImage, 'ProfilePage') as JsonLdNode;

    expect((withImagePage.mainEntity as JsonLdNode).image).toBe(fullInput.profile?.headshotImage);
    expect(nodeOfType(withoutImage, 'ProfilePage')?.mainEntity as JsonLdNode).not.toHaveProperty(
      'image',
    );
  });

  // Google requires `name` on the mainEntity. A Person node without one is
  // invalid, and an invalid block is worse than no block: it fails validation
  // and asserts nothing. Callers treat null as "emit no script tag".
  it('returns null when the profile has no name', () => {
    expect(
      buildHomeGraph({ ...fullInput, profile: { title: 'Television Director' } }, ORIGIN),
    ).toBeNull();
    expect(buildHomeGraph({ ...fullInput, profile: null }, ORIGIN)).toBeNull();
    expect(buildHomeGraph({}, ORIGIN)).toBeNull();
  });

  // In preview mode Sanity appends invisible zero-width characters to string
  // values to power click-to-edit. Sanity's docs are explicit that stega in
  // <head> or a JSON-LD block "always causes bugs and must be avoided".
  // The default stega filter already skips `email` and valid URLs, so the
  // fields genuinely at risk here are name, title, and tagline.
  it('strips stega zero-width characters from values', () => {
    // Built from code points rather than pasted literals. Invisible characters
    // in source are one editor normalization or lint --fix away from silently
    // becoming an empty string, at which point every assertion below would
    // still pass while guarding nothing. ZWSP, ZWNJ, ZWJ, BOM — the alphabet
    // @vercel/stega encodes with, repeated to clear its {4,} run threshold.
    const stega = String.fromCodePoint(0x200b, 0x200c, 0x200d, 0xfeff).repeat(2);

    // Precondition: the fixture must actually be dirty, or this test is vacuous.
    expect(stega).toHaveLength(8);
    expect(`Mike Lacey${stega}`).not.toBe('Mike Lacey');

    const graph = buildHomeGraph(
      {
        ...fullInput,
        profile: {
          ...fullInput.profile,
          name: `Mike Lacey${stega}`,
          title: `Television Director${stega}`,
        },
        hero: { tagline: `A tagline${stega}` },
      },
      ORIGIN,
    );

    const person = nodeOfType(graph, 'ProfilePage')?.mainEntity as JsonLdNode;
    expect(person.name).toBe('Mike Lacey');
    expect(person.jobTitle).toBe('Television Director');
    expect(person.description).toBe('A tagline');
  });

  it('includes sameAs only when profile URLs are present', () => {
    const withLinks = nodeOfType(buildHomeGraph(fullInput, ORIGIN), 'ProfilePage')
      ?.mainEntity as JsonLdNode;
    const withoutLinks = nodeOfType(
      buildHomeGraph({ ...fullInput, contactInfo: null }, ORIGIN),
      'ProfilePage',
    )?.mainEntity as JsonLdNode;

    expect(withLinks.sameAs).toEqual([
      'https://www.linkedin.com/in/mike-lacey-35926513/',
      'https://www.imdb.com/name/nm0479943/',
    ]);
    expect(withoutLinks).not.toHaveProperty('sameAs');
  });

  // Sanity currently holds the m.imdb.com mobile URL. That is fine for the
  // visible link on /connect, but sameAs is machine-facing identity data and
  // should point at the canonical profile. Normalizing only the host keeps
  // the path — and therefore the identity — untouched.
  it('normalizes the IMDb mobile host to the canonical one in sameAs', () => {
    const person = nodeOfType(
      buildHomeGraph(
        { ...fullInput, contactInfo: { imdb: 'https://m.imdb.com/name/nm0479943/' } },
        ORIGIN,
      ),
      'ProfilePage',
    )?.mainEntity as JsonLdNode;

    expect(person.sameAs).toEqual(['https://www.imdb.com/name/nm0479943/']);
  });

  it('leaves non-IMDb URLs untouched', () => {
    const person = nodeOfType(
      buildHomeGraph(
        { ...fullInput, contactInfo: { linkedin: 'https://m.example.com/in/someone/' } },
        ORIGIN,
      ),
      'ProfilePage',
    )?.mainEntity as JsonLdNode;

    expect(person.sameAs).toEqual(['https://m.example.com/in/someone/']);
  });

  // validator.schema.org checks that types and properties are well-formed, not
  // that the nodes point at each other correctly. A typo in an @id reference
  // would validate cleanly and still leave the graph unlinked.
  it('wires WebSite and ProfilePage together by @id', () => {
    const graph = buildHomeGraph(fullInput, ORIGIN);
    const website = nodeOfType(graph, 'WebSite');
    const profilePage = nodeOfType(graph, 'ProfilePage');

    expect(website?.['@id']).toBe(`${ORIGIN}/#website`);
    expect(website?.publisher).toEqual({ '@id': `${ORIGIN}/#person` });
    expect(profilePage?.isPartOf).toEqual({ '@id': `${ORIGIN}/#website` });
    expect(profilePage?.url).toBe(`${ORIGIN}/`);
    expect((profilePage?.mainEntity as JsonLdNode | undefined)?.url).toBe(`${ORIGIN}/`);
  });
});

describe('buildPageGraph', () => {
  const graph = buildPageGraph(
    {
      path: '/work',
      name: 'My Work - Mike Lacey',
      description: 'Production credits.',
      type: 'CollectionPage',
      breadcrumbLabel: 'Production Credits',
    },
    ORIGIN,
  );

  const nodeOf = (type: string) =>
    graph['@graph'].find((node) => node['@type'] === type) as JsonLdNode | undefined;

  // The whole point of an inner-page graph: describe the page, point at the
  // entity. Redescribing the Person here would put two competing descriptions
  // of one @id into the graph, and nothing would report it.
  it('refers to the Person by @id rather than restating it', () => {
    const page = nodeOf('CollectionPage');

    expect(page?.about).toEqual({ '@id': `${ORIGIN}/#person` });
    expect(graph['@graph'].some((node) => node['@type'] === 'Person')).toBe(false);
  });

  it('joins the page to the WebSite the homepage declares', () => {
    expect(nodeOf('CollectionPage')?.isPartOf).toEqual({ '@id': `${ORIGIN}/#website` });
  });

  it('builds a two-level breadcrumb that resolves to real URLs', () => {
    const crumbs = nodeOf('BreadcrumbList')?.itemListElement as JsonLdNode[];

    expect(crumbs).toHaveLength(2);
    expect(crumbs[0]).toMatchObject({ position: 1, name: 'Home', item: `${ORIGIN}/` });
    expect(crumbs[1]).toMatchObject({
      position: 2,
      name: 'Production Credits',
      item: `${ORIGIN}/work`,
    });
  });

  it('links the page node to its breadcrumb by @id', () => {
    expect(nodeOf('CollectionPage')?.breadcrumb).toEqual({
      '@id': `${ORIGIN}/work#breadcrumb`,
    });
    expect(nodeOf('BreadcrumbList')?.['@id']).toBe(`${ORIGIN}/work#breadcrumb`);
  });

  it('appends extra nodes as graph siblings', () => {
    const withExtra = buildPageGraph(
      {
        path: '/work',
        name: 'n',
        description: 'd',
        type: 'CollectionPage',
        breadcrumbLabel: 'b',
        extraNodes: [{ '@type': 'ItemList' }],
      },
      ORIGIN,
    );

    expect(withExtra['@graph']).toHaveLength(3);
    expect(withExtra['@graph'][2]).toEqual({ '@type': 'ItemList' });
  });
});

describe('buildItemList', () => {
  it('numbers its members from one', () => {
    const list = buildItemList('#credits', 'Credits', [
      { name: 'PGA Tour Live', description: 'Streaming' },
      { name: 'The Mickey Mouse Club', description: 'Disney Channel' },
    ]);

    const items = (list?.itemListElement ?? []) as JsonLdNode[];

    expect(list?.numberOfItems).toBe(2);
    expect(items[0]).toMatchObject({ position: 1, name: 'PGA Tour Live' });
  });

  // An empty ItemList is not a smaller claim than a full one — it asserts the
  // page lists nothing, which is false whenever the query simply came back
  // empty.
  it('returns nothing at all for an empty list', () => {
    expect(buildItemList('#credits', 'Credits', [])).toBeUndefined();
    expect(buildItemList('#credits', 'Credits', [{ name: '  ' }])).toBeUndefined();
  });

  // A whitespace-only network exists in the CMS today, and `description: ""`
  // would be an unresolvable property rather than an absent one.
  it('drops a blank description rather than emitting an empty string', () => {
    const list = buildItemList('#credits', 'Credits', [{ name: 'A', description: '   ' }]);

    const items = (list?.itemListElement ?? []) as JsonLdNode[];

    expect(items[0]).not.toHaveProperty('description');
  });
});

describe('buildContactPerson', () => {
  const person = buildContactPerson(
    {
      name: 'Mike Lacey',
      jobTitle: 'Television Director',
      email: 'themikelacey@gmail.com',
      phone: '+1-407-257-6132',
      linkedin: 'https://www.linkedin.com/in/mike-lacey-35926513/',
      imdb: 'https://m.imdb.com/name/nm0479943/',
    },
    ORIGIN,
  );

  // Same @id as the homepage Person, so consumers merge the two rather than
  // recording a second individual who shares a name.
  it('adds to the homepage entity rather than declaring a second one', () => {
    expect(person?.['@id']).toBe(`${ORIGIN}/#person`);
    expect(person?.url).toBe(`${ORIGIN}/`);
  });

  it('carries the two properties the homepage deliberately withholds', () => {
    expect(person?.email).toBe('themikelacey@gmail.com');
    expect(person?.telephone).toBe('+1-407-257-6132');
  });

  it('canonicalises the IMDb host here too', () => {
    expect(person?.sameAs).toContain('https://www.imdb.com/name/nm0479943/');
  });

  // `name` is what makes the node identify anyone. Without it the block would
  // assert an email against nothing.
  it('emits no node at all without a name', () => {
    expect(buildContactPerson({ email: 'a@b.com' }, ORIGIN)).toBeNull();
  });
});
