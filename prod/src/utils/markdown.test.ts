import { describe, expect, it } from 'vitest';
import {
  buildConnectBody,
  buildHomeBody,
  buildStoryBody,
  buildWorkBody,
  pipeTable,
  renderMarkdownDocument,
} from './markdown';
import { SITE_PAGES } from './site-pages';

const ORIGIN = 'https://www.themikelacey.com';
const HOME = SITE_PAGES[0];

describe('pipeTable', () => {
  // The measured failure mode in the wild is a pandoc grid table: `+-----+`
  // borders are paragraph text to a standard parser, so a document can be 64%
  // table scaffolding and contain no parseable table at all.
  it('emits GFM pipe syntax with a delimiter row and no grid borders', () => {
    const table = pipeTable(['Production', 'Network'], [['PGA Tour Live', 'Streaming']]);

    expect(table.split('\n')).toEqual([
      '| Production | Network |',
      '| --- | --- |',
      '| PGA Tour Live | Streaming |',
    ]);
    expect(table).not.toContain('+--');
  });

  // An unescaped pipe silently splits one cell into two and shifts every column
  // after it.
  it('escapes pipes inside cell content', () => {
    expect(pipeTable(['A'], [['left | right']])).toContain('left \\| right');
  });
});

describe('renderMarkdownDocument', () => {
  it('opens with an ATX h1 and names the canonical HTML address', () => {
    const doc = renderMarkdownDocument(HOME, ORIGIN, '## A section\n\nBody.');

    expect(doc.startsWith(`# ${HOME.title}\n`)).toBe(true);
    expect(doc).toContain(HOME.description);
    expect(doc).toContain(`Canonical HTML version: ${ORIGIN}/`);
  });

  // A representation of a page that is only reachable because the CMS was
  // reachable is not a representation of the page. Title, description and
  // canonical link must survive an empty body.
  it('still identifies the page when the body is empty', () => {
    const doc = renderMarkdownDocument(HOME, ORIGIN, '');

    expect(doc).toContain(`# ${HOME.title}`);
    expect(doc).toContain(`${ORIGIN}/`);
    expect(doc).not.toMatch(/\n{3}/);
  });

  it('builds the inner pages canonical link without doubling the slash', () => {
    const story = SITE_PAGES.find((page) => page.path === '/story');
    if (!story) throw new Error('inventory lost /story');

    expect(renderMarkdownDocument(story, ORIGIN, '')).toContain(`${ORIGIN}/story`);
    expect(renderMarkdownDocument(story, ORIGIN, '')).not.toContain(`${ORIGIN}//`);
  });
});

describe('page bodies', () => {
  it('uses ATX headings rather than emphasis for structure', () => {
    const body = buildHomeBody(
      {
        profile: { name: 'Mike Lacey', title: 'Director' },
        hero: { headline: 'Headline', tagline: 'Tagline.' },
        credits: [{ name: 'PGA Tour Live', network: 'Streaming' }],
      },
      ORIGIN,
    );

    expect(body).toContain('## Headline');
    expect(body).toContain('| Production | Network |');
    expect(body).not.toMatch(/^\*\*[^*]+\*\*$/m);
  });

  // A whitespace-only network exists in the CMS today. Emitting it leaves a
  // blank table cell that reads as missing data rather than absent data.
  it('substitutes an em dash for a blank network', () => {
    const body = buildHomeBody(
      { credits: [{ name: 'Corporate Productions', network: '  ' }] },
      ORIGIN,
    );

    expect(body).toContain('| Corporate Productions | — |');
  });

  it('omits sections the CMS has nothing for, rather than emitting empty ones', () => {
    const body = buildWorkBody({ credits: [], photos: [], interviews: [] });

    expect(body).not.toContain('## Production credits');
    expect(body).not.toContain('## Video interviews');
  });

  it('titles story eras with the year only when the page shows one', () => {
    const body = buildStoryBody({
      events: [
        { year: '1981', showYear: true, title: 'The shipping department', narrative: 'a' },
        { year: '1990', showYear: false, title: 'Later', narrative: 'b' },
      ],
    });

    expect(body).toContain('## 1981 — The shipping department');
    expect(body).toContain('## Later');
    expect(body).not.toContain('## 1990');
  });

  it('lists contact details a machine can read off', () => {
    const body = buildConnectBody({
      contactInfo: { email: 'a@b.com', phoneDisplay: '(407) 257-6132' },
    });

    expect(body).toContain('- **Email:** a@b.com');
    expect(body).toContain('- **Phone:** (407) 257-6132');
  });

  // Content lines should dominate scaffolding. A body that is mostly blank
  // lines and separators is the presence-only pass this lane rewards wrongly.
  it('keeps content lines dominant over blank ones', () => {
    const body = buildWorkBody({
      pageContent: { intro: 'Intro paragraph.' },
      credits: [
        { name: 'A', network: 'N' },
        { name: 'B', network: 'N' },
      ],
      photos: [{ caption: 'A photo' }],
      interviews: [{ title: 'An interview', youtubeUrl: 'https://youtu.be/x' }],
    });

    const lines = body.split('\n');
    const content = lines.filter((line) => line.trim() !== '');
    expect(content.length).toBeGreaterThan(lines.length / 2);
  });
});
