import type { APIRoute } from 'astro';
import QRCode from 'qrcode';
import connectData from '../data/connect.json';
import { loadQuery } from '../lib/loadQuery';
import type { ContactInfo } from '../types';
import { generateVCard } from '../utils/vcard';

export const prerender = false;

/**
 * The vCard QR code, as a PNG.
 *
 * Previously this was a data URL built in `Connect.astro` and handed to a
 * client island. That put 16.6 KB of base64 into the page twice — once in the
 * rendered `<img>` and once again in the island's serialised props — for 33 KB
 * of uncacheable markup on the site's conversion page, every load.
 *
 * As a route it is fetched once and cached. Deliberately not under `/api/`,
 * which robots.txt disallows: this is an image on a public page, and carving
 * out a second exception there is a rule waiting to be got wrong.
 */

// Matches the previous inline generation exactly. `H` error correction keeps
// the code scannable from a phone held at an angle, which is the only way
// anyone uses it.
const QR_OPTIONS = {
  type: 'png',
  width: 400,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: { dark: '#292524', light: '#ffffff' },
} as const;

export const GET: APIRoute = async () => {
  let contactInfo: ContactInfo = connectData.contactInfo;
  try {
    const settings = await loadQuery<{ contactInfo?: ContactInfo }>({
      query: '*[_type == "siteSettings"][0]{contactInfo}',
    });
    if (settings?.contactInfo?.email) contactInfo = settings.contactInfo;
  } catch {
    // Bundled JSON holds the same details. A QR code one deploy stale still
    // scans to a working contact card; a 500 leaves a broken image on /connect.
  }

  // No stegaClean needed: this route always reads the published perspective,
  // so no zero-width characters can reach the encoder.
  const png = await QRCode.toBuffer(generateVCard(contactInfo), QR_OPTIONS);

  return new Response(new Uint8Array(png), {
    headers: {
      'content-type': 'image/png',
      // The contact details change about never. A day at the edge, revalidated
      // on deploy, is the right trade for an asset the page waits on.
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
