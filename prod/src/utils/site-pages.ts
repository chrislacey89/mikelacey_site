/**
 * The site's page inventory, in navigation order.
 *
 * One list, five consumers: the header nav, the footer nav, `/sitemap.xml`,
 * `/llms.txt`, and the `.md` routes. Before this existed each page carried its
 * own `<title>` and description as literals, which is fine right up until a
 * sixth consumer needs the same strings — a sitemap that omits a page, or an
 * llms.txt describing a page differently from its own meta description, are
 * both drift bugs no test on a single page can see.
 *
 * `title` and `description` remain the exact strings the pages already shipped;
 * centralising them is a move, not a rewrite. Page copy is the site owner's
 * call, so nothing here invents a claim.
 */
export interface SitePage {
  /** Canonical path. Slashless except the homepage — matches `canonicalUrl`. */
  path: string;
  /** Header and footer link text. Deliberately the visitor's word for the
   *  page, which is not always the page's own `<h1>`. */
  navLabel: string;
  /** `<title>`. Unique per page; duplication here is the thing to catch. */
  title: string;
  /** `<meta name="description">`, and the OG/Twitter description with it. */
  description: string;
  /**
   * Sanity document types whose edits change this page. Feeds `<lastmod>` in
   * the sitemap — a lastmod derived from anything else (build time, deploy
   * time) is a date the content did not actually change on, and Google's
   * stated policy is to ignore lastmod it finds unreliable.
   */
  sourceTypes: readonly string[];
}

export const SITE_PAGES: readonly SitePage[] = [
  {
    path: '/',
    navLabel: 'Home',
    title: 'Mike Lacey - Television Director',
    description:
      'Television director Mike Lacey has spent four decades in live sports and entertainment, from a New York shipping department to directing PGA Tour golf.',
    sourceTypes: ['siteSettings'],
  },
  {
    path: '/story',
    navLabel: 'Story',
    title: 'My Story - Mike Lacey',
    description:
      "Mike Lacey's television career, era by era: from a 1981 job in a New York shipping department to directing PGA Tour golf, by way of Nickelodeon, MTV, and ESPN.",
    sourceTypes: ['siteSettings', 'timelineEvent'],
  },
  {
    path: '/work',
    navLabel: 'Production Credits',
    title: 'My Work - Mike Lacey',
    description:
      "Production credits, behind-the-scenes photos, and video interviews from Mike Lacey's work for Golf Channel, ESPN, Nickelodeon, Disney, NASCAR, and more.",
    sourceTypes: ['siteSettings', 'credit', 'photo', 'interview'],
  },
  {
    path: '/attaboys',
    navLabel: 'Attaboys',
    title: 'Attaboys - Mike Lacey',
    description:
      "Thank-you letters and notes of recognition sent to television director Mike Lacey by colleagues at the LPGA, Nickelodeon, MTV, and Children's Miracle Network.",
    sourceTypes: ['siteSettings', 'testimonial'],
  },
  {
    path: '/connect',
    navLabel: 'Connect',
    title: 'Connect - Mike Lacey',
    description:
      'Get in touch with television director Mike Lacey: send a message, save his contact card, or find him on IMDb and LinkedIn.',
    sourceTypes: ['siteSettings'],
  },
];

/** Lookup by canonical path. Trailing slashes are normalised away first, so
 *  `/story/` and `/story` resolve to the same entry — the same equivalence
 *  `canonicalUrl` asserts. */
export function findSitePage(pathname: string): SitePage | undefined {
  const path = pathname.replace(/\/+$/, '') || '/';
  return SITE_PAGES.find((page) => page.path === path);
}

/**
 * The `.md` companion path for a page.
 *
 * `/page.md` with the homepage at `/index.md`. Three incompatible conventions
 * are live in the wild (`/page.md`, `/page/index.md`, `/page.html.md`), so the
 * choice matters less than advertising it — which `BaseLayout` does with a
 * `<link rel="alternate">` and the middleware repeats in a `Link:` header.
 */
export function markdownPathFor(path: string): string {
  return path === '/' ? '/index.md' : `${path}.md`;
}
