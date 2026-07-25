import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from './jsonld';

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
