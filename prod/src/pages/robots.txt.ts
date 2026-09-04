import type { APIRoute } from 'astro';
import { PRODUCTION_ORIGIN } from '../utils/canonical';

// Static: the contents depend on nothing per-request, and a robots.txt that can
// fail at request time is a robots.txt that can be a 500 during an outage. Under
// RFC 9309 an unreachable robots.txt is treated as disallow-all by some
// crawlers, which makes this the one file on the site least worth rendering
// dynamically.
export const prerender = true;

/**
 * The AI crawlers worth naming individually.
 *
 * Silence is permissive under RFC 9309 — an unlisted agent is allowed — so this
 * group changes no bot's behaviour. It is here to put the decision on the
 * record: these agents are allowed deliberately, not by omission. The next
 * person to edit this file can see which bots were considered.
 *
 * `Google-Extended` governs Gemini and AI-training use only. It is not Google
 * Search, and blocking it would not affect Search ranking either way.
 */
const AI_USER_AGENTS = [
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
  'Applebot-Extended',
];

// Housekeeping only. /studio is the Sanity Studio SPA — an editor login screen
// with no extractable content — and /api holds machine endpoints.
//
// The /api/og.png exception is load-bearing: Facebook's and X's link
// unfurlers honour robots.txt, so a blanket /api block would stop every social
// preview from resolving its image. Under RFC 9309 longest-match precedence
// the more specific Allow wins over the Disallow above it.
const HOUSEKEEPING = ['Disallow: /studio', 'Disallow: /api/', 'Allow: /api/og.png'];

const group = (userAgents: string[]): string =>
  [...userAgents.map((agent) => `User-agent: ${agent}`), 'Allow: /', ...HOUSEKEEPING].join('\n');

export const GET: APIRoute = () => {
  const body = [
    '# https://www.themikelacey.com/robots.txt',
    '',
    '# Every crawler not named below.',
    group(['*']),
    '',
    '# AI answer engines and their crawlers. Allowed deliberately — see the',
    '# comment in src/pages/robots.txt.ts.',
    group(AI_USER_AGENTS),
    '',
    `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
