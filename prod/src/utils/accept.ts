interface MediaRange {
  type: string;
  subtype: string;
  q: number;
}

/**
 * Parses an `Accept` header into media ranges with their q-values.
 *
 * Malformed entries are dropped rather than defaulted. A range this function
 * cannot read is a range the client cannot be shown to have asked for, and the
 * one decision downstream is "serve something other than HTML" — quietly
 * inventing a q-value for unreadable input is how that decision goes wrong.
 */
function parseAccept(header: string): MediaRange[] {
  return header
    .split(',')
    .map((entry) => {
      const [range, ...params] = entry.split(';').map((part) => part.trim());
      const [type, subtype] = range.toLowerCase().split('/');
      if (!type || !subtype) return null;

      const qParam = params.find((param) => param.toLowerCase().startsWith('q='));
      const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;

      return Number.isNaN(q) ? null : { type, subtype, q };
    })
    .filter((range): range is MediaRange => range !== null);
}

/**
 * The client's q-value for one media type, honouring RFC 9110 precedence:
 * an exact `type/subtype` beats `type/*`, which beats `*​/*`. Absent = 0.
 */
function qualityFor(ranges: MediaRange[], type: string, subtype: string): number {
  const tiers = [
    (r: MediaRange) => r.type === type && r.subtype === subtype,
    (r: MediaRange) => r.type === type && r.subtype === '*',
    (r: MediaRange) => r.type === '*' && r.subtype === '*',
  ];

  for (const matches of tiers) {
    const match = ranges.find(matches);
    if (match) return match.q;
  }
  return 0;
}

/**
 * Whether this client asked for markdown *in preference to* HTML.
 *
 * The comparison is against HTML rather than a bare "markdown is acceptable"
 * test, and that is the whole design. A browser sends
 * `text/html,...,*​/*;q=0.8`, which makes markdown acceptable at q=0.8 — a
 * presence check would hand every human visitor a markdown file. `curl`'s
 * default `*​/*` scores both at 1.0 and is likewise not a preference.
 *
 * Strictly-greater, not greater-or-equal, for exactly that reason: ties mean
 * the client expressed no preference, and HTML is the representation every
 * client can render.
 */
export function prefersMarkdown(acceptHeader: string | null | undefined): boolean {
  if (!acceptHeader) return false;

  const ranges = parseAccept(acceptHeader);
  const markdown = qualityFor(ranges, 'text', 'markdown');

  return markdown > 0 && markdown > qualityFor(ranges, 'text', 'html');
}
