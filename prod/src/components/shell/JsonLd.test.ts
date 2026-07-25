import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import JsonLd from './JsonLd.astro';

const render = async (props: { graph?: object | null }) => {
  const container = await AstroContainer.create();
  return container.renderToString(JsonLd, { props });
};

describe('JsonLd.astro', () => {
  // The emission site, not the serializer. `type="application/ld+json"` is a
  // non-src attribute, so Astro treats the tag as inline and never interpolates
  // {expressions} — writing the payload as a child expression ships the literal
  // source text. Nothing in serializeJsonLd's signature can prevent that, so
  // this is the only guard on the mistake the whole feature was designed around.
  it('emits a parseable ld+json block rather than literal source text', async () => {
    const html = await render({ graph: { '@context': 'https://schema.org', '@type': 'Person', name: 'Mike Lacey' } });

    const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    expect(match).not.toBeNull();
    expect(match![1]).not.toContain('serializeJsonLd');
    expect(JSON.parse(match![1])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mike Lacey',
    });
  });

  it('escapes < so CMS content cannot break out of the emitted block', async () => {
    const hostile = 'Mike </script><img src=x onerror=alert(1)>';

    const html = await render({ graph: { '@type': 'Person', name: hostile } });

    const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    expect(match).not.toBeNull();
    expect(match![1]).not.toContain('<');
    expect(JSON.parse(match![1]).name).toBe(hostile);
    // The payload text may legitimately appear inside the block — what must not
    // exist is a live element. Escaped, the hostile string renders as
    // `<img …`, so a real `<img` tag anywhere means the block broke out.
    expect(html).not.toContain('<img');
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });

  it('emits nothing when there is no graph', async () => {
    expect(await render({ graph: null })).not.toContain('ld+json');
    expect(await render({})).not.toContain('ld+json');
  });

  it('does not leak its explanatory comment into the output', async () => {
    const html = await render({ graph: { '@type': 'Person', name: 'Mike Lacey' } });

    expect(html).not.toContain('set:html is mandatory');
    expect(html).not.toContain('<!--');
  });
});
