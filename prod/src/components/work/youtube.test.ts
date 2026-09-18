import { describe, expect, it } from 'vitest';
import { extractYouTubeId } from './youtube';

describe('extractYouTubeId', () => {
  it('reads the ID out of a standard watch URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('reads the ID out of a youtu.be share link', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('reads the ID out of an /embed/ URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('reads the ID out of a /v/ URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  // The latent bug this replaces: /live/ and /shorts/ used to fall through
  // to an empty string instead of being recognized.
  it('reads the ID out of a /live/ URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('reads the ID out of a /shorts/ URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('reads the ID from the nocookie host', () => {
    expect(extractYouTubeId('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('reads the ID from the mobile host', () => {
    expect(extractYouTubeId('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('ignores extra query params like playlist and timestamp', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123&t=42s')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('ignores a share token appended to a youtu.be link', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ?si=abc123')).toBe('dQw4w9WgXcQ');
  });

  it('tolerates a scheme-less authored value', () => {
    expect(extractYouTubeId('youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns undefined for a URL shape it does not recognize', () => {
    expect(extractYouTubeId('https://www.youtube.com/channel/UC1234567890')).toBeUndefined();
  });

  it('returns undefined for a non-YouTube host', () => {
    expect(extractYouTubeId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeUndefined();
  });

  it('returns undefined for a string that is not a URL at all', () => {
    expect(extractYouTubeId('not a url')).toBeUndefined();
  });

  it('returns undefined when the URL is absent', () => {
    expect(extractYouTubeId(undefined)).toBeUndefined();
    expect(extractYouTubeId(null)).toBeUndefined();
    expect(extractYouTubeId('')).toBeUndefined();
  });
});
