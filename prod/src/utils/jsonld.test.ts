import { describe, expect, it } from 'vitest';
import { buildHomeGraph, serializeJsonLd, type HomeGraphInput } from './jsonld';

const ORIGIN = 'https://www.themikelacey.com';

type JsonLdNode = Record<string, unknown>;

const fullInput: HomeGraphInput = {
  profile: {
    name: 'Mike Lacey',
    title: 'Television Director',
    headshotImage: 'https://cdn.sanity.io/images/yi6f32nh/production/headshot.jpg',
  },
  hero: { tagline: 'A career built on passion, respect, and making every show the best it can be.' },
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

    expect((nodeOfType(withImage, 'ProfilePage')?.mainEntity as JsonLdNode).image).toBe(
      fullInput.profile?.headshotImage,
    );
    expect(nodeOfType(withoutImage, 'ProfilePage')?.mainEntity as JsonLdNode).not.toHaveProperty(
      'image',
    );
  });

  // Google requires `name` on the mainEntity. A Person node without one is
  // invalid, and an invalid block is worse than no block: it fails validation
  // and asserts nothing. Callers treat null as "emit no script tag".
  it('returns null when the profile has no name', () => {
    expect(buildHomeGraph({ ...fullInput, profile: { title: 'Television Director' } }, ORIGIN)).toBeNull();
    expect(buildHomeGraph({ ...fullInput, profile: null }, ORIGIN)).toBeNull();
    expect(buildHomeGraph({}, ORIGIN)).toBeNull();
  });

  // In preview mode Sanity appends invisible zero-width characters to string
  // values to power click-to-edit. Sanity's docs are explicit that stega in
  // <head> or a JSON-LD block "always causes bugs and must be avoided".
  // The default stega filter already skips `email` and valid URLs, so the
  // fields genuinely at risk here are name, title, and tagline.
  it('strips stega zero-width characters from values', () => {
    const stega = '​‌‍﻿​‌‍﻿';

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
    expect((profilePage?.mainEntity as JsonLdNode).url).toBe(`${ORIGIN}/`);
  });
});
