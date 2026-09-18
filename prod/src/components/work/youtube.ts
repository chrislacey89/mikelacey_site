const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

// Path shapes that carry the ID as their final segment: /embed/<id>, /v/<id>,
// /live/<id>, /shorts/<id>. A plain /watch carries it in the `v` query
// param instead, handled separately below.
const ID_IN_PATH = /\/(?:embed|v|live|shorts)\/([^/?#]+)/;

/**
 * Extracts an 11-character YouTube video ID from any URL shape the Studio
 * might contain — watch, youtu.be share links, /embed/, /v/, /live/,
 * /shorts/ — across youtube.com, m.youtube.com, and youtube-nocookie.com,
 * with or without extra query params (playlist, timestamp, share tokens).
 *
 * Returns undefined instead of guessing when the shape isn't recognized, so
 * callers never build a player URL with a blank or malformed ID. That's the
 * latent bug this replaces: a failed match used to fall through to `''`,
 * producing a silently broken embed.
 */
export function extractYouTubeId(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    // Tolerate a bare host+path with no scheme, which is otherwise a valid
    // authored value.
    try {
      parsed = new URL(`https://${url}`);
    } catch {
      return undefined;
    }
  }

  const host = parsed.hostname.toLowerCase().replace(/^(www|m)\./, '');
  if (host !== 'youtube.com' && host !== 'youtu.be' && host !== 'youtube-nocookie.com') {
    return undefined;
  }

  let candidate: string | undefined;

  if (host === 'youtu.be') {
    // youtu.be/<id>[/extra][?query] — the ID is always the first segment.
    candidate = parsed.pathname.split('/')[1];
  } else {
    candidate = parsed.searchParams.get('v') ?? ID_IN_PATH.exec(parsed.pathname)?.[1];
  }

  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : undefined;
}
