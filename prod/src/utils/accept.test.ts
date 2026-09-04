import { describe, expect, it } from 'vitest';
import { prefersMarkdown } from './accept';

describe('prefersMarkdown', () => {
  // The failure this whole function exists to prevent. Chrome's default Accept
  // makes markdown acceptable at q=0.8 through the `*​/*` catch-all, so any
  // implementation that merely checks whether markdown is acceptable serves a
  // .md file to every human visitor.
  it('rejects a browser Accept header', () => {
    expect(
      prefersMarkdown(
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      ),
    ).toBe(false);
  });

  // curl and most SDK clients send this. Both types score 1.0, which is the
  // absence of a preference, not a preference for markdown.
  it('rejects a wildcard-only Accept header', () => {
    expect(prefersMarkdown('*/*')).toBe(false);
  });

  it('accepts an explicit markdown-only request', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true);
  });

  it('accepts markdown ranked above html', () => {
    expect(prefersMarkdown('text/markdown,text/html;q=0.9')).toBe(true);
    expect(prefersMarkdown('text/html;q=0.5, text/markdown;q=0.9')).toBe(true);
  });

  it('rejects html ranked above markdown', () => {
    expect(prefersMarkdown('text/html,text/markdown;q=0.5')).toBe(false);
  });

  // An exact type/subtype outranks `text/*` regardless of order, per RFC 9110
  // precedence — so a client that accepts all text but singles out HTML gets
  // HTML.
  it('gives an exact match precedence over a subtype wildcard', () => {
    expect(prefersMarkdown('text/*;q=0.9, text/html')).toBe(false);
    expect(prefersMarkdown('text/*;q=0.9, text/markdown, text/html;q=0.4')).toBe(true);
  });

  it('treats an absent or empty header as no preference', () => {
    expect(prefersMarkdown(null)).toBe(false);
    expect(prefersMarkdown(undefined)).toBe(false);
    expect(prefersMarkdown('')).toBe(false);
  });

  // Header values are attacker-controlled. The requirement is only that a
  // malformed one cannot be read as a preference for markdown.
  it('does not read a preference out of malformed input', () => {
    expect(prefersMarkdown('garbage')).toBe(false);
    expect(prefersMarkdown('text/markdown;q=notanumber')).toBe(false);
    expect(prefersMarkdown(';;;,,,')).toBe(false);
  });

  it('ignores case and surrounding whitespace', () => {
    expect(prefersMarkdown('  TEXT/MARKDOWN , text/html;q=0.2 ')).toBe(true);
  });
});
