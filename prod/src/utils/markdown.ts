import type { SitePage } from './site-pages';

/**
 * Markdown representations of the site's pages, for clients that ask for
 * `text/markdown` by content negotiation.
 *
 * Everything here is a pure function over already-fetched data. The route does
 * the I/O. That split is what lets the shape of the output be tested at all —
 * and shape is the whole risk in this lane. A markdown route that exists but
 * emits visual emphasis where headings belong, or pandoc grid-borders where a
 * GFM table belongs, passes a presence check and is still unreadable to a
 * standard parser.
 *
 * Scope note, because this lane oversells itself: serving markdown has been
 * observed at network scale as something agents request. It has not been shown
 * to improve rankings, citations, or answer presence. This exists because it is
 * cheap and correct, not because it is a lever.
 */

/** Escapes the one character that can break a GFM pipe table cell. */
const cell = (value: string): string => value.replace(/\|/g, '\\|').trim();

/**
 * A GFM pipe table. Not a pandoc grid table: `+-----+` borders are paragraph
 * text to a standard parser, which is the measured failure mode this avoids.
 */
export function pipeTable(headers: string[], rows: string[][]): string {
  const lines = [
    `| ${headers.map(cell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
  ];
  return lines.join('\n');
}

/**
 * Joins blocks with blank lines, dropping the empty ones so absent CMS fields
 * leave no gap rather than a run of blank lines.
 *
 * The `typeof` test is deliberate and must stay. Callers pass `cond && block`,
 * so a skipped section arrives as the boolean `false` — and `part?.trim()`,
 * which a linter will offer as a simplification, throws on it. The narrowing
 * has to reject non-strings, not just nullish ones.
 */
const blocks = (...parts: (string | undefined | null | false)[]): string =>
  parts
    .filter((part): part is string => typeof part === 'string' && part.trim() !== '')
    .join('\n\n');

/**
 * Wraps a page's body in the frame every representation shares: an ATX `#`
 * title, the page's own meta description as the opening line, the body, then
 * the canonical HTML address.
 *
 * The canonical link at the foot is not decoration. A markdown file passed
 * around without it has no way to say which URL it represents, and the whole
 * point of the representation is that it stands in for a specific page.
 */
export function renderMarkdownDocument(page: SitePage, origin: string, body: string): string {
  const canonical = `${origin}${page.path === '/' ? '/' : page.path}`;

  return `${blocks(
    `# ${page.title}`,
    page.description,
    body,
    `---\n\nCanonical HTML version: ${canonical}`,
  )}\n`;
}

// -----------------------------------------------------------------------------
// Per-page bodies
// -----------------------------------------------------------------------------

export interface HomeMarkdownInput {
  profile?: { name?: string; title?: string; subtitle?: string } | null;
  hero?: { headline?: string; tagline?: string } | null;
  credits?: { name?: string; network?: string }[] | null;
}

export function buildHomeBody(input: HomeMarkdownInput, origin: string): string {
  const credits = (input.credits ?? []).filter((credit) => credit.name);

  return blocks(
    input.hero?.headline && `## ${input.hero.headline}`,
    input.hero?.tagline,
    input.profile?.name &&
      blocks(
        '## At a glance',
        [
          `- **Name:** ${input.profile.name}`,
          input.profile.title && `- **Role:** ${input.profile.title}`,
          input.profile.subtitle && `- **Focus:** ${input.profile.subtitle}`,
        ]
          .filter(Boolean)
          .join('\n'),
      ),
    credits.length > 0 &&
      blocks(
        '## Selected production credits',
        pipeTable(
          ['Production', 'Network'],
          credits.map((credit) => [credit.name ?? '', credit.network?.trim() || '—']),
        ),
      ),
    blocks(
      '## More on this site',
      [
        `- [Mike Lacey's career story, era by era](${origin}/story)`,
        `- [Full production credits, photos, and interviews](${origin}/work)`,
        `- [Letters of recognition from colleagues](${origin}/attaboys)`,
        `- [Contact details and enquiry form](${origin}/connect)`,
      ].join('\n'),
    ),
  );
}

export interface StoryMarkdownInput {
  pageContent?: { intro?: string } | null;
  events?: { year?: string; showYear?: boolean; title?: string; narrative?: string }[] | null;
}

export function buildStoryBody(input: StoryMarkdownInput): string {
  const eras = (input.events ?? []).filter((event) => event.title);

  return blocks(
    input.pageContent?.intro,
    ...eras.map((era) =>
      blocks(
        `## ${era.showYear && era.year ? `${era.year} — ${era.title}` : era.title}`,
        era.narrative?.split('\n\n').join('\n\n'),
      ),
    ),
  );
}

export interface WorkMarkdownInput {
  pageContent?: { intro?: string } | null;
  credits?: { name?: string; network?: string }[] | null;
  photos?: { alt?: string; caption?: string }[] | null;
  interviews?: { title?: string; description?: string; youtubeUrl?: string }[] | null;
}

export function buildWorkBody(input: WorkMarkdownInput): string {
  const credits = (input.credits ?? []).filter((credit) => credit.name);
  const photos = (input.photos ?? []).filter((photo) => photo.caption || photo.alt);
  const interviews = (input.interviews ?? []).filter((interview) => interview.title);

  return blocks(
    input.pageContent?.intro,
    credits.length > 0 &&
      blocks(
        '## Production credits',
        pipeTable(
          ['Production', 'Network'],
          credits.map((credit) => [credit.name ?? '', credit.network?.trim() || '—']),
        ),
      ),
    photos.length > 0 &&
      blocks(
        '## Behind the scenes',
        photos.map((photo) => `- ${photo.caption?.trim() || photo.alt?.trim()}`).join('\n'),
      ),
    interviews.length > 0 &&
      blocks(
        '## Video interviews',
        interviews
          .map((interview) => {
            const label = interview.youtubeUrl
              ? `[${interview.title}](${interview.youtubeUrl})`
              : interview.title;
            return `- ${label}${interview.description ? ` — ${interview.description}` : ''}`;
          })
          .join('\n'),
      ),
  );
}

export interface AttaboysMarkdownInput {
  pageContent?: { intro?: string } | null;
  testimonials?: { caption?: string; alt?: string }[] | null;
}

export function buildAttaboysBody(input: AttaboysMarkdownInput): string {
  const notes = (input.testimonials ?? []).filter((note) => note.caption || note.alt);

  return blocks(
    input.pageContent?.intro,
    notes.length > 0 &&
      blocks(
        '## Letters and notes of recognition',
        notes.map((note) => `- ${note.caption?.trim() || note.alt?.trim()}`).join('\n'),
      ),
  );
}

export interface ConnectMarkdownInput {
  sectionContent?: { intro?: string } | null;
  contactInfo?: {
    email?: string;
    phoneDisplay?: string;
    linkedin?: string;
    imdb?: string;
  } | null;
}

export function buildConnectBody(input: ConnectMarkdownInput): string {
  const contact = input.contactInfo;

  return blocks(
    input.sectionContent?.intro,
    contact &&
      blocks(
        '## Contact',
        [
          contact.email && `- **Email:** ${contact.email}`,
          contact.phoneDisplay && `- **Phone:** ${contact.phoneDisplay}`,
          contact.linkedin && `- **LinkedIn:** ${contact.linkedin}`,
          contact.imdb && `- **IMDb:** ${contact.imdb}`,
        ]
          .filter(Boolean)
          .join('\n'),
      ),
  );
}
